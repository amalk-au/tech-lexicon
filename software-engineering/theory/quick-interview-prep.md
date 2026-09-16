## JavaScript Technical Interview Prep

[Back to the topic index](./README.md)

## Object-Oriented Programming (OOP) in JavaScript

- **Classes/Objects**: ES6 `class` syntax creates blueprints; objects are their instances.
- **Methods**: Functions within classes or as prototype methods.
- **Properties**: State/data attached to object instances.
- **Inheritance**: Use `extends` keyword; child classes inherit parent properties and methods.
- **Polymorphism**: Method overriding in subclasses enables objects to be used via parent references.
- **Encapsulation**: Private fields (`#field`) or closure patterns protect data.
- **Abstraction**: Only expose necessary API (public interface) of classes.

## Object-Oriented Programming (OOP)

### What is the structure of object-oriented programming?

The structure, or building blocks, of OOP include:

- **Classes**: User-defined data types that act as blueprints for individual objects, attributes, and methods.
- **Objects**: Instances of a class created with specifically defined data. Objects can correspond to real-world objects or an abstract entity.
- **Methods**: Functions defined inside a class that describe the behaviors of an object. Each method references the instance object.
- **Attributes**: Defined in the class template and represent the state of an object. Class attributes belong to the class itself.

---

```js
class Animal {
  #energy = 100;
  speak() {
    console.log("Makes a sound");
  }
}
class Cat extends Animal {
  speak() {
    console.log("Meow");
  }
}
```

## Essential JavaScript Data Structures

- **Array**: `let arr = [1, 2, 3]` — for ordered collections and most standard algorithms.
- **Object**: `let obj = { key: 'value' }` — for key-value pairs (hash maps).
- **Map**: `let map = new Map()` — for ordered, iterable key-value pairs with any data type as keys.
- **Set**: `let set = new Set([1, 2, 3])` — stores unique items.
- **Stack**: `arr.push(x), arr.pop()` — LIFO; use array methods.
- **Queue**: `arr.push(x), arr.shift()` — FIFO; use array or build a Queue class.
- **Linked List**: Custom implementation using classes and pointers.
- **Tree / Binary Tree / BST**: Node classes, recursive algorithms for traversals (DFS, BFS).
- **Graph**: Adjacency list via objects/maps.
- **Heap**: Implemented via arrays and custom functions (no built-in structure in JS).

## JavaScript Algorithms to Know

- **Search Algorithms**: Linear search, binary search (on sorted arrays), hash map lookup.
- **Sorting Algorithms**: Bubble sort, insertion sort, selection sort, quicksort, mergesort (all can be coded in JS arrays).
- **Recursion**: Essential for trees/graphs—be able to write recursive solutions.
- **Breadth-First and Depth-First Traversal**: For trees and graphs.
- **Dynamic Programming**: Use objects/arrays for memoization and tabulation.

## Language Concepts and Interview Patterns

- **Scope, Closures, Hoisting**: Understand how `let`, `const`, `var` work, and closures for encapsulation.
- **`this` Keyword**: Context binding for object methods, arrow functions.
- **Callbacks, Promises, Async/Await**: Fluency with asynchronous programming.
- **Functional Programming**: Array methods (`map`, `filter`, `reduce`), pure functions.
- **Error Handling**: Try/catch; handling edge cases.

## Interview Coding Tips

- Communicate: Ask for clarifications, talk through approach.
- Be clear: Name functions/variables meaningfully, use whitespace.
- Test: Write and run sample/edge test cases.
- Analyze: Mention time/space complexity, tradeoffs, limitations.
- Debug: Step through code, fix errors on the fly.

### What are the main principles of OOP?

