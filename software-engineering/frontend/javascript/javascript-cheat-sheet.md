# JavaScript Cheat Sheet (Modern ES6+)

[Back to JavaScript topic Index](./README.md)

A refined, up-to-date reference covering modern JavaScript syntax and built-ins.

---

## Table of Contents

- [JavaScript Cheat Sheet (Modern ES6+)](#javascript-cheat-sheet-modern-es6)
  - [Table of Contents](#table-of-contents)
  - [Data Types](#data-types)
  - [Variables](#variables)
  - [Operators](#operators)
    - [Arithmetic](#arithmetic)
    - [Assignment](#assignment)
    - [Comparison](#comparison)
    - [Logical](#logical)
    - [Other Modern Operators](#other-modern-operators)
  - [Control Structures](#control-structures)
    - [if / else / else if](#if--else--else-if)
    - [switch](#switch)
    - [Ternary](#ternary)
  - [Loops](#loops)
  - [Functions](#functions)
  - [Arrow Functions](#arrow-functions)
  - [Destructuring \& Spread/Rest](#destructuring--spreadrest)
  - [Template Literals](#template-literals)
  - [Classes](#classes)
  - [Modules](#modules)
  - [Array Methods](#array-methods)
  - [String Methods](#string-methods)
  - [Object Methods](#object-methods)
  - [Numbers \& Math](#numbers--math)
  - [Dates](#dates)
  - [Promises \& Async/Await](#promises--asyncawait)
    - [fetch API](#fetch-api)
  - [Map, Set, WeakMap, WeakSet](#map-set-weakmap-weakset)
  - [Regular Expressions](#regular-expressions)
  - [DOM Event Handlers](#dom-event-handlers)
  - [Reserved Words](#reserved-words)

---

## Data Types

**Primitive types:** `String`, `Number`, `BigInt`, `Boolean`, `undefined`, `null`, `Symbol`

**Reference (composite) types:** `Object`, `Array`, `Function`, `Date`, `Map`, `Set`, etc.

| Type      | Description                                                             |
| --------- | ----------------------------------------------------------------------- |
| Number    | All numbers (int & float) are a single `Number` type (double-precision) |
| BigInt    | Arbitrary-precision integers, e.g. `123n`                               |
| String    | Text, single/double quotes or backticks                                 |
| Boolean   | `true` / `false`                                                        |
| undefined | Declared but no value assigned                                          |
| null      | Intentional absence of value                                            |
| Symbol    | Unique, immutable identifier                                            |
| Object    | Key-value collection                                                    |

```js
typeof 42; // "number"
typeof "hi"; // "string"
typeof true; // "boolean"
typeof undefined; // "undefined"
typeof null; // "object" (a known JS quirk)
typeof Symbol(); // "symbol"
typeof 10n; // "bigint"
```

---

## Variables

Use `let` and `const` instead of `var` (block-scoped, avoids hoisting pitfalls).

```js
let count = 0; // mutable, block-scoped
const name = "Ada"; // immutable binding, block-scoped
var legacy = true; // function-scoped (avoid in modern code)
```

**Rules for naming:**

- Cannot be a reserved word
- Must start with a letter, `_`, or `$`
- Case-sensitive (`x` ≠ `X`)
- No spaces

---

## Operators

### Arithmetic

| Operator    | Description                   |
| ----------- | ----------------------------- |
| `+`         | Addition                      |
| `-`         | Subtraction                   |
| `*`         | Multiplication                |
| `/`         | Division                      |
| `%`         | Modulus (remainder)           |
| `**`        | Exponentiation (`2 ** 3` = 8) |
| `++` / `--` | Increment / decrement         |

### Assignment

| Operator                       | Description                   |
| ------------------------------ | ----------------------------- |
| `=`                            | Assign                        |
| `+=` `-=` `*=` `/=` `%=` `**=` | Compound assignment           |
| `&&=`                          | Logical AND assignment        |
| `\|\|=`                        | Logical OR assignment         |
| `??=`                          | Nullish coalescing assignment |

### Comparison

| Operator          | Description                                  |
| ----------------- | -------------------------------------------- |
| `==`              | Equal (loose, type coercion)                 |
| `===`             | Strictly equal (no coercion) — **preferred** |
| `!=`              | Not equal (loose)                            |
| `!==`             | Strictly not equal — **preferred**           |
| `>` `>=` `<` `<=` | Greater/less than (or equal)                 |

### Logical

| Operator | Description                                                                |
| -------- | -------------------------------------------------------------------------- |
| `&&`     | Logical AND                                                                |
| `\|\|`   | Logical OR                                                                 |
| `!`      | Logical NOT                                                                |
| `??`     | Nullish coalescing (returns right side only if left is `null`/`undefined`) |

### Other Modern Operators

| Operator | Description                                 |
| -------- | ------------------------------------------- |
| `?.`     | Optional chaining, e.g. `obj?.prop?.nested` |
| `...`    | Spread / rest                               |
| `?:`     | Ternary conditional                         |

```js
const user = null;
const city = user?.address?.city ?? "Unknown"; // "Unknown"
```

---

## Control Structures

### if / else / else if

```js
if (score >= 90) {
  grade = "A";
} else if (score >= 80) {
  grade = "B";
} else {
  grade = "F";
}
```

### switch

```js
switch (colorChoice) {
  case "red":
    document.body.style.background = "red";
    break;
  case "blue":
    document.body.style.background = "blue";
    break;
  default:
    document.body.style.background = "white";
}
```

### Ternary

```js
const message = score >= 65 ? "Pass" : "Fail";
```

---

## Loops

```js
// for
for (let i = 0; i <= 10; i++) {
  console.log(`Line ${i}`);
}

// while
let i = 0;
while (i <= 10) {
  console.log(i);
  i++;
}

// do...while
let j = 0;
do {
  console.log(j);
  j++;
} while (j <= 10);

// for...of (iterate values — arrays, strings, maps, sets)
for (const value of [10, 20, 30]) {
  console.log(value);
}

// for...in (iterate enumerable keys of an object)
for (const key in { a: 1, b: 2 }) {
  console.log(key);
}

// array iteration methods (preferred for arrays)
[1, 2, 3].forEach((n) => console.log(n));
```

> ⚠️ Watch out for infinite loops — always ensure the stopping condition is reachable.

---

## Functions

```js
// function declaration
function kilosToPounds(kilos) {
  return kilos * 2.2046;
}

// function expression
const kilosToPounds = function (kilos) {
  return kilos * 2.2046;
};

// default parameters
function greet(name = "friend") {
  return `Hello, ${name}!`;
}

// rest parameters
function sum(...nums) {
  return nums.reduce((total, n) => total + n, 0);
}
```

## Arrow Functions

```js
const add = (a, b) => a + b;
const square = (n) => n * n;
const sayHi = () => console.log("hi");

// Note: arrow functions do not bind their own `this`
```

---

## Destructuring & Spread/Rest

```js
// array destructuring
const [first, second] = [1, 2];

// object destructuring
const { name, age } = { name: "Ada", age: 30 };

// with defaults and renaming
const { name: userName = "Guest" } = {};

// spread — expand an iterable
const arr2 = [...arr1, 4, 5];
const merged = { ...obj1, ...obj2 };

// rest — collect remaining items
const [head, ...tail] = [1, 2, 3, 4];
```

---

## Template Literals

```js
const name = "Ada";
const greeting = `Hello, ${name}!`;

// multi-line strings
const html = `
  <div>
    <p>${greeting}</p>
  </div>
`;
```

---

## Classes

```js
class Person {
  #privateField; // private class field

  constructor(name, age) {
    this.name = name;
    this.age = age;
    this.#privateField = "secret";
  }

  greet() {
    return `Hi, I'm ${this.name}`;
  }

  static create(name, age) {
    return new Person(name, age);
  }

  get info() {
    return `${this.name} (${this.age})`;
  }
}

class Student extends Person {
  constructor(name, age, school) {
    super(name, age);
    this.school = school;
  }
}
```

---

## Modules

```js
// export
export const PI = 3.14159;
export function add(a, b) {
  return a + b;
}
export default class MyClass {}

// import
import MyClass, { PI, add } from "./myModule.js";
import * as utils from "./utils.js";
```

---

## Array Methods

| Method                               | Description                              |
| ------------------------------------ | ---------------------------------------- |
| `push()` / `pop()`                   | Add/remove from end                      |
| `unshift()` / `shift()`              | Add/remove from start                    |
| `slice(start, end)`                  | Extract a section (non-mutating)         |
| `splice(start, count, ...items)`     | Insert/remove/replace (mutating)         |
| `concat()`                           | Merge arrays                             |
| `join(separator)`                    | Join into a string                       |
| `reverse()`                          | Reverse in place                         |
| `sort(compareFn)`                    | Sort (mutating)                          |
| `indexOf()` / `lastIndexOf()`        | Find index of a value                    |
| `includes(value)`                    | Check for presence (boolean)             |
| `find(fn)`                           | First matching element                   |
| `findIndex(fn)`                      | Index of first match                     |
| `findLast(fn)` / `findLastIndex(fn)` | Last match (from end)                    |
| `filter(fn)`                         | New array of matching elements           |
| `map(fn)`                            | New array with transformed elements      |
| `reduce(fn, init)`                   | Reduce to a single value                 |
| `reduceRight(fn, init)`              | Reduce from the right                    |
| `forEach(fn)`                        | Execute fn for each element              |
| `some(fn)` / `every(fn)`             | Test elements (boolean)                  |
| `flat(depth)`                        | Flatten nested arrays                    |
| `flatMap(fn)`                        | Map then flatten one level               |
| `fill(value)`                        | Fill with a static value                 |
| `at(index)`                          | Access element (supports negative index) |
| `Array.from(iterable)`               | Create array from iterable/array-like    |
| `Array.of(...items)`                 | Create array from arguments              |
| `Array.isArray(value)`               | Check if value is an array               |

```js
[1, 2, 3].map((n) => n * 2); // [2, 4, 6]
[1, 2, 3].filter((n) => n > 1); // [2, 3]
[1, 2, 3].reduce((a, b) => a + b); // 6
[1, [2, [3, 4]]].flat(2); // [1, 2, 3, 4]
```

---

## String Methods

| Method                                 | Description                          |
| -------------------------------------- | ------------------------------------ |
| `charAt(i)` / `at(i)`                  | Character at index                   |
| `charCodeAt()` / `codePointAt()`       | Character code                       |
| `String.fromCharCode()`                | Build string from codes              |
| `concat()`                             | Join strings                         |
| `includes()`                           | Check substring presence             |
| `startsWith()` / `endsWith()`          | Check prefix/suffix                  |
| `indexOf()` / `lastIndexOf()`          | Find substring index                 |
| `slice()` / `substring()`              | Extract a section                    |
| `split(separator)`                     | Split into an array                  |
| `replace()` / `replaceAll()`           | Replace substring(s), supports regex |
| `match()` / `matchAll()`               | Match against a regex                |
| `search()`                             | Search using regex                   |
| `trim()` / `trimStart()` / `trimEnd()` | Remove whitespace                    |
| `padStart()` / `padEnd()`              | Pad to a target length               |
| `repeat(n)`                            | Repeat the string                    |
| `toUpperCase()` / `toLowerCase()`      | Change case                          |
| `localeCompare()`                      | Locale-aware comparison              |
| `length`                               | Number of characters (property)      |

```js
`  Hello  `.trim(); // "Hello"
"5".padStart(3, "0"); // "005"
"abc".repeat(3); // "abcabcabc"
"Hello World".replaceAll("o", "0"); // "Hell0 W0rld"
```

---

## Object Methods

| Method                              | Description                            |
| ----------------------------------- | -------------------------------------- |
| `Object.keys(obj)`                  | Array of keys                          |
| `Object.values(obj)`                | Array of values                        |
| `Object.entries(obj)`               | Array of `[key, value]` pairs          |
| `Object.assign(target, ...sources)` | Merge objects                          |
| `Object.freeze(obj)`                | Prevent modification                   |
| `Object.isFrozen(obj)`              | Check if frozen                        |
| `Object.fromEntries(entries)`       | Build object from entries              |
| `Object.getPrototypeOf(obj)`        | Get the prototype                      |
| `Object.defineProperty()`           | Define a property with descriptors     |
| `hasOwnProperty(key)`               | Check own property                     |
| `Object.hasOwn(obj, key)`           | Modern alternative to `hasOwnProperty` |
| `structuredClone(obj)`              | Deep clone an object                   |

```js
const obj = { a: 1, b: 2 };
Object.entries(obj); // [["a",1],["b",2]]
const clone = structuredClone(obj);
```

---

## Numbers & Math

| Method/Property                    | Description                                       |
| ---------------------------------- | ------------------------------------------------- |
| `Number.isInteger()`               | Check integer                                     |
| `Number.isFinite()` / `isFinite()` | Check finite                                      |
| `Number.isNaN()` / `isNaN()`       | Check NaN                                         |
| `parseInt()` / `parseFloat()`      | Parse strings to numbers                          |
| `toFixed(n)`                       | Format with n decimal places                      |
| `toPrecision(n)`                   | Format with n significant digits                  |
| `toString(radix)`                  | Convert to string in a given base                 |
| `Number.MAX_SAFE_INTEGER`          | Largest safely representable integer              |
| `Number.EPSILON`                   | Smallest difference between representable numbers |

**Math object:**

```js
Math.abs(-5); // 5
Math.round(4.5); // 5
Math.ceil(4.1); // 5
Math.floor(4.9); // 4
Math.max(1, 2, 3); // 3
Math.min(1, 2, 3); // 1
Math.random(); // 0 to <1
Math.sqrt(16); // 4
Math.pow(2, 3); // 8 (or use 2 ** 3)
Math.PI; // 3.14159...
```

---

## Dates

```js
const now = new Date();
new Date("2026-07-30");
new Date(2026, 6, 30); // month is 0-indexed (6 = July)

now.getFullYear();
now.getMonth(); // 0-11
now.getDate(); // day of month
now.getDay(); // day of week (0-6)
now.getHours();
now.getMinutes();
now.getSeconds();
now.getTime(); // ms since epoch

now.toISOString();
now.toLocaleDateString();
now.toLocaleTimeString();

Date.now(); // current timestamp (ms)
```

> Note: Native `Date` has many quirks. For serious date handling, consider libraries like `date-fns` or `Luxon` (Moment.js is now legacy/deprecated).

---

## Promises & Async/Await

```js
// Promise
function fetchData() {
  return new Promise((resolve, reject) => {
    // async work...
    if (success) resolve(data);
    else reject(error);
  });
}

fetchData()
  .then((data) => console.log(data))
  .catch((err) => console.error(err))
  .finally(() => console.log("done"));

// async/await (preferred)
async function loadData() {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}

// combinators
Promise.all([p1, p2, p3]); // fails fast if any reject
Promise.allSettled([p1, p2, p3]); // waits for all, no fail-fast
Promise.race([p1, p2, p3]); // resolves/rejects with the first settled
Promise.any([p1, p2, p3]); // resolves with the first fulfilled
```

### fetch API

```js
const response = await fetch("https://api.example.com/data");
const json = await response.json();
```

---

## Map, Set, WeakMap, WeakSet

```js
// Map — key-value pairs, any key type
const map = new Map();
map.set("a", 1);
map.get("a"); // 1
map.has("a"); // true
map.delete("a");
map.size;
for (const [key, value] of map) {
  /* ... */
}

// Set — unique values
const set = new Set([1, 2, 2, 3]); // {1, 2, 3}
set.add(4);
set.has(2); // true
set.delete(2);
[...set]; // convert to array

// WeakMap / WeakSet — keys must be objects, garbage-collectable
const wm = new WeakMap();
```

---

## Regular Expressions

```js
/pattern/flags
new RegExp("pattern", "flags");
```

| Flag | Description         |
| ---- | ------------------- |
| `g`  | Global match        |
| `i`  | Case-insensitive    |
| `m`  | Multi-line          |
| `s`  | Dot matches newline |
| `u`  | Unicode mode        |
| `y`  | Sticky mode         |

| Syntax         | Meaning                     |
| -------------- | --------------------------- |
| `^`            | Start of string             |
| `$`            | End of string               |
| `.`            | Any character               |
| `\d` `\D`      | Digit / non-digit           |
| `\w` `\W`      | Word char / non-word char   |
| `\s` `\S`      | Whitespace / non-whitespace |
| `*`            | 0 or more                   |
| `+`            | 1 or more                   |
| `?`            | 0 or 1                      |
| `{n,m}`        | Between n and m             |
| `(...)`        | Capture group               |
| `(?:...)`      | Non-capturing group         |
| `(?<name>...)` | Named capture group         |
| `[abc]`        | Character class             |
| `[^abc]`       | Negated character class     |
| `a\|b`         | Alternation                 |

```js
const re = /(\d{3})-(\d{4})/;
"555-1234".match(re);
"555-1234".replace(re, "$2-$1"); // "1234-555"
```

---

## DOM Event Handlers

Common event names used with `addEventListener()`:

| Category | Events                                                                                                        |
| -------- | ------------------------------------------------------------------------------------------------------------- |
| Mouse    | `click`, `dblclick`, `mousedown`, `mouseup`, `mousemove`, `mouseover`, `mouseout`, `mouseenter`, `mouseleave` |
| Keyboard | `keydown`, `keyup`, `keypress`                                                                                |
| Form     | `submit`, `change`, `input`, `focus`, `blur`, `reset`, `select`                                               |
| Window   | `load`, `resize`, `scroll`, `unload`, `beforeunload`                                                          |
| Drag     | `dragstart`, `dragover`, `drop`, `dragend`                                                                    |
| Touch    | `touchstart`, `touchmove`, `touchend`                                                                         |

```js
button.addEventListener("click", (event) => {
  console.log("Clicked!", event.target);
});
```

---

## Reserved Words

```
break case catch class const continue debugger default
delete do else export extends false finally for function
if import in instanceof new null return super switch this
throw true try typeof var void while with yield
let static async await
```
