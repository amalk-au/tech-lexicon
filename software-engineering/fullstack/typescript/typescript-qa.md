# Typescript Common Q&A

[Back to the topic index](./README.md)

### 1. **What is TypeScript and how is it different from JavaScript?**

- **Sample Answer:**
  TypeScript is a superset of JavaScript that adds static typing and additional features like interfaces and enums. TypeScript code is compiled to JavaScript, which can then run in any browser or JavaScript environment. The main difference is that TypeScript allows for type checking at compile time, helping catch errors earlier in the development process.

### 2. **How do you define types for variables and functions in TypeScript?**

- **Sample Answer:**
  You can define types using type annotations. For example:

```typescript
let name: string = "Alice";
function add(a: number, b: number): number {
  return a + b;
}
```

### 3. **What are interfaces and how are they used?**

- **Sample Answer:**
  Interfaces define the structure of an object. They are used to type-check the shape of objects.

```typescript
interface User {
  name: string;
  age: number;
}
const user: User = { name: "Bob", age: 25 };
```

### 4. **What is the difference between `interface` and `type` in TypeScript?**

- **Sample Answer:**
  Both can be used to describe the shape of objects, but `type` is more flexible—it can represent primitives, unions, and intersections. `interface` is mainly for object shapes and can be extended or merged.

### 5. **How does TypeScript help prevent runtime errors?**

- **Sample Answer:**
  TypeScript’s static type checking catches type-related errors at compile time, before the code runs, reducing the likelihood of runtime bugs due to incorrect data types.

### 6. **How do you handle optional properties in TypeScript?**

- **Sample Answer:**
  Use a question mark `?` after the property name:

```typescript
interface User {
  name: string;
  age?: number; // age is optional
}
```

### 7. **What are generics in TypeScript?**

- **Sample Answer:**
  Generics allow you to write reusable, type-safe functions and classes that work with any data type.

```typescript
function identity<T>(arg: T): T {
  return arg;
}
```

### 8. **How do you use enums in TypeScript?**

- **Sample Answer:**
  Enums allow you to define a set of named constants:

```typescript
enum Direction {
  Up,
  Down,
  Left,
  Right,
}
let dir: Direction = Direction.Up;
```

### 9. **How do you convert a JavaScript project to TypeScript?**

- **Sample Answer:**
  - Rename `.js` files to `.ts`.
  - Add a `tsconfig.json` file.
  - Gradually add type annotations and fix type errors.

### 10. **What is type inference in TypeScript?**

- **Sample Answer:**
  TypeScript can automatically infer the type of a variable based on its value, so explicit type annotations are not always necessary.
