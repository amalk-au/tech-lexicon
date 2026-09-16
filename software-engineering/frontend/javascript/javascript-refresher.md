# JavaScript Refresher

[Back to JavaScript topic Index](./README.md)

A practical refresher for developers returning to JavaScript after a break or preparing to move into TypeScript, React, Node.js, or full-stack development.

This guide is intended as a **reference and memory refresher**, not a complete JavaScript course. Use it to rebuild familiarity with the language, then reinforce the concepts by writing code.

---

## 1\. The JavaScript Mental Model

A useful way to think about JavaScript is:

```text
Values
  ↓
Variables
  ↓
Expressions
  ↓
Statements
  ↓
Functions
  ↓
Objects and Arrays
  ↓
Modules
  ↓
Asynchronous Programming
  ↓
Runtime APIs
```

JavaScript is the **programming language**.

The browser and Node.js are **runtime environments** that provide additional APIs.

For example:

```js
const name = "Developer";
```

is JavaScript.

```js
document.querySelector("h1");
```

uses the browser's DOM API.

```js
process.env.DATABASE_URL;
```

uses a Node.js runtime API.

A good mental model is:

> **JavaScript is the language; the runtime provides additional capabilities.**

---

# 2\. Variables

Modern JavaScript primarily uses `const` and `let`.

```js
const name = "Developer";
let age = 30;

age = 31;
```

### `const`

`const` prevents reassignment of the variable binding:

```js
const age = 30;

age = 31; // Error
```

It does **not** make an object immutable:

```js
const user = {
  name: "Developer",
};

user.name = "Another Developer"; // Allowed
```

### `let`

Use `let` when reassignment is required:

```js
let count = 0;

count++;
```

### `var`

Understand `var` because you will encounter it in older code, but prefer `const` and `let` in modern JavaScript.

A useful rule:

```text
const → default
let   → when reassignment is required
var   → generally avoid in new code
```

---

# 3\. JavaScript Types

The primitive types are:

```text
string
number
bigint
boolean
undefined
null
symbol
```

Examples:

```js
const name = "Developer";
const age = 30;
const largeNumber = 123n;
const active = true;

let value;
const nothing = null;
```

Objects, arrays, functions, dates, maps, sets, and other structures are non-primitive values.

---

# 4\. `typeof`

`typeof` is useful when inspecting values:

```js
typeof "hello"; // "string"
typeof 123; // "number"
typeof true; // "boolean"
typeof undefined; // "undefined"
typeof {}; // "object"
typeof []; // "object"
typeof function () {}; // "function"
```

One famous JavaScript quirk:

```js
typeof null; // "object"
```

This is a historical behavior that cannot simply be changed without breaking existing code.

---

# 5\. Strings

Template literals are heavily used in modern JavaScript:

```js
const name = "Developer";

const message = `Hello, ${name}!`;
```

Useful string operations:

```js
const text = "JavaScript";

text.length;
text.toUpperCase();
text.toLowerCase();
text.includes("Script");
text.startsWith("Java");
text.endsWith("Script");
text.slice(0, 4);
text.trim();
text.split("");
```

Strings are immutable.

```js
const text = "hello";

const upper = text.toUpperCase();
```

The original string was not modified; a new string was returned.

---

# 6\. Numbers

JavaScript's normal numeric type is `number`.

```js
const price = 19.99;
const count = 10;
```

Useful methods:

```js
Math.round(4.6);
Math.floor(4.9);
Math.ceil(4.1);
Math.max(1, 5, 3);
Math.min(1, 5, 3);
Math.random();
```

Floating-point arithmetic can produce surprising results:

```js
0.1 + 0.2;
// 0.30000000000000004
```

This occurs because JavaScript numbers use IEEE 754 floating-point representation.

For financial or other precision-sensitive applications, understand the limitations of binary floating-point arithmetic and choose an appropriate representation.

---

# 7\. Truthiness

The main falsy values are:

