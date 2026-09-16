# Typescript cheat sheet

[Back to the topic index](./README.md)

This covers everything from basic variable declarations to the advanced patterns you'll use in React and Next.js.

---

### 1. Basic Types (Primitives)

```typescript
let name: string = "Pragmatic";
let age: number = 2026;
let isReady: boolean = true;
let nothing: null = null;
let undefinedValue: undefined = undefined;
let anyValue: any = "This disables type checking - use sparingly!";
```

### 2. Arrays and Objects

```typescript
// Arrays
let scores: number[] = [10, 20, 30];
let tags: Array<string> = ["React", "TS"]; // Alternative syntax

// Objects (Inline)
let user: { name: string; id: number } = {
  name: "Alex",
  id: 1,
};
```

### 3. Interfaces vs. Types

Use **Interfaces** for objects and classes. Use **Types** for unions, aliases, and functions.

```typescript
// Interface: Extendable, perfect for Data Models
interface User {
  readonly id: number; // Cannot be changed after creation
  name: string;
  email?: string; // Optional property
}

// Type: Great for specific values (Unions)
type Status = "idle" | "loading" | "success" | "error";
type ID = string | number;

// Usage
const myStatus: Status = "success";
```

### 4. Functions

```typescript
// Named function with return type
function add(a: number, b: number): number {
  return a + b;
}

// Arrow function
const greet = (name: string): void => {
  console.log(`Hello ${name}`);
};

// Function with optional/default parameters
const log = (msg: string, userId?: string) => { ... };

```

### 5. TypeScript in React (The Essentials)

```tsx
interface ButtonProps {
  label: string;
  variant: "primary" | "secondary";
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode; // For nesting components
}

export const Button = ({ label, variant, onClick, children }: ButtonProps) => {
  return <button onClick={onClick}>{label}</button>;
};
```

### 6. Useful Utility Types

TypeScript provides built-in helpers to transform types:

| Utility        | Description                    | Example                  |
| -------------- | ------------------------------ | ------------------------ |
| `Partial<T>`   | Makes all properties optional. | `Partial<User>`          |
| `Pick<T, K>`   | Selects specific properties.   | `Pick<User, "name">`     |
| `Omit<T, K>`   | Removes specific properties.   | `Omit<User, "id">`       |
| `Record<K, T>` | Creates a map/dictionary.      | `Record<string, number>` |

### 7. Generics (Reusable Types)

Generics allow you to create components or functions that work with multiple types but keep "type safety."

```typescript
// The <T> is a placeholder for any type passed in
function getFirstItem<T>(array: T[]): T {
  return array[0];
}

const firstNum = getFirstItem([1, 2, 3]); // Inferred as number
const firstStr = getFirstItem(["a", "b"]); // Inferred as string
```

---

### Pro-Tip: When to use `Type` vs `Interface`?

- **Use `interface**` by default for the "shape" of your data (API responses, Component Props).
- **Use `type**` when you need a "This OR That" logic (Unions) or for complex logic.
