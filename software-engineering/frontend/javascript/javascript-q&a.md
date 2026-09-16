# Full-Stack Engineer Interview Q&A

[Back to JavaScript topic Index](./README.md)

A JavaScript fundamentals reference plus leveled interview questions (Junior → Mid → Senior) covering JavaScript, Node.js, React, databases, APIs, and system design.

---

## Part 1: JavaScript Fundamentals

### Fundamentals

**Q: What is JavaScript and how is it used in web development?** A: JavaScript is a high-level, interpreted programming language primarily used to add interactivity, manipulate content, and control multimedia on web pages. It runs in the browser and enables dynamic user experiences.

**Q: What are JavaScript's primitive data types?** A: The primitive data types are: `string`, `number`, `bigint`, `boolean`, `undefined`, `symbol`, and `null`.

**Q: How does JavaScript differ from Java?** A: JavaScript is a lightweight, interpreted language mainly for web development, while Java is a compiled, object-oriented language used for a wide range of applications. They have different syntax, use cases, and runtime environments.

**Q: What is the difference between `null` and `undefined`?** A: `undefined` means a variable has been declared but not assigned a value. `null` is an assignment value that represents no value or no object.

**Q: Explain the difference between `var`, `let`, and `const`.** A:

- `var` is function-scoped and can be redeclared and reassigned.
- `let` is block-scoped, can be reassigned but not redeclared within the same scope.
- `const` is block-scoped and cannot be reassigned or redeclared.

**Q: What are arrays and how do you access their elements?** A: Arrays are ordered collections of values. Elements are accessed using zero-based indexing, e.g., `arr[0]`.

**Q: What is the purpose of the `typeof` operator?** A: It returns a string indicating the type of the unevaluated operand, such as `"string"`, `"number"`, `"object"`, etc.

**Q: What is hoisting in JavaScript?** A: Hoisting is JavaScript's behavior of moving declarations to the top of their scope before code execution. `var` declarations are hoisted and initialized as `undefined`; `let` and `const` are hoisted but not initialized (temporal dead zone).

**Q: What is the difference between `==` and `===`?** A: `==` checks for value equality with type coercion. `===` checks for both value and type equality (strict equality).

**Q: How do you check if a variable is undefined?** A: Use `typeof variable === "undefined"` or compare directly: `variable === undefined`.

### Functions and Scope

**Q: What is a closure and how does it work?** A: A closure is a function that retains access to its outer function's variables even after the outer function has returned, due to lexical scoping.

**Q: What is the difference between a parameter and an argument?** A: Parameters are variables listed in a function's definition. Arguments are the actual values passed to the function when it's called.

**Q: What is a higher-order function?** A: A function that takes one or more functions as arguments, returns a function, or both.

**Q: What are callback functions and how are they used?** A: A callback is a function passed as an argument to another function to be executed later, often after an asynchronous operation.

**Q: What is an arrow function and how does it differ from a regular function?** A: Arrow functions have a shorter syntax and do not have their own `this`, `arguments`, or `super`. They are best suited for non-method functions.

**Q: Explain the concept of lexical scope.** A: Lexical scope means that a variable's accessibility is determined by its location within the source code, and nested functions have access to variables declared in their outer scope.

**Q: What is the difference between function declarations and function expressions?** A: Function declarations are hoisted and can be called before they appear in the code. Function expressions are not hoisted and can only be called after they are defined.

**Q: What is an Immediately Invoked Function Expression (IIFE)?** A: An IIFE is a function that runs as soon as it is defined, often used to create a private scope.

**Q: What is recursion and how is it used in JavaScript?** A: Recursion is when a function calls itself to solve a problem. It's used for tasks that can be broken down into similar sub-tasks.

### Objects and Prototypes

**Q: What is an object in JavaScript?** A: An object is a collection of key-value pairs, where the values can be data or functions (methods).

**Q: What is prototypal inheritance?** A: Objects can inherit properties and methods from other objects via the prototype chain, allowing for shared behavior.

**Q: How does the `this` keyword work?** A: `this` refers to the object that is executing the current function. Its value depends on how the function is called.

