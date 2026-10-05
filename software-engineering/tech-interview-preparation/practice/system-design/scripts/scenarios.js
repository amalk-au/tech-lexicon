import assert from "node:assert/strict";
import { Catalog } from "../src/cache-aside.js";
import { InventoryService, KeyConflict } from "../src/idempotency.js";
import { LeaseQueue, DedupeSink } from "../src/job-queue.js";

export const scenarios = {
  cache() {
    let now = 0;
    const stale = new Catalog({ clock: () => now, invalidateOnWrite: false });
    stale.save("widget", { displayPrice: 10 });
    stale.read("widget");
    stale.save("widget", { displayPrice: 12 });
    const stalePrice = stale.read("widget").displayPrice;
    assert.equal(stalePrice, 10);
    now = 1000;
    const freshAfterTtl = stale.read("widget").displayPrice;
    assert.equal(freshAfterTtl, 12);
    const fresh = new Catalog({ clock: () => now });
    fresh.save("widget", { displayPrice: 10 });
    fresh.read("widget");
    fresh.save("widget", { displayPrice: 12 });
    const freshAfterInvalidation = fresh.read("widget").displayPrice;
    assert.equal(freshAfterInvalidation, 12);
    return { stalePrice, freshAfterTtl, freshAfterInvalidation, databaseReads: fresh.databaseReads };
  },
  idempotency() {
    const service = new InventoryService();
    const request = { key: "request-1", sku: "widget", quantity: 2 };
    const original = service.reserve(request); // Imagine the response is lost.
    const retry = service.reserve(request);
    assert.deepEqual(retry, original);
    assert.equal(service.remaining("widget"), 3);
    assert.throws(() => service.reserve({ ...request, quantity: 1 }), KeyConflict);
    const naiveRemainingAfterRetry = 5 - 2 - 2;
    return { remainingAfterRetry: service.remaining("widget"), sameResponse: true, keyConflict: true, naiveRemainingAfterRetry };
  },
  jobs() {
    let now = 0;
    const queue = new LeaseQueue({ clock: () => now });
    const sink = new DedupeSink();
    queue.enqueue("job-1", { kind: "export-ready" });
    const first = queue.claim("worker-1");
    assert.equal(sink.deliver(first.id, first.payload), true);
    // Crash after the effect, before acknowledgement; move time instead of sleeping.
    now = 1000;
    const retry = queue.claim("worker-2");
    assert.equal(sink.deliver(retry.id, retry.payload), false);
    const staleAck = queue.ack(first.id, first.token);
    const finished = queue.ack(retry.id, retry.token);
    assert.equal(staleAck, false);
    assert.equal(finished, true);
    assert.equal(sink.effects.length, 1);
    return { attempts: retry.attempts, effects: sink.effects.length, staleAck, finished };
  },
};
