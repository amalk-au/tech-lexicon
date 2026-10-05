import test from "node:test";
import assert from "node:assert/strict";
import { Catalog } from "../src/cache-aside.js";
import { InventoryService, KeyConflict } from "../src/idempotency.js";
import { LeaseQueue, DedupeSink } from "../src/job-queue.js";
import { scenarios } from "../scripts/scenarios.js";

test("Cache hits avoid reads and expiry refreshes exactly at the TTL boundary", () => {
  let now = 0;
  const catalog = new Catalog({ clock: () => now, ttlMs: 10 });
  catalog.save("item", { value: 1 });
  assert.deepEqual(catalog.read("item"), { value: 1 });
  now = 9;
  catalog.read("item");
  assert.equal(catalog.databaseReads, 1);
  now = 10;
  catalog.read("item");
  assert.equal(catalog.databaseReads, 2);
});

test("Writes invalidate cache and caller mutations cannot change stored values", () => {
  const catalog = new Catalog();
  const original = { nested: { value: 1 } };
  catalog.save("item", original);
  original.nested.value = 9;
  const read = catalog.read("item");
  read.nested.value = 8;
  assert.equal(catalog.read("item").nested.value, 1);
  catalog.save("item", { nested: { value: 2 } });
  assert.equal(catalog.read("item").nested.value, 2);
  assert.equal(catalog.read("absent"), undefined);
});

test("Identical retries replay the response without decrementing stock again", () => {
  const service = new InventoryService(new Map([["item", 1]]));
  const request = { key: "key-1", sku: "item", quantity: 1 };
  const first = service.reserve(request);
  assert.equal(first.status, 201);
  first.body.sku = "changed";
  assert.equal(service.reserve(request).body.sku, "item");
  assert.equal(service.remaining("item"), 0);
  assert.equal(service.reserve({ ...request, key: "key-2" }).status, 409);
});

test("Reusing a key for a different quantity or SKU fails without effects", () => {
  const service = new InventoryService();
  const request = { key: "key-1", sku: "widget", quantity: 1 };
  service.reserve(request);
  assert.throws(() => service.reserve({ ...request, quantity: 2 }), KeyConflict);
  assert.throws(() => service.reserve({ ...request, sku: "other" }), KeyConflict);
  assert.equal(service.remaining("widget"), 4);
});

test("Business failures replay and invalid requests never consume stock", () => {
  const service = new InventoryService(new Map([["item", 0]]));
  const request = { key: "failed", sku: "item", quantity: 1 };
  assert.deepEqual(service.reserve(request), service.reserve(request));
  assert.equal(service.reserve({ ...request, key: "absent", sku: "absent" }).status, 404);
  assert.throws(() => service.reserve({ ...request, quantity: 0 }), RangeError);
  assert.throws(() => service.reserve({ ...request, key: "" }), RangeError);
  assert.equal(service.remaining("item"), 0);
});

test("Leases prevent another active claim and stale tokens cannot acknowledge a newer claim", () => {
  let now = 0;
  const queue = new LeaseQueue({ clock: () => now, leaseMs: 10 });
  queue.enqueue("job", { value: 1 });
  const first = queue.claim("worker-1");
  assert.equal(queue.claim("worker-2"), null);
  assert.equal(queue.ack("job", 999), false);
  now = 10;
  assert.equal(queue.ack("job", first.token), false);
  const second = queue.claim("worker-2");
  assert.equal(second.attempts, 2);
  assert.notEqual(second.token, first.token);
  assert.equal(queue.ack("job", first.token), false);
  assert.equal(queue.ack("job", second.token), true);
  assert.equal(queue.claim("worker-3"), null);
  assert.equal(queue.inspect("job").state, "done");
});

test("Queue snapshots do not expose mutable internal payloads", () => {
  const queue = new LeaseQueue();
  const payload = { value: 1 };
  queue.enqueue("job", payload);
  payload.value = 2;
  const lease = queue.claim("worker");
  lease.payload.value = 3;
  assert.equal(queue.inspect("job").payload.value, 1);
  assert.throws(() => queue.enqueue("job", {}), /Duplicate/);
  assert.equal(queue.ack("missing", 1), false);
});

test("A stable effect key suppresses duplicate deliveries, while distinct jobs remain distinct", () => {
  const sink = new DedupeSink();
  assert.equal(sink.deliver("job-1", { value: 1 }), true);
  assert.equal(sink.deliver("job-1", { value: 1 }), false);
  assert.equal(sink.deliver("job-2", { value: 1 }), true);
  const effects = sink.effects;
  effects[0].payload.value = 99;
  assert.equal(sink.effects[0].payload.value, 1);
  assert.equal(sink.effects.length, 2);
});

for (const [id, scenario] of Object.entries(scenarios)) {
  test(`Runnable design scenario: ${id}`, () => scenario());
}