**Q: What is the difference between `Object.freeze()` and `const`?** A: `Object.freeze()` prevents modification of an object's properties. `const` prevents reassignment of the variable, but the object itself can still be mutated unless frozen.

**Q: What are the differences between `Object.seal()` and `Object.freeze()`?** A: `Object.seal()` prevents adding or removing properties but allows modifying existing ones. `Object.freeze()` makes an object completely immutable.

**Q: How do you create and use classes in JavaScript?** A: Use the `class` keyword to define a class, and `new` to create instances. Classes support constructors, methods, and inheritance.

### Asynchronous JavaScript

**Q: What is a Promise and how does it work?** A: A Promise is an object representing the eventual completion or failure of an asynchronous operation. It has states: pending, fulfilled, or rejected, and supports chaining with `.then()` and `.catch()`.

**Q: What is the difference between callbacks, Promises, and async/await?** A: Callbacks are functions passed to handle async results. Promises provide a cleaner, chainable way to handle async operations. `async/await` is syntax sugar over Promises for writing async code in a synchronous style.

**Q: How does the event loop work in JavaScript?** A: The event loop continuously checks the call stack and message queue, executing queued callbacks when the stack is clear, enabling non-blocking asynchronous behavior.

**Q: What is the purpose of `setTimeout` and `setInterval`?** A: `setTimeout` schedules a function to run after a delay. `setInterval` schedules a function to run repeatedly at specified intervals.

**Q: What is event delegation?** A: Event delegation is a technique where a single event handler is added to a parent element to manage events for its child elements, improving performance and code organization.

**Q: How do you handle errors in asynchronous code?** A: For callbacks, handle errors in the callback function. For Promises, use `.catch()`. With `async/await`, use `try...catch` blocks.

### Advanced and Practical Questions

**Q: How can you remove duplicates from an array?** A: Use a `Set`: `const unique = [...new Set(array)];`

**Q: How can you check if an array includes a certain value?** A: Use the `includes()` method: `array.includes(value);`

**Q: What is the difference between shallow and deep copying?** A: Shallow copy duplicates only the top-level properties; nested objects are shared. Deep copy duplicates all levels, creating independent objects.

**Q: What are ES6 features you have used?** A: Examples include arrow functions, template literals, destructuring, `let`/`const`, classes, modules, and Promises.

**Q: What is currying in JavaScript?** A: Currying is transforming a function with multiple arguments into a sequence of functions, each taking a single argument.

**Q: Explain the difference between `call`, `apply`, and `bind`.** A: All set the `this` value of a function. `call` and `apply` invoke the function immediately (`call` takes arguments separately, `apply` as an array). `bind` returns a new function with `this` bound.

**Q: What is strict mode and how is it enabled?** A: Strict mode enforces stricter parsing and error handling. Enable it by adding `"use strict";` at the top of a script or function.

**Q: How is JavaScript executed in the browser?** A: JavaScript is parsed and executed by the browser's JavaScript engine, using a call stack, event loop, callback queue, and microtask queue to manage execution order.

**Q: What happens when you enter a URL in the browser?** A: The browser resolves the domain, sends an HTTP request, receives a response, parses HTML/CSS/JS, and renders the page.

**Q: What is functional programming and how is it used in JavaScript?** A: Functional programming emphasizes pure functions, immutability, and higher-order functions. JavaScript supports this style with functions like `map`, `filter`, and `reduce`.

### Table: Key JavaScript Topics

| Topic                 | Example Question                                 | Example Answer (Short)                                      |
| :-------------------- | :----------------------------------------------- | :---------------------------------------------------------- |
| Data Types            | What are the different data types in JavaScript? | string, number, bigint, boolean, undefined, symbol, null    |
| Variable Declarations | Difference between `var`, `let`, and `const`?    | Scope, hoisting, reassignment, redeclaration rules          |
| Functions & Scope     | What is a closure?                               | Function with access to its lexical scope                   |
| Objects & Prototypes  | What is prototypal inheritance?                  | Objects inherit from other objects via prototype chain      |
| Asynchronous JS       | How do Promises differ from callbacks?           | Promises allow chaining, better error handling, readability |
| Array Methods         | How do you remove duplicates from an array?      | Use `Set`: `[...new Set(array)]`                            |
| ES6 Features          | What are arrow functions and how do they work?   | Concise syntax, no own `this`, best for non-methods         |
| Error Handling        | How do you handle errors in JavaScript?          | Use `try...catch`, `.catch()` for Promises                  |