```text
false
0
-0
0n
''
null
undefined
NaN
```

Most other values are truthy.

For example:

```js
if (name) {
  console.log("A value exists");
}
```

This is common:

```js
const username = input || "Guest";
```

But understand the difference between `||` and `??`.

```js
const count = 0 || 10;
// 10

const count2 = 0 ?? 10;
// 0
```

`??` falls back only when the value is:

```text
null
undefined
```

---

# 8\. Equality and Comparison

Prefer strict equality:

```js
===
!==
```

rather than loose equality:

```js
==
!=
```

Examples:

```js
5 === 5; // true
5 === "5"; // false

5 == "5"; // true
```

Strict equality does not perform the same implicit type coercion as loose equality.

---

# 9\. Operators

### Arithmetic

```js
+
-
*
/
%
**
```

### Comparison

```js
>
<
>=
<=
===
!==
```

### Logical

```js
&&
||
!
??
```

### Assignment

```js
=
+=
-=
*=
/=
```

### Increment / decrement

```js
count++;
count--;
```

### Ternary operator

```js
const message = age >= 18 ? "Adult" : "Minor";
```

Use the ternary operator for simple expressions. Avoid deeply nested ternaries.

---

# 10\. Conditionals

```js
if (age >= 18) {
  console.log("Adult");
} else if (age >= 13) {
  console.log("Teenager");
} else {
  console.log("Child");
}
```

`switch` can be useful when comparing one value against several known cases:

```js
switch (role) {
  case "admin":
    console.log("Admin");
    break;

  case "user":
    console.log("User");
    break;

  default:
    console.log("Unknown");
}
```

---

# 11\. Loops

### `for`

```js
for (let i = 0; i < 5; i++) {
  console.log(i);
}
```

### `while`

```js
let i = 0;

while (i < 5) {
  console.log(i);
  i++;
}
```

### `for...of`

Use `for...of` to iterate over values:

```js
const numbers = [10, 20, 30];

for (const number of numbers) {
  console.log(number);
}
```

### `for...in`

Use `for...in` to iterate over enumerable keys:

```js
const user = {
  name: "Developer",
  age: 30,
};

for (const key in user) {
  console.log(key, user[key]);
}
```

Remember:

```text
for...of → values
for...in → keys
```

---

# 12\. Functions

### Function declaration

```js
function add(a, b) {
  return a + b;
}
```

### Arrow function

```js
const add = (a, b) => {
  return a + b;
};
```

### Concise arrow function

```js
const add = (a, b) => a + b;
```

### No parameters

```js
const greet = () => {
  console.log("Hello");
};
```

### One parameter

```js
const double = (value) => value * 2;
```

Functions are first-class values in JavaScript. They can be:

- stored in variables

- passed as arguments

- returned from other functions

- stored in objects and arrays

---

# 13\. Scope

JavaScript uses lexical scoping.

```js
function greet() {
  const message = "Hello";

  console.log(message);
}

console.log(message); // Error
```

Block scope:

```js
if (true) {
  const x = 10;
}

console.log(x); // Error
```

Inner scopes can access variables from outer scopes:

```js
const x = 10;

function test() {
  console.log(x); // Works
}
```

Outer scopes cannot access variables declared inside inner scopes.

---

# 14\. Closures

A closure occurs when a function retains access to variables from its surrounding lexical scope.

```js
function createCounter() {
  let count = 0;

  return function () {
    count++;
    return count;
  };
}

const counter = createCounter();

counter(); // 1
counter(); // 2
counter(); // 3
```

The returned function still has access to `count`.

Closures are fundamental to:

```text
callbacks
event handlers
factories
middleware
private state
React components and hooks
```

---

# 15\. Arrays

Create an array:

```js
const numbers = [1, 2, 3, 4, 5];
```

Access values:

```js
numbers[0];
numbers[2];
numbers.length;
```

Modify arrays:

