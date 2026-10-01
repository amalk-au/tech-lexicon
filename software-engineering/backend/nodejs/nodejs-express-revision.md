# Node.js and Express revision: learn by doing

[Back to the topic index](./README.md)

A practical reference with runnable snippets, concise explanations and small experiments. The examples use generic data and run on the server. Try HTTP endpoints with curl, a browser or a REST client.

## Use this guide in an existing project

**Target:** Node.js 24+ and Express 5.x. Use the pnpm version required by your project's `package.json`.

You can use the [Web Development template](https://github.com/amalk-au/web-development-template) or alternatively install as follows.

From your project root on Ubuntu:

```bash
node --version
pnpm --version
pnpm install
pnpm list express
```

If you need Express 5 in a practice copy of the project:

```bash
pnpm add express@5
```

If the project uses Express 4, see [Express 4 and 5](#25-express-4-and-5) before adapting async handlers. Adding a dependency can update `package.json` and `pnpm-lock.yaml`.

Create a `revision/` folder in your existing project. These examples use **`.mjs` files**, which Node treats as ES modules even when the existing project uses CommonJS. You do not need to change the project's `"type"` setting.

### Practice workflow

- **Node labs:** create the named file and run its command from the project root.
- **Express labs:** first create the three starter files in [section 10](#10-express-starter). Then replace **all** of `revision/lab.router.mjs` with one lab at a time.
- The practice server listens at **`http://127.0.0.1:3010`**. Keep it running in one terminal; run curl in another.
- With `--watch`, saving an imported file restarts the server. In-memory data resets on restart.
- File paths are relative to the project root. Linux filenames are case-sensitive. Do not paste all labs into one file.

When you want to integrate a lab into your existing application, mount its router **before** the existing 404 and error handlers:

```js
import { createLabRouter } from "./revision/lab.router.mjs";

// Inside your existing app setup, after any required body parser:
app.use("/lab", createLabRouter());
```

This small integration excerpt assumes your application already defines `app`. The complete, independently runnable setup is in section 10.

### Useful commands

| Command                                       | Purpose                                           |
| --------------------------------------------- | ------------------------------------------------- |
| `pnpm exec node revision/example.mjs`         | Run a Node lab; replace the example filename      |
| `pnpm exec node --watch revision/server.mjs`  | Restart the practice server when its code changes |
| `pnpm exec node --test revision/api.test.mjs` | Run the API tests from this guide                 |
| `pnpm install --frozen-lockfile`              | Install using the committed lockfile in CI        |
| `pnpm add <package>`                          | Add a runtime dependency                          |
| `pnpm add -D <package>`                       | Add a development dependency                      |
| `pnpm remove <package>`                       | Remove a dependency                               |

If port 3010 is occupied, start the server with `REVISION_PORT=3011` and update the URLs in the examples. Stop a running server with **Ctrl+C**.

## Contents

- [Node.js and Express revision: learn by doing](#nodejs-and-express-revision-learn-by-doing)
  - [Use this guide in an existing project](#use-this-guide-in-an-existing-project)
    - [Practice workflow](#practice-workflow)
    - [Useful commands](#useful-commands)
  - [Contents](#contents)
  - [1. Node.js, Express and the browser](#1-nodejs-express-and-the-browser)
  - [2. Modules: ESM and CommonJS](#2-modules-esm-and-commonjs)
  - [3. Process, arguments and environment variables](#3-process-arguments-and-environment-variables)
  - [4. Async work and the event loop](#4-async-work-and-the-event-loop)
  - [5. Files, paths and JSON](#5-files-paths-and-json)
  - [6. Buffers, streams and backpressure](#6-buffers-streams-and-backpressure)
  - [7. EventEmitter](#7-eventemitter)
  - [8. Worker threads for CPU work](#8-worker-threads-for-cpu-work)
  - [9. HTTP without Express](#9-http-without-express)
  - [10. Express starter](#10-express-starter)
  - [11. Routing, parameters and query strings](#11-routing-parameters-and-query-strings)
  - [12. Middleware and request logging](#12-middleware-and-request-logging)
  - [13. Request bodies and validation](#13-request-bodies-and-validation)
  - [14. Async errors, 404 and cleanup](#14-async-errors-404-and-cleanup)
  - [15. Complete CRUD API](#15-complete-crud-api)
  - [16. API tests with node:test](#16-api-tests-with-nodetest)
  - [17. Fetch, timeouts and cancellation](#17-fetch-timeouts-and-cancellation)
  - [18. Static files and a browser client](#18-static-files-and-a-browser-client)
  - [19. CORS and preflight](#19-cors-and-preflight)
  - [20. Authentication and authorization](#20-authentication-and-authorization)
  - [21. Cookies and session concepts](#21-cookies-and-session-concepts)
  - [22. Headers and rate limiting](#22-headers-and-rate-limiting)
  - [23. Repository boundaries and database readiness](#23-repository-boundaries-and-database-readiness)
    - [Optional PostgreSQL lab](#optional-postgresql-lab)
  - [24. Shutdown, debugging and deployment habits](#24-shutdown-debugging-and-deployment-habits)
  - [25. Express 4 and 5](#25-express-4-and-5)
  - [26. Revision checklist and practice challenges](#26-revision-checklist-and-practice-challenges)
    - [Common mistakes](#common-mistakes)
    - [Suggested study order](#suggested-study-order)
    - [Practice challenges](#practice-challenges)
    - [Mental checklist](#mental-checklist)
  - [Official references](#official-references)

## 1. Node.js, Express and the browser

**What it does:** separates language features from APIs supplied by the runtime.

| Layer               | Examples                                             |
| ------------------- | ---------------------------------------------------- |
| JavaScript language | Functions, objects, arrays, promises, classes        |
| Node.js runtime     | Filesystem, processes, streams, HTTP, worker threads |
| Express             | Routing, middleware, request and response helpers    |
| Browser             | DOM, localStorage, browser events                    |

**File: `revision/runtime.mjs`**

```js
import { platform } from "node:os";

console.log("Node version:", process.version);
console.log("Platform:", platform());
console.log("document:", typeof document); // undefined in Node
console.log("fetch:", typeof fetch); // function on the target Node version
```

**Run:**

```bash
pnpm exec node revision/runtime.mjs
```

**Try it:** inspect the output. A Node process can access files and serve HTTP without a DOM. Express runs inside that process; it is not a separate runtime.

## 2. Modules: ESM and CommonJS

**What it does:** shares code through explicit module exports.

**File: `revision/math.mjs`**

```js
export function add(a, b) {
  return a + b;
}

export default function double(value) {
  return value * 2;
}
```

**File: `revision/modules.mjs`**

```js
import double, { add } from "./math.mjs";

console.log(add(2, 3)); // 5
console.log(double(4)); // 8
console.log(new URL("./math.mjs", import.meta.url).pathname);
```

**Run:**

```bash
pnpm exec node revision/modules.mjs
```

For CommonJS practice, use separate `.cjs` files:

**File: `revision/math.cjs`**

```js
function add(a, b) {
  return a + b;
}

module.exports = { add };
```

**File: `revision/modules.cjs`**

```js
const { add } = require("./math.cjs");

console.log(add(2, 3)); // 5
console.log(__dirname); // directory containing this module
```

**Run:**

```bash
pnpm exec node revision/modules.cjs
```

**Remember:** `.mjs` means ESM; `.cjs` means CommonJS. For `.js`, prefer an explicit package `"type"` rather than relying on syntax detection. Local ESM imports include the extension. ESM has `import.meta.url`; CommonJS has `__dirname` and `__filename`.

**Try it:** add a named export called `subtract` and import it into the matching module.

## 3. Process, arguments and environment variables

**What it does:** reads CLI inputs and validates environment configuration.

**File: `revision/config.mjs`**

```js
const [topic = "express"] = process.argv.slice(2);
const rawPort = process.env.REVISION_PORT ?? "3010";

if (!/^\d+$/.test(rawPort)) {
  throw new Error("REVISION_PORT must contain only digits");
}

const port = Number(rawPort);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("REVISION_PORT must be between 1 and 65535");
}

console.log({ topic, port, mode: process.env.NODE_ENV ?? "development" });
```

**Run:**

```bash
REVISION_PORT=3011 NODE_ENV=development pnpm exec node revision/config.mjs streams
```

**Expected:** the selected topic and numeric port. Environment values arrive as strings; parse and validate them before use.

You can also load a dedicated local file.

**File: `.env.revision`**

```dotenv
REVISION_PORT=3011
NODE_ENV=development
```

**Run:**

```bash
pnpm exec node --env-file=.env.revision revision/config.mjs files
```

An already-set environment variable takes precedence over the value in the file. Add `.env.revision` to `.gitignore`; commit a placeholder `.env.example` when a project needs documented configuration.

**Try it:** use `REVISION_PORT=abc`, `0` and `70000`. Each should fail before the application starts. Avoid logging the whole environment; it can contain secrets.

## 4. Async work and the event loop

**What it does:** shows microtasks, concurrent waiting and the effect of synchronous CPU work.

**File: `revision/async.mjs`**

```js
import { setTimeout as delay } from "node:timers/promises";

console.log("1: synchronous");
queueMicrotask(() => console.log("3: microtask"));
setTimeout(() => console.log("4: timer"), 0);
console.log("2: synchronous");

async function load(label, ms) {
  await delay(ms);
  return label;
}

console.time("concurrent");
const results = await Promise.all([load("first", 80), load("second", 120)]);
console.timeEnd("concurrent");
console.log(results); // ['first', 'second']
```

**Run:**

```bash
pnpm exec node revision/async.mjs
```

**Expected:** the numbered messages appear as 1, 2, 3, 4. Concurrent waiting takes roughly the longest delay, not their sum. Exact timing depends on scheduling.

**Remember:** promises do not move ordinary JavaScript computation to another thread. An `async` function runs synchronously until it reaches an `await`. `Promise.all` preserves input order, rejects on the first rejection and does not automatically cancel other operations. Use `Promise.allSettled` when every outcome matters.

**Try it:** replace `Promise.all` with two sequential `await` calls and compare the duration. A long synchronous loop delays other callbacks; use worker threads for substantial CPU work.

## 5. Files, paths and JSON

**What it does:** writes and reads a small JSON file using module-relative paths.

**File: `revision/files.mjs`**

```js
import { mkdir, writeFile, readFile } from "node:fs/promises";

const directory = new URL("./data/", import.meta.url);
const file = new URL("./data/demo.json", import.meta.url);

await mkdir(directory, { recursive: true });
await writeFile(file, JSON.stringify({ completed: false }, null, 2), "utf8");

const text = await readFile(file, "utf8");
const data = JSON.parse(text);

if (typeof data.completed !== "boolean") {
  throw new Error("Invalid demo file");
}

console.log(data); // { completed: false }

try {
  await readFile(new URL("./data/missing.json", import.meta.url), "utf8");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
  console.log("Missing file handled");
}
```

**Run:**

```bash
pnpm exec node revision/files.mjs
```

**Remember:** `process.cwd()` is the working directory; `import.meta.url` identifies the module. These are different bases for resolving paths. Promise APIs avoid blocking the event loop while waiting for I/O.

This lab overwrites only `revision/data/demo.json`. A JSON file is useful for practice; concurrent read-modify-write operations can lose updates, so it is not a replacement for transactional storage.

**Try it:** change the object, rerun and inspect the file. Add an extra field check after `JSON.parse`: valid JSON does not guarantee valid application data.

## 6. Buffers, streams and backpressure

**What it does:** treats data as bytes and copies a file through a stream pipeline.

**File: `revision/streams.mjs`**

```js
import { Buffer } from "node:buffer";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";

const bytes = Buffer.from("hello", "utf8");
console.log(bytes.length); // 5 bytes
console.log(bytes.toString("hex")); // 68656c6c6f
console.log(bytes.toString("utf8")); // hello

const directory = new URL("./data/", import.meta.url);
const source = new URL("./data/source.txt", import.meta.url);
const target = new URL("./data/copy.txt", import.meta.url);

await mkdir(directory, { recursive: true });
await writeFile(source, "stream practice\n".repeat(100), "utf8");

await pipeline(createReadStream(source), createWriteStream(target));

console.log((await readFile(source)).equals(await readFile(target))); // true
```

**Run:**

```bash
pnpm exec node revision/streams.mjs
```

**Remember:** streams process chunks instead of loading the whole source into memory. Backpressure lets a slower consumer limit how quickly the producer sends data. `pipeline` manages stream flow and propagates failures. The final readback here is only a small-file verification step.

**Try it:** replace `hello` with an emoji. UTF-8 byte length and JavaScript string length can differ.

## 7. EventEmitter

**What it does:** publishes local events and registers reusable or one-time listeners.

**File: `revision/events.mjs`**

```js
import { EventEmitter } from "node:events";

const events = new EventEmitter();
const log = (task) => console.log("Created:", task.title);

events.on("created", log);
events.once("created", () => console.log("First creation only"));
events.on("error", (error) => console.log("Handled:", error.message));

events.emit("created", { title: "Read routing notes" });
events.emit("created", { title: "Try middleware" });
events.off("created", log);
events.emit("created", { title: "No creation listeners remain" });
events.emit("error", new Error("Demo event failure"));
```

**Run:**

```bash
pnpm exec node revision/events.mjs
```

**Expected:** two creation messages, one first-creation message and one handled-error message.

**Remember:** regular listeners run synchronously when `emit` is called. An unhandled `error` event throws. Local events do not provide durable delivery or communication between separate processes.

**Try it:** move `off` before the second emission. If a listener starts async work, handle its rejected promise deliberately.

## 8. Worker threads for CPU work

**What it does:** calculates a sum in a worker while the main thread remains available.

**File: `revision/sum.worker.mjs`**

```js
import { parentPort, workerData } from "node:worker_threads";

let total = 0;
for (let value = 1; value <= workerData.limit; value += 1) {
  total += value;
}

parentPort.postMessage(total);
```

**File: `revision/workers.mjs`**

```js
import { Worker } from "node:worker_threads";

function calculate(limit) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./sum.worker.mjs", import.meta.url), {
      workerData: { limit },
    });
    let received = false;

    worker.once("message", (result) => {
      received = true;
      resolve(result);
    });
    worker.once("error", reject);
    worker.once("exit", (code) => {
      if (code !== 0 || !received) {
        reject(new Error("Worker exited before a successful result"));
      }
    });
  });
}

const pending = calculate(1_000_000);
console.log("Main thread can continue");
console.log(await pending); // 500000500000
```

**Run:**

```bash
pnpm exec node revision/workers.mjs
```

**Remember:** worker creation has overhead; pools suit repeated CPU jobs. Ordinary asynchronous I/O usually does not need a worker. This demonstration uses numbers small enough to remain safe integers.

**Try it:** compare this with the same loop in the main thread. A fast calculation may not justify worker overhead.

## 9. HTTP without Express

**What it does:** creates a basic Node HTTP server and returns JSON.

**File: `revision/http.mjs`**

```js
import { createServer } from "node:http";

const server = createServer((req, res) => {
  const url = new URL(req.url, "http://127.0.0.1");

  if (req.method === "GET" && url.pathname === "/health") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.on("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});

server.listen(3012, "127.0.0.1", () => {
  console.log("HTTP lab: http://127.0.0.1:3012");
});
```

**Run:**

```bash
pnpm exec node revision/http.mjs
```

**Try in a second terminal:**

```bash
curl -i http://127.0.0.1:3012/health
curl -i http://127.0.0.1:3012/missing
```

**Expected:** 200 with a health object; 404 with an error object. Express adds routing and middleware helpers on top of Node's HTTP facilities.

Stop this server before moving on.

## 10. Express starter

**What it does:** separates application construction from listening, mounts a replaceable lab router, and returns consistent JSON errors.

Create these **four files once**. Later Express labs replace only `revision/lab.router.mjs` unless they explicitly name an additional file.

**File: `revision/lab.router.mjs`**

```js
import express from "express";

export function createLabRouter() {
  const router = express.Router();

  router.get("/", (req, res) => {
    res.json({ message: "Choose a lab and replace this router" });
  });

  return router;
}
```

**File: `revision/http-errors.mjs`**

```js
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function requireJson(req) {
  if (!req.is("application/json")) {
    throw new HttpError(415, "Use Content-Type: application/json");
  }
}
```

**File: `revision/app.mjs`**

```js
import express from "express";
import { randomUUID } from "node:crypto";
import { createLabRouter } from "./lab.router.mjs";
import { HttpError } from "./http-errors.mjs";

export function createApp() {
  const app = express();
  app.disable("x-powered-by");

  app.use((req, res, next) => {
    res.locals.requestId = randomUUID();
    res.set("X-Request-Id", res.locals.requestId);
    next();
  });

  app.use(express.json({ limit: "16kb" }));
  app.get("/health", (req, res) => res.json({ status: "ok" }));
  app.use("/lab", createLabRouter());

  app.use((req, res, next) => {
    next(new HttpError(404, "Route not found"));
  });

  // All four parameters are required for Express to identify an error handler.
  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);

    let status = 500;
    let message = "Internal server error";

    if (error instanceof HttpError) {
      status = error.status;
      message = error.message;
    } else if (error.type === "entity.parse.failed") {
      status = 400;
      message = "Invalid JSON";
    } else if (error.type === "entity.too.large") {
      status = 413;
      message = "Request body is too large";
    }

    if (status >= 500) {
      console.error({
        requestId: res.locals.requestId,
        name: error.name,
        message: error.message,
      });
    }

    res.status(status).json({
      error: { message },
      requestId: res.locals.requestId,
    });
  });

  return app;
}
```

**File: `revision/server.mjs`**

```js
import { createApp } from "./app.mjs";

const rawPort = process.env.REVISION_PORT ?? "3010";
const port = Number(rawPort);

if (
  !/^\d+$/.test(rawPort) ||
  !Number.isInteger(port) ||
  port < 1 ||
  port > 65535
) {
  throw new Error("REVISION_PORT must be an integer between 1 and 65535");
}

const server = createApp().listen(port, "127.0.0.1", () => {
  console.log("Practice server: http://127.0.0.1:" + port);
});

server.on("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});

let stopping = false;

function shutdown() {
  if (stopping) return;
  stopping = true;

  // Force an exit only if active requests cannot finish within the deadline.
  const deadline = setTimeout(() => {
    console.error("Shutdown deadline exceeded");
    server.closeAllConnections();
    process.exit(1);
  }, 5000);
  deadline.unref();

  server.close((error) => {
    clearTimeout(deadline);
    if (error) {
      console.error(error.message);
      process.exitCode = 1;
    }
    console.log("Practice server stopped");
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
```

**Run:**

```bash
pnpm exec node --watch revision/server.mjs
```

**Try in another terminal:**

```bash
curl -i http://127.0.0.1:3010/health
curl -i http://127.0.0.1:3010/lab
curl -i http://127.0.0.1:3010/missing
```

**Expected:** 200, 200 and 404. Every response has a request ID header. The ID in a JSON error lets you correlate it with server logs.

**Remember:** registration order matters: context/body parsing → routes → 404 → error handler. The application factory makes it possible to start independent instances in tests.

## 11. Routing, parameters and query strings

**What it does:** distinguishes a path parameter, a query parameter and a request header.

**Replace file: `revision/lab.router.mjs`**

```js
import express from "express";
import { HttpError } from "./http-errors.mjs";

export function createLabRouter() {
  const router = express.Router();

  router.get("/items/:id", (req, res) => {
    const id = req.params.id;
    const page = req.query.page ?? "1";

    if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) {
      throw new HttpError(400, "id must be a positive safe integer");
    }
    if (
      typeof page !== "string" ||
      !/^[1-9]\d*$/.test(page) ||
      !Number.isSafeInteger(Number(page))
    ) {
      throw new HttpError(400, "page must be a positive safe integer");
    }

    res.json({
      id: Number(id),
      page: Number(page),
      accepts: req.get("accept") ?? null,
    });
  });

  router.get("/redirect", (req, res) => res.redirect(302, "/health"));
  return router;
}
```

**Try:**

```bash
curl -i -H 'Accept: application/json' 'http://127.0.0.1:3010/lab/items/7?page=2'
curl -i 'http://127.0.0.1:3010/lab/items/abc?page=2'
curl -i 'http://127.0.0.1:3010/lab/items/7?page=1&page=2'
curl -i http://127.0.0.1:3010/lab/redirect
```

**Expected:** a JSON object with numeric values, two 400 errors, and a 302 with a `Location` header. Add curl's `-L` option to follow the redirect.

| API                 | Reads or writes                                    |
| ------------------- | -------------------------------------------------- |
| `req.params`        | Matched route segments                             |
| `req.query`         | Parsed query values; validate their type and shape |
| `req.body`          | Parsed request body, after the matching parser     |
| `req.get('header')` | Request header                                     |
| `res.status(code)`  | Response status                                    |
| `res.json(value)`   | JSON response                                      |
| `res.send(value)`   | String, buffer or other supported response         |
| `res.end()`         | Finish a response without additional data          |

**Try it:** send a second query value using the same key. Never assume every query value is a single string.

## 12. Middleware and request logging

**What it does:** passes a request through middleware and records the finished response.

**Replace file: `revision/lab.router.mjs`**

```js
import express from "express";

export function createLabRouter() {
  const router = express.Router();

  router.use((req, res, next) => {
    const started = performance.now();
    res.locals.trace = ["router middleware"];

    res.on("finish", () => {
      console.log(
        JSON.stringify({
          requestId: res.locals.requestId,
          method: req.method,
          status: res.statusCode,
          durationMs: Number((performance.now() - started).toFixed(2)),
        }),
      );
    });

    next();
  });

  router.get(
    "/trace",
    (req, res, next) => {
      res.locals.trace.push("route middleware");
      next();
    },
    (req, res) => {
      res.locals.trace.push("handler");
      res.json({ trace: res.locals.trace });
    },
  );

  return router;
}
```

**Try:**

```bash
curl -i http://127.0.0.1:3010/lab/trace
```

**Expected:** three trace entries in registration order and one terminal log.

**Remember:** call `next()` to continue, `next(error)` to enter error handling, or send a response to finish. Calling `next()` after sending a response can reach another handler that tries to send again. `return res.json(...)` is a useful early exit.

`res.locals` stores data for one response. A `finish` event means the response was handed to the underlying system; it does not prove that a client consumed it. Avoid recording authorization headers, passwords or whole request bodies.

**Try it:** temporarily remove the first `next()`. The request hangs because the middleware neither continues nor responds; restore it and restart the server.

## 13. Request bodies and validation

**What it does:** parses JSON or URL-encoded form data, validates the shape, and normalizes a title.

**Replace file: `revision/lab.router.mjs`**

```js
import express from "express";
import { HttpError, requireJson } from "./http-errors.mjs";

function readTitle(body) {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    throw new HttpError(400, "Body must be an object");
  }
  if (Object.keys(body).some((key) => key !== "title")) {
    throw new HttpError(400, "Only title is allowed");
  }
  if (typeof body.title !== "string") {
    throw new HttpError(400, "title must be a string");
  }

  const title = body.title.trim();
  if (title.length < 1 || title.length > 80) {
    throw new HttpError(400, "title must contain 1–80 characters");
  }
  return title;
}

export function createLabRouter() {
  const router = express.Router();
  router.use(express.urlencoded({ extended: false, limit: "16kb" }));

  router.post("/json", (req, res) => {
    requireJson(req);
    res.status(201).json({ title: readTitle(req.body) });
  });

  router.post("/form", (req, res) => {
    if (!req.is("application/x-www-form-urlencoded")) {
      throw new HttpError(415, "Use a URL-encoded form body");
    }
    res.status(201).json({ title: readTitle(req.body) });
  });

  return router;
}
```

**Try:**

```bash
curl -i -X POST http://127.0.0.1:3010/lab/json \
  -H 'Content-Type: application/json' \
  --data '{"title":"  Learn validation  "}'

curl -i -X POST http://127.0.0.1:3010/lab/json \
  -H 'Content-Type: application/json' \
  --data '{"title":true}'

curl -i -X POST http://127.0.0.1:3010/lab/json \
  -H 'Content-Type: application/json' \
  --data '{"title":'

curl -i -X POST http://127.0.0.1:3010/lab/form \
  --data-urlencode 'title=Learn forms'
```

**Expected:** 201 with a trimmed title, 400 for the wrong field type, 400 for malformed JSON, and 201 for the form.

**Remember:** a body parser checks syntax, not your business rules. Select allowed fields instead of blindly copying user input into a database record. Multipart uploads require a separate parser; neither JSON nor URL-encoded parsing handles them.

**Try it:** send `{"title":"Demo","id":99}`, an empty title and an array body. Each should be rejected.

## 14. Async errors, 404 and cleanup

**What it does:** forwards failures from promise-based handlers and callback-based operations.

**Replace file: `revision/lab.router.mjs`**

```js
import express from "express";
import { setTimeout as delay } from "node:timers/promises";
import { HttpError } from "./http-errors.mjs";

export function createLabRouter() {
  const router = express.Router();

  router.get("/conflict", async (req, res) => {
    await delay(10);
    throw new HttpError(409, "Demo conflict");
  });

  router.get("/failure", async (req, res) => {
    await delay(10);
    throw new Error("Detailed demo failure for the server log");
  });

  router.get("/callback-failure", (req, res, next) => {
    setTimeout(() => {
      try {
        throw new Error("Failure inside a timer callback");
      } catch (error) {
        next(error);
      }
    }, 10);
  });

  return router;
}
```

**Try:**

```bash
curl -i http://127.0.0.1:3010/lab/conflict
curl -i http://127.0.0.1:3010/lab/failure
curl -i http://127.0.0.1:3010/lab/callback-failure
curl -i http://127.0.0.1:3010/lab/missing
```

**Expected:** 409, 500, 500 and 404. Unexpected error details stay in the server log.

Express 5 catches rejections from a promise **returned by the handler**. A detached timer or forgotten promise is outside that returned chain; forward its error or await the operation.

For resource cleanup, use `finally`.

**File: `revision/cleanup.mjs`**

```js
import { open } from "node:fs/promises";

const handle = await open(new URL("./cleanup-demo.txt", import.meta.url), "w");
try {
  await handle.writeFile("cleanup practice\n", "utf8");
  console.log("Wrote the demo file");
} finally {
  await handle.close();
  console.log("Closed the file handle");
}
```

**Run:**

```bash
pnpm exec node revision/cleanup.mjs
```

**Try it:** throw an error after `writeFile`. The `finally` block still closes the handle. Do not use unhandled failures as a way to keep a server running.

## 15. Complete CRUD API

**What it does:** creates, lists, reads, replaces, updates and deletes tasks. It includes body validation, query validation, filtering and pagination.

**Additional file: `revision/tasks.router.mjs`**

```js
import express from "express";
import { HttpError, requireJson } from "./http-errors.mjs";

function readId(value) {
  if (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value))) {
    throw new HttpError(400, "id must be a positive safe integer");
  }
  return Number(value);
}

function readPositive(value, label, fallback, maximum) {
  if (value === undefined) return fallback;
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
    throw new HttpError(400, label + " must be a positive integer");
  }
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number > maximum) {
    throw new HttpError(400, label + " is outside the allowed range");
  }
  return number;
}

function readPayload(body, partial = false) {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    throw new HttpError(400, "Body must be an object");
  }

  const keys = Object.keys(body);
  if (keys.some((key) => !["title", "completed"].includes(key))) {
    throw new HttpError(400, "Only title and completed are allowed");
  }
  if (partial && keys.length === 0) {
    throw new HttpError(400, "Provide at least one field");
  }

  const result = {};
  if (!partial || Object.hasOwn(body, "title")) {
    if (
      typeof body.title !== "string" ||
      body.title.trim().length < 1 ||
      body.title.trim().length > 80
    ) {
      throw new HttpError(400, "title must contain 1–80 characters");
    }
    result.title = body.title.trim();
  }

  if (Object.hasOwn(body, "completed")) {
    if (typeof body.completed !== "boolean") {
      throw new HttpError(400, "completed must be a boolean");
    }
    result.completed = body.completed;
  } else if (!partial) {
    result.completed = false;
  }

  return result;
}

export function createTasksRouter() {
  const router = express.Router();
  const tasks = new Map([
    [1, { id: 1, title: "Learn routing", completed: false }],
    [2, { id: 2, title: "Try middleware", completed: true }],
  ]);
  let nextId = 3;

  function find(value) {
    const id = readId(value);
    const task = tasks.get(id);
    if (!task) throw new HttpError(404, "Task not found");
    return task;
  }

  router.get("/", (req, res) => {
    const page = readPositive(req.query.page, "page", 1, 10_000);
    const limit = readPositive(req.query.limit, "limit", 10, 50);
    const completed = req.query.completed;
    const query = req.query.q ?? "";

    if (
      completed !== undefined &&
      completed !== "true" &&
      completed !== "false"
    ) {
      throw new HttpError(400, "completed must be true or false");
    }
    if (typeof query !== "string" || query.length > 100) {
      throw new HttpError(400, "q must be a string of at most 100 characters");
    }

    const filtered = [...tasks.values()]
      .filter(
        (task) =>
          completed === undefined || task.completed === (completed === "true"),
      )
      .filter((task) => task.title.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => a.id - b.id);

    const start = (page - 1) * limit;
    res.json({
      data: filtered.slice(start, start + limit),
      meta: { total: filtered.length, page, limit },
    });
  });

  router.get("/:id", (req, res) => res.json(find(req.params.id)));

  router.post("/", (req, res) => {
    requireJson(req);
    const payload = readPayload(req.body);
    const task = { id: nextId++, ...payload };
    tasks.set(task.id, task);
    res
      .location(req.baseUrl + "/" + task.id)
      .status(201)
      .json(task);
  });

  router.put("/:id", (req, res) => {
    requireJson(req);
    const existing = find(req.params.id);
    const task = { id: existing.id, ...readPayload(req.body) };
    tasks.set(task.id, task);
    res.json(task);
  });

  router.patch("/:id", (req, res) => {
    requireJson(req);
    const existing = find(req.params.id);
    const task = { ...existing, ...readPayload(req.body, true) };
    tasks.set(task.id, task);
    res.json(task);
  });

  router.delete("/:id", (req, res) => {
    const task = find(req.params.id);
    tasks.delete(task.id);
    res.status(204).end();
  });

  return router;
}
```

**Replace file: `revision/lab.router.mjs`**

```js
import express from "express";
import { createTasksRouter } from "./tasks.router.mjs";

export function createLabRouter() {
  const router = express.Router();
  router.use("/tasks", createTasksRouter());
  return router;
}
```

**Try in order after a fresh server restart:**

```bash
curl -i 'http://127.0.0.1:3010/lab/tasks?completed=false&page=1&limit=5'
curl -i http://127.0.0.1:3010/lab/tasks/1

curl -i -X POST http://127.0.0.1:3010/lab/tasks \
  -H 'Content-Type: application/json' \
  --data '{"title":"Practise CRUD"}'

curl -i -X PATCH http://127.0.0.1:3010/lab/tasks/3 \
  -H 'Content-Type: application/json' \
  --data '{"completed":true}'

curl -i -X PUT http://127.0.0.1:3010/lab/tasks/3 \
  -H 'Content-Type: application/json' \
  --data '{"title":"Replaced task"}'

curl -i -X DELETE http://127.0.0.1:3010/lab/tasks/3
curl -i http://127.0.0.1:3010/lab/tasks/3
```

**Expected:** the new task has ID 3 only when you start with the two seed tasks. Use the ID returned by POST if you have already created tasks.

| Method         | Meaning in this API                                                  | Success          |
| -------------- | -------------------------------------------------------------------- | ---------------- |
| GET collection | Filtered, paginated list                                             | 200              |
| GET item       | Read one existing task                                               | 200              |
| POST           | Create a task                                                        | 201 + `Location` |
| PUT            | Replace editable fields; title required, completed defaults to false | 200              |
| PATCH          | Change provided fields; preserve other fields                        | 200              |
| DELETE         | Remove an existing task                                              | 204, empty body  |

**Remember:** data belongs to one router instance in one process. It resets on restart and is not shared across server instances. This API defines replacement of an existing task with PUT; other APIs may define an additional create-on-PUT contract.

**Try it:** send `{"completed":"false"}`, `{"id":99}`, an empty PATCH, `?limit=500` or `?completed=maybe`. Each should return 400. Filtering and search happen before pagination.

## 16. API tests with node:test

**What it does:** starts the application on a temporary port and verifies real HTTP responses without an extra testing package.

Keep the CRUD router from section 15 active.

**File: `revision/api.test.mjs`**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { createApp } from "./app.mjs";

async function start(t) {
  const server = createApp().listen(0, "127.0.0.1");

  t.after(
    () =>
      new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      }),
  );

  await once(server, "listening");
  return "http://127.0.0.1:" + server.address().port;
}

test("health and unknown routes have useful HTTP contracts", async (t) => {
  const origin = await start(t);
  const health = await fetch(origin + "/health");
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), { status: "ok" });

  const missing = await fetch(origin + "/missing");
  assert.equal(missing.status, 404);
  const body = await missing.json();
  assert.equal(body.error.message, "Route not found");
  assert.equal(body.requestId, missing.headers.get("x-request-id"));
});

test("create, patch, replace, read and delete a task", async (t) => {
  const origin = await start(t);
  const collection = origin + "/lab/tasks";
  const headers = { "Content-Type": "application/json" };

  const created = await fetch(collection, {
    method: "POST",
    headers,
    body: JSON.stringify({ title: "  Test task  " }),
  });
  assert.equal(created.status, 201);
  const task = await created.json();
  assert.equal(task.title, "Test task");
  const item = new URL(created.headers.get("location"), origin);

  const patched = await fetch(item, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ completed: true }),
  });
  assert.equal(patched.status, 200);
  assert.equal((await patched.json()).completed, true);

  const filtered = await fetch(collection + "?completed=true&limit=1&page=2");
  const page = await filtered.json();
  assert.equal(page.meta.total, 2);
  assert.equal(page.data.length, 1);
  assert.equal(page.data[0].id, task.id);

  const replaced = await fetch(item, {
    method: "PUT",
    headers,
    body: JSON.stringify({ title: "Replacement" }),
  });
  assert.equal(replaced.status, 200);
  assert.equal((await replaced.json()).completed, false);

  const read = await fetch(item);
  assert.equal((await read.json()).title, "Replacement");

  const removed = await fetch(item, { method: "DELETE" });
  assert.equal(removed.status, 204);
  assert.equal(await removed.text(), "");

  const missing = await fetch(item);
  assert.equal(missing.status, 404);
  await missing.json();
});

test("invalid inputs and malformed JSON return client errors", async (t) => {
  const origin = await start(t);
  const collection = origin + "/lab/tasks";

  for (const body of [
    { title: "" },
    { title: "Demo", completed: "false" },
    { title: "Demo", id: 99 },
    [],
  ]) {
    const response = await fetch(collection, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    assert.equal(response.status, 400);
    await response.json();
  }

  const malformed = await fetch(collection, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: '{"title":',
  });
  assert.equal(malformed.status, 400);
  assert.equal((await malformed.json()).error.message, "Invalid JSON");

  const wrongType = await fetch(collection, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: "Demo",
  });
  assert.equal(wrongType.status, 415);
  await wrongType.json();
});
```

**Run:**

```bash
pnpm exec node --test revision/api.test.mjs
```

**Expected:** three passing tests. Each test gets an independent app and fresh in-memory data. Port 0 lets the operating system choose a free port.

**Try it:** add tests for an empty PATCH, an invalid query and an oversized body. Test observable status, headers, data and persistence between requests rather than repeating internal implementation details.

## 17. Fetch, timeouts and cancellation

**What it does:** makes an outgoing HTTP request from Node, checks HTTP status and applies a deadline.

**Replace file: `revision/lab.router.mjs`**

```js
import express from "express";
import { setTimeout as delay } from "node:timers/promises";

export function createLabRouter() {
  const router = express.Router();

  router.get("/slow", async (req, res) => {
    await delay(300);
    res.json({ message: "Slow operation finished" });
  });

  return router;
}
```

**File: `revision/fetch.mjs`**

```js
const origin = process.env.REVISION_ORIGIN ?? "http://127.0.0.1:3010";

async function getJson(path, timeoutMs) {
  const response = await fetch(new URL(path, origin), {
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!response.ok) {
    throw new Error("HTTP " + response.status);
  }
  return await response.json();
}

console.log(await getJson("/health", 2000));

try {
  await getJson("/lab/slow", 50);
} catch (error) {
  console.log("Slow request:", error.name); // normally TimeoutError
}

try {
  await getJson("/missing", 2000);
} catch (error) {
  console.log(error.message); // HTTP 404
}

const controller = new AbortController();
controller.abort();
try {
  await fetch(new URL("/health", origin), { signal: controller.signal });
} catch (error) {
  console.log("Manual cancellation:", error.name); // AbortError
}
```

**Run while the practice server is running:**

```bash
pnpm exec node revision/fetch.mjs
```

**Remember:** fetch rejects for network failures or cancellation, but 404/500 responses require an explicit `response.ok` check. Abort stops the client from waiting; it does not undo server side effects. CORS is a browser constraint, so server-side fetch does not enforce browser CORS policy.

**Try it:** increase the slow request's timeout to 1000 ms. Use a fixed, trusted upstream destination when building a proxy; accepting arbitrary client URLs can introduce server-side request forgery.

## 18. Static files and a browser client

**What it does:** serves a small frontend from Express and lets you list and create tasks in the browser.

First create `revision/tasks.router.mjs` from section 15. This lab mounts it alongside the frontend. You can continue using the existing `app.mjs` and `server.mjs`.

**Replace file: `revision/lab.router.mjs`**

```js
import express from "express";
import { fileURLToPath } from "node:url";
import { createTasksRouter } from "./tasks.router.mjs";

export function createLabRouter() {
  const router = express.Router();
  const publicDirectory = fileURLToPath(new URL("./public/", import.meta.url));

  router.use("/tasks", createTasksRouter());
  router.use("/assets", express.static(publicDirectory, { dotfiles: "deny" }));
  return router;
}
```

**Additional file: `revision/public/index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Express task practice</title>
  </head>
  <body>
    <main>
      <h1>Express task practice</h1>
      <form id="create-task">
        <label>Title <input id="title" required maxlength="80" /></label>
        <button type="submit">Create task</button>
      </form>
      <button id="refresh" type="button">Refresh tasks</button>
      <p id="status" role="status"></p>
      <ul id="tasks"></ul>
    </main>
    <script type="module" src="./browser.js"></script>
  </body>
</html>
```

**Additional browser file: `revision/public/browser.js`**

```js
const form = document.querySelector("#create-task");
const titleInput = document.querySelector("#title");
const list = document.querySelector("#tasks");
const status = document.querySelector("#status");
const refresh = document.querySelector("#refresh");
const createButton = form.querySelector("button");

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error("HTTP " + response.status);
  return await response.json();
}

async function load() {
  status.textContent = "Loading…";
  const result = await requestJson("/lab/tasks?limit=50");
  list.replaceChildren();

  for (const task of result.data) {
    const item = document.createElement("li");
    item.textContent = task.title + (task.completed ? " — done" : " — pending");
    list.append(item);
  }
  status.textContent = "Loaded " + result.data.length + " tasks";
}

function report(error) {
  status.textContent = error.message;
}

refresh.addEventListener("click", () => load().catch(report));

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  createButton.disabled = true;

  try {
    await requestJson("/lab/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: titleInput.value }),
    });
    form.reset();
    await load();
  } catch (error) {
    report(error);
  } finally {
    createButton.disabled = false;
  }
});

await load().catch(report);
```

**Open:** `http://127.0.0.1:3010/lab/assets/`.

**Try it:** create a task, refresh the list, and inspect requests in browser DevTools → Network. Restart the server and observe that new tasks disappear.

**Remember:** this page and API share an origin, so no CORS middleware is needed. Static directories should contain files intended for public access. An absolute directory path keeps serving independent of the shell's working directory. Use `textContent` for task titles.

## 19. CORS and preflight

**What it does:** allows browser JavaScript on an approved frontend origin to read an API response.

**Install this lab's dependency if needed:**

```bash
pnpm add cors
```

**Replace file: `revision/lab.router.mjs`**

```js
import express from "express";
import cors from "cors";

export function createLabRouter() {
  const router = express.Router();

  router.use(
    cors({
      origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
      methods: ["GET"],
      allowedHeaders: ["Content-Type", "X-Lab"],
      maxAge: 60,
    }),
  );

  router.get("/message", (req, res) => {
    res.json({ message: "Browser can read this from an approved origin" });
  });

  return router;
}
```

**Inspect a preflight:**

```bash
curl -i -X OPTIONS http://127.0.0.1:3010/lab/message \
  -H 'Origin: http://localhost:5173' \
  -H 'Access-Control-Request-Method: GET' \
  -H 'Access-Control-Request-Headers: X-Lab'
```

**Expected:** 204 with CORS headers allowing the requested origin, method and header.

From DevTools on an existing frontend served at `http://localhost:5173` or `http://127.0.0.1:5173`, run this **browser code**:

```js
async function tryCors() {
  const response = await fetch("http://127.0.0.1:3010/lab/message", {
    headers: { "X-Lab": "demo" },
  });
  if (!response.ok) throw new Error("HTTP " + response.status);
  console.log(await response.json());
}

tryCors().catch(console.error);
```

The custom header triggers a preflight. The `cors` middleware handles OPTIONS requests at its mount point; an extra wildcard OPTIONS route is unnecessary.

**Remember:** an origin includes scheme, hostname and port. `localhost` and `127.0.0.1` are different origins. CORS governs browser access to responses; curl and server-side fetch do not enforce it. It does not provide authentication or authorization.

For cross-origin cookies, coordinate an explicit allowed origin, server `credentials: true`, client `credentials: 'include'` and appropriate cookie/CSRF settings. A wildcard origin is incompatible with credentialed browser access.

**Try it:** remove your frontend origin from the list, restart the API and retry in the browser. Inspect the Network and Console output; the API can still be reachable by curl.

## 20. Authentication and authorization

**What it does:** separates recognizing a principal from checking its permission.

This lab uses **public demonstration tokens**. A real application would verify a session or access token through its authentication system.

**Replace file: `revision/lab.router.mjs`**

```js
import express from "express";
import { HttpError } from "./http-errors.mjs";

const demoTokens = new Map([
  ["Bearer revision-reader", { id: "demo-reader", permissions: ["read"] }],
  [
    "Bearer revision-writer",
    { id: "demo-writer", permissions: ["read", "write"] },
  ],
]);

function authenticate(req, res, next) {
  const principal = demoTokens.get(req.get("authorization"));
  if (!principal) {
    res.set("WWW-Authenticate", "Bearer");
    return next(new HttpError(401, "Valid demonstration token required"));
  }
  res.locals.principal = principal;
  next();
}

function requirePermission(permission) {
  return (req, res, next) => {
    if (!res.locals.principal.permissions.includes(permission)) {
      return next(new HttpError(403, "Permission denied"));
    }
    next();
  };
}

export function createLabRouter() {
  const router = express.Router();
  router.use(authenticate);

  router.get("/account", requirePermission("read"), (req, res) => {
    res.json({ id: res.locals.principal.id });
  });

  router.post("/write", requirePermission("write"), (req, res) => {
    res.json({ message: "Write permission checked" });
  });

  return router;
}
```

**Try:**

```bash
curl -i http://127.0.0.1:3010/lab/account

curl -i http://127.0.0.1:3010/lab/account \
  -H 'Authorization: Bearer revision-reader'

curl -i -X POST http://127.0.0.1:3010/lab/write \
  -H 'Authorization: Bearer revision-reader'

curl -i -X POST http://127.0.0.1:3010/lab/write \
  -H 'Authorization: Bearer revision-writer'
```

**Expected:** 401, 200, 403 and 200.

**Remember:** authentication supplies a trusted principal; authorization checks what it can do. A body field or client-supplied role header is not a verified identity. Real access-token verification checks its signature and required claims, including issuer, audience and expiry. Resource ownership also needs an authorization check.

**Try it:** add a `delete` permission and a route that requires it. Keep checks on the server even if the frontend hides its delete button.

## 21. Cookies and session concepts

**What it does:** saves and reads a validated preference cookie.

**Install if needed:**

```bash
pnpm add cookie-parser
```

**Replace file: `revision/lab.router.mjs`**

```js
import express from "express";
import cookieParser from "cookie-parser";
import { HttpError, requireJson } from "./http-errors.mjs";

const options = {
  httpOnly: true,
  sameSite: "lax",
  secure: false, // this local lab uses HTTP; use true with production HTTPS
  path: "/lab",
};

export function createLabRouter() {
  const router = express.Router();
  router.use(cookieParser());

  router.get("/preferences", (req, res) => {
    const value = req.cookies["revision-theme"];
    const theme = ["light", "dark"].includes(value) ? value : "light";
    res.json({ theme });
  });

  router.post("/preferences", (req, res) => {
    requireJson(req);
    const theme = req.body?.theme;
    if (!["light", "dark"].includes(theme)) {
      throw new HttpError(400, "theme must be light or dark");
    }
    res.cookie("revision-theme", theme, { ...options, maxAge: 60 * 60 * 1000 });
    res.json({ theme });
  });

  router.delete("/preferences", (req, res) => {
    res.clearCookie("revision-theme", options);
    res.status(204).end();
  });

  return router;
}
```

**Try using a local curl cookie jar:**

```bash
curl -i -c revision/preferences.cookies \
  -X POST http://127.0.0.1:3010/lab/preferences \
  -H 'Content-Type: application/json' \
  --data '{"theme":"dark"}'

curl -i -b revision/preferences.cookies \
  http://127.0.0.1:3010/lab/preferences

curl -i -b revision/preferences.cookies -c revision/preferences.cookies \
  -X DELETE http://127.0.0.1:3010/lab/preferences

curl -i -b revision/preferences.cookies \
  http://127.0.0.1:3010/lab/preferences
```

**Expected:** dark after setting; light after clearing. Keep generated cookie jars out of Git.

| Concept    | Meaning                                                          |
| ---------- | ---------------------------------------------------------------- |
| Cookie     | Browser stores a value and sends it on matching requests         |
| `HttpOnly` | Prevents browser JavaScript from reading the cookie              |
| `Secure`   | Sends the cookie over HTTPS                                      |
| `SameSite` | Controls cookie sending in cross-site contexts                   |
| Session    | Usually stores server-side state identified by a session cookie  |
| JWT        | A token format containing claims; signed does not mean encrypted |

**Remember:** cookies remain client input. A preference cookie can be validated; an authentication cookie requires proper session or token verification. Signed cookies provide integrity, not confidentiality. Cookie-based authentication needs an appropriate CSRF defence. Clearing a cookie must match its original path/domain options.

**Try it:** change the value in your request cookie to something outside the allowlist. The server should return the default preference.

## 22. Headers and rate limiting

**What it does:** applies HTTP security headers and limits repeated requests.

**Install if needed:**

```bash
pnpm add helmet express-rate-limit
```

**Replace file: `revision/lab.router.mjs`**

```js
import express from "express";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

export function createLabRouter() {
  const router = express.Router();

  router.use(helmet());
  router.use(
    rateLimit({
      windowMs: 60_000,
      limit: 5,
      standardHeaders: "draft-8",
      legacyHeaders: false,
      message: { error: { message: "Too many requests; retry later" } },
    }),
  );

  router.get("/limited", (req, res) =>
    res.json({ message: "Request accepted" }),
  );
  return router;
}
```

**Try immediately after a restart:**

```bash
curl -i http://127.0.0.1:3010/lab/limited

for attempt in {1..6}
do
  curl -s -o /dev/null -w '%{http_code}\n' \
    http://127.0.0.1:3010/lab/limited
done
```

**Expected:** the first five total requests succeed; later requests in the window receive 429 and a `Retry-After` header. The initial inspection request counts toward the limit.

**Remember:** this limiter's default store is local to the process. Multiple instances need a suitable shared store for consistent limits. Configure Express `trust proxy` to match the actual proxy chain before relying on client IP addresses behind a proxy.

Helmet's defaults include a Content Security Policy; configure it for the scripts, styles and connections your frontend actually uses. Put application-wide middleware before the routes it should protect.

**Try it:** inspect `Content-Security-Policy`, `X-Content-Type-Options` and `RateLimit` headers. Wait for the window to expire or restart the practice server to reset this in-memory limiter.

## 23. Repository boundaries and database readiness

**What it does:** gives storage a promise-based interface, keeping HTTP handling separate from persistence.

**Additional file: `revision/repository.mjs`**

```js
export function createTaskRepository() {
  const records = new Map([[1, { id: 1, title: "Repository practice" }]]);
  let nextId = 2;

  return {
    async list() {
      return [...records.values()].map((record) => ({ ...record }));
    },
    async find(id) {
      const record = records.get(id);
      return record ? { ...record } : null;
    },
    async create(title) {
      const record = { id: nextId++, title };
      records.set(record.id, record);
      return { ...record };
    },
  };
}
```

**Replace file: `revision/lab.router.mjs`**

```js
import express from "express";
import { createTaskRepository } from "./repository.mjs";
import { HttpError, requireJson } from "./http-errors.mjs";

export function createLabRouter({ repository = createTaskRepository() } = {}) {
  const router = express.Router();

  router.get("/records", async (req, res) => {
    res.json({ data: await repository.list() });
  });

  router.post("/records", async (req, res) => {
    requireJson(req);
    const title = req.body?.title;
    if (
      typeof title !== "string" ||
      title.trim().length < 1 ||
      title.trim().length > 80
    ) {
      throw new HttpError(400, "title must contain 1–80 characters");
    }
    res.status(201).json(await repository.create(title.trim()));
  });

  router.get("/records/:id", async (req, res) => {
    const value = req.params.id;
    if (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value))) {
      throw new HttpError(400, "id must be a positive safe integer");
    }
    const record = await repository.find(Number(value));
    if (!record) throw new HttpError(404, "Record not found");
    res.json(record);
  });

  return router;
}
```

**Try:**

```bash
curl -i http://127.0.0.1:3010/lab/records

curl -i -X POST http://127.0.0.1:3010/lab/records \
  -H 'Content-Type: application/json' \
  --data '{"title":"Swap storage later"}'

curl -i http://127.0.0.1:3010/lab/records/2
```

**Remember:** an async interface does not make in-memory work run in parallel. It gives callers an interface that can later await database I/O. Returning copies prevents callers from changing stored records through shared references.

| Layer            | Typical responsibility                                    |
| ---------------- | --------------------------------------------------------- |
| Route/controller | Parse inputs, call application code, choose HTTP response |
| Service          | Business rules and orchestration                          |
| Repository       | Storage queries and data mapping                          |
| Database         | Constraints, transactions, durable storage                |

**Try it:** pass a different repository into `createLabRouter` in a test. Make its `list` method reject to exercise the central error handler.

### Optional PostgreSQL lab

**Prerequisite:** a reachable development PostgreSQL database. Set `DATABASE_URL` in your local `.env.revision` using that database's connection settings. Keep real credentials out of the public document and repository. No table is needed for this example.

```bash
pnpm add pg
```

**File: `revision/postgres.mjs`**

```js
import { Pool } from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("Set DATABASE_URL for a development PostgreSQL database");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 2,
  connectionTimeoutMillis: 3000,
});
let client;

try {
  client = await pool.connect();
  await client.query("BEGIN");

  const result = await client.query(
    "SELECT $1::text AS title, $2::boolean AS completed",
    ["A demo title with 'quotes'", false],
  );
  console.log(result.rows[0]);

  await client.query("COMMIT");
} catch (error) {
  if (client) {
    try {
      await client.query("ROLLBACK");
    } catch {
      console.error("Rollback failed");
    }
  }
  throw error;
} finally {
  client?.release();
  await pool.end();
}
```

**Run after setting the local connection variable:**

```bash
pnpm exec node --env-file=.env.revision revision/postgres.mjs
```

**Remember:** bind SQL values with `$1`/`$2` instead of concatenating user data into query text. Parameters do not substitute table or column names. A transaction uses the same checked-out client for all its statements.

This one-off script ends its pool. A long-running Express application normally creates one shared pool and closes it during shutdown.

**Try it:** insert `await client.query('SELECT 1 / 0')` before COMMIT. The catch block rolls back and the finally block releases the client.

## 24. Shutdown, debugging and deployment habits

**What it does:** connects local experiments to a maintainable server workflow.

The starter's shutdown handler receives SIGINT/SIGTERM, stops accepting new connections, lets active requests finish and enforces a deadline. Node's server close also closes idle keep-alive connections on the target runtime. WebSocket upgrades and other long-lived resources need their own shutdown handling.

**Try graceful shutdown:**

1. Activate the slow-request router from section 17.
2. Start the practice server **without** watch mode: `pnpm exec node revision/server.mjs`.
3. Request `/lab/slow` from another terminal and press Ctrl+C in the server terminal while it is waiting.
4. Observe the request finish and the server stop. Increase the delay to make the interval easier to see.

For debugging:

```bash
pnpm exec node --inspect=127.0.0.1:9230 revision/server.mjs
```

Attach VS Code's debugger to port 9230 and set a breakpoint in a route. Keep the inspector bound to a local interface.

**Optional entries to merge into your existing package scripts:**

```json
{
  "revision:dev": "node --watch revision/server.mjs",
  "revision:start": "node revision/server.mjs",
  "revision:test": "node --test revision/api.test.mjs"
}
```

Then run `pnpm revision:dev` or `pnpm revision:test`. Do not replace the project's existing scripts with this fragment.

**Remember:**

- Plain `.mjs` examples run directly; TypeScript or other build tools have their own compilation/configuration requirements.
- Commit the dependency manifest and lockfile. Use reproducible installs and run relevant checks in CI.
- Validate required configuration at startup. Expose health/readiness information appropriate to the deployment.
- The lab server binds to loopback. A container deployment may require a configured listening interface such as `0.0.0.0`.
- Keep slow synchronous CPU work out of request handlers; bound incoming body sizes and outgoing request durations.
- Close shared database pools and other resources after requests drain.
- An in-memory task map, session store or rate-limit store is not shared across replicas.
- Use a process manager or hosting platform to restart a failed process. An uncaught exception can leave application state unreliable.
- Log useful request context and unexpected failures; redact secrets and personal data.
- Preserve least-privilege credentials and enforce database constraints alongside application validation.

## 25. Express 4 and 5

**What it does:** identifies version-sensitive behavior before snippets are reused in an existing application.

| Topic                  | Express 5 behavior                                                 |
| ---------------------- | ------------------------------------------------------------------ |
| Async handlers         | Returned promise rejections reach the error handler                |
| Wildcards              | Named wildcard: `/*splat`; `/{*splat}` also matches the root       |
| Optional route segment | Use brace syntax, such as `/:file{.:ext}`                          |
| Query values           | `req.query` is a getter; validate its data instead of replacing it |
| JSON body              | `req.body` can be undefined when no matching body was parsed       |
| Response status        | Use `res.status(code).json(data)`                                  |
| Static files           | Dotfiles are ignored by default; choose any exceptions explicitly  |

For Express 4, explicitly forward promise rejections. This wrapper also works in Express 5.

**Additional file: `revision/async-handler.mjs`**

```js
export const asyncHandler = (handler) => (req, res, next) => {
  return Promise.resolve()
    .then(() => handler(req, res, next))
    .catch(next);
};
```

**Replace file: `revision/lab.router.mjs`**

```js
import express from "express";
import { asyncHandler } from "./async-handler.mjs";

export function createLabRouter() {
  const router = express.Router();

  router.get(
    "/wrapped-error",
    asyncHandler(async (req, res) => {
      throw new Error("Demo rejected handler");
    }),
  );

  return router;
}
```

**Try:**

```bash
curl -i http://127.0.0.1:3010/lab/wrapped-error
```

**Expected:** the starter's JSON 500 response.

**Remember:** this wrapper covers the returned promise chain. Detached callbacks still need their own error forwarding. Review the official migration guide before changing an existing application's Express major version.

## 26. Revision checklist and practice challenges

### Common mistakes

| Symptom                                  | Check                                                  |
| ---------------------------------------- | ------------------------------------------------------ |
| `Cannot use import...`                   | File extension and package module configuration        |
| Local ESM module cannot be found         | Explicit extension, relative path and case             |
| `EADDRINUSE`                             | Another process is using the selected port             |
| Request hangs                            | A handler neither responds nor calls next              |
| `Cannot set headers after they are sent` | A second response or unwanted fall-through             |
| `req.body` is undefined                  | Body parser order and Content-Type                     |
| Query numbers behave as strings          | Validate and convert inputs                            |
| Boolean `"false"` acts truthy            | Parse explicitly; don't use Boolean on a string        |
| New tasks disappear                      | In-memory storage reset on server restart              |
| Browser fetch fails but curl works       | Origin, preflight, credentials and browser CORS output |
| Async failure misses the error handler   | Forgotten await/return, detached callback or Express 4 |
| Server becomes unresponsive              | Synchronous CPU work or blocking I/O                   |
| Transaction behaves inconsistently       | Statements are using different database clients        |

### Suggested study order

1. Modules, configuration and asynchronous work.
2. Files, streams, events and HTTP.
3. Express starter, routes, middleware and validation.
4. Error handling, CRUD and API tests.
5. Browser requests, CORS, cookies and permission checks.
6. Storage boundaries, database queries, shutdown and deployment.

### Practice challenges

- Extend the CRUD tests with search, invalid IDs, bad pagination and 413 responses.
- Add a route-specific request-size limit and explain which parser runs first.
- Add task ownership and verify that a different principal cannot edit a task.
- Replace the memory repository with durable storage; preserve its promise-based contract.
- Add database constraints and a transaction for a change that spans multiple records.
- Introduce an upstream failure and translate it into an appropriate gateway response.
- Use the browser client to display field validation errors and support task deletion.
- Restart the server while a request is active and observe how shutdown behaves.

### Mental checklist

- Which code runs in the browser, and which runs in Node?
- Does the file use ESM or CommonJS?
- Are configuration and request inputs validated?
- Does the matching body parser run before the route?
- Does every execution path respond, continue or forward an error?
- Are unexpected error details kept in server logs?
- Are asynchronous operations awaited or deliberately handled?
- Are HTTP status codes and response shapes consistent?
- Are permission and resource ownership checks performed on the server?
- Are storage operations durable and safe under concurrency?
- Can tests start a fresh application without occupying a fixed port?
- Can the server stop cleanly and release its resources?

## Official references

Use the documentation matching the Node and Express versions in your project.

- [Node.js documentation](https://nodejs.org/docs/latest-v24.x/api/)
- [Node modules and package formats](https://nodejs.org/docs/latest-v24.x/api/packages.html)
- [Node CLI and environment-file flags](https://nodejs.org/docs/latest-v24.x/api/cli.html)
- [Node filesystem APIs](https://nodejs.org/docs/latest-v24.x/api/fs.html)
- [Node streams](https://nodejs.org/docs/latest-v24.x/api/stream.html)
- [Node events](https://nodejs.org/docs/latest-v24.x/api/events.html)
- [Node worker threads](https://nodejs.org/docs/latest-v24.x/api/worker_threads.html)
- [Node HTTP and server shutdown](https://nodejs.org/docs/latest-v24.x/api/http.html)
- [Node test runner](https://nodejs.org/docs/latest-v24.x/api/test.html)
- [Express 5 API](https://expressjs.com/en/5x/api/)
- [Express middleware](https://expressjs.com/en/guide/using-middleware/)
- [Express error handling](https://expressjs.com/en/guide/error-handling/)
- [Express 5 migration](https://expressjs.com/en/guide/migrating-5/)
- [Express CORS middleware](https://expressjs.com/en/resources/middleware/cors/)
- [Express cookie-parser](https://expressjs.com/en/resources/middleware/cookie-parser/)
- [Express security practices](https://expressjs.com/en/advanced/best-practice-security/)
- [Helmet](https://helmet.js.org/)
- [express-rate-limit configuration](https://express-rate-limit.mintlify.app/reference/configuration)
- [node-postgres parameterized queries](https://node-postgres.com/features/queries)
- [node-postgres transactions](https://node-postgres.com/features/transactions)
- [pnpm commands](https://pnpm.io/pnpm-cli)