---

## Part 2: Junior Full-Stack Engineer Interview Q&A

_Focus: fundamentals, basic CRUD, using frameworks correctly, following patterns._

**Q: What is the difference between `npm` and `npx`?** A: `npm` installs and manages packages. `npx` executes a package's binary directly, either from `node_modules` or by temporarily downloading it, without installing it globally.

**Q: What is `package.json` and what is `package-lock.json` for?** A: `package.json` declares project metadata, dependencies, and scripts. `package-lock.json` locks exact dependency versions (including transitive ones) to ensure consistent installs across environments.

**Q: What is the difference between `dependencies` and `devDependencies`?** A: `dependencies` are required at runtime in production. `devDependencies` are only needed for development/build/testing (e.g., linters, test frameworks).

**Q: What is a REST API?** A: An architectural style for web APIs using standard HTTP methods (GET, POST, PUT, PATCH, DELETE) on resources identified by URLs, typically returning JSON.

**Q: What is the difference between `PUT` and `PATCH`?** A: `PUT` replaces an entire resource. `PATCH` applies a partial update to a resource.

**Q: What is middleware in Express.js?** A: A function with access to the request, response, and `next()` function, used to process requests (logging, auth, parsing body, etc.) before they reach the route handler.

**Q: How do you create a simple GET route in Express?** A:

```javascript
const express = require("express");
const app = express();

app.get("/users", (req, res) => {
  res.json([{ id: 1, name: "Alice" }]);
});

app.listen(3000);
```

**Q: What is JSX in React?** A: JSX is a syntax extension that lets you write HTML-like code inside JavaScript. It compiles down to `React.createElement()` calls.

**Q: What is the difference between props and state in React?** A: Props are read-only data passed from a parent to a child component. State is data managed internally within a component that can change over time and triggers re-renders.

**Q: What is the `useState` hook used for?** A: It lets a functional component hold and update local state. It returns an array with the current state value and a setter function.

**Q: What is the `useEffect` hook used for?** A: It runs side effects (data fetching, subscriptions, DOM updates) after render, and can clean up via a returned function. Its dependency array controls when it re-runs.

**Q: What is the virtual DOM?** A: An in-memory representation of the real DOM that React uses to calculate the minimal set of changes needed, then efficiently applies (patches) them to the actual DOM.

**Q: What is a "key" prop in React lists and why is it important?** A: A unique identifier for list items that helps React efficiently track which items changed, were added, or removed, avoiding unnecessary re-renders or bugs with component state.

**Q: What's the difference between SQL and NoSQL databases?** A: SQL databases (e.g., PostgreSQL, MySQL) are relational, use structured schemas and tables with fixed columns, and support joins/ACID transactions. NoSQL databases (e.g., MongoDB) are more flexible/schemaless, often document- or key-value based, and prioritize scalability.

**Q: What is CORS and why does it matter?** A: Cross-Origin Resource Sharing is a browser security mechanism that restricts web pages from making requests to a different origin than the one that served the page, unless the server explicitly allows it via response headers.

**Q: What is the difference between `localStorage`, `sessionStorage`, and cookies?** A: `localStorage` persists data with no expiration; `sessionStorage` persists only for the tab session. Both are client-side only and not sent to the server automatically. Cookies persist per an expiration date and are sent with every HTTP request to the matching domain, which is important for auth.

**Q: What is Git and what's the difference between `git merge` and `git rebase`?** A: Git is a distributed version control system. `merge` combines branches by creating a new merge commit and preserves history as-is. `rebase` replays commits on top of another branch, producing a linear history but rewriting commit hashes.

**Q: What status code would you return for a successful resource creation vs. a not-found resource?** A: `201 Created` for successful creation; `404 Not Found` when the resource doesn't exist.