```js
numbers.push(6);
numbers.pop();
numbers.unshift(0);
numbers.shift();
```

Important array methods:

```text
map
filter
find
findIndex
some
every
reduce
includes
sort
slice
splice
forEach
```

---

# 16\. `map`

`map` transforms every element and returns a new array.

```js
const numbers = [1, 2, 3];

const doubled = numbers.map((number) => number * 2);

// [2, 4, 6]
```

Mental model:

```text
input array
    ↓
mapping function
    ↓
new array
```

---

# 17\. `filter`

`filter` returns the elements that satisfy a condition.

```js
const numbers = [1, 2, 3, 4, 5];

const even = numbers.filter((number) => number % 2 === 0);

// [2, 4]
```

---

# 18\. `find`

`find` returns the first matching element.

```js
const users = [
  { id: 1, name: "Developer One" },
  { id: 2, name: "Developer Two" },
];

const user = users.find((user) => user.id === 2);
```

Result:

```js
{
  id: 2,
  name: 'Developer Two',
}
```

If there is no match, `find()` returns `undefined`.

---

# 19\. `some` and `every`

```js
const numbers = [1, 2, 3, 4];

numbers.some((number) => number > 3);
// true

numbers.every((number) => number > 0);
// true
```

Use `some` when you want to know whether **at least one** item matches.

Use `every` when you want to know whether **all** items match.

---

# 20\. `reduce`

`reduce` combines multiple values into one result.

```js
const numbers = [1, 2, 3, 4];

const total = numbers.reduce((sum, number) => sum + number, 0);
```

Result:

```text
10
```

Mental model:

```text
many values
    ↓
reduce
    ↓
one result
```

`reduce` is powerful, but don't use it when `map`, `filter`, `find`, or a simple loop communicates the intent more clearly.

---

# 21\. Objects

```js
const user = {
  name: "Developer",
  age: 30,
  active: true,
};
```

Access properties:

```js
user.name;
user["name"];
```

Modify properties:

```js
user.age = 31;
user.city = "Melbourne";
```

Delete a property:

```js
delete user.city;
```

---

# 22\. Object Utilities

Useful built-in methods:

```js
Object.keys(user);
Object.values(user);
Object.entries(user);
```

Example:

```js
Object.entries(user).forEach(([key, value]) => {
  console.log(key, value);
});
```

---

# 23\. Destructuring

### Objects

```js
const user = {
  name: "Developer",
  age: 30,
};

const { name, age } = user;
```

### Arrays

```js
const numbers = [10, 20];

const [first, second] = numbers;
```

Destructuring is used extensively in modern JavaScript, React, and Node.js.

---

# 24\. Spread Syntax

Spread expands iterable or object values.

### Objects

```js
const user = {
  name: "Developer",
  age: 30,
};

const updatedUser = {
  ...user,
  age: 31,
};
```

### Arrays

```js
const first = [1, 2];
const second = [3, 4];

const combined = [...first, ...second];
```

A useful mental model:

```text
spread → expand
```

---

# 25\. Rest Parameters

Rest looks similar to spread but collects values.

```js
function sum(...numbers) {
  return numbers.reduce((total, number) => total + number, 0);
}
```

A useful distinction:

```text
spread → expand
rest   → collect
```

---

# 26\. Optional Chaining

Optional chaining safely accesses nested properties:

```js
const city = user?.address?.city;
```

Without optional chaining, accessing a property on `undefined` or `null` can throw an error.

Optional chaining can also be used for function calls:

```js
callback?.();
```

---

# 27\. Nullish Coalescing

```js
const name = user.name ?? "Guest";
```

The fallback is used only when the left side is:

```text
null
undefined
```

This is different from `||`, which also treats values such as `0`, `false`, and `''` as falsy.

---

# 28\. Classes

JavaScript supports classes:

```js
class User {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return `Hello ${this.name}`;
  }
}

const user = new User("Developer");

user.greet();
```

Understand classes, but don't assume every JavaScript application needs them.

