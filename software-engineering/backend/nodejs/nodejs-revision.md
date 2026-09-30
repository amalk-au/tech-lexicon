# Node.js revision: learn by doing

[Back to the topic index](./README.md)

A hands-on refresher using **Node.js 24 LTS, JavaScript ES modules, pnpm and Ubuntu**. Examples use only built-in Node modules and generic demonstration data. No API keys, accounts, database or third-party packages are required.

Each lab includes complete files, a command, expected behavior and a small experiment. Basic JavaScript knowledge is assumed.

## 0. Set up the practice project

With Node.js 24 and pnpm installed: You can use the [Web Development template](https://github.com/amalk-au/web-development-template) or alternatively install as follows.

```bash
node --version
pnpm --version
mkdir nodejs-revision
cd nodejs-revision
mkdir -p labs lib test
```

Create these files at the project root.

**`package.json`**

```json
{
  "name": "nodejs-revision",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "start": "node labs/12-server.js",
    "dev": "node --watch labs/12-server.js",
    "test": "node --test"
  }
}
```

**`.gitignore`**

```gitignore
node_modules/
coverage/
lab-data/
.env
.env.*
!.env.example
```

There is nothing to install for these core labs. `pnpm exec node ...` runs Node in the project environment; `pnpm start` and `pnpm dev` work after creating lab 12. Use **Ctrl+C** to stop a server or watch process.

**File rules:** paths are relative to the project root. Create each named file with its complete snippet. Keep files from earlier labs: dependencies are stated explicitly. Run terminal commands from the project root unless instructed otherwise. File labs write only demonstration files under `lab-data/`; rerunning them can overwrite those demo files.

**Ubuntu notes:** filenames are case-sensitive. Servers here bind to `127.0.0.1` for local practice. If a port is busy, stop the earlier server or use the alternative-port command shown in lab 12. `curl` is used for HTTP exercises; the Node fetch lab offers another way to make requests.

## Contents

- [Node.js revision: learn by doing](#nodejs-revision-learn-by-doing)
  - [0. Set up the practice project](#0-set-up-the-practice-project)
  - [Contents](#contents)
  - [The mental model](#the-mental-model)
  - [1. Modules and exports](#1-modules-and-exports)
  - [2. Arguments, environment and exit codes](#2-arguments-environment-and-exit-codes)
  - [3. The event loop and blocking work](#3-the-event-loop-and-blocking-work)
  - [4. Promises and concurrency](#4-promises-and-concurrency)
  - [5. Cancellation and cleanup](#5-cancellation-and-cleanup)
  - [6. Files and JSON](#6-files-and-json)
  - [7. Paths and module-relative files](#7-paths-and-module-relative-files)
  - [8. Buffers and encodings](#8-buffers-and-encodings)
  - [9. Events and listeners](#9-events-and-listeners)
  - [10. Streams and backpressure](#10-streams-and-backpressure)
  - [11. Reading files line by line](#11-reading-files-line-by-line)
  - [12. A local JSON HTTP API](#12-a-local-json-http-api)
  - [13. Fetch, status codes and timeouts](#13-fetch-status-codes-and-timeouts)
  - [14. Built-in automated testing](#14-built-in-automated-testing)
  - [15. Child processes](#15-child-processes)
  - [16. Worker threads](#16-worker-threads)
  - [17. Hashes and random identifiers](#17-hashes-and-random-identifiers)
  - [18. Graceful shutdown](#18-graceful-shutdown)
  - [Quick reference and practice](#quick-reference-and-practice)
    - [Error handling by API style](#error-handling-by-api-style)
    - [Choosing an API](#choosing-an-api)
    - [Common mistakes](#common-mistakes)
    - [Debugging and development commands](#debugging-and-development-commands)
    - [Package management reminders](#package-management-reminders)
    - [Practice challenges](#practice-challenges)
    - [Further reading](#further-reading)

## The mental model

Node.js runs JavaScript outside the browser. It provides filesystem, networking and process APIs, but no browser DOM: `document` and `window` are not available.

JavaScript typically runs on one main thread per Node instance. The runtime uses operating-system facilities and, for some operations, a worker pool to complete work asynchronously. An `await` can let other work proceed, but it does not make a CPU-heavy loop non-blocking.

| Work                      | Typical tool                           |
| ------------------------- | -------------------------------------- |
| Network or filesystem I/O | Async APIs and promises                |
| Large sequential data     | Streams                                |
| CPU-intensive JavaScript  | Worker threads, often through a pool   |
| Another executable        | Child process                          |
| HTTP request handling     | `node:http` or a framework built on it |
| Browser page interaction  | Browser APIs, not Node APIs            |

## 1. Modules and exports

**What it does:** separates reusable logic from the entry point. The `node:` prefix identifies built-in modules.

**`lib/pricing.js`**

```js
export function total(price, quantity = 1) {
  if (!Number.isFinite(price) || price < 0) {
    throw new TypeError("price must be a non-negative finite number");
  }
  if (!Number.isInteger(quantity) || quantity < 0) {
    throw new TypeError("quantity must be a non-negative integer");
  }
  return price * quantity;
}
```

**`labs/01-modules.js`**

```js
import { total } from "../lib/pricing.js";
import { basename } from "node:path";

console.log(total(12, 3));
console.log(basename("/tmp/demo/report.json"));
```

```bash
pnpm exec node labs/01-modules.js
```

**Expected:** `36`, then `report.json`.

**Try it:** pass `-1` as the quantity to see the validation error; restore it afterward.

**Remember:** with `"type": "module"`, `.js` files use ESM `import`/`export`. Relative ESM imports include the extension. `.cjs` explicitly selects CommonJS (`require`/`module.exports`); don't mix the two styles accidentally. This simple pricing function demonstrates validation, not precise financial arithmetic. [Docs](https://nodejs.org/api/esm.html)

## 2. Arguments, environment and exit codes

**What it does:** reads one CLI argument and an environment setting, validates them and signals failure without immediately terminating pending output.

**`labs/02-config.js`**

```js
const rawCount = process.argv[2] ?? "2";
const count = Number(rawCount);
const label = process.env.LAB_LABEL ?? "Demo";

if (
  rawCount.trim() === "" ||
  !Number.isInteger(count) ||
  count < 1 ||
  count > 5
) {
  console.error("Usage: node labs/02-config.js <integer from 1 to 5>");
  process.exitCode = 1;
} else {
  for (let index = 1; index <= count; index += 1) {
    console.log(`${label} ${index}`);
  }
}
```

```bash
LAB_LABEL=Example pnpm exec node labs/02-config.js 3
```

**Expected:** `Example 1`, `Example 2`, `Example 3`.

Try an invalid argument and inspect the status immediately afterward:

```bash
pnpm exec node labs/02-config.js invalid
echo $?
```

**Expected:** a usage message and exit code `1`.

To try built-in environment-file support, create:

**`.env.example`**

```dotenv
LAB_LABEL=Environment file demo
```

```bash
pnpm exec node --env-file=.env.example labs/02-config.js 1
```

**Remember:** CLI arguments and environment values are strings. A `.env` file isn't loaded merely because it exists; this command uses `--env-file`. Existing environment variables take precedence. Commit dummy examples, not credentials. `process.exitCode` lets the process finish naturally; an immediate `process.exit()` can interrupt pending work. [Process](https://nodejs.org/docs/latest-v24.x/api/process.html) · [CLI](https://nodejs.org/api/cli.html)

## 3. The event loop and blocking work

**What it does:** compares synchronous code, microtasks and a timer. A short deliberate busy loop shows that timer callbacks must wait for JavaScript to yield.

**`labs/03-event-loop.js`**

```js
console.log("1: synchronous start");

setTimeout(() => console.log("5: timer callback"), 0);
Promise.resolve().then(() => console.log("3: promise microtask"));
queueMicrotask(() => console.log("4: queued microtask"));

const start = performance.now();
while (performance.now() - start < 80) {
  // Deliberate short blocking loop for this exercise only.
}

console.log("2: synchronous end");
```

```bash
pnpm exec node labs/03-event-loop.js
```

**Expected:** lines numbered `1, 2, 3, 4, 5`. The timer runs after the blocking work, despite its zero delay.

**Try it:** change 80ms to 200ms. Observe that the promise callback also waits.

**Remember:** timer delays are thresholds, not exact execution times. `async` functions still execute ordinary synchronous code on their current thread. Don't generalize this example into a universal ordering rule for `setImmediate`, `process.nextTick` and timers; execution context matters. [Timers](https://nodejs.org/api/timers.html)

## 4. Promises and concurrency

**What it does:** contrasts starting independent operations sequentially with starting them together. It also shows how to collect individual failures.

**`labs/04-concurrency.js`**

```js
import { setTimeout as delay } from "node:timers/promises";

async function job(label, milliseconds, fail = false) {
  await delay(milliseconds);
  if (fail) throw new Error(`${label} failed`);
  return label;
}

console.time("sequential");
const first = await job("first", 80);
const second = await job("second", 120);
console.timeEnd("sequential");
console.log(first, second);

console.time("concurrent");
const results = await Promise.all([job("first", 80), job("second", 120)]);
console.timeEnd("concurrent");
console.log(results.join(", "));

const settled = await Promise.allSettled([
  job("good", 20),
  job("bad", 10, true),
]);
for (const result of settled) {
  console.log(
    result.status === "fulfilled" ? result.value : result.reason.message,
  );
}
```

```bash
pnpm exec node labs/04-concurrency.js
```

**Expected:** roughly 200ms sequential versus 120ms concurrent, then `good` and `bad failed`. Timings vary. Results retain input order, not completion order.

**Try it:** use `Promise.all` for the final pair inside `try/catch`; one rejection rejects the combined promise.

**Remember:** concurrency isn't necessarily CPU parallelism. `Promise.all` doesn't cancel remaining work after rejection. For thousands of tasks, use a bounded concurrency strategy instead of starting everything at once. [Promise timers](https://nodejs.org/api/timers.html#timers-promises-api)

## 5. Cancellation and cleanup

**What it does:** passes a cancellation signal into an API that supports it and clears the timer used to trigger cancellation.

**`labs/05-abort.js`**

```js
import { setTimeout as delay } from "node:timers/promises";

const controller = new AbortController();
const cancelTimer = setTimeout(() => controller.abort(), 50);

try {
  await delay(500, undefined, { signal: controller.signal });
  console.log("Finished");
} catch (error) {
  if (error.name === "AbortError") console.log("Cancelled");
  else throw error;
} finally {
  clearTimeout(cancelTimer);
  console.log("Cleanup complete");
}
```

```bash
pnpm exec node labs/05-abort.js
```

**Expected:** `Cancelled`, then `Cleanup complete`.

**Try it:** change the delay from 500ms to 10ms. Work now finishes before cancellation.

**Remember:** cancellation is cooperative. An `AbortController` won't stop arbitrary JavaScript unless the operation observes its signal. A `Promise.race` timeout alone does not cancel the underlying operation. [AbortController](https://nodejs.org/api/globals.html#class-abortcontroller)

## 6. Files and JSON

**What it does:** creates a directory, writes JSON and reads it back with promise-based filesystem APIs.

**`labs/06-files.js`**

```js
import { mkdir, writeFile, readFile } from "node:fs/promises";

const directory = new URL("../lab-data/", import.meta.url);
const file = new URL("tasks.json", directory);

await mkdir(directory, { recursive: true });
const tasks = [
  { id: 1, title: "Revise Node.js", done: false },
  { id: 2, title: "Run a file lab", done: true },
];
await writeFile(file, JSON.stringify(tasks, null, 2), "utf8");

const text = await readFile(file, "utf8");
const restored = JSON.parse(text);
console.log(restored.map((task) => task.title).join(" | "));

try {
  await readFile(new URL("missing-demo-file.json", directory), "utf8");
} catch (error) {
  if (error.code === "ENOENT") console.log("Missing file handled");
  else throw error;
}
```

```bash
pnpm exec node labs/06-files.js
```

**Expected:** the two titles, followed by `Missing file handled`. Inspect `lab-data/tasks.json`.

**Try it:** add another task. For a parse-error experiment, change the `text` passed to `JSON.parse` to `'invalid json'`, then restore it.

**Remember:** filesystem errors reject promises; inspect `error.code`, not message text. `readFile` loads the whole file. Await writes to the same file in order. A JSON file is not a concurrency-safe replacement for a database; parsed external data still needs validation. [Docs](https://nodejs.org/docs/latest-v24.x/api/fs.html)

## 7. Paths and module-relative files

**What it does:** contrasts paths based on the current terminal directory with paths based on the script location.

**`labs/07-paths.js`**

```js
import path from "node:path";
import { fileURLToPath } from "node:url";

const moduleFile = fileURLToPath(import.meta.url);
const dataFile = fileURLToPath(
  new URL("../lab-data/tasks.json", import.meta.url),
);

console.log("Working directory:", process.cwd());
console.log("Script name:", path.basename(moduleFile));
console.log("CWD-relative:", path.resolve("lab-data/tasks.json"));
console.log("Module-relative:", dataFile);
```

```bash
pnpm exec node labs/07-paths.js
```

Then run from the parent directory:

```bash
cd ..
node nodejs-revision/labs/07-paths.js
cd nodejs-revision
```

**Expected:** the CWD-based path changes; the module-based path still points inside the project.

**Remember:** use URL/path APIs instead of splitting strings on `/`. `path.resolve()` normalizes a path but doesn't authorize access or prevent all traversal/symlink issues. This lab only builds paths; it doesn't require lab 6's file to exist. [Path docs](https://nodejs.org/api/path.html)

## 8. Buffers and encodings

**What it does:** converts text to bytes and demonstrates that encoded length differs from JavaScript string length.

**`labs/08-buffers.js`**

```js
import { Buffer } from "node:buffer";

const text = "A🌍";
const bytes = Buffer.from(text, "utf8");

console.log("String length:", text.length);
console.log("Byte length:", bytes.length);
console.log("Hex:", bytes.toString("hex"));
console.log(
  "Round trip:",
  Buffer.from(bytes.toString("base64"), "base64").toString("utf8"),
);

const copy = Buffer.from(bytes);
copy[0] = 66;
console.log("Copy:", copy.toString("utf8"));
console.log("Original:", bytes.toString("utf8"));
```

```bash
pnpm exec node labs/08-buffers.js
```

**Expected:** string length `3`, byte length `5`, hex `41f09f8c8d`; the copy becomes `B🌍`, while the original stays `A🌍`.

**Try it:** replace the text with plain ASCII and compare lengths.

**Remember:** string length counts UTF-16 code units, not visual characters. Base64 encodes data; it doesn't encrypt it. `Buffer.from(buffer)` copies bytes; `subarray()` creates a shared view. Prefer initialized buffers unless uninitialized memory is deliberately handled. [Docs](https://nodejs.org/docs/latest-v24.x/api/buffer.html)

## 9. Events and listeners

**What it does:** subscribes to events, handles one event only once, then removes a listener.

**`labs/09-events.js`**

```js
import { EventEmitter } from "node:events";

const bus = new EventEmitter();
function logTask(task) {
  console.log(`Task: ${task.title}`);
}

bus.on("task", logTask);
bus.once("task", () => console.log("First task observed"));
bus.on("error", (error) => console.log(`Handled: ${error.message}`));

bus.emit("task", { title: "One" });
bus.emit("task", { title: "Two" });
bus.off("task", logTask);
bus.emit("task", { title: "Three" });
bus.emit("error", new Error("Demo error"));
console.log("Task listeners:", bus.listenerCount("task"));
```

```bash
pnpm exec node labs/09-events.js
```

**Expected:** tasks One and Two are logged; the one-time message appears once; Three isn't logged; the error is handled; listener count is zero.

**Try it:** put a log before and after `emit`. Ordinary listeners run synchronously during `emit`.

**Remember:** returned promises are not automatically awaited by `emit`. An unhandled `'error'` event is special and can terminate the process. Remove listeners when their owner no longer needs them. [Docs](https://nodejs.org/api/events.html)

## 10. Streams and backpressure

**What it does:** generates text incrementally and compresses it to a file without building one large source string.

**`labs/10-streams.js`**

```js
import { mkdir, stat } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { createGzip } from "node:zlib";

const directory = new URL("../lab-data/", import.meta.url);
await mkdir(directory, { recursive: true });
const destination = new URL("records.txt.gz", directory);

async function* records() {
  for (let index = 1; index <= 10_000; index += 1) {
    yield `record-${index}: demo data\n`;
  }
}

await pipeline(
  Readable.from(records()),
  createGzip(),
  createWriteStream(destination),
);
console.log("Compressed bytes:", (await stat(destination)).size);
```

```bash
pnpm exec node labs/10-streams.js
gzip -dc lab-data/records.txt.gz | wc -l
```

**Expected:** a compressed byte count and `10000` lines after decompression. Exact compressed size can vary.

**Try it:** increase the number of records. Compare the streaming approach with generating one huge string before writing.

**Remember:** backpressure prevents a fast producer from overwhelming a slower consumer. `pipeline` coordinates completion, backpressure and error cleanup. When writing manually, a `write()` result of `false` means wait for `'drain'`. Chunk boundaries are not message or line boundaries. [Docs](https://nodejs.org/api/stream.html)

## 11. Reading files line by line

**What it does:** processes newline-delimited JSON without loading the complete file into memory. The small fixture is created by the example itself.

**`labs/11-lines.js`**

```js
import { mkdir, writeFile } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";

const directory = new URL("../lab-data/", import.meta.url);
await mkdir(directory, { recursive: true });
const file = new URL("events.ndjson", directory);
await writeFile(file, '{"value":2}\n{"value":3}\n{"value":5}\n', "utf8");

const input = createReadStream(file, { encoding: "utf8" });
const lines = createInterface({ input, crlfDelay: Infinity });
let total = 0;

try {
  for await (const line of lines) {
    if (!line.trim()) continue;
    const row = JSON.parse(line);
    if (
      row === null ||
      typeof row !== "object" ||
      !Number.isFinite(row.value)
    ) {
      throw new Error("Each row needs a finite numeric value");
    }
    total += row.value;
  }
  console.log("Total:", total);
} finally {
  lines.close();
  input.destroy();
}
```

```bash
pnpm exec node labs/11-lines.js
```

**Expected:** `Total: 10`.

**Try it:** change the fixture's second value to a string and rerun. Validation rejects the row.

**Remember:** line-oriented processing still buffers individual lines; a single huge line can use substantial memory. `finally` releases resources on success or failure. [Docs](https://nodejs.org/api/readline.html)

## 12. A local JSON HTTP API

**What it does:** implements GET/POST/DELETE routes with request validation and HTTP status codes. State is in memory and resets when the server restarts.

The reusable factory has no listening side effect, making it easy to test. This is the largest example; create both files.

**`lib/task-api.js`**

```js
import { createServer } from "node:http";

function json(response, status, body, headers = {}) {
  const text = JSON.stringify(body);
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(text),
    ...headers,
  });
  response.end(text);
}

async function readJson(request) {
  const mediaType = request.headers["content-type"]
    ?.split(";")[0]
    ?.trim()
    .toLowerCase();
  if (mediaType !== "application/json") {
    throw Object.assign(new Error("Use application/json"), { status: 415 });
  }

  const chunks = [];
  let size = 0;
  let tooLarge = false;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 8192) {
      tooLarge = true;
      chunks.length = 0;
    } else if (!tooLarge) {
      chunks.push(chunk);
    }
  }
  // Discard oversized bodies while reading; report the error after the body ends.
  if (tooLarge)
    throw Object.assign(new Error("Body exceeds 8 KiB"), { status: 413 });
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw Object.assign(new Error("Invalid JSON"), { status: 400 });
  }
}

export function createTaskServer() {
  const tasks = new Map([[1, { id: 1, title: "First demo task" }]]);
  let nextId = 2;

  async function handle(request, response) {
    const url = new URL(request.url, "http://localhost");
    const itemMatch = /^\/tasks\/(\d+)$/.exec(url.pathname);

    if (url.pathname === "/tasks") {
      if (request.method === "GET") {
        return json(response, 200, [...tasks.values()]);
      }
      if (request.method === "POST") {
        const body = await readJson(request);
        if (
          body === null ||
          typeof body !== "object" ||
          typeof body.title !== "string" ||
          body.title.trim().length < 1 ||
          body.title.trim().length > 80
        ) {
          return json(response, 400, {
            error: "title must contain 1–80 characters",
          });
        }
        const task = { id: nextId++, title: body.title.trim() };
        tasks.set(task.id, task);
        return json(response, 201, task, { Location: `/tasks/${task.id}` });
      }
      return json(
        response,
        405,
        { error: "Method not allowed" },
        { Allow: "GET, POST" },
      );
    }

    if (itemMatch) {
      if (!["GET", "DELETE"].includes(request.method)) {
        return json(
          response,
          405,
          { error: "Method not allowed" },
          { Allow: "GET, DELETE" },
        );
      }
      const id = Number(itemMatch[1]);
      const task = tasks.get(id);
      if (!task) return json(response, 404, { error: "Task not found" });
      if (request.method === "GET") return json(response, 200, task);
      tasks.delete(id);
      response.writeHead(204);
      return response.end();
    }

    return json(response, 404, { error: "Route not found" });
  }

  const server = createServer((request, response) => {
    handle(request, response).catch((error) => {
      if (response.destroyed) return;
      if (response.headersSent) return response.destroy();
      const status = error.status ?? 500;
      if (status === 500) console.error(error);
      json(response, status, {
        error: status === 500 ? "Internal server error" : error.message,
      });
    });
  });
  server.requestTimeout = 10_000;
  server.headersTimeout = 5_000;
  return server;
}
```

**`labs/12-server.js`**

```js
import { createTaskServer } from "../lib/task-api.js";

const port = Number(process.env.LAB_PORT ?? 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("LAB_PORT must be an integer from 1 to 65535");
}

const server = createTaskServer();
server.on("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
server.listen(port, "127.0.0.1", () => {
  console.log(`Task API: http://127.0.0.1:${port}/tasks`);
});
```

Start it:

```bash
pnpm start
```

Open [http://127.0.0.1:3000/tasks](http://127.0.0.1:3000/tasks) in a browser. In a second terminal:

```bash
curl -i http://127.0.0.1:3000/tasks
curl -i -X POST http://127.0.0.1:3000/tasks -H 'Content-Type: application/json' -d '{"title":"Try the API"}'
curl -i http://127.0.0.1:3000/tasks/2
curl -i -X DELETE http://127.0.0.1:3000/tasks/2
curl -i http://127.0.0.1:3000/tasks/2
```

**Expected on a fresh server:** 200, 201, 200, 204, then 404. IDs depend on earlier POST requests; use the returned ID if necessary.

**Try it:** submit `{}`, malformed JSON or the wrong content type; compare 400 and 415. To use another port:

```bash
LAB_PORT=3001 pnpm start
```

**Remember:** request bodies arrive as chunks, not a ready-made object. This lab bounds retained body bytes but drains an oversized body before returning 413; it is a local teaching server, not a hardened public service. Real services also need durable storage and application-specific access controls. Browser cross-origin rules are separate from whether Node/curl can call an endpoint. [Docs](https://nodejs.org/docs/latest-v24.x/api/http.html)

## 13. Fetch, status codes and timeouts

**Requires:** `lib/task-api.js` from lab 12. This lab starts its own server on an OS-selected port and closes it afterward; the manual server does not need to be running.

**What it does:** makes real local HTTP requests, checks response status and handles a missing resource.

**`labs/13-fetch.js`**

```js
import { once } from "node:events";
import { createTaskServer } from "../lib/task-api.js";

const server = createTaskServer();
server.listen(0, "127.0.0.1");
await once(server, "listening");
const base = `http://127.0.0.1:${server.address().port}`;

async function getJson(path) {
  const response = await fetch(`${base}${path}`, {
    signal: AbortSignal.timeout(2000),
  });
  const body = await response.json();
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${body.error}`);
  return body;
}

try {
  const tasks = await getJson("/tasks");
  console.log(tasks[0].title);

  try {
    await getJson("/tasks/999");
  } catch (error) {
    console.log(error.message);
  }
} finally {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}
```

```bash
pnpm exec node labs/13-fetch.js
```

**Expected:** `First demo task`, then `HTTP 404: Task not found`.

**Try it:** change the valid path to `/unknown`. For a timeout experiment, temporarily delay lab 12's handler by more than two seconds and restore it afterward.

**Remember:** `fetch` doesn't reject just because a server returns 404/500. A network failure or timeout is different from an HTTP failure. This helper expects JSON from the known local API; other APIs can return non-JSON error bodies. Validate external response shapes before trusting them. [Docs](https://nodejs.org/api/globals.html#fetch)

## 14. Built-in automated testing

**Requires:** `lib/pricing.js` from lab 1 and `lib/task-api.js` from lab 12.

**What it does:** tests business logic and the real HTTP interface without installing a test framework. Each server instance has independent state.

**`test/pricing.test.js`**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { total } from "../lib/pricing.js";

test("calculates a total and defaults quantity to one", () => {
  assert.equal(total(7, 3), 21);
  assert.equal(total(7), 7);
});

test("rejects invalid quantity and price", () => {
  assert.throws(() => total(7, -1), TypeError);
  assert.throws(() => total(NaN, 2), TypeError);
});
```

**`test/api.test.js`**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { createTaskServer } from "../lib/task-api.js";

test("creates a task and retrieves it", async (t) => {
  const server = createTaskServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(
    () =>
      new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      }),
  );
  const base = `http://127.0.0.1:${server.address().port}`;

  const created = await fetch(`${base}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Test task" }),
  });
  assert.equal(created.status, 201);
  const task = await created.json();
  assert.equal(task.title, "Test task");

  const response = await fetch(`${base}/tasks/${task.id}`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), task);
});
```

```bash
pnpm test
pnpm exec node --test --watch
```

**Expected:** three passing tests. The watch command remains running until Ctrl+C.

**Try it:** change one expected value and watch a test fail. Add tests for invalid JSON, missing fields and DELETE.

**Remember:** use meaningful assertions and await asynchronous work. An ephemeral port (`0`) avoids hard-coded test-port collisions; teardown prevents servers from keeping the test process alive. [Docs](https://nodejs.org/docs/latest-v24.x/api/test.html)

## 15. Child processes

**What it does:** runs another Node process with explicit arguments, captures its output and handles a nonzero exit status.

**`labs/15-child.js`**

```js
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const runFile = promisify(execFile);

const result = await runFile(
  process.execPath,
  ["-e", "console.log(process.argv[1].toUpperCase())", "demo argument"],
  { timeout: 2000, maxBuffer: 64 * 1024 },
);
console.log(result.stdout.trim());

try {
  await runFile(process.execPath, ["-e", "process.exitCode = 2"]);
} catch (error) {
  console.log("Child exit code:", error.code);
}
```

```bash
pnpm exec node labs/15-child.js
```

**Expected:** `DEMO ARGUMENT`, then `Child exit code: 2`.

**Try it:** pass an argument containing spaces or shell punctuation; it remains an argument instead of shell syntax.

**Remember:** `execFile` runs without a shell by default, avoiding shell interpolation. It buffers output; use `spawn` when streaming large output or interactive I/O. Don't concatenate untrusted input into shell commands or into executable JavaScript source. [Docs](https://nodejs.org/api/child_process.html)

## 16. Worker threads

**What it does:** moves a CPU-heavy prime-counting loop to another JavaScript thread while the main thread keeps servicing a timer.

**`labs/16-prime-worker.js`**

```js
import { parentPort, workerData } from "node:worker_threads";

let count = 0;
for (let value = 2; value <= workerData.limit; value += 1) {
  let prime = true;
  for (let divisor = 2; divisor * divisor <= value; divisor += 1) {
    if (value % divisor === 0) {
      prime = false;
      break;
    }
  }
  if (prime) count += 1;
}
parentPort.postMessage(count);
```

**`labs/16-workers.js`**

```js
import { Worker } from "node:worker_threads";

const worker = new Worker(new URL("./16-prime-worker.js", import.meta.url), {
  workerData: { limit: 1_000_000 },
});
const heartbeat = setInterval(() => console.log("Main thread responsive"), 50);

try {
  const result = await new Promise((resolve, reject) => {
    let received = false;
    worker.once("message", (value) => {
      received = true;
      resolve(value);
    });
    worker.once("error", reject);
    worker.once("exit", (code) => {
      if (!received)
        reject(new Error(`Worker exited without a result (code ${code})`));
    });
  });
  console.log("Prime count:", result);
} finally {
  clearInterval(heartbeat);
  await worker.terminate();
}
```

```bash
pnpm exec node labs/16-workers.js
```

**Expected:** prime count `78498`; the number of heartbeat messages varies with hardware and load. Run only `16-workers.js`; the worker file is launched by its parent.

**Try it:** increase the limit. As a comparison, place the counting loop on the main thread and observe that timer callbacks wait.

**Remember:** workers help CPU-bound JavaScript, not ordinary asynchronous network I/O. Message data is normally cloned, with explicit transfer/shared-memory options available. Creating a worker per small task can cost more than the work; repeated workloads often use a pool. [Docs](https://nodejs.org/docs/latest-v24.x/api/worker_threads.html)

## 17. Hashes and random identifiers

**What it does:** compares deterministic content hashing with random ID generation.

**`labs/17-crypto.js`**

```js
import { createHash, randomUUID, randomBytes } from "node:crypto";

function hash(text) {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

console.log("Equal input, equal hash:", hash("demo") === hash("demo"));
console.log("Changed input, equal hash:", hash("demo") === hash("Demo"));
console.log("Hash length:", hash("demo").length);
console.log("Random ID:", randomUUID());
console.log("Random token:", randomBytes(16).toString("hex"));
```

```bash
pnpm exec node labs/17-crypto.js
```

**Expected:** `true`, `false`, length `64`, then a UUID and a 32-character random hexadecimal token. Random values change each run.

**Try it:** hash two copies of the same text, then change one character.

**Remember:** hashing is not encryption. Plain SHA-256 is not a password-storage scheme; passwords need a suitable salted password KDF. A UUID identifies a record; it doesn't authorize access. [Docs](https://nodejs.org/docs/latest-v24.x/api/crypto.html)

## 18. Graceful shutdown

**What it does:** stops accepting new connections on Ctrl+C/SIGTERM, gives active requests a chance to finish, and enforces a shutdown deadline.

**`labs/18-shutdown.js`**

```js
import { createServer } from "node:http";

const server = createServer((request, response) => {
  const timer = setTimeout(() => {
    response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Finished demo request\n");
  }, 1500);
  response.once("close", () => clearTimeout(timer));
});

server.on("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});

let stopping = false;
function shutdown(signal) {
  if (stopping) return;
  stopping = true;
  console.log(`Received ${signal}; closing server`);

  const deadline = setTimeout(() => {
    console.error("Shutdown deadline reached");
    server.closeAllConnections();
    process.exitCode = 1;
  }, 5000);
  deadline.unref();

  server.close((error) => {
    clearTimeout(deadline);
    if (error) {
      console.error(error.message);
      process.exitCode = 1;
    }
    console.log("Server closed");
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
server.listen(3002, "127.0.0.1", () => {
  console.log("Shutdown lab: http://127.0.0.1:3002");
});
```

```bash
pnpm exec node labs/18-shutdown.js
```

In another terminal:

```bash
curl http://127.0.0.1:3002
```

**Try it:** press Ctrl+C in the server terminal while the request is waiting. The active response can finish before `Server closed` appears. Restart and increase the response delay beyond five seconds to observe forced connection closure instead.

**Remember:** signal handlers replace the default signal behavior; your cleanup must let the process exit. `unref()` means the deadline timer alone won't keep it alive. Real applications also close database pools, workers and other handles; upgraded sockets need their own handling. Never try to perform asynchronous cleanup in an `'exit'` event handler. [Process](https://nodejs.org/docs/latest-v24.x/api/process.html) · [HTTP shutdown](https://nodejs.org/docs/latest-v24.x/api/http.html#serverclosecallback)

## Quick reference and practice

### Error handling by API style

| Style                       | Handle failure with                                               |
| --------------------------- | ----------------------------------------------------------------- |
| Synchronous function        | `try/catch`                                                       |
| Promise / async function    | `await` inside `try/catch`, or `.catch()`                         |
| Error-first callback        | Inspect its first `error` argument                                |
| EventEmitter / many streams | Appropriate `'error'` listener or a helper such as `pipeline`     |
| HTTP response               | Check status; transport success doesn't imply application success |
| Child process               | Handle spawn failure and nonzero exit status                      |

A surrounding `try/catch` won't catch an exception thrown later in a timer callback. Handle that failure inside the callback or expose it through a promise.

### Choosing an API

| Need                      | Use                                                |
| ------------------------- | -------------------------------------------------- |
| Small file                | `readFile` / `writeFile` from `node:fs/promises`   |
| Large file                | Streams + `pipeline`                               |
| Delimited records         | `readline` / a suitable streaming parser           |
| Local event notifications | `EventEmitter`                                     |
| Independent async work    | `Promise.all`, with appropriate concurrency limits |
| Every operation's outcome | `Promise.allSettled`                               |
| Cancellation              | Supported API + `AbortSignal`                      |
| JSON endpoint             | `node:http` / framework                            |
| Outbound HTTP             | Built-in `fetch`                                   |
| CPU-heavy JavaScript      | Worker threads                                     |
| External executable       | `execFile` or `spawn`                              |
| Unit/integration tests    | `node:test` + `node:assert/strict`                 |

### Common mistakes

- **Blocking a server with synchronous filesystem calls or expensive loops:** async request handlers don't automatically fix blocking code.
- **Using `array.forEach(async ...)` and expecting it to wait:** use `for...of` with `await`, or `Promise.all(array.map(...))` for bounded independent work.
- **Forgetting `await`:** errors may become unhandled rejections and work may finish after the caller proceeds.
- **Assuming one chunk equals one message:** streams can split or combine application records.
- **Checking file existence before opening it:** the file may change between operations; attempt the operation and handle its error.
- **Building paths from untrusted input:** normalization alone is not access control.
- **Writing to the same file concurrently:** sequence writes or use appropriate storage.
- **Sending a response twice:** return after a completed response path and centralize error handling.
- **Trusting request JSON:** syntax validity doesn't establish a valid data shape.
- **Treating in-memory state as durable/shared storage:** restarts and multiple processes break that assumption.
- **Leaving timers/listeners/servers open:** they can leak resources or keep the process alive.
- **Continuing after an unexpected uncaught exception:** report it and shut down under a process supervisor rather than assuming the process state is sound.

### Debugging and development commands

Run after creating the referenced lab files:

```bash
# Restart the API after relevant source changes
pnpm dev

# Syntax check a file without running it
pnpm exec node --check labs/12-server.js

# Pause on startup for a local debugger; attach with VS Code's Node debugger
pnpm exec node --inspect-brk=127.0.0.1:9229 labs/12-server.js

# Test with coverage reporting
pnpm exec node --test --experimental-test-coverage

# Inspect why a dependency is installed, after adding it to a project
pnpm why package-name
```

The debug command waits for a debugger to attach. In VS Code, use **Debug: Attach to Node Process** or a Node attach configuration on port 9229.

### Package management reminders

| Command                          | Purpose                                                            |
| -------------------------------- | ------------------------------------------------------------------ |
| `pnpm add package-name`          | Add a runtime dependency                                           |
| `pnpm add -D package-name`       | Add a development dependency                                       |
| `pnpm remove package-name`       | Remove a direct dependency                                         |
| `pnpm install --frozen-lockfile` | Install exactly from a committed compatible lockfile, useful in CI |
| `pnpm exec tool`                 | Run a project-available executable                                 |
| `pnpm run script-name`           | Run a script from `package.json`                                   |

The names above are placeholders, not packages required by this guide. When dependencies are added, commit `package.json` and `pnpm-lock.yaml`; don't commit `node_modules/` or secrets.

### Practice challenges

- [ ] Add `PATCH /tasks/:id` with validated title updates.
- [ ] Add tests for malformed JSON, unsupported methods, oversized bodies and missing tasks.
- [ ] Add a query-string filter to `GET /tasks` using `URL.searchParams`.
- [ ] Replace the task Map with a database while preserving the HTTP contract tests.
- [ ] Add a transform stream that counts bytes without collecting the whole input.
- [ ] Build a bounded-concurrency runner for a list of async jobs.
- [ ] Add graceful shutdown to the task API and close any additional resources.
- [ ] Compare main-thread and worker-thread CPU work while measuring event-loop delay.
- [ ] Write a CLI that reads a JSON file, validates it and exits with a useful status.

### Further reading

- [Node.js 24 documentation](https://nodejs.org/docs/latest-v24.x/api/)
- [Don't block the event loop](https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop)
- [Backpressure in streams](https://nodejs.org/en/learn/modules/backpressuring-in-streams)
- [Node test runner](https://nodejs.org/docs/latest-v24.x/api/test.html)
- [pnpm CLI](https://pnpm.io/pnpm-cli)

Documentation checked **1 October 2026**. Examples target Node.js 24 and are original teaching exercises. They demonstrate core mechanisms; application frameworks, databases, authentication and deployment are separate topics.

Validation: checked with Node.js 24.19.0. The 15 finite entry-point scripts ran successfully, the three included tests passed, compressed output was verified, and additional checks covered API error responses and graceful shutdown during an active request. Markdown contents links and personal-information checks also passed.