---

## Part 3: Mid-Level Full-Stack Engineer Interview Q&A

_Focus: architecture decisions, performance, testing, state management, security basics._

**Q: How does the Node.js event loop handle I/O differently from a traditional multi-threaded server?** A: Node.js runs JavaScript on a single thread but delegates I/O operations (file system, network, timers) to the libuv thread pool or OS-level async APIs. Non-blocking callbacks are queued and processed by the event loop's phases (timers, pending callbacks, poll, check, close), allowing high concurrency without spawning a thread per request.

**Q: What are the phases of the Node.js event loop?** A: Timers → Pending callbacks → Idle/prepare → Poll → Check (`setImmediate`) → Close callbacks, with microtasks (Promises, `process.nextTick`) processed between each phase.

**Q: How would you handle a CPU-intensive task in a Node.js server without blocking the event loop?** A: Offload it using `worker_threads`, a child process, or a separate microservice/queue (e.g., a job worker consuming from Redis/RabbitMQ), so the main event loop stays free to handle other requests.

**Q: What is the difference between `useMemo` and `useCallback`?** A: `useMemo` memoizes a computed value between renders. `useCallback` memoizes a function reference. Both take a dependency array and are used to avoid unnecessary recalculations or re-renders of child components.

**Q: When would you reach for `useContext` vs. a state management library like Redux or Zustand?** A: `useContext` works well for low-frequency-update, broadly shared data (theme, auth user, locale). For complex, frequently-updated, or cross-cutting state with middleware/devtools needs, a dedicated state library avoids unnecessary re-renders and gives better tooling.

**Q: What causes unnecessary re-renders in React and how do you prevent them?** A: Common causes: new object/array/function references created on every render, unmemoized context values, or missing `key`s. Prevent with `React.memo`, `useMemo`/`useCallback`, splitting context, and keeping state as local as possible.

**Q: How would you design pagination for a large dataset via a REST API?** A: Prefer cursor-based pagination (opaque cursor pointing to the last seen record) over offset-based for large or frequently changing datasets, since offset pagination degrades in performance and can skip/duplicate rows under concurrent writes. Return a `nextCursor` and page size, and index the sort/filter columns.

**Q: What's the difference between authentication and authorization?** A: Authentication verifies _who_ a user is (login). Authorization determines _what_ an authenticated user is allowed to do (permissions/roles).

**Q: How would you implement JWT-based authentication securely?** A: Sign short-lived access tokens with a strong secret/algorithm, store them client-side in memory or an httpOnly, secure, SameSite cookie (avoid `localStorage` for sensitive tokens due to XSS risk), use refresh tokens for renewal, validate signature/expiry on every request server-side, and support revocation (e.g., a token blacklist or short expiry + refresh rotation).

**Q: What is SQL injection and how do you prevent it?** A: An attack where untrusted input is concatenated into a SQL query, altering its logic. Prevent it with parameterized queries/prepared statements or an ORM/query builder that escapes input automatically — never string-concatenate user input into SQL.

**Q: What's the difference between horizontal and vertical scaling?** A: Vertical scaling adds more resources (CPU/RAM) to a single machine. Horizontal scaling adds more machines/instances and distributes load, typically requiring statelessness and a load balancer.

**Q: How do database indexes improve performance, and what's the tradeoff?** A: Indexes create an ordered lookup structure (often a B-tree) so queries can find rows without scanning the whole table, greatly speeding up reads/filters/sorts on indexed columns. The tradeoff is added storage and slower writes, since indexes must be updated on every insert/update/delete.

**Q: What is N+1 query problem and how do you fix it?** A: It happens when fetching a list of records then making a separate query per record for related data (1 query + N queries). Fix with eager loading/joins (e.g., `include` in Sequelize/Prisma, SQL `JOIN`) or batching with a data loader pattern.

**Q: How do you test asynchronous code in JavaScript (e.g., with Jest)?** A: Return the promise, use `async/await` in the test function, or use the `done` callback for callback-based code. Mock external dependencies (API calls, DB) to isolate the unit under test.