JavaScript also works very naturally with:

```text
functions
objects
closures
modules
composition
```

Many modern codebases use those patterns extensively.

---

# 29\. `this`

`this` depends on how a function is called.

Object method:

```js
const user = {
  name: "Developer",

  greet() {
    console.log(this.name);
  },
};

user.greet();
```

Here `this` refers to the object used to call the method.

Arrow functions are different:

```js
const user = {
  name: "Developer",

  greet: () => {
    console.log(this.name);
  },
};
```

Arrow functions do not create their own `this`; they capture it lexically from the surrounding scope.

Understanding `this` is important for:

```text
objects
classes
callbacks
event handlers
Node.js
framework code
```

---

# 30\. Prototypes

JavaScript uses prototype-based inheritance.

```js
const animal = {
  speak() {
    console.log("sound");
  },
};

const dog = Object.create(animal);

dog.speak();
```

`dog` can access `speak` through its prototype chain.

JavaScript classes provide a more familiar syntax for working with prototype-based behavior.

You do not need to memorize the prototype system immediately, but you should understand what prototypes are and how property lookup works.

---

# 31\. Modules

ES modules are fundamental to modern JavaScript.

### Named export

```js
export function add(a, b) {
  return a + b;
}
```

### Named import

```js
import { add } from "./math.js";
```

### Default export

```js
export default function greet() {
  console.log("Hello");
}
```

### Default import

```js
import greet from "./greet.js";
```

Be comfortable with:

```text
import
export
export default
```

Modules are particularly important when working with Vite, React, Node.js, and TypeScript.

---

# 32\. Synchronous vs Asynchronous JavaScript

Synchronous code executes in sequence:

```js
console.log("A");
console.log("B");
console.log("C");
```

Output:

```text
A
B
C
```

Asynchronous operations allow work to be scheduled for later:

```js
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

console.log("C");
```

Output:

```text
A
C
B
```

Even a zero-millisecond timeout does not execute immediately.

This leads to one of the most important concepts in JavaScript: **the event loop**.

---

# 33\. Promises

A Promise represents the eventual result of an asynchronous operation.

```js
const promise = fetch("/api/users");
```

Promises can be handled using:

```js
promise
  .then((response) => response.json())
  .then((users) => {
    console.log(users);
  })
  .catch((error) => {
    console.error(error);
  });
```

A Promise can be:

```text
pending
fulfilled
rejected
```

---

# 34\. `async` / `await`

Modern JavaScript commonly uses `async` / `await`:

```js
async function getUsers() {
  const response = await fetch("/api/users");
  const users = await response.json();

  return users;
}
```

Handle errors with `try` / `catch`:

```js
async function getUsers() {
  try {
    const response = await fetch("/api/users");

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
  }
}
```

Be comfortable with:

```text
Promise
async
await
try
catch
throw
```

---

# 35\. Promise Utilities

Important Promise methods include:

```js
Promise.all();
Promise.allSettled();
Promise.race();
Promise.any();
```

For example:

```js
const [users, posts] = await Promise.all([getUsers(), getPosts()]);
```

The operations can proceed concurrently rather than waiting for one to finish before starting the other.

---

# 36\. Fetch API

A common HTTP request:

```js
const response = await fetch("/api/users");
```

Always consider the response status:

```js
if (!response.ok) {
  throw new Error(`HTTP ${response.status}`);
}
```

Parse JSON:

```js
const data = await response.json();
```

POST request:

```js
await fetch("/api/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "Developer",
  }),
});
```

---

# 37\. The DOM

For browser applications:

```js
document.querySelector("h1");
```

Multiple elements:

```js
document.querySelectorAll(".item");
```

Change text:

```js
element.textContent = "Hello";
```

Classes:

```js
element.classList.add("active");
element.classList.remove("active");
element.classList.toggle("active");
```

Create an element:

```js
const div = document.createElement("div");
```

Append it:

```js
document.body.append(div);
```

