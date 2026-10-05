# 1hr technical interview revision

[Back to the topic index](./README.md)

Use the lookup tables for a final qucik refresh. Cover the answer column and explain each concept aloud; use the examples below for hands-on revision and the linked guides for deeper study.

Jump to: [JavaScript](#javascript-essentials) · [Async](#asynchronous-javascript) · [Browser](#browser-and-dom) · [OOP](#oop-and-design-principles) · [DSA](#dsa-recall) · [Backend/design](#practical-backend-and-system-design) · [Examples](#copy-and-run-examples).

The relative links assume this document is saved as `software-engineering/tech-interview-preparation/quick-interview-prep.md` in the repository.

## JavaScript essentials

| Concept                                 | Accurate short answer                                                                                                                                                                                                                                                                                                                                          |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Types                                   | Seven primitives: `undefined`, `null`, `boolean`, `number`, `bigint`, `string`, `symbol`. Objects include arrays and functions. `typeof null` is the historical `"object"` quirk; `typeof NaN` is `"number"`.                                                                                                                                                  |
| `==` vs `===`                           | `==` follows coercion rules; `===` compares without coercion. Prefer `===` unless coercion is intended. Objects compare by identity; `NaN !== NaN`. `Map`/`Set` use SameValueZero, where NaN equals NaN and ±0 are the same key.                                                                                                                               |
| `null` vs `undefined`                   | `null` expresses intentional absence. `undefined` commonly comes from an uninitialised variable, missing property/argument, or a function with no returned value; it can also be assigned explicitly. An undeclared identifier normally throws `ReferenceError`.                                                                                               |
| Truthiness                              | Falsy values include `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, and `NaN`. Empty arrays/objects are truthy.                                                                                                                                                                                                                                          |
| Coercion                                | `+` can concatenate strings; other numeric operators commonly convert operands. Convert and validate external inputs explicitly.                                                                                                                                                                                                                               |
| `var`, `let`, `const` / variable scope  | `var` is function scoped; top-level scope depends on script versus module. It permits compatible redeclarations and reassignment. `let`/`const`, introduced in ES2015 (ES6), are block scoped and cannot be redeclared in the same scope; `let` allows reassignment, `const` requires an initialiser and prevents rebinding. Object contents can still mutate. |
| Hoisting                                | Declarations are processed during scope setup, not physically moved. `var` starts as `undefined`; function declarations are initialised early. `let`/`const` are inaccessible in the temporal dead zone before initialisation. Function expressions follow their variable's rules.                                                                             |
| Function declaration vs expression      | A function declaration is initialised during setup of its enclosing scope. A function expression creates a function when that expression executes; its binding follows `var`/`let`/`const` rules. Avoid saying that no part of an expression's declaration is hoisted.                                                                                         |
| Closure                                 | A function retains access to its lexical environment after the outer function returns. It captures bindings, so later changes can be observed.                                                                                                                                                                                                                 |
| `this`                                  | In an ordinary function, `this` depends on how it is called: receiver, `call`/`apply`/`bind`, or `new`. A plain call in strict mode has `undefined` this. Arrow functions capture lexical this; binding cannot replace it.                                                                                                                                     |
| `bind()`                                | Returns a new function with a chosen this for ordinary calls and optional pre-filled arguments. Creating it does not invoke the original function. `call()`/`apply()` invoke immediately; construction with `new` ignores bound this.                                                                                                                          |
| Arrow functions                         | Concise `=>` syntax with lexical this; no own `arguments`; cannot be constructors. Use a regular method when you need receiver-based this.                                                                                                                                                                                                                     |
| Prototypes                              | Property lookup follows the prototype chain until a match or `null`. Objects can have a null prototype, such as `Object.create(null)`. JavaScript classes use this model; class methods usually live on the prototype. Use `Object.hasOwn()` when you need own properties only.                                                                                |
| Prototype vs instance properties        | Prototype properties/methods are shared through inheritance. Own instance properties are stored on each instance, although their values may reference shared objects. Static class properties belong to the constructor, rather than individual instances.                                                                                                     |
| Functions                               | Functions are objects. A higher-order function accepts/returns functions. A callback is a function supplied for another function to invoke; it is not automatically asynchronous.                                                                                                                                                                              |
| Object creation / constructor functions | Use object literals, `new Constructor()`, `new ClassName()`, or `Object.create(prototype)` as appropriate. An ordinary constructor called with `new` creates/binds an instance, initialises it, and links it to the constructor's prototype. Arrows cannot be constructors.                                                                                    |
| Shallow copy                            | Spread, `slice()`, and `Object.assign()` copy only one level. Nested references remain shared. `structuredClone()` supports many data types but does not clone functions or every object kind.                                                                                                                                                                 |
| Freeze                                  | `Object.freeze()` prevents changes to an object's own properties; it is shallow. Nested objects can still change unless separately frozen. It is not an access-control mechanism.                                                                                                                                                                              |
| Arrays                                  | Resizable, ordered, potentially mixed-type collections. Index access is usually O(1) in the dense-array model. Front insertion/removal can require O(n) movement.                                                                                                                                                                                              |
| Array vs object                         | Arrays are objects specialised for ordered, zero-based indexed collections, with a `length` and array methods. Ordinary objects model named records; property keys are strings or symbols, and numeric property keys become strings. Either can hold mixed value types.                                                                                        |
| Sorting                                 | Default `sort()` compares string representations and mutates. Use `(a, b) => a - b` for numbers, or `toSorted()` for a new array. Sorting time/space depend on the engine.                                                                                                                                                                                     |
| Array transforms                        | `map()` returns a new array of transformed items; `filter()` returns selected items; `reduce()` produces one accumulated result. Use an initial reducer value so empty arrays are handled. Callbacks can still cause mutations/side effects. `forEach()` discards returned values and does not await async callbacks.                                          |
| Functional programming / pure functions | Compose functions and transformations; a pure function gives the same result for the same relevant inputs and has no observable side effects. `map()`/`filter()`/`reduce()` support this style when their callbacks are pure.                                                                                                                                  |
| `slice` / `splice`                      | `slice(start, end)` copies a range with exclusive end. `splice(start, count, ...items)` mutates the array and returns removed items.                                                                                                                                                                                                                           |
| Membership                              | `includes()` uses SameValueZero; `indexOf()` uses strict equality and cannot find NaN. `Set` helps repeated membership checks; expected O(1) is the usual hash model.                                                                                                                                                                                          |
| Remove duplicates                       | `[...new Set(values)]` keeps the first occurrence of each distinct value in insertion order. A `filter()` + `indexOf()` approach is also possible, but usually O(n²) and drops NaN values because `indexOf(NaN)` returns -1. Objects deduplicate by identity.                                                                                                  |
| Numbers                                 | `Number` uses floating-point. All integers in the safe integer range are exact; outside it, consecutive-integer precision is not guaranteed. Use `BigInt` for suitable large-integer work; normal arithmetic cannot directly mix BigInt and Number. Validate conversions.                                                                                      |
| Strings                                 | Strings are immutable. Length/indexing count UTF-16 code units. Iteration gives code points, which can still differ from user-visible grapheme clusters.                                                                                                                                                                                                       |
| String to lowercase                     | `text.toLowerCase()` returns a new lowercase string without changing the original. Use locale-aware handling when the problem requires language-specific case rules.                                                                                                                                                                                           |
| Recursion                               | A function calls itself, with a base case and progress towards it. Used for factorial, Fibonacci, and tree/graph traversal. Count call-stack memory; very deep recursion can overflow. Naïve recursive Fibonacci repeats subproblems, which memoization can avoid.                                                                                             |
| Memoization                             | Cache a result by its relevant inputs. Correct keys, purity/staleness, and eviction matter; it trades memory for repeated work.                                                                                                                                                                                                                                |
| Modules / types                         | ES modules use `import`/`export` and strict mode. TypeScript's compile-time types are erased; runtime external data still needs validation.                                                                                                                                                                                                                    |
| Errors                                  | Throw `Error` objects; catch where you can recover or add context. A sync try/catch does not catch a later asynchronous callback's exception.                                                                                                                                                                                                                  |
| Error types                             | Syntax errors violate grammar or parsing rules; runtime errors arise while executing, such as `ReferenceError` or `TypeError`; logical errors produce the wrong result without necessarily throwing. These are categories, not three specific built-in Error classes.                                                                                          |
| Generators                              | `function*` returns an iterator; `yield` pauses it until the next iteration. They can represent lazy sequences.                                                                                                                                                                                                                                                |

### Asynchronous JavaScript

| Concept                     | Accurate short answer                                                                                                                                                                                                                          |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Promise states              | Pending, fulfilled, rejected. Fulfilled/rejected means settled. “Resolved” means its fate is locked in; adopting a pending promise can leave it pending.                                                                                       |
| Promise purpose / chaining  | Represents an eventual completion value or failure. `then()` returns another promise, so return a value or promise to pass work down the chain; `catch()` handles rejections. Chains and async/await help avoid deeply nested callbacks.       |
| Promise execution           | The executor runs synchronously. Registered promise handlers run as microtasks after the current synchronous work.                                                                                                                             |
| `async` / `await`           | An async function returns a promise. `await` suspends that function, not the entire thread; handle rejection with an awaited try/catch or a returned catch chain.                                                                              |
| Concurrency                 | `Promise.all()` waits for all to fulfil or rejects on a rejection; it does not cancel other work. `allSettled()` records every outcome. Start independent operations before awaiting when concurrent work is intended.                         |
| Timers                      | `setTimeout()` schedules a callback after a minimum delay; load can make it later. A zero delay is not immediate execution.                                                                                                                    |
| Event loop                  | Async I/O permits other work, but CPU-heavy JavaScript can block the event loop. Use worker threads/processes or a background job when appropriate.                                                                                            |
| Synchronous vs asynchronous | Synchronous calls finish before execution proceeds past them. Asynchronous operations report completion later, allowing other work while waiting. Async does not automatically mean CPU-parallel execution or make blocking work non-blocking. |
| Fetch                       | `fetch()` makes an HTTP request and returns a promise for a Response. It rejects on network-level failures, not automatically on HTTP 404/500. Check `response.ok`; use `AbortController` for cancellation/timeouts.                           |

### Browser and DOM

| Concept                                 | Short answer                                                                                                                                                                                                                                                                                     |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Element selection / HTML element access | `document.getElementById()` finds an ID; `querySelector()` returns the first CSS-selector match; `querySelectorAll()` returns a static NodeList. `getElementsByTagName()` returns a live HTMLCollection of matching tag names.                                                                   |
| Events / bubbling / delegation          | Capturing runs towards the target; bubbling runs outward for bubbling events. Delegation attaches one listener to an ancestor to handle descendant events, including newly added descendants. It can reduce listener count/memory; inspect `target`/`closest()` and distinguish `currentTarget`. |
| Common events                           | `click`, `mouseover`, `keydown`, `keyup`, and `change`. `mouseover` bubbles and can fire when moving between descendants; `change` timing depends on the control. Register handlers with `addEventListener()`.                                                                                   |
| Event controls                          | `preventDefault()` cancels a cancelable default action; `stopPropagation()` stops propagation. They solve different problems.                                                                                                                                                                    |
| Storage                                 | `localStorage` persists per origin; `sessionStorage` is scoped to the origin and tab/session. Both are synchronous string stores and accessible to same-origin JavaScript; avoid storing sensitive tokens carelessly.                                                                            |
| `window` / globals                      | `window` represents a browser window and exposes features such as `document`, timers, and storage. It is not a Node.js global. Use `globalThis` when a cross-runtime global reference is needed.                                                                                                 |

For longer explanations: [JavaScript concise revision](../frontend/javascript/javascript-revision-concise.md) and [extended revision](../frontend/javascript/javascript-revision-extended.md).

## OOP and design principles

| Concept                               | What to say                                                                                                                                                                                                                                                                                                  |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Object / class / methods / attributes | An object models a concrete or abstract entity with state and behaviour. ES2015 (ES6) class syntax defines construction and shared methods; a method is a function property used through an object. Attributes/properties hold state; instance fields belong to instances, static fields to the constructor. |
| Encapsulation                         | Protect representation and control changes through an API; use private fields or closures where useful. It does not replace authentication/authorisation.                                                                                                                                                    |
| Abstraction                           | Expose operations that users need while hiding irrelevant implementation details.                                                                                                                                                                                                                            |
| Inheritance                           | Derive behaviour with `extends`; JavaScript method/property lookup uses prototypes. Prefer composition when the relationship is collaboration rather than “is a”.                                                                                                                                            |
| Polymorphism                          | Different implementations satisfy the same usable contract, including through method overriding or compatible interfaces.                                                                                                                                                                                    |
| SOLID: S — Single Responsibility      | A module/class has one cohesive responsibility and reason to change. For example, an `AreaCalculator` computes shape areas while a separate formatter renders reports.                                                                                                                                       |
| SOLID: O — Open/Closed                | Support expected extensions through stable contracts while keeping existing behaviour stable; avoid unnecessary speculative abstraction.                                                                                                                                                                     |
| SOLID: L — Liskov Substitution        | A subtype preserves the base contract, including expected behaviour and invariants. Matching method names alone is insufficient.                                                                                                                                                                             |
| SOLID: I — Interface Segregation      | Clients depend only on the operations they need.                                                                                                                                                                                                                                                             |
| SOLID: D — Dependency Inversion       | High-level policy depends on abstractions rather than low-level details. Dependency injection is one supporting technique.                                                                                                                                                                                   |
| Refactoring                           | Improve internal structure while preserving observable behaviour. Performance optimisation is a separate goal, though a refactor can enable it.                                                                                                                                                              |
| Performance optimisation              | Measure a bottleneck, then consider moving invariant work out of loops, removing redundant conditions, or improving common paths. Preserve required behaviour and verify the improvement; optimisation has a different goal from refactoring.                                                                |
| DRY / KISS / YAGNI                    | **Don't Repeat Yourself:** avoid duplicated knowledge. **Keep It Simple:** keep the design understandable. **You Aren't Going to Need It:** build abstractions/features when a real need appears.                                                                                                            |
| Testing                               | Unit tests check isolated behaviour; integration tests check boundaries; end-to-end tests check user flows. Choose tests for risks and behaviour, not implementation details.                                                                                                                                |

See [clean code](../software-engineering-theory/clean-code.md), [engineering basics](../software-engineering-theory/software-engineering-basics.md), and [testing revision](../fullstack/software-testing/testing-revision.md).

### OOP examples, benefits, and tradeoffs

Encapsulation scenario: a `Cat` could keep `mood`, `hungry`, and `energy` private and expose `sleep()`, `play()`, and `feed()` to control changes. Abstraction example: a coffee machine or smartphone exposes useful controls while hiding internal mechanics. See the [class example](#classes-encapsulation-inheritance-and-polymorphism) below for private state and method overriding.

| Benefit                    | Practical meaning                                                                                                                             |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Modularity                 | Cohesive components make troubleshooting and collaborative work easier.                                                                       |
| Reusability / productivity | Reuse proven behaviour through composition or suitable inheritance, reducing repeated development.                                            |
| Independent extension      | Separate responsibilities let features evolve independently and help a codebase scale; runtime throughput still depends on the actual design. |
| Interface descriptions     | Explicit contracts make communication between components and systems clearer.                                                                 |
| State protection           | Encapsulation limits accidental access/change to internal state; authentication and authorisation enforce access permissions.                 |
| Flexibility                | Polymorphism provides a uniform contract for different implementations.                                                                       |

**Tradeoffs:** forcing every problem into classes can overemphasise data modelling and obscure a simpler algorithm or transformation. Deep inheritance and widespread mutable state can complicate maintenance and testing. Compile/build/runtime cost depends on the language, tools, and implementation; OOP does not inherently make compilation slow.

### Alternative programming styles

Languages often support several paradigms; the examples below are possible styles rather than exclusive language classifications.

| Style                | Emphasis and examples                                                                                                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Functional           | Function composition and controlled side effects; Erlang, Scala, and Lisp support functional styles.                                                                                      |
| Structured / modular | Clear control flow and separated functions/modules; applicable in PHP and C#, which also support OOP.                                                                                     |
| Imperative           | Explicit steps that change state; common in C++ and Java alongside their other styles.                                                                                                    |
| Declarative          | Describe a desired result or relation rather than every execution step; SQL and declarative logic in Prolog. Lisp can support declarative techniques, but is not exclusively declarative. |
| Logic                | Facts/rules and queries; Prolog.                                                                                                                                                          |

## DSA recall

The table uses the standard dense-array/hash-table model. Hash access is expected rather than guaranteed O(1); append/pop and the head-index queue use amortized costs. State assumptions in an interview.

| Choice                     | Recall                                                                                                                                                                                                                                                                                          |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Array vs linked list       | Array: direct index access and compact iteration. List: O(1) insertion after a known node, but O(n) search and extra node references.                                                                                                                                                           |
| Object / Map / Set         | Objects suit named records with string/symbol keys; Map is iterable and maps keys of any type to values; Set stores unique values. Map/Set preserve insertion order and commonly support expected O(1) lookup. Object keys in Map/Set use identity; “same contents” does not mean the same key. |
| Stack / queue              | LIFO vs FIFO. `push()`/`pop()` implement an array stack. `push()`/`shift()` implement FIFO semantics, but repeated front removals can be costly; use a head index or queue class for BFS.                                                                                                       |
| Linked-list representation | Nodes hold a value and a next reference; a doubly linked list also holds a previous reference. JavaScript links are object references, rather than raw memory pointers.                                                                                                                         |
| Tree / binary tree / BST   | Trees model a parent/child hierarchy. A binary tree has at most two children per node; a BST additionally orders values across its left/right subtrees. BST lookup takes O(h), possibly O(n) if unbalanced. Traverse trees with recursion or an explicit queue/stack.                           |
| Heap                       | Usually a complete binary tree represented in an array: minimum O(1), push/pop O(log n), without fully sorting the array. JavaScript has no standard built-in Heap or PriorityQueue; implement one or use a suitable library.                                                                   |
| Graph                      | Use an adjacency list via objects or a Map of neighbour collections, taking O(V + E) space. Track visited vertices to handle cycles; distinguish directed/undirected and weighted/unweighted edges.                                                                                             |
| Search                     | Linear: O(n). Binary: O(log n) with a sorted range or monotonic predicate and guaranteed interval shrinkage.                                                                                                                                                                                    |
| Hashing / pointers         | Two-sum Map: expected O(n) time/O(n) space. Two pointers: O(n)/O(1) on sorted input; original indices need care if you sort.                                                                                                                                                                    |
| Windows / prefix sums      | Window updates a consecutive range. Prefix sums answer unchanged-input sum queries in O(1) after O(n) preprocessing.                                                                                                                                                                            |
| BFS / DFS                  | O(V + E) traversal. BFS gives fewest edges for equal edge costs; DFS explores branches. General weighted paths need another algorithm.                                                                                                                                                          |
| Backtracking / DP          | Backtracking explores/undoes choices. DP reuses repeated subproblem answers through top-down memoization or bottom-up tabulation, often storing results in arrays, Maps, or objects. Greedy needs a proof that local choices remain globally valid.                                             |
| Sorting                    | Merge sort is O(n log n), stable with left-first ties, and uses O(n) peak auxiliary space here. Built-in numeric sort needs a comparator.                                                                                                                                                       |

### Sorting algorithm checklist

| Algorithm      | What it does                                                                                | Time to remember                                                      |
| -------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Bubble sort    | Repeatedly swaps adjacent out-of-order items; an early-exit flag stops when no swaps occur. | O(n²) worst case; O(n) best case with early exit                      |
| Insertion sort | Inserts each new item into the already-sorted prefix.                                       | O(n²) worst case; O(n) best case on sorted input                      |
| Selection sort | Selects the smallest remaining item for each next position.                                 | O(n²) comparisons, including already-sorted input                     |
| Quicksort      | Partitions around a pivot, then sorts the partitions.                                       | Expected O(n log n) with suitable randomised pivots; O(n²) worst case |
| Merge sort     | Recursively sorts halves, then merges them; left-first ties preserve stability.             | O(n log n); O(n) peak auxiliary space for the linked implementation   |

Complete code: [data structures](../software-engineering-theory/data-structures/data-structures-revision.md), [algorithms](../software-engineering-theory/algorithms/algorithms-revision.md), and [editable exercises](../practice/dsa/exercises/README.md).

## Practical backend and system design

| Topic             | Check yourself                                                                                                                                                               |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API               | Clear contract/status codes, input validation, authentication, authorisation, pagination, and bounded work/timeouts. CORS is a browser access policy, not authentication.    |
| SQL               | Use parameters for values. Understand indexes, joins, constraints, query plans, transactions, and isolation; an ORM does not remove those concerns.                          |
| Concurrent writes | A check followed by a write can race. Use constraints, atomic conditional updates, or appropriate locking/transactions.                                                      |
| Cache             | Explain key, TTL, invalidation, stale-fill races, stampedes, and dependency failure. A cache hit rate is a measurement, not a guarantee.                                     |
| Idempotency       | Same key and same intent replay a result. Different intent with the same key conflicts. Record the effect and result atomically where possible.                              |
| Jobs              | Expect repeated attempts; use durable state, leases, ownership tokens, bounded retries, and stable effect identities. A queue alone does not guarantee exactly-once effects. |
| Reliability       | Consider deadlines, backoff/jitter, overload limits, logs/metrics/traces, and recovery. Measure tail latency and backlog, not just averages.                                 |

Practise the [three design exercises](../software-engineering-theory/system-design/system-design-exercises.md) and [runnable failure labs](../practice/system-design/README.md).

## Coding interview routine

1. Clarify inputs, constraints, desired output, duplicates, mutation, and failure cases.
2. Work a tiny example; describe a correct baseline.
3. Choose the structure/pattern and explain its invariant.
4. Implement with clear names while explaining key decisions.
5. Test normal, empty, boundary, and adversarial cases.
6. State time, auxiliary memory, output space, and tradeoffs; adjust when constraints change.

Use clear names, whitespace, and brief comments that explain decisions. Treat the interviewer as a collaborator: ask clarifying questions, narrate key reasoning, and step through a failing example to debug it.

For experience questions, practise a specific situation, task, action, result, and reflection privately. Keep actual names, client details, and confidential project information out of this public document.

## Copy-and-run examples

Each JavaScript block is a separate, complete example. Copy one into `practice.mjs` and run it on Ubuntu with Node.js 24 or newer:

```bash
node practice.mjs
```

No third-party dependencies are needed. The snippets use `.mjs` so ES-module strict mode and top-level `await` work. Browser/DOM APIs in the lookup table require a browser; these runnable examples use standard JavaScript and timers available in Node.js.

### Classes, encapsulation, inheritance, and polymorphism

`#energy` is private state. The getter exposes a read operation; `Cat` inherits it and overrides `speak()`. Calling the same method on different objects demonstrates polymorphism.

```js
class Animal {
  #energy = 100;
  get energy() {
    return this.#energy;
  }
  speak() {
    console.log("Makes a sound");
  }
}

class Cat extends Animal {
  speak() {
    console.log("Meow");
  }
}

const cat = new Cat();
for (const animal of [new Animal(), cat]) animal.speak();
console.log(cat.energy);
```

Expected output:

```text
Makes a sound
Meow
100
```

### Coercion and comparison output

Addition is evaluated left to right. A string operand can make `+` concatenate; loose equality has its own coercion rules.

```js
console.log(5 + "10");
console.log("10" + 5);
console.log(3 + 2 + "7");
console.log(5 == "5", 5 === "5");
console.log(null == undefined, null === undefined);
```

Expected output:

```text
510
105
57
true false
true false
```

### Shallow object copying

Both forms create a new top-level object; the nested object remains shared. Use `structuredClone()` only when its supported types and cloning semantics fit the data.

```js
const oldObj = { count: 1, nested: { value: 2 } };
const assigned = Object.assign({}, oldObj);
const spread = { ...oldObj };
assigned.count = 9;
assigned.nested.value = 8;
console.log(oldObj.count, assigned.count, spread.count);
console.log(oldObj.nested.value, spread.nested.value);
```

Expected output:

```text
1 9 1
8 8
```

### String to lowercase

The operation returns a new string and leaves the source unchanged.

```js
const str = "JavaScript";
const lower = str.toLowerCase();
console.log(lower);
console.log(str);
```

Expected output:

```text
javascript
JavaScript
```

### Removing duplicate values

`Set` is the usual general-purpose choice. The `filter()`/`indexOf()` alternative works for this numeric example, but removes NaN entirely and repeatedly scans the input.

```js
const arr = [1, 2, 2, 3];
const unique = [...new Set(arr)];
const filtered = arr.filter((value, index) => arr.indexOf(value) === index);
console.log(JSON.stringify([unique, filtered]));
const withNaN = [NaN, NaN];
console.log([...new Set(withNaN)].length);
console.log(
  withNaN.filter((value, index) => withNaN.indexOf(value) === index).length,
);
```

Expected output:

```text
[[1,2,3],[1,2,3]]
1
0
```

### Function declarations, expressions, and hoisting

The declaration is available early. The function expression cannot be accessed before its `const` initialisation; a `var` binding starts as `undefined`.

```js
console.log(describe());
function describe() {
  return "ready";
}

try {
  transform();
} catch (error) {
  console.log(error.name);
}
const transform = function () {
  return "expression";
};
console.log(transform());

console.log(futureValue);
var futureValue = 1;
```

Expected output:

```text
ready
ReferenceError
expression
undefined
```

### Closures and functional array methods

`multiplyBy()` returns a function retaining `factor`. That returned function is a pure transformation for these numeric inputs; `map()` and `filter()` accept callbacks, and `reduce()` builds the total.

```js
function multiplyBy(factor) {
  return (value) => value * factor;
}
const numbers = [1, 2, 3];
const doubled = numbers.map(multiplyBy(2));
const selected = doubled.filter((value) => value >= 4);
const total = selected.reduce((sum, value) => sum + value, 0);
console.log(JSON.stringify([numbers, doubled, selected, total]));
```

Expected output:

```text
[[1,2,3],[2,4,6],[4,6],10]
```

### Constructor functions and prototype methods

Each counter has its own `count` property, while both inherit the same `increment` function.

```js
function Counter(start = 0) {
  this.count = start;
}
Counter.prototype.increment = function () {
  this.count++;
};
const first = new Counter();
const second = new Counter();
first.increment();
console.log(first.count, second.count);
console.log(first.increment === second.increment);
console.log(Object.hasOwn(first, "count"), Object.hasOwn(first, "increment"));
```

Expected output:

```text
1 0
true
true false
```

### Binding a method with bind

The returned function keeps the receiver for ordinary calls and pre-fills `step`. It can be passed around without losing that receiver.

```js
const counter = {
  count: 2,
  incrementBy(step) {
    this.count += step;
    return this.count;
  },
};
const addFive = counter.incrementBy.bind(counter, 5);
console.log(addFive());
console.log(counter.count);
```

Expected output:

```text
7
7
```

### Basic data-structure operations

This small example uses array `shift()` to illustrate FIFO order. For a large queue, use the linked head-index queue implementation instead.

```js
const values = [1, 2, 3];
const record = { key: "value" };
const map = new Map([["key", "value"]]);
const set = new Set([1, 2, 2, 3]);
const stack = [];
stack.push("first", "second");
const queue = [];
queue.push("first", "second");
console.log(
  JSON.stringify([
    values,
    record,
    map.get("key"),
    [...set],
    stack.pop(),
    queue.shift(),
  ]),
);
```

Expected output:

```text
[[1,2,3],{"key":"value"},"value",[1,2,3],"second","first"]
```

### Creating and handling a promise

The executor runs immediately; the timer fulfils the promise later. Replace `resolve(...)` with `reject(new Error("Something went wrong..."))` to practise the catch branch. The 2000 ms delay is a minimum, not an exact scheduling guarantee.

```js
const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Promise fulfilled!");
  }, 2000);
});

await myPromise
  .then((value) => console.log(value))
  .catch((error) => console.error(error.message));
```

Expected output after the timer:

```text
Promise fulfilled!
```

### Chaining promises

Return a value or promise from a handler so the next handler receives its result. Thrown errors or returned rejected promises propagate to the catch handler.

```js
function doSomething() {
  return new Promise((resolve) => {
    setTimeout(() => resolve("Step 1 Complete"), 500);
  });
}

await doSomething()
  .then((result) => {
    console.log(result);
    return "Step 2 Complete";
  })
  .then((next) => console.log(next))
  .catch((error) => console.error(error.message));
```

Expected output:

```text
Step 1 Complete
Step 2 Complete
```

### Async/await and error handling

Use an awaited try/catch when handling a rejection; `finally` handles cleanup. Returning/awaiting promises composes asynchronous work without deeply nested callbacks.

```js
async function readStatus() {
  try {
    return await Promise.resolve("ready");
  } finally {
    console.log("Cleanup");
  }
}
console.log(await readStatus());

try {
  await Promise.reject(new Error("Temporary failure"));
} catch (error) {
  console.log(error.message);
}
```

Expected output:

```text
Cleanup
ready
Temporary failure
```

[Back to Main Index](../../README.md)