**Q: What's the difference between unit, integration, and end-to-end (E2E) tests?** A: Unit tests verify a single function/component in isolation with mocked dependencies. Integration tests verify multiple units work together (e.g., API route + DB). E2E tests simulate real user flows through the whole system (e.g., with Playwright/Cypress).

**Q: How would you debounce a search input in React?** A:

```javascript
function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
```

This delays updating the value used to trigger the API call until the user stops typing for `delay` ms.

**Q: What are environment variables and how do you manage secrets across environments?** A: Environment variables configure app behavior without hardcoding values (API keys, DB URLs) in source code. Manage them with `.env` files locally (excluded from version control via `.gitignore`) and a secrets manager or the hosting platform's environment configuration in staging/production.

**Q: What is CI/CD and why does it matter?** A: Continuous Integration automatically builds/tests code on every commit to catch issues early. Continuous Deployment/Delivery automates releasing that code to staging/production, reducing manual error and enabling faster, safer iteration.

---

## Part 4: Senior Full-Stack Engineer Interview Q&A

_Focus: system design, scalability, tradeoffs, leadership, reliability, security depth._

**Q: How would you design a URL shortener (e.g., bit.ly) at scale?** A: Key points: generate short codes via base62 encoding of an auto-incrementing ID or a hash with collision handling; use a fast key-value store (Redis) for read-heavy lookups with a relational/NoSQL DB as the source of truth; cache popular redirects; use a CDN/edge layer for redirect latency; shard/partition by code prefix if write volume is high; handle analytics asynchronously via an event queue rather than blocking the redirect path.

**Q: How would you design a scalable notification system (email, push, SMS)?** A: Decouple producers from delivery via a message queue (e.g., SQS/Kafka/RabbitMQ). Have worker services per channel that consume from the queue, handle retries with exponential backoff and dead-letter queues for failures, support idempotency (avoid duplicate sends), rate-limit per user/provider, and track delivery status asynchronously. Use a template/config service so content isn't hardcoded in workers.

**Q: What's the difference between optimistic and pessimistic locking, and when would you use each?** A: Pessimistic locking locks a row/resource before modifying it (e.g., `SELECT ... FOR UPDATE`), preventing concurrent access but reducing throughput — good for high-contention, high-conflict-cost operations (e.g., financial transactions). Optimistic locking allows concurrent reads/writes and checks a version/timestamp at commit time, retrying on conflict — better for low-contention scenarios with higher throughput needs.

**Q: How do you approach caching strategy in a distributed system?** A: Choose the right layer (CDN, application-level like Redis, DB query cache, browser cache) based on data volatility and access pattern. Decide on cache-aside vs. write-through vs. write-behind. Handle invalidation carefully (TTL vs. explicit invalidation on writes) since "cache invalidation" is one of the classic hard problems — stale data and cache stampedes are common failure modes to design around (e.g., with jittered TTLs or request coalescing).

**Q: How would you design a system to handle 10,000 requests per second on an API?** A: Horizontally scale stateless API servers behind a load balancer; use connection pooling and read replicas for the database; cache hot reads (Redis/CDN); use async processing/queues for non-critical-path work; implement rate limiting and circuit breakers to protect downstream services; monitor with metrics/tracing to find the actual bottleneck rather than guessing, since the limiting factor is often the database or a single downstream dependency, not the API layer itself.

**Q: Explain the CAP theorem and how it influences database choice.** A: In a distributed system, you can only guarantee two of Consistency, Availability, and Partition tolerance at once during a network partition. Since partitions are inevitable in distributed systems, the real choice is CP (consistency over availability, e.g., traditional RDBMS clusters, MongoDB in certain configs) vs. AP (availability over consistency, e.g., Cassandra, DynamoDB) — the right choice depends on whether the business can tolerate stale reads or needs strict correctness (e.g., banking vs. social feed).

**Q: How would you approach a microservices vs. monolith decision for a growing product?** A: Start with a well-modularized monolith unless there's a clear driver for microservices (independent scaling needs, distinct team ownership boundaries, differing tech/deploy cadence requirements). Microservices add real operational cost — distributed tracing, network reliability, data consistency across services, deployment complexity — so the tradeoff should be justified by organizational or scaling needs, not novelty.