---

# 38\. Events

```js
const button = document.querySelector("button");

button.addEventListener("click", () => {
  console.log("Clicked");
});
```

Access the event object:

```js
button.addEventListener("click", (event) => {
  console.log(event);
});
```

Forms:

```js
form.addEventListener("submit", (event) => {
  event.preventDefault();
});
```

---

# 39\. Event Delegation

Instead of attaching listeners to many children, an ancestor can handle events:

```js
container.addEventListener("click", (event) => {
  if (event.target.matches(".delete-button")) {
    console.log("Delete");
  }
});
```

Event delegation becomes particularly useful when working with dynamically generated content.

---

# 40\. JSON

Convert an object to JSON:

```js
const json = JSON.stringify(user);
```

Convert JSON back into a JavaScript value:

```js
const user = JSON.parse(json);
```

JSON is commonly used for:

```text
HTTP APIs
configuration
local storage
data interchange
```

---

# 41\. Local Storage

Store a value:

```js
localStorage.setItem("theme", "dark");
```

Retrieve it:

```js
const theme = localStorage.getItem("theme");
```

Remove it:

```js
localStorage.removeItem("theme");
```

Objects must be serialized:

```js
localStorage.setItem("user", JSON.stringify(user));
```

Read them back:

```js
const storedUser = localStorage.getItem("user");

const user = storedUser ? JSON.parse(storedUser) : null;
```

Remember that values retrieved from `localStorage` are strings, or `null` when the key doesn't exist.

---

# 42\. Error Handling

Basic error handling:

```js
try {
  riskyOperation();
} catch (error) {
  console.error(error);
}
```

Create an error:

```js
throw new Error("Something went wrong");
```

Validation:

```js
if (!email) {
  throw new Error("Email is required");
}
```

For asynchronous code:

```js
try {
  await saveUser();
} catch (error) {
  console.error(error);
}
```

Don't silently swallow errors unless you have a deliberate reason to do so.

---

# 43\. Modules + Async Code

A common real-world pattern:

```js
import { getUsers } from "./api.js";

async function initialize() {
  try {
    const users = await getUsers();

    console.log(users);
  } catch (error) {
    console.error(error);
  }
}

initialize();
```

This pattern combines several core concepts:

```text
modules
functions
Promises
async/await
error handling
```

---

# 44\. Immutability

Instead of modifying an object directly:

```js
user.name = "Updated";
```

you may create a new object:

```js
const updatedUser = {
  ...user,
  name: "Updated",
};
```

For arrays:

```js
const updatedUsers = users.map((user) =>
  user.id === id ? { ...user, name: "Updated" } : user,
);
```

This style is especially important in React and other state-driven systems.

Immutability is a design technique, not a rule that every JavaScript object must literally never change.

---

# 45\. Shallow vs Deep Copy

This is a shallow copy:

```js
const copy = { ...user };
```

Nested objects are still shared:

```js
const original = {
  profile: {
    name: "Developer",
  },
};

const copy = { ...original };

copy.profile.name = "Updated";
```

Now the nested `profile` object is shared.

For supported data structures, `structuredClone()` can create a deep clone:

```js
const copy = structuredClone(original);
```

Use deep cloning deliberately; it is not automatically the right solution for every state-management problem.

---

# 46\. Reference vs Value

Primitive values are copied by value:

```js
let a = 10;
let b = a;

b = 20;
```

`a` remains `10`.

Objects are accessed through references:

```js
const a = {
  value: 10,
};

const b = a;

b.value = 20;
```

Now:

```js
a.value === 20;
```

Both variables refer to the same object.

Understanding this is essential for avoiding accidental mutation.

---

# 47\. `Map` and `Set`

### `Map`

Useful for key/value collections:

```js
const users = new Map();

users.set(1, "Developer One");
users.set(2, "Developer Two");

users.get(1);
users.has(2);
```

### `Set`

Useful when values should be unique:

