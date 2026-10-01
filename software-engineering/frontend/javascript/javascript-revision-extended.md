# JavaScript revision extended: learn by doing

[Back to the topic index](./README.md)

A practical JavaScript reference with copy-paste examples, concise explanations and browser exercises. Work through a concept, run its example, change it and observe the result. All example data is generic.

## Run the examples in the web development template

Use a practice copy of the [Web Development template](https://github.com/amalk-au/web-development-template) project. Its existing tooling uses Node.js 24 and pnpm 12.4.1+ (within version 12); the JavaScript exercises execute in the browser as ES modules.

From the template's project root on Ubuntu:

```bash
pnpm install
pnpm dev
```

Open the local URL printed by Vite. Keep the terminal running. Open browser DevTools → **Console** for language examples and **Network** for HTTP examples.

### Connect a JavaScript entry point

Create **`src/js/main.js`**. In `index.html`, put this container inside the existing `<main>` element:

```html
<div id="app"></div>
```

Point the existing module script at the JavaScript file:

```html
<script type="module" src="/src/js/main.js"></script>
```

Use a single module entry script. The template's stylesheet is **`src/css/main.css`**. For convenient lab styling, append:

```css
main {
  max-width: 850px;
  margin: 2rem auto;
  padding: 0 1rem;
}
button,
input,
select {
  font: inherit;
  padding: 0.5rem;
  margin: 0.25rem;
}
label {
  display: block;
  margin: 0.5rem 0;
}
button {
  cursor: pointer;
}
li {
  margin: 0.5rem 0;
}
pre {
  overflow: auto;
  padding: 1rem;
  background: #f1f3f5;
}
.active {
  background: #e6f2ff;
}
.done {
  text-decoration: line-through;
}
```

### Practice workflow

1. Replace **all** of `src/js/main.js` with one lab's main snippet, including any imports.
2. Create additional files only when their paths are listed, such as `src/js/math.js` or `public/revision-data/items.json`.
3. Reload the browser after switching labs to clear previous listeners, timers and console output.
4. Read the Console or interact with the UI inside `#app`, then try the suggested experiment.

File paths are relative to the project root, and Linux filenames are case-sensitive. Examples are independent; don't paste them all into the same file. Keep the template's package scripts and configuration. Its type-check command checks the configured TypeScript files; these `.js` exercises rely on browser execution and JavaScript tooling.

## Contents

- [JavaScript revision extended: learn by doing](#javascript-revision-extended-learn-by-doing)
  - [Run the examples in the web development template](#run-the-examples-in-the-web-development-template)
    - [Connect a JavaScript entry point](#connect-a-javascript-entry-point)
    - [Practice workflow](#practice-workflow)
  - [Contents](#contents)
  - [1. Language and runtimes](#1-language-and-runtimes)
  - [2. Variables, scope and hoisting](#2-variables-scope-and-hoisting)
  - [3. Types and typeof](#3-types-and-typeof)
  - [4. Strings and template literals](#4-strings-and-template-literals)
  - [5. Numbers and conversion](#5-numbers-and-conversion)
  - [6. Truthiness, equality and operators](#6-truthiness-equality-and-operators)
  - [7. Conditions and loops](#7-conditions-and-loops)
  - [8. Functions, callbacks and higher-order functions](#8-functions-callbacks-and-higher-order-functions)
  - [9. Closures](#9-closures)
  - [10. Array basics](#10-array-basics)
  - [11. Array transformations and searching](#11-array-transformations-and-searching)
  - [12. Objects and object utilities](#12-objects-and-object-utilities)
  - [13. Destructuring, spread and rest](#13-destructuring-spread-and-rest)
  - [14. Optional chaining and nullish defaults](#14-optional-chaining-and-nullish-defaults)
  - [15. References, immutability and copying](#15-references-immutability-and-copying)
  - [16. This and function binding](#16-this-and-function-binding)
  - [17. Classes and prototypes](#17-classes-and-prototypes)
  - [18. Map and Set](#18-map-and-set)
  - [19. Regular expressions](#19-regular-expressions)
  - [20. Dates and time](#20-dates-and-time)
  - [21. Modules](#21-modules)
  - [22. Synchronous code and the event loop](#22-synchronous-code-and-the-event-loop)
  - [23. Promises, async and concurrency](#23-promises-async-and-concurrency)
  - [24. Errors and cleanup](#24-errors-and-cleanup)
  - [25. Fetch and browser API practice](#25-fetch-and-browser-api-practice)
    - [A. Load a JSON file through fetch](#a-load-a-json-file-through-fetch)
    - [B. Practice POST, HTTP errors and cancellation in the browser](#b-practice-post-http-errors-and-cancellation-in-the-browser)
  - [26. DOM manipulation](#26-dom-manipulation)
  - [27. Events, forms and delegation](#27-events-forms-and-delegation)
  - [28. JSON and localStorage](#28-json-and-localstorage)
  - [29. Task manager practice project](#29-task-manager-practice-project)
  - [30. Browser files and pnpm](#30-browser-files-and-pnpm)
    - [Package tooling for the browser project](#package-tooling-for-the-browser-project)
  - [31. Vite, TypeScript and React readiness](#31-vite-typescript-and-react-readiness)
  - [32. Mistakes, study order and mental checklist](#32-mistakes-study-order-and-mental-checklist)
    - [Common mistakes to revisit](#common-mistakes-to-revisit)
    - [Suggested refresher order](#suggested-refresher-order)
    - [Final mental checklist](#final-mental-checklist)
  - [References](#references)

## 1. Language and runtimes

JavaScript is the language. Browsers and Node.js provide runtime APIs in addition to language features.

| Layer        | Examples                                                                                  |
| ------------ | ----------------------------------------------------------------------------------------- |
| Language     | Values, variables, expressions, statements, functions, objects, arrays, modules, promises |
| Browser APIs | DOM, events, localStorage, fetch, timers                                                  |
| Node.js APIs | Filesystem, process arguments, environment variables, HTTP servers                        |
| Tooling      | Vite, package managers, TypeScript compiler                                               |

```js
const title = "Demo lesson"; // language
console.log(title.toUpperCase());
console.log(document.querySelector("h1").textContent); // browser DOM API
console.log(window.location.protocol); // http: or https: in the browser
```

**Try it:** inspect `document` and `window.location` in the browser. Browser APIs provide the document, navigation and storage. Filesystem/process APIs belong to a different runtime such as Node.js.

A useful progression is values → variables → expressions/statements → functions → data structures → modules → async work → runtime APIs. Recognize which layer a problem belongs to before choosing syntax.

## 2. Variables, scope and hoisting

**What it does:** contrasts changing a binding, changing an object and accessing outer lexical scope.

```js
let count = 0;
count += 1;
const item = { title: "Original" };
item.title = "Updated"; // allowed: the binding still refers to the same object

const prefix = "Outer";
function print() {
  const local = "Inner";
  if (true) {
    const blockOnly = "Block";
    console.log(prefix, local, blockOnly);
  }
  // console.log(blockOnly); // ReferenceError: outside its block
}
print();
console.log(count, item.title);
// item = {}; // TypeError: const binding cannot be reassigned
// console.log(local); // ReferenceError: outside the function

function legacyHoisting() {
  console.log(legacy); // undefined; declaration is initialized before this line
  var legacy = 10;
}
legacyHoisting();
// console.log(later); // ReferenceError: temporal dead zone
const later = 10;
console.log(later);
```

**Expected:** `Outer Inner Block`, `1 Updated`, `undefined`, `10`.

**Try it:** uncomment one error line at a time, then restore it. `const` and `let` are block-scoped; `var` is function-scoped. Inner scopes can see enclosing variables; outer scopes cannot see inner declarations.

**Remember:** default to `const`, use `let` for reassignment, understand `var` for older code. `const` does not freeze an object. Hoisting differs by declaration kind; `let`/`const` remain inaccessible until initialization.

## 3. Types and typeof

**What it does:** lists the seven primitive types and demonstrates important `typeof` results.

```js
const values = ["demo", 42, 123n, true, undefined, null, Symbol("id")];
for (const value of values) console.log(String(value), typeof value);

console.log(typeof {}); // object
console.log(typeof []); // object
console.log(typeof (() => {})); // function
console.log(Array.isArray([])); // true
console.log(typeof null); // object: historical quirk
```

**Try it:** add a `Date`, `Map` and `Set`; each is an object. Arrays and functions are also non-primitive values.

**Remember:** the primitives are string, number, bigint, boolean, undefined, null and symbol. `typeof` alone cannot distinguish every data structure. Symbol values are unique, even when their descriptions match.

## 4. Strings and template literals

**What it does:** embeds expressions in text and runs common string operations.

```js
const text = "  JavaScript  ";
const clean = text.trim();
console.log(`Topic: ${clean}; length: ${clean.length}`);
console.log(clean.toUpperCase(), clean.toLowerCase());
console.log(
  clean.includes("Script"),
  clean.startsWith("Java"),
  clean.endsWith("Script"),
);
console.log(clean.slice(0, 4));
console.log(clean.split("")); // UTF-16 code units, not always complete characters
console.log("red,blue".split(","));
console.log(text === "  JavaScript  "); // true: original string was not changed
console.log("A🌍".length, [..."A🌍"].length); // 3 code units, 2 code points
```

**Try it:** change the delimiter passed to `split`. Compare trimming with simply calling `toUpperCase`.

**Remember:** strings are immutable; methods return new values. Template literals use backticks and `${expression}`. Code points are not always visual characters either: combined emoji/accents can contain several code points.

## 5. Numbers and conversion

**What it does:** demonstrates rounding, numeric input conversion and floating-point limits.

```js
console.log(Math.round(4.6), Math.floor(4.9), Math.ceil(4.1)); // 5 4 5
console.log(Math.max(1, 5, 3), Math.min(1, 5, 3)); // 5 1
console.log(0.1 + 0.2); // 0.30000000000000004
console.log((0.1 + 0.2).toFixed(2)); // "0.30": a display string

const raw = "12.5";
const amount = Number(raw);
console.log(amount, Number.isFinite(amount));
console.log(Number(""), Number("invalid")); // 0, NaN
console.log(Number.isNaN(Number("invalid"))); // true
console.log(parseInt("12px", 10), Number("12px")); // 12, NaN
console.log(Math.floor(Math.random() * 6) + 1); // random integer 1–6
console.log(10n + 2n); // 12n
// console.log(10n + 2); // TypeError: don't mix bigint and number arithmetic
```

**Try it:** supply an empty form-like input. Check its trimmed text before converting if blank input must be rejected.

**Remember:** `number` uses IEEE 754 binary floating point. Formatting isn't a precision fix. Precision-sensitive values need an appropriate representation. `Math.random()` is not for security tokens; use a cryptographic API for those. BigInt handles integers and is not directly JSON-serializable.

## 6. Truthiness, equality and operators

**What it does:** distinguishes falsy values, nullish fallback and coercion.

```js
const falsy = [false, 0, -0, 0n, "", null, undefined, NaN];
console.log(falsy.map(Boolean)); // all false
console.log(Boolean([]), Boolean({}), Boolean("false")); // all true
console.log(0 || 10, 0 ?? 10); // 10, 0
console.log("" || "fallback", "" ?? "fallback"); // fallback, empty string
console.log(5 === 5, 5 === "5", 5 == "5"); // true false true
console.log(NaN === NaN, Number.isNaN(NaN)); // false true
console.log({} === {}); // false: different objects

let quantity = 2;
quantity += 3;
quantity++;
quantity--;
console.log(quantity, quantity % 2, 2 ** 3); // 5 1 8
console.log(quantity >= 3 && quantity < 10); // true
console.log(!false, quantity !== 0); // true true
console.log(quantity > 0 ? "In stock" : "Unavailable");
```

| Group                  | Operators                                    |
| ---------------------- | -------------------------------------------- | --- | ------------ |
| Arithmetic             | `+`, `-`, `*`, `/`, `%`, `**`                |
| Comparisons            | `>`, `<`, `>=`, `<=`, `===`, `!==`           |
| Loose equality         | `==`, `!=` (coerce values; use deliberately) |
| Logical/defaults       | `&&`, `                                      |     | `, `!`, `??` |
| Assignment             | `=`, `+=`, `-=`, `*=`, `/=`                  |
| Increment/decrement    | `++`, `--`                                   |
| Conditional expression | `condition ? yes : no`                       |

**Try it:** replace `??` with `||` where zero is valid. `&&` and `||` return operand values, not necessarily booleans: `true && 'ready'` returns `'ready'`.

**Remember:** prefer strict equality. `??` handles only null/undefined; it preserves zero, false and empty strings. Avoid deeply nested ternaries. Parenthesize when combining `??` with `||` or `&&`.

## 7. Conditions and loops

**What it does:** handles branches and iterates over values and keys.

```js
const score = 15;
if (score >= 20) console.log("High");
else if (score >= 10) console.log("Medium");
else console.log("Low");

const role = "editor";
switch (role) {
  case "admin":
    console.log("Admin view");
    break;
  case "editor":
    console.log("Editor view");
    break;
  default:
    console.log("Read-only view");
}

for (let index = 0; index < 3; index++) console.log("for", index);
let remaining = 2;
while (remaining > 0) {
  console.log("while", remaining);
  remaining--;
}

const prices = [10, 20, 30];
for (const price of prices) {
  if (price === 20) continue;
  console.log("value", price);
}
const item = { title: "Demo", stock: 3 };
for (const key in item) {
  if (Object.hasOwn(item, key)) console.log("key", key, item[key]);
}
```

**Try it:** use `break` in the `for...of` loop to stop at a matching value. Check that your `while` loop changes the value used by its condition.

**Remember:** `for...of` iterates values of iterables. `for...in` iterates enumerable string keys, including inherited ones; use `Object.hasOwn` or `Object.entries` when you want own properties. Prefer `for...of` over `for...in` for array values.

## 8. Functions, callbacks and higher-order functions

**What it does:** defines functions, passes a callback and returns another function.

```js
function add(a, b = 0) {
  return a + b;
}
const double = (value) => value * 2;
const greet = () => console.log("Hello");
const createItem = (title) => ({ title }); // parentheses return an object literal

function apply(value, callback) {
  return callback(value);
}
function createLogger(prefix) {
  return (message) => console.log(`${prefix}: ${message}`);
}

console.log(add(2, 3), add(2), double(4)); // 5 2 8
greet();
console.log(createItem("Demo"));
console.log(apply(5, double)); // 10
const log = createLogger("Lab");
log("Ready");
```

**Try it:** replace `double` with a callback that squares its input. A callback can run synchronously (as here) or asynchronously; the term doesn't imply timing.

**Remember:** functions are first-class values: store them, pass them, return them and put them in objects/arrays. A higher-order function accepts or returns a function. Declarations, block-body arrows and expression-body arrows are all useful; a block body needs an explicit `return` for a result.

## 9. Closures

**What it does:** keeps private state available after the factory function has returned.

```js
function createCounter(start = 0) {
  let count = start;
  return {
    increment() {
      count += 1;
      return count;
    },
    read() {
      return count;
    },
  };
}
const first = createCounter();
const second = createCounter(10);
console.log(first.increment(), first.increment()); // 1 2
console.log(second.increment(), first.read()); // 11 2
```

**Try it:** create a reset method. Each factory call gets its own state; methods from one call share that call's variable.

**Remember:** a closure retains access to its lexical environment. Closures underpin callbacks, handlers, factories, middleware, private state and React hooks. They access variables, not permanently frozen copies of their values.

## 10. Array basics

**What it does:** accesses positions, adds/removes values and contrasts non-mutating slicing with mutating splicing.

```js
const values = [1, 2, 3];
console.log(values[0], values.length, values[99]); // 1 3 undefined
values.push(4);
console.log(values.pop()); // 4
values.unshift(0);
console.log(values.shift()); // 0
console.log(values.slice(0, 2)); // new [1, 2]; source unchanged
const removed = values.splice(1, 1, 20); // remove one, insert 20
console.log(removed, values); // [2], [1, 20, 3]
console.log(values.includes(20)); // true
values.forEach((value, index) => console.log(index, value));
```

**Try it:** change the `splice` deletion count to zero. Observe that `slice` and `splice` do different jobs.

**Remember:** arrays are zero-indexed. `push`, `pop`, `unshift`, `shift` and `splice` mutate the array; `slice` creates a shallow copy of a range. Use `forEach` for side effects, not to obtain a transformed result.

## 11. Array transformations and searching

**What it does:** transforms, selects, finds, checks, totals and sorts a collection.

```js
const items = [
  { id: 1, title: "Notebook", price: 12, active: true },
  { id: 2, title: "Pen", price: 3, active: false },
  { id: 3, title: "Folder", price: 5, active: true },
];
console.log(items.map((item) => item.title));
console.log(items.filter((item) => item.active).map((item) => item.id)); // [1, 3]
console.log(items.find((item) => item.id === 2)?.title); // Pen
console.log(items.find((item) => item.id === 99)); // undefined
console.log(items.findIndex((item) => item.id === 2)); // 1; -1 if missing
console.log(items.some((item) => item.price > 10)); // true
console.log(items.every((item) => item.price > 0)); // true
console.log(items.reduce((sum, item) => sum + item.price, 0)); // 20
console.log(
  items.toSorted((a, b) => a.price - b.price).map((item) => item.title),
);
console.log(items.map((item) => item.id)); // still [1, 2, 3]

const numbers = [10, 2, 30];
console.log([...numbers].sort((a, b) => a - b)); // [2, 10, 30]
console.log([].some(Boolean), [].every(Boolean)); // false true
```

| Method               | Result / purpose                                   | Mutates the array itself?           |
| -------------------- | -------------------------------------------------- | ----------------------------------- |
| `map`                | New array of transformed values                    | No                                  |
| `filter`             | New array of matching items                        | No                                  |
| `find` / `findIndex` | First matching value/index; undefined/-1 if absent | No                                  |
| `some` / `every`     | At least one/all satisfy a condition               | No                                  |
| `reduce`             | Accumulated result                                 | Not inherently; callback can mutate |
| `includes`           | Whether a value occurs                             | No                                  |
| `sort`               | Sort existing array; default compares strings      | Yes                                 |
| `toSorted`           | Sorted shallow copy                                | No                                  |
| `slice` / `splice`   | Copy range / edit array                            | No / Yes                            |
| `forEach`            | Perform side effects; returns undefined            | Callback can mutate                 |

**Try it:** total only active item prices by composing `filter` and `reduce`. Use the initial `0` so an empty collection works. A callback can still mutate objects even when its array method doesn't mutate the array itself.

**Remember:** `map` is one result per visited element, `filter` selects, `find` stops at the first match, `some`/`every` answer questions, and `reduce` accumulates. Don't use `reduce` when a simpler method or loop communicates the intent. `toSorted` needs a modern browser; `[...array].sort(...)` is the fallback.

## 12. Objects and object utilities

**What it does:** reads, modifies, adds/deletes and enumerates object properties.

```js
const item = { title: "Demo", stock: 3, active: true };
console.log(item.title, item["title"]);
const field = "stock";
item[field] = 4;
item.category = "Stationery";
console.log(Object.keys(item));
console.log(Object.values(item));
for (const [key, value] of Object.entries(item)) console.log(key, value);
delete item.category;
console.log(Object.hasOwn(item, "category")); // false
console.log(
  Object.fromEntries([
    ["theme", "dark"],
    ["size", 10],
  ]),
);
```

**Try it:** use a variable as a property key; bracket notation allows computed keys.

**Remember:** keys/values/entries enumerate own enumerable string properties, not every possible property. `Object.fromEntries` reverses an entries-like collection into an object. Choose objects for records and `Map` when general key/value collection behavior is useful.

## 13. Destructuring, spread and rest

**What it does:** extracts fields/positions, copies with replacement fields and collects remaining inputs.

```js
const item = { id: 1, title: "Demo", stock: 3 };
const { title: label, stock = 0, ...otherFields } = item;
const [first, second = 0] = [10];
console.log(label, stock, otherFields, first, second);

const updated = { ...item, stock: 4 };
const combined = [...[1, 2], ...[3, 4]];
function sum(...numbers) {
  return numbers.reduce((total, number) => total + number, 0);
}
console.log(updated.stock, item.stock, combined, sum(1, 2, 3));
```

**Try it:** move `stock: 4` before `...item`. The later spread now overwrites it.

**Remember:** destructuring extracts; spread expands; rest collects. Defaults apply to `undefined`, not `null`. Array/call spread requires an iterable; object spread copies own enumerable properties. These copies are shallow. Destructuring and spread/rest appear constantly in React and Node code.

## 14. Optional chaining and nullish defaults

**What it does:** handles missing nested data and an optional callback while preserving meaningful falsy values.

```js
const item = { details: null, stock: 0 };
console.log(item.details?.category ?? "Uncategorized");
console.log(item.stock ?? 10); // 0
const callback = undefined;
callback?.(); // no call, no error
const existing = { notify: () => console.log("Notified") };
existing.notify?.();
// console.log(undeclared?.value); // ReferenceError: root must be declared
// existing.notify = 'not a function'; existing.notify?.(); // still throws
```

**Try it:** set `details` to `{ category: 'Demo' }` and stock to `null`.

**Remember:** `?.` short-circuits only on null/undefined. It doesn't prove that an existing value is callable, and it doesn't make an undeclared root safe. Keep a continuous chain: grouping `(item.details?.address).city` can resume unsafe access.

## 15. References, immutability and copying

**What it does:** contrasts primitive copies, shared objects, shallow copying and deep cloning.

```js
let first = 10;
let second = first;
second = 20;
console.log(first, second); // 10 20

const original = { id: 1, profile: { label: "Original" } };
const alias = original;
alias.profile.label = "Shared";
console.log(original.profile.label); // Shared

const shallow = { ...original };
console.log(shallow !== original, shallow.profile === original.profile); // true true
const deep = structuredClone(original);
deep.profile.label = "Independent";
console.log(original.profile.label, deep.profile.label); // Shared Independent

const updated = {
  ...original,
  profile: { ...original.profile, label: "Updated" },
};
console.log(updated.profile.label, original.profile.label); // Updated Shared
const items = [original];
const revised = items.map((item) =>
  item.id === 1 ? { ...item, id: 2 } : item,
);
console.log(items[0].id, revised[0].id); // 1 2
```

**Try it:** modify `shallow.profile.label` and see the original change. Then modify `deep` instead.

**Remember:** JavaScript passes values; an object value is a reference, which can be copied so two variables reach the same object. It is not pass-by-reference variable rebinding. Immutability is a design technique, especially useful for React state. Copy only the branches you change. `structuredClone` supports many data structures but cannot clone functions and is not a general clone of class behavior/DOM nodes. Don't use JSON round-tripping as a universal deep copy.

## 16. This and function binding

**What it does:** shows how ordinary methods get a receiver and how binding preserves it for a detached callback.

```js
const item = {
  title: "Demo",
  describe() {
    return this.title;
  },
  makeCallback() {
    return () => this.title;
  }, // arrow captures this call's receiver
};
console.log(item.describe());
const detached = item.describe;
try {
  console.log(detached());
} catch (error) {
  console.log(error.name);
}
console.log(detached.call({ title: "Other" }));
const bound = item.describe.bind(item);
console.log(bound());
console.log(item.makeCallback()());
console.log(this); // undefined at top level of an ES module
```

**Expected:** `Demo`, `TypeError`, `Other`, `Demo`, `Demo`, `undefined`.

**Try it:** pass `bound` to `setTimeout` inside a wrapper that logs its result. Replace an object method with an arrow defined at module level and notice it has no object receiver.

**Remember:** ordinary-function `this` depends on the call; arrows capture surrounding `this` and cannot be rebound using `call`/`bind`. Modules run in strict mode. This distinction matters in classes, callbacks and event handlers.

## 17. Classes and prototypes

**What it does:** defines instance state/methods and demonstrates inherited property lookup directly.

```js
class Item {
  constructor(title) {
    this.title = title;
  }
  describe() {
    return `Item: ${this.title}`;
  }
}
const item = new Item("Demo");
console.log(item.describe());
console.log(Object.getPrototypeOf(item) === Item.prototype); // true

const base = {
  speak() {
    return "base sound";
  },
};
const child = Object.create(base);
console.log(child.speak());
console.log(Object.hasOwn(child, "speak")); // false: method inherited
child.speak = () => "own sound";
console.log(child.speak());
```

**Try it:** delete `child.speak`; the inherited method becomes visible again.

**Remember:** lookup checks an object's own properties and then its prototype chain. Classes use that system, with additional language rules. Functions, plain objects, closures, modules and composition remain valid alternatives; every application doesn't need class hierarchies.

## 18. Map and Set

**What it does:** stores keyed values and deduplicates a collection.

```js
const items = new Map([
  [1, "Notebook"],
  [2, "Pen"],
]);
items.set(3, "Folder");
console.log(items.get(1), items.has(2), items.size);
for (const [id, title] of items) console.log(id, title);
items.delete(2);
console.log(items.has(2)); // false

const unique = new Set([1, 2, 2, 3]);
unique.add(4);
console.log([...unique]); // [1, 2, 3, 4]
console.log(unique.has(2));
unique.delete(2);
console.log(unique.size); // 3
console.log(new Set([{}, {}]).size); // 2: different object references
```

**Try it:** use an object as a Map key. Only the same reference retrieves that entry.

**Remember:** Maps accept arbitrary key types. Sets track unique values; matching objects are based on identity, not deep content. Both preserve insertion order for iteration.

## 19. Regular expressions

**What it does:** checks a simple format, extracts numbers and replaces whitespace.

```js
const lettersOnly = /^[A-Za-z]+$/;
console.log(lettersOnly.test("Demo"), lettersOnly.test("Demo 2")); // true false
const text = "Item 12 costs 30 units";
console.log(text.match(/\d+/g)); // ["12", "30"]
console.log("  spaced   words  ".trim().replace(/\s+/g, " "));
const code = "sku-42".match(/^([a-z]+)-(\d+)$/);
console.log(code?.[1], code?.[2]); // sku 42
```

**Try it:** add an accented letter to the first input; this intentionally ASCII pattern rejects it.

**Remember:** regex supports validation, search, extraction and replacement. The pattern must match your actual requirements. Global/sticky regexes used repeatedly with `test` have state in `lastIndex`. Complex validation can be clearer with a parser or validation library than one large regex.

## 20. Dates and time

**What it does:** parses an explicit UTC instant and formats it without depending on the computer's local timezone.

```js
const instant = new Date("2026-01-15T12:30:00Z");
console.log(instant.toISOString());
console.log(
  instant.getUTCFullYear(),
  instant.getUTCMonth(),
  instant.getUTCDate(),
); // 2026 0 15
console.log(instant.getTime()); // milliseconds since Unix epoch
console.log(
  new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(instant),
);
console.log(Number.isNaN(new Date("not a date").getTime())); // true
const now = new Date();
console.log(now.getFullYear(), now.getMonth(), now.getDate()); // local calendar fields
```

**Try it:** change the formatting timezone to `America/New_York`. The displayed clock time changes; the underlying instant does not.

**Remember:** month getters are zero-indexed (0–11). `getDate` is day-of-month; `getDay` is weekday. Use explicit offsets/UTC for instants and understand ISO 8601, timestamps, local time and timezones. A calendar-only date is not automatically a midnight instant in every timezone. Avoid ambiguous human-readable date parsing; elapsed calendar days can differ from 24-hour increments around daylight-saving changes.

## 21. Modules

**What it does:** supplies complete named/default export modules and imports them into the entry file.

**`src/js/math.js`**

```js
export function add(a, b) {
  return a + b;
}
export const double = (value) => value * 2;
```

**`src/js/greet.js`**

```js
export default function greet(label) {
  return `Hello, ${label}`;
}
```

**Replace `src/js/main.js`:**

```js
import { add, double as twice } from "./math.js";
import greet from "./greet.js";
console.log(add(2, 3), twice(4)); // 5 8
console.log(greet("Demo")); // Hello, Demo
```

**Try it:** rename the local default import. Named exports require the exported name unless aliased; default imports choose a local name.

**Remember:** a module has its own scope and runs in strict mode. The HTML setup uses `type="module"`. Serve modules through Vite/HTTP rather than opening files directly. Modules are central to Vite, React, TypeScript and Node projects.

## 22. Synchronous code and the event loop

**What it does:** shows that synchronous work finishes before promise microtasks and timer callbacks.

```js
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");
```

**Expected:** `1`, `4`, `3`, `2`.

**Try it:** add a short synchronous loop before the final log. Async callbacks wait for the running code to yield; don't freeze the page with a long loop.

**Remember:** timer callbacks are tasks; promise reactions are microtasks. A zero-millisecond timer doesn't run immediately. Browser task execution is followed by microtask processing before later tasks; painting has its own scheduling opportunities. Node has additional queues/phases, so this small example isn't a complete cross-runtime scheduling model.

## 23. Promises, async and concurrency

**What it does:** creates fulfilled/rejected asynchronous work, handles it using both chaining and await, and compares Promise combinators.

```js
function wait(value, milliseconds, fail = false) {
  return new Promise((resolve, reject) => {
    setTimeout(
      () => (fail ? reject(new Error(`${value} failed`)) : resolve(value)),
      milliseconds,
    );
  });
}

await wait("chained", 20)
  .then((value) => console.log(value))
  .catch(console.error);
async function getValue() {
  return await wait("awaited", 20);
}
console.log(await getValue());

const [first, second] = await Promise.all([wait("slow", 50), wait("fast", 10)]);
console.log(first, second); // input order, not completion order
const results = await Promise.allSettled([
  wait("good", 10),
  wait("bad", 5, true),
]);
console.log(results.map((result) => result.status)); // fulfilled, rejected
console.log(await Promise.race([wait("later", 20), wait("earlier", 5)]));
console.log(await Promise.any([wait("failure", 5, true), wait("success", 10)]));
```

| API                  | Behavior                                                                          |
| -------------------- | --------------------------------------------------------------------------------- |
| `.then` / `.catch`   | Process a result / handle rejection; return values/promises to continue the chain |
| `async` / `await`    | An async function returns a Promise; await pauses its continuation                |
| `Promise.all`        | All values, in input order; rejects when one rejects                              |
| `Promise.allSettled` | Every outcome, including rejections                                               |
| `Promise.race`       | First settlement (fulfillment or rejection)                                       |
| `Promise.any`        | First fulfillment; rejects with AggregateError if all reject                      |

**Try it:** make the fastest `race` operation reject and catch that error. Then do the same with `any`; another fulfillment can still win.

**Remember:** promises can be pending, fulfilled or rejected. Independent operations can run concurrently when started together; awaiting one before starting the next makes them sequential. Promise combinators don't cancel losing/remaining work. Avoid `forEach(async ...)` when you need to wait: use `for...of` with await, or `Promise.all(array.map(...))` for a suitably bounded set of independent operations.

## 24. Errors and cleanup

**What it does:** validates input, propagates asynchronous errors to a caller and always performs cleanup.

```js
async function saveTitle(title) {
  if (typeof title !== "string" || !title.trim())
    throw new Error("Title is required");
  await new Promise((resolve) => setTimeout(resolve, 20));
  return title.trim();
}

for (const title of ["Demo", ""]) {
  try {
    console.log("Saved:", await saveTitle(title));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
  } finally {
    console.log("Attempt complete");
  }
}
```

**Try it:** remove `await` before `saveTitle`; the surrounding `try/catch` no longer observes the rejection through that expression.

**Remember:** throw errors with useful context. Don't silently swallow failures unless you intentionally recover. `try/catch` catches synchronous errors and awaited rejections, not arbitrary later timer-callback errors. Catch near a boundary that can respond or recover; otherwise let the error reach the caller. Use `finally` for cleanup, and avoid returning from it because that can override earlier results/errors.

## 25. Fetch and browser API practice

**What it does:** makes a real browser GET request for a local JSON file, validates the result, and practices request/response contracts with a browser simulator. The simulator keeps data in memory and provides observable loading, POST, HTTP errors and cancellation.

### A. Load a JSON file through fetch

Create **`public/revision-data/items.json`**:

```json
[
  { "id": 1, "title": "Notebook" },
  { "id": 2, "title": "Pen" }
]
```

Create **`src/js/api.js`**:

```js
export async function requestJson(url, options = {}, transport = fetch) {
  const response = await transport(url, options);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await response.json();
}

export async function getItems(signal) {
  const url = `${import.meta.env.BASE_URL}revision-data/items.json`;
  const data = await requestJson(url, { signal });
  if (
    !Array.isArray(data) ||
    !data.every(
      (item) =>
        item !== null &&
        typeof item === "object" &&
        Number.isInteger(item.id) &&
        typeof item.title === "string",
    )
  ) {
    throw new Error("Invalid item data");
  }
  return data;
}
```

Replace **`src/js/main.js`**:

```js
import { getItems } from "./api.js";

const app = document.querySelector("#app");
app.innerHTML = '<button>Load items</button><pre role="status"></pre>';
const button = app.querySelector("button");
const output = app.querySelector("pre");

async function load() {
  button.disabled = true;
  output.textContent = "Loading…";
  try {
    output.textContent = JSON.stringify(await getItems(), null, 2);
  } catch (error) {
    output.textContent = error.message;
  } finally {
    button.disabled = false;
  }
}
button.addEventListener("click", load);
await load();
```

**Try it:** inspect the request in DevTools Network. Change an item title in the JSON file and reload. Make an ID a string to trigger schema validation. Break the JSON syntax to trigger a parse error, then restore it.

**Remember:** Vite serves `public/` assets from the site root and includes them in the build. `import.meta.env.BASE_URL` accommodates a configured deployment base. `fetch` and `response.json()` are asynchronous. HTTP 404/500 doesn't automatically reject fetch; check `response.ok`. A successful parse proves JSON syntax, not the required data shape. A response body is normally consumed once.

### B. Practice POST, HTTP errors and cancellation in the browser

Keep `src/js/api.js` from part A. Create **`src/js/browser-api.js`**:

```js
const items = [{ id: 1, title: "Demo item" }];
let nextId = 2;

function pause(milliseconds, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Operation cancelled", "AbortError"));
      return;
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", abort);
      resolve();
    }, milliseconds);
    function abort() {
      clearTimeout(timer);
      signal?.removeEventListener("abort", abort);
      reject(new DOMException("Operation cancelled", "AbortError"));
    }
    signal?.addEventListener("abort", abort, { once: true });
  });
}

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function browserApi(url, options = {}) {
  const request = new Request(new URL(url, window.location.origin), options);
  await pause(600, options.signal);
  const path = new URL(request.url);
  if (path.pathname !== "/practice/items")
    return json(404, { error: "Not found" });
  if (path.searchParams.get("fail") === "1")
    return json(500, { error: "Demo failure" });
  if (request.method === "GET") return json(200, items);
  if (request.method !== "POST")
    return json(405, { error: "Method not allowed" });
  if (
    request.headers.get("Content-Type")?.split(";")[0].trim() !==
    "application/json"
  ) {
    return json(415, { error: "Use application/json" });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "Invalid JSON" });
  }
  if (
    body === null ||
    typeof body !== "object" ||
    typeof body.title !== "string" ||
    !body.title.trim() ||
    body.title.trim().length > 80
  ) {
    return json(400, { error: "title needs 1–80 characters" });
  }
  const item = { id: nextId++, title: body.title.trim() };
  items.push(item);
  return json(201, item);
}
```

Replace **`src/js/main.js`**:

```js
import { requestJson } from "./api.js";
import { browserApi } from "./browser-api.js";

const app = document.querySelector("#app");
app.innerHTML = `
  <p>Browser simulator: requests below stay in this page's memory.</p>
  <button id="load">List items</button>
  <button id="fail">Demo HTTP error</button>
  <form id="create"><label>Title <input id="title" required maxlength="80"></label><button>Create</button></form>
  <button id="cancel" disabled>Cancel active operation</button>
  <pre id="result" role="status"></pre>`;
const output = app.querySelector("#result");
const cancel = app.querySelector("#cancel");
const controls = [...app.querySelectorAll("button")].filter(
  (button) => button !== cancel,
);
let controller;

async function run(operation) {
  if (controller) return;
  controller = new AbortController();
  controls.forEach((button) => {
    button.disabled = true;
  });
  cancel.disabled = false;
  output.textContent = "Loading…";
  try {
    output.textContent = JSON.stringify(
      await operation(controller.signal),
      null,
      2,
    );
  } catch (error) {
    output.textContent =
      error.name === "AbortError" ? "Cancelled" : error.message;
  } finally {
    controller = undefined;
    controls.forEach((button) => {
      button.disabled = false;
    });
    cancel.disabled = true;
  }
}
function listItems(signal) {
  return requestJson("/practice/items", { signal }, browserApi);
}
app.querySelector("#load").addEventListener("click", () => run(listItems));
app
  .querySelector("#fail")
  .addEventListener("click", () =>
    run((signal) =>
      requestJson("/practice/items?fail=1", { signal }, browserApi),
    ),
  );
cancel.addEventListener("click", () => controller?.abort());
app.querySelector("#create").addEventListener("submit", (event) => {
  event.preventDefault();
  const title = app.querySelector("#title").value.trim();
  if (!title) return;
  run((signal) =>
    requestJson(
      "/practice/items",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
        signal,
      },
      browserApi,
    ),
  );
});
await run(listItems);
```

**Try it:** create an item, list it, trigger a 500 response, then cancel a loading operation. Submit an empty/malformed body by editing the POST snippet to see validation fail. Reload to reset the simulator's data.

**Remember:** part A uses real HTTP through fetch. Part B injects a browser function as the transport and returns `Request`/`Response` objects; it demonstrates status codes and async contracts without network requests. Its actions won't appear as API requests in the Network tab. Static JSON files provide data but cannot process persistent POST writes. In a real fetch call, use the same `method`, `headers`, serialized `body` and `signal` options with a reachable server endpoint. Cancellation is cooperative and doesn't guarantee that a real server undoes work already performed.

## 26. DOM manipulation

**What it does:** selects elements, changes text/classes, creates nodes and appends them.

```js
const app = document.querySelector("#app");
app.innerHTML = '<p class="item">Original</p><p class="item">Second</p>';
const first = app.querySelector(".item");
first.textContent = "Updated text";
first.classList.add("active");
first.classList.remove("active");
first.classList.toggle("active");
for (const element of app.querySelectorAll(".item"))
  console.log(element.textContent);
const created = document.createElement("p");
created.textContent = "Created with JavaScript";
app.append(created);
```

**Try it:** add a button that toggles `active` instead of doing it immediately.

**Remember:** `querySelector` may return null; validate when markup isn't guaranteed. `querySelectorAll` returns a static NodeList, not an automatically updating array. Here `innerHTML` only contains a trusted fixed template; use `textContent`/created nodes for user-provided text to avoid treating it as HTML.

## 27. Events, forms and delegation

**What it does:** adds list items through a form and uses one ancestor listener to handle deletion, including clicks on nested spans.

```js
const app = document.querySelector("#app");
app.innerHTML = `
  <form><label>Item <input required></label><button>Add</button></form>
  <ul id="items"></ul><p id="status" role="status"></p>`;
const form = app.querySelector("form");
const input = app.querySelector("input");
const list = app.querySelector("#items");
const status = app.querySelector("#status");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = input.value.trim();
  if (!title) return;
  const row = document.createElement("li");
  const label = document.createElement("span");
  label.textContent = title;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "delete-button";
  button.innerHTML = "<span>Delete</span>"; // fixed trusted template
  row.append(label, button);
  list.append(row);
  input.value = "";
  input.focus();
});

list.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest(".delete-button");
  if (!button || !list.contains(button)) return;
  button.closest("li").remove();
  status.textContent = "Item deleted";
  console.log("Target:", event.target, "Listener owner:", event.currentTarget);
});
```

**Try it:** add several items and click the span text inside a Delete button. Delegation still finds the containing button.

**Remember:** events commonly bubble from the target to ancestors. `target` is where the event originated; `currentTarget` is the element whose listener is running. `preventDefault` prevents the browser's default action; it does not stop bubbling. `stopPropagation` stops further propagation when deliberately needed. `closest` handles nested markup more reliably than only checking `target.matches`. Remove long-lived listeners with `removeEventListener` using the same function, or register with an AbortSignal and abort it during cleanup.

## 28. JSON and localStorage

**What it does:** stores a small preference, validates what is read back and removes only its own key.

```js
const key = "javascript-revision-theme";
function readTheme() {
  try {
    const text = localStorage.getItem(key);
    if (text === null) return "light";
    const value = JSON.parse(text);
    if (value?.theme === "light" || value?.theme === "dark") return value.theme;
    throw new Error("Invalid stored theme");
  } catch (error) {
    console.warn("Using default theme:", error.message);
    return "light";
  }
}
const app = document.querySelector("#app");
app.innerHTML =
  '<button id="save">Save dark</button><button id="remove">Remove saved theme</button><p></p>';
const show = () => {
  app.querySelector("p").textContent = `Stored theme: ${readTheme()}`;
};
app.querySelector("#save").addEventListener("click", () => {
  try {
    localStorage.setItem(key, JSON.stringify({ theme: "dark" }));
  } catch (error) {
    console.error("Storage unavailable:", error.message);
  }
  show();
});
app.querySelector("#remove").addEventListener("click", () => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Cannot remove preference:", error.message);
  }
  show();
});
show();
```

**Try it:** save, reload and remove. In DevTools, corrupt this key's stored text and reload; the fallback is used.

**Remember:** storage returns strings or null, is synchronous and is scoped to an origin (including port). Access/writes can fail. JSON is used for APIs, configuration, storage and data interchange. `JSON.parse` checks syntax, not your schema. JSON loses/changes some JavaScript values: functions/undefined aren't ordinary JSON fields, Dates serialize as strings, BigInt/cycles need special handling. Don't store credentials in this practice storage, and don't use `localStorage.clear()` to remove unrelated app keys.

## 29. Task manager practice project

**What it does:** combines the guide's concepts into one runnable project: add, edit, delete, complete, filter, search and persist tasks. Replace `src/js/main.js`; no API server is needed.

```js
const key = "javascript-revision-tasks-v1";
let storageMessage = "";
function validTask(task) {
  return (
    task !== null &&
    typeof task === "object" &&
    typeof task.id === "string" &&
    typeof task.title === "string" &&
    typeof task.done === "boolean"
  );
}
function loadTasks() {
  try {
    const text = localStorage.getItem(key);
    if (text === null) return [];
    const data = JSON.parse(text);
    if (
      !Array.isArray(data) ||
      !data.every(validTask) ||
      new Set(data.map((task) => task.id)).size !== data.length
    ) {
      throw new Error("Invalid stored tasks");
    }
    return data;
  } catch (error) {
    storageMessage = "Stored tasks could not be loaded; using an empty list.";
    console.warn(error);
    return [];
  }
}
let tasks = loadTasks();
const app = document.querySelector("#app");
app.innerHTML = `
  <form id="add-form"><label>New task <input id="title" required maxlength="120"></label><button>Add</button></form>
  <label>Show <select id="filter"><option value="all">All</option><option value="active">Active</option><option value="done">Completed</option></select></label>
  <label>Search <input id="search" type="search"></label>
  <p id="status" role="status"></p><ul id="tasks"></ul>`;
const list = app.querySelector("#tasks");
const titleInput = app.querySelector("#title");
const filter = app.querySelector("#filter");
const search = app.querySelector("#search");
const status = app.querySelector("#status");

function render() {
  const query = search.value.trim().toLowerCase();
  const visible = tasks.filter(
    (task) =>
      (filter.value === "all" ||
        (filter.value === "done" ? task.done : !task.done)) &&
      task.title.toLowerCase().includes(query),
  );
  list.replaceChildren();
  for (const task of visible) {
    const row = document.createElement("li");
    row.dataset.id = task.id;
    const text = document.createElement("span");
    text.textContent = task.title;
    text.classList.toggle("done", task.done);
    row.append(text);
    for (const [action, label] of [
      ["toggle", task.done ? "Reopen" : "Complete"],
      ["edit", "Edit"],
      ["delete", "Delete"],
    ]) {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.action = action;
      button.textContent = label;
      row.append(button);
    }
    list.append(row);
  }
  status.textContent = `${tasks.filter((task) => !task.done).length} remaining; ${visible.length} shown. ${storageMessage}`;
}

function saveAndRender() {
  try {
    localStorage.setItem(key, JSON.stringify(tasks));
    storageMessage = "";
  } catch (error) {
    storageMessage = "Changes are in memory only; storage is unavailable.";
    console.warn(error);
  }
  render();
}

app.querySelector("#add-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const title = titleInput.value.trim();
  if (!title || title.length > 120) return;
  tasks = [...tasks, { id: crypto.randomUUID(), title, done: false }];
  titleInput.value = "";
  saveAndRender();
  titleInput.focus();
});

list.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest("button[data-action]");
  if (!button || !list.contains(button)) return;
  const id = button.closest("li").dataset.id;
  const task = tasks.find((task) => task.id === id);
  if (!task) return;
  switch (button.dataset.action) {
    case "toggle":
      tasks = tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      );
      break;
    case "delete":
      tasks = tasks.filter((task) => task.id !== id);
      break;
    case "edit": {
      const title = prompt("Edit task (1–120 characters)", task.title)?.trim();
      if (!title || title.length > 120) return;
      tasks = tasks.map((task) => (task.id === id ? { ...task, title } : task));
      break;
    }
    default:
      return;
  }
  saveAndRender();
});
filter.addEventListener("change", render);
search.addEventListener("input", render);
render();
```

**Try it:** add three tasks, complete one, filter Active/Completed, search, edit and delete. Reload to verify persistence. Type text that looks like HTML; it remains text. Cancel an edit prompt and verify the task stays unchanged. The prompt is a compact teaching UI; replace it with an inline edit form as a follow-up.

**Concepts practiced:** variables, functions, objects, arrays, map/filter/find, immutability, stable IDs, event delegation, DOM creation, forms, JSON, localStorage and state management. `crypto.randomUUID()` works on localhost/HTTPS. Persisting browser state isn't database durability or multi-user synchronization.

**Practice next:** extract storage, rendering and task operations into modules. Build an inline editing form, then add import/export using the browser File and Blob APIs. A later full-stack version can connect browser fetch calls to a REST API and PostgreSQL; keep that backend as a separate project.

## 30. Browser files and pnpm

**What it does:** reads a file selected through a browser input and downloads generated text using a Blob.

Replace **`src/js/main.js`**:

```js
const app = document.querySelector("#app");
app.innerHTML = `
  <label>Choose a small text file <input type="file" accept="text/plain,.txt,.json"></label>
  <button id="download">Download demo text</button>
  <pre role="status"></pre>`;
const input = app.querySelector("input");
const output = app.querySelector("pre");

input.addEventListener("change", async () => {
  const file = input.files?.[0];
  if (!file) return;
  if (file.size > 1024 * 1024) {
    output.textContent = "Choose a file smaller than 1 MiB.";
    return;
  }
  try {
    output.textContent = await file.text();
  } catch (error) {
    output.textContent = error.message;
  }
});

app.querySelector("#download").addEventListener("click", () => {
  const blob = new Blob(["Demo file content\n"], {
    type: "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "demo.txt";
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
```

**Try it:** download the demo file, select it with the file input and read its text on the page. As a follow-up, export tasks with `JSON.stringify` into a Blob, then import a selected JSON file and validate its shape.

**Remember:** browsers expose user-selected files through the File API; they don't provide Node's unrestricted filesystem/process APIs. The `accept` attribute is a chooser hint, not content validation. Object URLs refer to browser-managed data; revoke them when they're no longer needed. Reading file text does not automatically upload it anywhere.

### Package tooling for the browser project

| Command                          | Purpose                                                      |
| -------------------------------- | ------------------------------------------------------------ |
| `pnpm install`                   | Install the template's dependencies                          |
| `pnpm dev`                       | Start Vite and open its URL in the browser                   |
| `pnpm build`                     | Check configured TypeScript files and bundle frontend assets |
| `pnpm preview`                   | Serve the built browser project locally                      |
| `pnpm lint`                      | Run the template's ESLint configuration                      |
| `pnpm format`                    | Apply the template's formatting rules                        |
| `pnpm test`                      | Run the template's existing automated tests                  |
| `pnpm install --frozen-lockfile` | Install using a compatible committed lockfile, useful in CI  |

`pnpm add <package-name>` adds a runtime dependency, `pnpm add -D <package-name>` adds development tooling, and `pnpm remove <package-name>` removes a dependency. Replace the placeholder with an actual package name. `pnpm exec` runs an available project tool; `pnpm dlx` runs a package without adding it as a project dependency.

Commit `package.json` and `pnpm-lock.yaml`; keep generated assets, dependency folders and credentials out of Git. Browser code and package tooling have different jobs: Vite serves/bundles the page, while the browser executes the lab. Frontend environment values included in a bundle are visible to its users.

## 31. Vite, TypeScript and React readiness

| Step                          | Role                                                         |
| ----------------------------- | ------------------------------------------------------------ |
| `index.html`                  | Page entry point                                             |
| JavaScript/TypeScript modules | Application source                                           |
| Vite                          | Development server/module transforms and production bundling |
| JavaScript + CSS + assets     | Files served to the browser                                  |
| Browser                       | Executes JavaScript and provides web APIs                    |

The browser executes JavaScript. TypeScript adds development-time types; Vite transforms TypeScript, while the template runs its compiler separately for type checking. Type annotations do not validate runtime input.

```bash
# Build the template and preview its browser output
pnpm build
pnpm preview
```

The JSON fixture under `public/` is included in the build. The browser simulator works in development and in preview. `preview` serves built files locally for inspection; publishing them requires a separate hosting step.

To explore TypeScript later, use the template's `src/js/main.ts` entry and its existing type-check/build commands. Begin with typed versions of the same browser examples. Keep only one active module entry in `index.html`.

**Before React:** be comfortable with const/let, primitive values, objects, arrays, functions/arrows, lexical scope, closures, destructuring, spread/rest, map/filter/find/reduce, modules, promises, async/await, try/catch, fetch, DOM/events, immutability and shared references.

**Then TypeScript:** basic types, interfaces, type aliases, unions, generics, narrowing, typed functions/objects, modules and utility types. Type annotations don't validate runtime input.

## 32. Mistakes, study order and mental checklist

### Common mistakes to revisit

| Mistake                                    | Better approach                                            |
|--------------------------------------------|------------------------------------------------------------|
| `sort()` unexpectedly changes the source   | `toSorted()` or `[...values].sort(comparator)`             |
| Default numeric sorting                    | Supply `(a, b) => a - b`                                   |
| `map` used just to log                     | Use `forEach` or a loop for side effects                   |
| Block-body map callback forgets `return`   | Return explicitly or use an expression body                |
| Async call treated as resolved data        | Await it in an appropriate async context                   |
| `forEach(async ...)` expected to wait      | `for...of` + `await`, or bounded concurrent work           |
| `\|\|` replaces valid zero/false/empty input | Use `??` for nullish fallback                            |
| Shared nested data changed after spreading | Copy the nested branch being updated                       |
| Fetch treats HTTP errors as success        | Check `response.ok` and handle parsing/network errors      |
| Accessing missing values                   | Validate, narrow, or use a deliberate optional/default path |
| Lost method receiver                       | Bind, wrap, or use a correctly scoped arrow                |
| User input inserted as HTML                | Use `textContent`/created nodes for text                   |
| Broken/corrupt stored JSON crashes startup | Catch syntax/storage errors and validate shape             |
| Error caught and ignored without recovery  | Report, recover deliberately, or propagate                 |

Missing-return experiment (standalone `src/js/main.js` snippet):

```js
const numbers = [1, 2, 3];
const broken = numbers.map((number) => {
  number * 2;
});
const fixed = numbers.map((number) => number * 2);
console.log(broken); // [undefined, undefined, undefined]
console.log(fixed); // [2, 4, 6]
```

### Suggested refresher order

| Phase                        | Focus                                                                    |
|------------------------------|--------------------------------------------------------------------------|
| 1. Fundamentals              | Variables, types, operators, conditions, loops, functions                |
| 2. Data and functions        | Arrays/objects, destructuring, spread/rest, methods, scope, closures      |
| 3. Modern language patterns  | Modules, optional chaining/defaults, classes, `this`, prototypes          |
| 4. Async work                | Callbacks, promises, async/await, fetch, errors, combinators, event loop  |
| 5. Browser development       | DOM, events, forms, JSON, localStorage, modules, Vite                     |
| 6. Browser project structure | Modules, package tooling, file import/export, runtime boundaries          |
| 7. TypeScript                | Types, interfaces/aliases, unions, generics, narrowing, utility types     |

Reading restores familiarity; building and modifying examples restores fluency. Use the task manager to make the concepts work together rather than memorizing unrelated syntax.

### Final mental checklist

When facing a problem, ask which concept is involved:

- Is this an array transformation or search?
- Does this need a closure or a reusable higher-order function?
- Is this asynchronous, and am I handling its Promise?
- Are multiple references reaching the same mutable object?
- Should this be separated into a module?
- Is this a browser API or a Node runtime API?
- Is this a compile-time type question or runtime validation?

Understand the concept, look up exact syntax when needed, and practice until the common patterns are familiar.

## References

- [MDN JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [MDN array reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [MDN this reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
- [MDN fetch guide](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [MDN structuredClone](https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone)
- [Vite guide](https://vite.dev/guide/)
- [pnpm commands](https://pnpm.io/pnpm-cli)