**Q: How do you design database schemas to support both strong consistency where needed and high read scalability elsewhere?** A: Use normalized relational schemas with transactions for consistency-critical data (payments, inventory), and denormalized/read-optimized structures (materialized views, read replicas, or a separate read-model in a CQRS-style setup) for high-read, less consistency-sensitive views like dashboards or feeds.

**Q: How do you prevent race conditions in distributed systems (e.g., double-processing a payment)?** A: Enforce idempotency using unique idempotency keys per operation, use database-level unique constraints or conditional writes, leverage distributed locks (e.g., Redis with `SETNX` + TTL, or a proper distributed lock service) only when necessary, and design consumers to be safely retryable.

**Q: What's your approach to observability in production (logging, metrics, tracing)?** A: Structured logging with correlation/trace IDs across services; metrics (RED: rate, errors, duration, or USE for resources) exported to a time-series system with alerting on SLOs; distributed tracing (e.g., OpenTelemetry) to follow a request across service boundaries; and dashboards that map to actual user-facing outcomes, not just infrastructure health.

**Q: How do you handle a production incident (e.g., API latency spike) as the on-call engineer?** A: Triage first: check recent deploys/config changes, dashboards for the affected service and its dependencies, and error rates. Mitigate quickly (rollback, feature flag off, scale up) before root-causing fully. Communicate status to stakeholders. After resolution, do a blameless postmortem focused on systemic fixes (better alerting, tests, guardrails) rather than individual blame.

**Q: How would you review a junior engineer's PR that works but has design issues?** A: Approve incrementally where reasonable, distinguish "must-fix" (bugs, security, correctness) from "nice-to-have" (style, minor structure) in comments, explain the _why_ behind suggestions with examples, and use it as a mentoring moment rather than blocking on personal preference — the goal is a working, maintainable system and a growing engineer, not a perfect diff.

**Q: How do you decide between server-side rendering (SSR), static generation (SSG), and client-side rendering (CSR) for a React app?** A: SSR (e.g., Next.js) suits content that needs fast first paint and SEO with frequently changing data. SSG suits mostly-static content (marketing pages, docs) for best performance/cacheability. CSR suits highly interactive, authenticated, SEO-irrelevant apps (dashboards). Many real apps mix all three per-route based on these tradeoffs.

**Q: What security vulnerabilities do you actively guard against in a full-stack app, beyond SQL injection?** A: XSS (sanitize/escape user-rendered content, use CSP headers), CSRF (SameSite cookies, CSRF tokens for state-changing requests), broken access control (verify authorization server-side on every request, not just hiding UI elements), insecure deserialization, dependency vulnerabilities (regular audits/`npm audit`, Dependabot), and secrets management (never committing keys, rotating credentials).

**Q: How do you approach backward-compatible API evolution?** A: Version the API (URL or header-based), add new fields as optional rather than changing existing field meanings, deprecate with clear timelines and monitoring of old-version usage before removal, and favor additive changes over breaking ones — treat the API as a contract with consumers you may not control.

---

## Quick Reference: Question Difficulty by Topic

| Topic         | Junior                    | Mid-Level                           | Senior                                           |
| :------------ | :------------------------ | :---------------------------------- | :----------------------------------------------- |
| JavaScript    | Syntax, types, closures   | Async patterns, memory, performance | Engine internals, event loop tuning              |
| Node.js       | Basic Express routes      | Event loop phases, worker threads   | Scaling, clustering, observability               |
| React         | Props/state, hooks basics | Memoization, rendering optimization | Rendering strategy (SSR/SSG/CSR) tradeoffs       |
| Databases     | SQL vs NoSQL              | Indexing, N+1, transactions         | Sharding, CAP theorem, consistency models        |
| APIs          | REST verbs, status codes  | Pagination, auth, versioning        | Rate limiting, backward compatibility, contracts |
| System Design | N/A                       | Basic caching, simple scaling       | Distributed systems, CAP, incident response      |
| Security      | CORS basics               | JWT, SQLi prevention                | XSS/CSRF depth, access control, threat modeling  |