```js
const numbers = new Set([1, 2, 2, 3]);

console.log(numbers);
```

The duplicate `2` is stored only once.

---

# 48\. Regular Expressions

You don't need to memorize regex syntax, but understand the basics:

```js
const pattern = /^[A-Za-z]+$/;

pattern.test("Developer");
```

Regular expressions are commonly used for:

```text
validation
searching
text extraction
replacement
```

For complex validation, a dedicated validation library or structured parser may be more maintainable than a large regular expression.

---

# 49\. Dates and Time

```js
const now = new Date();

now.getFullYear();
now.getMonth();
now.getDate();
```

JavaScript months are zero-indexed:

```text
0  → January
1  → February
...
11 → December
```

Date/time handling becomes significantly more complicated when time zones are involved.

For serious applications, understand:

```text
UTC
local time
time zones
ISO 8601
timestamps
```

before assuming a `Date` object solves all date/time problems.

---

# 50\. JavaScript, TypeScript and Vite

A modern frontend project often looks like:

```text
index.html
    ↓
TypeScript / JavaScript
    ↓
Vite
    ↓
JavaScript + CSS + assets
    ↓
Browser
```

For example:

```ts
import { add } from "./math";
```

The browser ultimately runs JavaScript; TypeScript is a development-time language/tooling layer that is transformed before execution.

This distinction is important when moving from JavaScript to TypeScript.

---

# 51\. Node.js Basics

Node.js provides JavaScript with server-side runtime capabilities.

Import a built-in module:

```js
import fs from "node:fs/promises";
```

Read a file:

```js
const text = await fs.readFile("file.txt", "utf8");
```

Environment variables:

```js
process.env.DATABASE_URL;
```

Command-line arguments:

```js
process.argv;
```

A common backend stack is:

```text
Node.js
   ↓
HTTP framework
   ↓
REST / API layer
   ↓
Database
```

Examples of Node.js frameworks include Express and Fastify.

---

# 52\. Package Management with pnpm

Install dependencies:

```bash
pnpm install
```

Add a production dependency:

```bash
pnpm add express
```

Add a development dependency:

```bash
pnpm add -D vitest
```

Remove a dependency:

```bash
pnpm remove express
```

Run a package script:

```bash
pnpm dev
```

Run a package without adding it permanently:

```bash
pnpm dlx <package>
```

A committed lockfile should be used to keep dependency versions reproducible.

---

# 53\. Hoisting

Understand hoisting, but don't rely on it.

Example:

```js
console.log(x);

var x = 10;
```

`var` declarations are hoisted differently from `let` and `const`.

This:

```js
console.log(x);

let x = 10;
```

throws because `x` is in the temporal dead zone until its declaration is evaluated.

Modern practice:

```text
prefer const
then let
avoid var in new code
```

---

# 54\. Callbacks

A callback is a function passed to another function:

```js
function greet(name, callback) {
  callback(name);
}

greet("Developer", (name) => {
  console.log(`Hello ${name}`);
});
```

Callbacks appear throughout JavaScript:

```text
array methods
events
timers
Node.js APIs
asynchronous operations
framework code
```

---

# 55\. Higher-Order Functions

A higher-order function either:

- accepts a function as an argument, or

- returns a function.

Examples:

```js
map();
filter();
reduce();
```

and:

```js
function createLogger(prefix) {
  return (message) => {
    console.log(prefix, message);
  };
}
```

Higher-order functions are fundamental to functional patterns used throughout modern JavaScript.

---

# 56\. The Event Loop

A simplified model:

```text
Call Stack
    ↓
Web / Node APIs
    ↓
Queues
    ↓
Event Loop
    ↓
Call Stack
```

Consider:

```js
console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);

Promise.resolve().then(() => {
  console.log("3");
});

console.log("4");
```

The output is:

```text
1
4
3
2
```

Promises use the microtask queue, while `setTimeout` callbacks are scheduled as tasks.