Reference: [FreeCodeCamp: OOP Concepts](https://www.freecodecamp.org/news/object-oriented-programming-concepts-21bb035f7260/)

#### Encapsulation (Methods)

Encapsulation is achieved when each object keeps its state private, inside a class. Other objects don’t have direct access; they use public methods only.

Example scenario: a `Cat` class encapsulating `mood`, `hungry`, and `energy` states, with public methods like `sleep()`, `play()`, and `feed()`.

#### Abstraction

Abstraction hides internal implementation details, exposing only high-level operations.
Example: Using a coffee machine or a smartphone, you interact with a few controls without knowing internal mechanics.

#### Inheritance

Inheritance allows creating a child class from a parent class to reuse common logic while implementing unique features.

#### Polymorphism

Polymorphism allows objects of different classes to be treated as objects of a parent class. Methods defined in the parent can be overridden in child classes.

---

### Benefits of OOP

- **Modularity**: Easier troubleshooting and collaborative development.
- **Reusability**: Reuse code through inheritance.
- **Productivity**: Faster development with reusable code.
- **Scalability**: Implement functionalities independently.
- **Interface descriptions**: Simplified communication between systems.
- **Security**: Encapsulation and abstraction protect internal logic.
- **Flexibility**: Polymorphism allows uniform interfaces across classes.

---

### Criticism of OOP

- Overemphasizes data over computation or algorithms.
- May complicate code and slow compilation.

**Alternative approaches:**

- Functional programming (Erlang, Scala)
- Structured/modular programming (PHP, C\#)
- Imperative programming (C++, Java)
- Declarative programming (Prolog, Lisp)
- Logical programming (Prolog)

---

### SOLID Principles

Reference: [DigitalOcean: SOLID Principles](https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design)

- **S** - Single-responsibility Principle
- **O** - Open-closed Principle
- **L** - Liskov Substitution Principle
- **I** - Interface Segregation Principle
- **D** - Dependency Inversion Principle

#### Single-Responsibility Principle

A class should have only one reason to change. Example: AreaCalculator class for shapes.

#### Open-Closed Principle

Classes should be open for extension but closed for modification.

#### Liskov Substitution Principle

Derived classes should be substitutable for their base classes.

#### Interface Segregation Principle

Clients should not be forced to depend on interfaces they do not use.

#### Dependency Inversion Principle

High-level modules should depend on abstractions, not concrete implementations.

---

### YAGNI

_"You Aren’t Going to Need It"_ – only add features when required.

### Refactoring

Rewrite code efficiently: minimize work inside loops, optimize conditions, and handle common cases first.

### Writing Code in Interviews

- Keep code simple and readable.
- Use white space and comments effectively.
- Ask clarifying questions and treat the interviewer as a collaborator.

## Promises in JavaScript

A **Promise** is an object representing the eventual completion (or failure) of an asynchronous operation, and its resulting value.
Promises solve callback hell and make async code easier to read and maintain.

**States of a Promise:**

- Pending
- Fulfilled (resolved)
- Rejected

**Basic Usage:**

```js
const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Promise fulfilled!");
    // or reject("Something went wrong...");
  }, 2000);
});

myPromise.then((val) => console.log(val)).catch((err) => console.error(err));
```

**Chaining Example:**

```js
function doSomething() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Step 1 Complete");
    }, 500);
  });
}

doSomething()
  .then((result) => {
    console.log(result);
    return "Step 2 Complete";
  })
  .then((next) => console.log(next))
  .catch((error) => console.error(error));
```

---

## SOLID Principles

- **S (Single Responsibility Principle):** Classes should have only one reason to change.
- **O (Open-Closed Principle):** Software is open for extension but closed for modification.
- **L (Liskov Substitution Principle):** Subtypes must be substitutable for their base types.
- **I (Interface Segregation Principle):** Clients shouldn't depend on interfaces they don't use.
- **D (Dependency Inversion Principle):** High-level modules should depend on abstractions, not concrete implementations.

---

## JavaScript Data Types

**Primitive:** Number, String, Boolean, Null, Undefined, Symbol
**Compound:** Object, Array

---

## Hoisting

JavaScript moves declarations to the top of their scope. Functions and variables (declared with `var`) are hoisted.

---

## null vs undefined

- **null:** An assigned value representing no value.
- **undefined:** Declared but not assigned.

---

## Arrow Functions

A concise function syntax using `=>`. Arrow functions inherit `this` from their surrounding scope.

---

## this Keyword

Refers to the object executing the current function, allowing access to properties/methods in that context.

---

## == vs ===

- **==:** Checks value equality (allows coercion).
- **===:** Checks value and type equality (no coercion).

---

## var vs let vs const

- **var:** Function-scoped, can be redeclared/reassigned.
- **let:** Block-scoped, reassignable.
- **const:** Block-scoped, cannot be reassigned.

---

## Closures

Functions that retain access to their outer scope variables after the outer function has finished.

---

## Event Delegation

Attaching a single event listener to a parent, handling events from child elements. Improves performance and memory usage.

---

## Implicit Type Coercion

JavaScript automatically converts values during operations. Example: `5 + "10"` results in `"510"`.

---

## Prototypes

Mechanism for inheritance. Every object links to a prototype with shared properties/methods.

---

## Output Example

```js
console.log(3 + 2 + "7"); // "57"
```

---

## Clone an Object

```js
const newObj = Object.assign({}, oldObj);
// or
const newObj = { ...oldObj };
```

---

## Higher-Order Functions

Functions that accept or return other functions.

---

## bind() Method

Creates a new function with a specified `this` value.

---

## Function Declaration vs Expression

- **Declaration:** Hoisted, accessible before they appear.
- **Expression:** Not hoisted.

---

## JavaScript Errors

- **Syntax Error:** Invalid code structure.
- **Runtime Error:** Occurs during execution.
- **Logical Error:** Output is incorrect but code runs.

---

## Memoization

Caching function outputs for specific inputs to avoid recalculation.

---

## Recursion

A function calling itself. Used for algorithms like factorial and fibonacci.

---

## Constructor Functions

Used to create and initialize new objects.

---

## Callback Functions

Functions passed into another function to be called later (often asynchronous).

---

## Synchronous vs Asynchronous Programming

- **Synchronous:** Sequential, blocks execution.
- **Asynchronous:** Tasks run concurrently, doesn't block.

---

## Error Handling

Use `try/catch` blocks for graceful error recovery.

---

## Event Bubbling

Event propagates from the innermost element outward up the DOM tree.

---

## querySelector vs getElementById

- `querySelector`: Selects using CSS selectors.
- `getElementById`: Selects by ID.

---

## setTimeout

Delays function execution by specified milliseconds.

---

## localStorage vs sessionStorage

- **localStorage:** Persistent.
- **sessionStorage:** Cleared per browser tab/session.

---

## String to Lowercase

```js
const lower = str.toLowerCase();
```

---

## map()

Creates a new array by transforming each element.

---

## splice() vs slice()

- **splice():** Modifies original array.
- **slice():** Returns shallow copy.

---

## reduce()

Transforms array into a single value.

---

## includes()

Checks if array contains a value.

---

## Prototype vs Instance Properties

- **Prototype:** Shared.
- **Instance:** Unique to each object.

---

## Array vs Object

- **Array:** Indexed by numbers.
- **Object:** Indexed by strings/keys.

---

## Remove Duplicates

```js
const unique = [...new Set(arr)];
```

---

## fetch()

Performs async HTTP requests; returns a Promise.

---

## Generator Functions

Functions that can be paused/resumed using `yield`.

---

## Common Events

- Click
- Mouseover
- Keydown
- Keyup
- Change

---

## HTML Element Access

- `getElementById()`
- `getElementsByTagName()`
- `querySelector()`

---

## Variable Scope

- **var:** Function
- **let:** Block
- **const:** Block

---

## Object Creation

Object literal, constructor, `Object.create()`, ES6 class.

---

## window Object

Represents browser window \& provides access to global features.

---

## async/await

Simplifies handling Promises for more readable async code.

# Software Developer Technical Interview Questions

## JavaScript Technical Interview Prep

---

## Object-Oriented Programming (OOP) in JavaScript

- **Classes/Objects**: ES6 `class` syntax creates blueprints; objects are their instances.
- **Methods**: Functions within classes or as prototype methods.
- **Properties**: State/data attached to object instances.
- **Inheritance**: Use `extends` keyword; child classes inherit parent properties and methods.
- **Polymorphism**: Method overriding in subclasses enables objects to be used via parent references.
- **Encapsulation**: Private fields (`#field`) or closure patterns protect data.
- **Abstraction**: Only expose necessary API (public interface) of classes.

---

## Object-Oriented Programming (OOP)

### What is the structure of object-oriented programming?

The structure, or building blocks, of OOP include:

- **Classes**: User-defined data types that act as blueprints for individual objects, attributes, and methods.
- **Objects**: Instances of a class created with specifically defined data.
- **Methods**: Functions defined inside a class that describe the behaviors of an object.
- **Attributes**: Defined in the class template and represent the state of an object.

```js
class Animal {
  #energy = 100;
  speak() {
    console.log("Makes a sound");
  }
}
class Cat extends Animal {
  speak() {
    console.log("Meow");
  }
}
```

---

## Essential JavaScript Data Structures

- **Array**: `let arr = [1, 2, 3]` — for ordered collections and most standard algorithms.
- **Object**: `let obj = { key: 'value' }` — for key-value pairs (hash maps).
- **Map**: `let map = new Map()` — for ordered, iterable key-value pairs with any data type as keys.
- **Set**: `let set = new Set([1, 2, 3])` — stores unique items.
- **Stack**: `arr.push(x), arr.pop()` — LIFO; use array methods.
- **Queue**: `arr.push(x), arr.shift()` — FIFO; use array or build a Queue class.
- **Linked List**: Custom implementation using classes and pointers.
- **Tree / Binary Tree / BST**: Node classes, recursive algorithms for traversals (DFS, BFS).
- **Graph**: Adjacency list via objects/maps.
- **Heap**: Implemented via arrays and custom functions.

---

## JavaScript Algorithms to Know

- **Search Algorithms**: Linear search, binary search, hash map lookup.
- **Sorting Algorithms**: Bubble sort, insertion sort, selection sort, quicksort, mergesort.
- **Recursion**: Essential for trees/graphs—be able to write recursive solutions.
- **Breadth-First and Depth-First Traversal**: For trees and graphs.
- **Dynamic Programming**: Use objects/arrays for memoization and tabulation.

---

## Language Concepts and Interview Patterns

- **Scope, Closures, Hoisting**: Know `let`, `const`, `var`; closures for encapsulation.
- **`this` Keyword**: Context binding for object methods, arrow functions.
- **Callbacks, Promises, Async/Await**: Asynchronous programming.
- **Functional Programming**: Array methods (`map`, `filter`, `reduce`), pure functions.
- **Error Handling**: Try/catch; handling edge cases.

---

## Interview Coding Tips

- Communicate: Ask for clarifications, talk through approach.
- Be clear: Name functions/variables meaningfully, use whitespace.
- Test: Write and run sample/edge test cases.
- Analyze: Time/space complexity, tradeoffs, limitations.
- Debug: Step through code, fix errors on the fly.

---

### What are the main principles of OOP?

Reference: [FreeCodeCamp: OOP Concepts](https://www.freecodecamp.org/news/object-oriented-programming-concepts-21bb035f7260/)

#### Encapsulation (Methods)

Encapsulation is achieved when each object keeps its state private, inside a class. Other objects don’t have direct access; they use public methods only.

#### Abstraction

Abstraction hides internal implementation details, exposing only high-level operations.

#### Inheritance

Inheritance allows creating a child class from a parent class to reuse common logic while implementing unique features.

#### Polymorphism

Polymorphism allows objects of different classes to be treated as objects of a parent class.

---

### Benefits of OOP

- **Modularity**: Easier troubleshooting and collaboration.
- **Reusability**: Inheritance.
- **Productivity**: Reusable code.
- **Scalability**: Independent functionality.
- **Interface descriptions**: Communication between systems.
- **Security**: Encapsulation and abstraction.
- **Flexibility**: Polymorphism for uniform interfaces.

---

### Criticism of OOP

- May overemphasize data over algorithms.
- Can complicate codebase.

**Alternative approaches:**

- Functional programming (Erlang, Scala)
- Structured/modular programming (PHP, C\#)
- Imperative programming (C++, Java)
- Declarative programming (Prolog, Lisp)
- Logical programming (Prolog)

---

### SOLID Principles

Reference: [DigitalOcean: SOLID Principles](https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design)

- **S** - Single-responsibility Principle
- **O** - Open-closed Principle
- **L** - Liskov Substitution Principle
- **I** - Interface Segregation Principle
- **D** - Dependency Inversion Principle

#### Single-Responsibility Principle

A class should have only one reason to change.

#### Open-Closed Principle

Classes should be open for extension but closed for modification.

#### Liskov Substitution Principle

Derived classes should be substitutable for their base classes.

#### Interface Segregation Principle

Clients should not be forced to depend on interfaces they do not use.

#### Dependency Inversion Principle

High-level modules should depend on abstractions, not concrete implementations.

---

### YAGNI

_"You Aren’t Going to Need It"_ – add features only when required.

### Refactoring

Rewrite code efficiently: minimal work inside loops, optimize conditions, handle common cases first.

### Writing Code in Interviews

- Keep code simple and readable.
- Use whitespace and comments.
- Ask clarifying questions; treat the interviewer as a collaborator.

---

## JavaScript Concepts Q\&A

### Promises

A promise is an object that may produce a value at some point in the future.

### Data Types

- Six primitive: Number, String, Boolean, Null, Undefined, Symbol.
- Compound: Object, Array.

### Hoisting

JavaScript moves declarations to the top of their scope.

### null vs undefined

- `null`: No value or empty value.
- `undefined`: Declared but not assigned.

### Arrow Functions

Concise syntax, inherit `this` from outer scope.

### this Keyword

Refers to the object executing the function or method.

### == vs ===

- `==`: Equality, allows coercion.
- `===`: Strict equality, checks type too.

### var vs let

- `var`: function-scoped, redeclarable/reassignable.
- `let`: block-scoped, reassignable, introduced in ES6.

### Closures

Functions that remember the environment in which they were created.

### Event Delegation

Attach one event listener to a parent, handle events from children.

### Implicit Type Coercion

JavaScript converts values when needed, e.g. `"10" + 5` results in `"105"`.

### Prototypes

Mechanism for inheritance. Every object links to a prototype.

### Example Output

```js
console.log(3 + 2 + "7"); // "57"
```

### Clone an Object

Use `Object.assign()` or the spread operator (`...`).

### Higher-Order Functions

Accept functions as arguments or return functions.

### bind() Method

Creates a function with specified `this` value.

### Function Declaration vs Expression

- Declaration is hoisted.
- Expression is not.

### Error Types

- Syntax, Runtime, Logical.

### Memoization

Cache expensive calculations for reuse.

### Recursion

Function calls itself, e.g. factorial, fibonacci.

### Constructor Functions

Special functions to create objects.

### Callback Functions

Passed as argument to another function, invoked there.

### Synchronous vs Asynchronous

- Synchronous: Sequential execution.
- Asynchronous: Tasks run concurrently.

### Error Handling

Use `try`/`catch` blocks.

### Event Bubbling

Events propagate from inner element to parents.

### querySelector vs getElementById

- `querySelector`: Uses CSS selectors.
- `getElementById`: Selects by ID.

### setTimeout()

Delays execution after a set time.

### localStorage vs sessionStorage

- `localStorage`: Persists across sessions.
- `sessionStorage`: Limited to one browser session/tab.

### String to Lowercase

Use `toLowerCase()`.

### map() Function

Transforms elements in an array.

### splice() vs slice()

- `splice()`: Modifies array.
- `slice()`: Copies array.

### reduce()

Reduces array to a single value.

### includes()

Checks for value in array.

### Prototype vs Instance Properties

- Prototype: Shared by all instances.
- Instance: Unique to each object.

### Array vs Object

- Arrays: Indexed by numbers, store ordered values.
- Objects: Indexed by strings, can store mixed data.

### Remove Duplicates

Use `Set` or `filter()` + `indexOf()`.

### fetch()

Asynchronous HTTP requests; returns a Promise.

### Generator Functions

Functions that can pause and resume with `yield`.

### Events

- Click, Mouseover, Keydown, Keyup, Change.

### HTML Element Access

- `getElementById()`
- `getElementsByTagName()`
- `querySelector()`

### Variable Scope

- var: Local/function scope.
- let: Block scope.
- const: Block scope, no reassignment.

### Object Creation

- Object literal, constructor, `Object.create()`, ES6 classes.

### window Object

Represents browser window; access browser features.

### async/await

Handles asynchronous code in a synchronous style.