Understanding the event loop is essential for debugging asynchronous JavaScript.

---

# 57\. Common Mistakes

## Accidentally mutating an array

`sort()` mutates the original array:

```js
users.sort();
```

If you want a new array:

```js
const sortedUsers = [...users].sort();
```

## Using `map` when no new array is needed

Avoid:

```js
users.map((user) => {
  console.log(user);
});
```

Use:

```js
users.forEach((user) => {
  console.log(user);
});
```

when the purpose is simply to perform a side effect.

## Forgetting `return`

This produces an array of `undefined`:

```js
const doubled = numbers.map((number) => {
  number * 2;
});
```

Correct:

```js
const doubled = numbers.map((number) => {
  return number * 2;
});
```

or:

```js
const doubled = numbers.map((number) => number * 2);
```

## Forgetting `await`

```js
const users = getUsers();
```

may give you a Promise instead of the resolved users.

Correct:

```js
const users = await getUsers();
```

inside an appropriate async context.

---

# 58\. Core Concepts to Know Before React

Before moving deeply into React, be comfortable with:

```text
✓ const / let
✓ primitive values
✓ objects
✓ arrays
✓ functions
✓ arrow functions
✓ scope
✓ closures
✓ destructuring
✓ spread / rest
✓ map / filter / find / reduce
✓ modules
✓ Promises
✓ async / await
✓ try / catch
✓ fetch
✓ DOM
✓ events
✓ immutability
✓ reference vs value
```

These concepts appear constantly in React applications.

---

# 59\. Suggested Refresher Order

When returning to JavaScript, use a progression rather than trying to memorize everything at once.

### Phase 1 — Fundamentals

```text
Variables
Types
Operators
Conditions
Loops
Functions
```

### Phase 2 — Data and Functions

```text
Arrays
Objects
Destructuring
Spread / rest
Array methods
Scope
Closures
```

### Phase 3 — Modern JavaScript

```text
Modules
Optional chaining
Nullish coalescing
Classes
this
Prototypes
```

### Phase 4 — Asynchronous JavaScript

```text
Callbacks
Promises
async / await
fetch
Error handling
Promise utilities
Event loop
```

### Phase 5 — Browser Development

```text
DOM
Events
Forms
JSON
localStorage
Modules
Vite
```

### Phase 6 — Node.js

```text
Node.js
Modules
Package management
Environment variables
File system
HTTP
APIs
```

### Phase 7 — TypeScript

Once the JavaScript fundamentals feel comfortable:

```text
Basic types
Interfaces
Type aliases
Unions
Generics
Narrowing
Functions
Objects
Modules
Utility types
```

---

# 60\. Rebuild Your Skills by Building

Reading a reference is useful, but writing code is what restores fluency.

A good first project is a small **Task Manager**.

Suggested stack:

```text
HTML
CSS
JavaScript / TypeScript
Vite
localStorage
```

Features:

```text
Add task
Edit task
Delete task
Complete task
Filter tasks
Search tasks
Persist tasks
```

This forces you to practice:

```text
variables
functions
arrays
objects
map
filter
find
events
DOM manipulation
forms
modules
JSON
localStorage
state management
```

Once that works, build a second version with a backend:

```text
Browser
   ↓
fetch()
   ↓
Node.js
   ↓
REST API
   ↓
PostgreSQL
```

That progression rebuilds practical programming ability much faster than passively rereading syntax.

---

# Final Mental Checklist

When looking at a problem, try to recognize the underlying concept before worrying about exact syntax.

```text
"This is an array transformation."
"This needs a closure."
"This is asynchronous."
"This is a Promise."
"This is a reference-sharing problem."
"This should be a module."
"This is browser API functionality."
"This belongs in the Node.js runtime."
"This is a type-safety problem."
```

Once the mental patterns become familiar again, the syntax becomes much easier to retrieve.

> **Understand the concept first. Look up syntax when necessary. Practice until the common patterns become automatic.**
