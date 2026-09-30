# TypeScript revision: learn by doing

[Back to the topic index](./README.md)

A practical refresher using **TypeScript 6.x** and **pnpm on Ubuntu** for developers who know JavaScript. Work through everyday types first, then reusable types, async code and browser integration. All data is generic demonstration data.

**How to use this guide:** paste one example, check its types, run it, then try the suggested change. Most examples replace the complete contents of `src/index.ts`. The modules and browser labs explicitly list their different files.

## 0. Set up a practice project

You can use the [Web Development template](https://github.com/amalk-au/web-development-template) or alternatively setup project as below.
Use Node.js 24 LTS with pnpm installed for the setup below. Check both:

```bash
node --version
pnpm --version
mkdir typescript-revision
cd typescript-revision
mkdir src
```

Create these files at the project root.

**`package.json`**

```json
{
  "name": "typescript-revision",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "typecheck": "tsc --noEmit",
    "build": "tsc",
    "start": "pnpm run build && node dist/index.js"
  }
}
```

Install the compiler and Node.js type declarations:

```bash
pnpm add -D typescript@6 @types/node@24
```

**`tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "types": ["node"],
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "verbatimModuleSyntax": true,
    "noEmitOnError": true,
    "sourceMap": true
  },
  "include": ["src/**/*.ts"]
}
```

**`.gitignore`**

```gitignore
node_modules/
dist/
.env
.env.*
!.env.example
```

Paste lab 1 into `src/index.ts`, then run:

```bash
pnpm typecheck
pnpm start
```

`typecheck` reports type errors without generating JavaScript. `start` compiles and runs only if compilation succeeds. No output from the type checker normally means success. Check `dist/index.js` to see which TypeScript syntax disappeared.

**For every core lab:** replace `src/index.ts`, run those same commands, then uncomment a marked error line and run **only** `pnpm typecheck`. Restore the line afterward. Do not paste all examples into one file.

In VS Code, open the project folder and use **TypeScript: Select TypeScript Version → Use Workspace Version**. Hover variables to inspect inferred types. No TypeScript extension is required for the built-in editor support.

| Setting                      | Why it is here                                                              |
| ---------------------------- | --------------------------------------------------------------------------- |
| `strict`                     | Enables strict checks, including null safety and implicit-any checks        |
| `noUncheckedIndexedAccess`   | Indexed arrays/dictionaries can produce `undefined`                         |
| `exactOptionalPropertyTypes` | Omitting an optional property differs from explicitly assigning `undefined` |
| `NodeNext`                   | Models Node.js module behavior; package `type` selects ESM here             |
| `verbatimModuleSyntax`       | Makes type-only imports explicit                                            |
| `noEmitOnError`              | Stops new JavaScript output when the build has errors                       |

These settings are for the standalone Node.js exercises. Keep framework-specific configs in React/Next.js projects. The browser lab uses a separate project. Commit `pnpm-lock.yaml` to keep versions reproducible. [TSConfig reference](https://www.typescriptlang.org/tsconfig/)

## Contents

- [TypeScript revision: learn by doing](#typescript-revision-learn-by-doing)
  - [0. Set up a practice project](#0-set-up-a-practice-project)
  - [Contents](#contents)
  - [The mental model](#the-mental-model)
  - [1. Inference and primitive types](#1-inference-and-primitive-types)
  - [2. Functions and callbacks](#2-functions-and-callbacks)
  - [3. Object types and interfaces](#3-object-types-and-interfaces)
  - [4. Arrays, tuples and readonly](#4-arrays-tuples-and-readonly)
  - [5. Unions and narrowing](#5-unions-and-narrowing)
  - [6. Optional values and null safety](#6-optional-values-and-null-safety)
  - [7. Unknown data and runtime validation](#7-unknown-data-and-runtime-validation)
  - [8. Discriminated unions and never](#8-discriminated-unions-and-never)
  - [9. Generics and constraints](#9-generics-and-constraints)
  - [10. Keyof, typeof and indexed access](#10-keyof-typeof-and-indexed-access)
  - [11. Utility types](#11-utility-types)
  - [12. As const and satisfies](#12-as-const-and-satisfies)
  - [13. Mapped and template literal types](#13-mapped-and-template-literal-types)
  - [14. Conditional types and infer](#14-conditional-types-and-infer)
  - [15. Async functions and errors](#15-async-functions-and-errors)
  - [16. Modules and type-only imports](#16-modules-and-type-only-imports)
  - [17. Classes and structural typing](#17-classes-and-structural-typing)
  - [18. Function overloads](#18-function-overloads)
  - [19. Browser lab: typed DOM events](#19-browser-lab-typed-dom-events)
  - [20. Checking intentional type errors](#20-checking-intentional-type-errors)
  - [Quick reference and challenges](#quick-reference-and-challenges)
    - [Types versus runtime behavior](#types-versus-runtime-behavior)
    - [Frequently confused types](#frequently-confused-types)
    - [Common mistakes](#common-mistakes)
    - [Practical workflow](#practical-workflow)
    - [Practice challenges](#practice-challenges)
    - [Further reading](#further-reading)

## The mental model

TypeScript checks JavaScript **before execution**. Types describe allowed values and operations; JavaScript still determines runtime behavior. Type annotations, interfaces and most type operators disappear during compilation.

| Tool               | Answers                                                    |
| ------------------ | ---------------------------------------------------------- |
| Compiler/editor    | Does this code satisfy its declared types?                 |
| Runtime validation | Does this actual input have the required shape and values? |
| Automated tests    | Does the program behave as expected for these cases?       |

A successful type check does not validate an API response, prove business logic correct or prevent all runtime errors. `as SomeType` is an assertion to the checker, not conversion or validation.

## 1. Inference and primitive types

**What it does:** shows inferred variable types and an explicit annotation where a variable starts without a value.

**Replace `src/index.ts`:**

```ts
let quantity = 3; // inferred number
const unitPrice = 12.5;
const available: boolean = true;
let label: string;
label = "Demo item";

const total = quantity * unitPrice;
console.log(`${label}: ${total.toFixed(2)}; available=${available}`);

quantity = 4;
console.log(quantity);

// Uncomment to inspect the error:
// quantity = 'four';

export {};
```

**Expected:** `Demo item: 37.50; available=true`, then `4`.

**Try it:** uncomment the invalid assignment. Hover `quantity`, `unitPrice` and `total`. `const` can retain a literal type, while a mutable variable generally widens to a broader type.

**Remember:** use lowercase `string`, `number` and `boolean`, not wrapper types `String`, `Number` and `Boolean`. Let obvious local values be inferred. `export {}` makes an otherwise import-free example a module. [Docs](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

## 2. Functions and callbacks

**What it does:** declares parameter/return types and a callback contract. Types flow into the inline callback automatically.

```ts
function calculateTotal(price: number, quantity = 1): number {
  return price * quantity;
}

type Formatter = (value: number) => string;

function printTotal(value: number, format: Formatter): void {
  console.log(format(value));
}

printTotal(calculateTotal(8, 3), (value) => `$${value.toFixed(2)}`);
printTotal(calculateTotal(8), (value) => `Total: ${value}`);

// calculateTotal('8', 3); // error: argument must be a number
// printTotal(10, value => value * 2); // error: callback must return a string

export {};
```

**Expected:** `$24.00`, then `Total: 8`.

**Try it:** make the callback return a number and inspect the error.

**Remember:** annotate function boundaries when useful; callback parameters often get contextual types. `void` means the caller should not use a result, not that every `void` callback must literally return nothing. [Docs](https://www.typescriptlang.org/docs/handbook/2/functions.html)

## 3. Object types and interfaces

**What it does:** describes data shapes, extends an interface and combines types with an intersection.

```ts
interface Item {
  readonly id: string;
  title: string;
}

interface PricedItem extends Item {
  price: number;
}

type Stock = { quantity: number };
type InventoryItem = PricedItem & Stock;

function inventoryValue(item: InventoryItem): number {
  return item.price * item.quantity;
}

const item: InventoryItem = {
  id: "item-1",
  title: "Notebook",
  price: 5,
  quantity: 4,
};

item.quantity = 6;
console.log(item.title, inventoryValue(item));

// item.id = 'item-2'; // error: readonly property
// const incomplete: Item = { id: 'item-3' }; // error: title is missing

export {};
```

**Expected:** `Notebook 30`.

**Try it:** add a required `category` field and let the checker show which objects need updating.

**Remember:** both `interface` and `type` describe object shapes. Interfaces support declaration merging; type aliases also express unions, tuples and other types. `A & B` must satisfy both sides; conflicting properties can produce unusable types. [Docs](https://www.typescriptlang.org/docs/handbook/2/objects.html)

## 4. Arrays, tuples and readonly

**What it does:** distinguishes a variable-length collection from a fixed-position tuple and prevents writes through a readonly view.

```ts
const prices: number[] = [10, 20, 30];
const pair: [code: string, stock: number] = ["sku-1", 8];

function sum(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

const first = prices[0]; // number | undefined with this config
console.log(first?.toFixed(2) ?? "No price");
console.log(pair[0].toUpperCase(), pair[1]);
console.log(sum(prices));

const view: readonly number[] = prices;
// view.push(40); // error: readonly array
prices.push(40); // allowed through the mutable reference
console.log(view.length);

export {};
```

**Expected:** `10.00`, `SKU-1 8`, `60`, then `4`.

**Try it:** make `prices` empty. The first line becomes `No price` instead of throwing.

**Remember:** `readonly` is a type-level restriction on that reference, not a deep runtime freeze. The `view` still points to the same array. Tuples describe known positions; ordinary array indexing may be missing. [Docs](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types)

## 5. Unions and narrowing

**What it does:** accepts more than one type, then uses runtime checks to select safe operations.

```ts
type Identifier = string | number;

function formatId(id: Identifier): string {
  if (typeof id === "number") {
    return `ID-${id.toFixed(0)}`;
  }
  return id.trim().toUpperCase();
}

type Download = { url: string } | { filePath: string };

function locationOf(download: Download): string {
  if ("url" in download) return download.url;
  return download.filePath;
}

console.log(formatId(42));
console.log(formatId(" item-7 "));
console.log(locationOf({ filePath: "/tmp/demo.txt" }));

// formatId(true); // error: boolean is not an Identifier

export {};
```

**Expected:** `ID-42`, `ITEM-7`, `/tmp/demo.txt`.

**Try it:** call `id.toUpperCase()` before the `typeof` check. The checker rejects an operation not available on every union member.

**Remember:** `typeof`, `instanceof`, property checks and comparisons can narrow types. Truthiness checks also remove `0`, `''` and `false`, which may be valid data. [Docs](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

## 6. Optional values and null safety

**What it does:** handles optional fields and a possibly missing search result without non-null assertions.

```ts
type Settings = {
  theme?: "light" | "dark";
  retries: number | null;
};

function describe(settings: Settings): string {
  const theme = settings.theme ?? "light";
  const retries = settings.retries ?? 3;
  return `${theme}; retries=${retries}`;
}

console.log(describe({ retries: null }));
console.log(describe({ theme: "dark", retries: 0 }));

const values = ["routing", "types"];
const found = values.find((value) => value === "missing");
console.log(found?.toUpperCase() ?? "Not found");

// describe({ theme: undefined, retries: 1 }); // error with exactOptionalPropertyTypes
// console.log(found.toUpperCase()); // error: possibly undefined

export {};
```

**Expected:** `light; retries=3`, `dark; retries=0`, `Not found`.

**Try it:** replace `settings.retries ?? 3` with `settings.retries || 3`. Zero now becomes 3, changing the behavior.

**Remember:** `??` falls back only for `null`/`undefined`. An optional property may be omitted; with this config, explicit `undefined` needs to be part of its type. `value!` suppresses a null warning but inserts no runtime check. [Strict null checks](https://www.typescriptlang.org/tsconfig/strictNullChecks.html) · [Exact optional properties](https://www.typescriptlang.org/tsconfig/exactOptionalPropertyTypes.html)

## 7. Unknown data and runtime validation

**What it does:** treats parsed JSON as untrusted data and checks the fields the program needs before using them.

```ts
type Product = { id: number; title: string };

function isProduct(value: unknown): value is Product {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "number" &&
    Number.isFinite(value.id) &&
    "title" in value &&
    typeof value.title === "string"
  );
}

function readProduct(json: string): Product {
  const value: unknown = JSON.parse(json);
  if (!isProduct(value)) throw new Error("Invalid product shape");
  return value;
}

const samples = [
  '{"id":1,"title":"Demo item"}',
  '{"id":"wrong","title":"Demo item"}',
  "{broken json",
];

for (const json of samples) {
  try {
    const product = readProduct(json);
    console.log(product.title.toUpperCase());
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : "Unknown failure");
  }
}

export {};
```

**Expected:** `DEMO ITEM`, `Invalid product shape`, then a JSON syntax error message whose wording depends on Node.js.

**Try it:** change the valid title to a number. Then add a required field and update both the type and the validator.

**Remember:** `unknown` forces checking before use; `any` disables much of that checking. TypeScript trusts a custom type predicate, so an incorrect `value is Product` implementation can lie. A larger application may use a schema validator to keep runtime checks and types aligned. This validator permits extra fields. [Docs](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)

## 8. Discriminated unions and never

**What it does:** models mutually exclusive UI states and checks that every state is handled.

```ts
type LoadState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; items: string[] }
  | { status: "error"; message: string };

function assertNever(value: never): never {
  throw new Error(`Unhandled state: ${JSON.stringify(value)}`);
}

function describe(state: LoadState): string {
  switch (state.status) {
    case "idle":
      return "Ready";
    case "loading":
      return "Loading…";
    case "success":
      return `${state.items.length} items`;
    case "error":
      return `Failed: ${state.message}`;
    default:
      return assertNever(state);
  }
}

console.log(describe({ status: "success", items: ["one", "two"] }));
console.log(describe({ status: "error", message: "Demo failure" }));

// describe({ status: 'success' }); // error: success needs items

export {};
```

**Expected:** `2 items`, then `Failed: Demo failure`.

**Try it:** add `| { status: 'cancelled' }` to the union. The `assertNever(state)` call becomes an error until you handle that case.

**Remember:** the shared literal property is the discriminant. This is often clearer than independent `loading`, `error` and `data` flags that permit contradictory states. `never` describes values that cannot occur at a correctly handled point. [Docs](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)

## 9. Generics and constraints

**What it does:** preserves the relationship between input and output types without using `any`.

```ts
function first<T>(values: readonly T[]): T | undefined {
  return values[0];
}

function withLabel<T extends { id: string }>(item: T): T & { label: string } {
  return { ...item, label: `Item ${item.id}` };
}

const price = first([12, 24]);
const title = first(["One", "Two"]);
const missing = first<number>([]);
const item = withLabel({ id: "sku-1", stock: 8 });

console.log(price?.toFixed(2));
console.log(title?.toUpperCase());
console.log(missing);
console.log(item.label, item.stock);

// withLabel({ stock: 8 }); // error: missing id

export {};
```

**Expected:** `12.00`, `ONE`, `undefined`, `Item sku-1 8`.

**Try it:** pass an array of objects to `first` and inspect the inferred return type.

**Remember:** `T` is a type parameter, not a runtime value. A constraint states what the implementation needs; it doesn't discard the caller's extra fields. [Docs](https://www.typescriptlang.org/docs/handbook/2/generics.html)

## 10. Keyof, typeof and indexed access

**What it does:** connects an object key to that property's exact value type.

```ts
const product = { id: "sku-1", title: "Demo item", stock: 8 };

type Product = typeof product;
type ProductKey = keyof Product;
type Stock = Product["stock"];

function getProperty<T, K extends keyof T>(object: T, key: K): T[K] {
  return object[key];
}

const key: ProductKey = "title";
const stock: Stock = getProperty(product, "stock");

console.log(getProperty(product, key).toUpperCase());
console.log(stock.toFixed(0));

// getProperty(product, 'missing'); // error: invalid key

export {};
```

**Expected:** `DEMO ITEM`, then `8`.

**Try it:** change `'stock'` to `'title'` while leaving the `Stock` annotation. The mismatch is caught.

**Remember:** `typeof` in a type position derives a static type; JavaScript's runtime `typeof` returns a string. `keyof T` gives keys, while `T[K]` gives the corresponding value type. [keyof](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html) · [Indexed access](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)

## 11. Utility types

**What it does:** derives related types from one model and constrains an update function.

```ts
type Product = {
  id: string;
  title: string;
  price: number;
  internalCode: string;
};

type PublicProduct = Omit<Product, "internalCode">;
type Summary = Pick<Product, "id" | "title">;
type ProductPatch = Partial<Pick<Product, "title" | "price">>;
type Status = "draft" | "published";

const labels: Record<Status, string> = {
  draft: "Work in progress",
  published: "Visible",
};

function update(product: Product, patch: ProductPatch): Product {
  return { ...product, ...patch };
}

const product: Product = {
  id: "p-1",
  title: "Notebook",
  price: 10,
  internalCode: "demo",
};
const revised = update(product, { price: 12 });
const summary: Summary = { id: revised.id, title: revised.title };
const publicView: PublicProduct = {
  id: revised.id,
  title: revised.title,
  price: revised.price,
};

console.log(revised.price, summary.title, publicView.price, labels.published);

// update(product, { id: 'p-2' }); // fresh literal rejected: id is not editable

export {};
```

**Expected:** `12 Notebook 12 Visible`.

| Utility                           | Purpose                                          |
| --------------------------------- | ------------------------------------------------ |
| `Partial<T>`                      | Make top-level properties optional               |
| `Required<T>`                     | Make top-level properties required               |
| `Readonly<T>`                     | Prevent writes through that view                 |
| `Pick<T, K>` / `Omit<T, K>`       | Select / exclude properties                      |
| `Record<K, V>`                    | Describe a mapping of keys to values             |
| `Exclude<U, V>` / `Extract<U, V>` | Remove / keep union members                      |
| `NonNullable<T>`                  | Remove `null` and `undefined`                    |
| `Parameters<F>` / `ReturnType<F>` | Derive function argument / result types          |
| `Awaited<T>`                      | Derive the resolved value of a promise-like type |

**Try it:** add another member to `Status`; the `labels` object must include it.

**Remember:** these transform types, not runtime data. `Omit` does not delete private fields, and structural typing can allow extra fields through variables. Validate and explicitly select allowed fields for real input updates; this spread example assumes trusted input. [Docs](https://www.typescriptlang.org/docs/handbook/utility-types.html)

## 12. As const and satisfies

**What it does:** derives a union from runtime values and checks a configuration while retaining its useful inferred details.

```ts
const statuses = ["queued", "running", "done"] as const;
type Status = (typeof statuses)[number];

const appearance = {
  queued: { color: "gray", retry: true },
  running: { color: "blue", retry: false },
  done: { color: "green", retry: false },
} satisfies Record<Status, { color: string; retry: boolean }>;

function describe(status: Status): string {
  return `${status}: ${appearance[status].color}`;
}

console.log(describe("running"));
console.log(appearance.queued.retry);

// describe('finished'); // error: not part of Status
// statuses.push('failed'); // error: readonly tuple

export {};
```

**Expected:** `running: blue`, then `true`.

**Try it:** remove `done` from `appearance`, or misspell `retry`. `satisfies` reports the mismatch.

**Remember:** `as const` retains literals and readonly properties for literal expressions; it does not freeze objects at runtime. `satisfies` checks compatibility while retaining the expression's resulting inferred type rather than replacing it with the target type; contextual typing can still influence inference. An ordinary `as Type` assertion may bypass a check you actually need. [satisfies docs](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator)

## 13. Mapped and template literal types

**What it does:** generates a boolean flag type from an existing model and a constrained event-name union from string literals.

```ts
type Settings = { theme: string; pageSize: number };
type Flags<T> = { [K in keyof T]: boolean };
type SettingsEvent = `${keyof Settings}Changed`;

const changed: Flags<Settings> = { theme: true, pageSize: false };

function logEvent(event: SettingsEvent): void {
  console.log(event);
}

console.log(changed.theme, changed.pageSize);
logEvent("themeChanged");

// logEvent('unknownChanged'); // error
// const incomplete: Flags<Settings> = { theme: true }; // error: missing pageSize

export {};
```

**Expected:** `true false`, then `themeChanged`.

**Try it:** add `compact: boolean` to `Settings`. The flag object needs another key, and `'compactChanged'` becomes valid.

**Remember:** mapped types transform property types; template literal types build string patterns. They create no runtime objects or event listeners. [Mapped types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html) · [Template literal types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)

## 14. Conditional types and infer

**What it does:** extracts an array's element type, or leaves a non-array type unchanged.

```ts
type ElementOrSelf<T> = T extends readonly (infer Element)[] ? Element : T;

type Score = ElementOrSelf<number[]>;
type Label = ElementOrSelf<string>;
type Mixed = ElementOrSelf<string[] | number[]>;

const score: Score = 42;
const label: Label = "Demo";
const mixed: Mixed[] = ["one", 2];

console.log(score.toFixed(1), label.toUpperCase(), mixed.join(", "));

// const wrong: Score = '42'; // error

export {};
```

**Expected:** `42.0 DEMO one, 2`.

**Try it:** replace `number[]` with `readonly boolean[]` in `Score`, then update the value and output accordingly.

**Remember:** `infer` names a type captured by a conditional pattern. A conditional using a bare type parameter distributes over unions, which is why `Mixed` becomes `string | number`. Use these when they simplify an API; ordinary named types are often clearer. [Docs](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)

## 15. Async functions and errors

**What it does:** types asynchronous results and represents expected failure as a discriminated union. The mock keeps the exercise offline.

```ts
type Product = { id: number; title: string };
type Result<T> = { ok: true; data: T } | { ok: false; error: string };

async function loadProduct(id: number): Promise<Product> {
  await new Promise<void>((resolve) => setTimeout(resolve, 100));
  if (id !== 1) throw new Error("Product not found");
  return { id, title: "Demo item" };
}

async function safelyLoad(id: number): Promise<Result<Product>> {
  try {
    return { ok: true, data: await loadProduct(id) };
  } catch (error: unknown) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown failure",
    };
  }
}

type LoadedProduct = Awaited<ReturnType<typeof loadProduct>>;
const sample: LoadedProduct = { id: 1, title: "Sample" };
console.log(sample.title);

for (const id of [1, 2]) {
  const result = await safelyLoad(id);
  console.log(result.ok ? result.data.title : result.error);
}

export {};
```

**Expected:** `Sample`, `Demo item`, `Product not found`.

**Try it:** remove `await` before `safelyLoad(id)` and inspect the property-access errors on the Promise.

**Remember:** `Promise<T>` describes the fulfilled value; it doesn't specify which errors can be thrown. With real `fetch`, check `response.ok` and validate the parsed response (lab 7). A generic return type or assertion cannot prove an API response's shape. [Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html) · [Awaited](https://www.typescriptlang.org/docs/handbook/utility-types.html#awaitedtype)

## 16. Modules and type-only imports

**What it does:** separates a data contract from its runtime function and imports each with the appropriate syntax.

**`src/product.ts`**

```ts
export type Product = { title: string; price: number };

export function label(product: Product): string {
  return `${product.title}: $${product.price.toFixed(2)}`;
}
```

**Replace `src/index.ts`:**

```ts
import { label } from "./product.js";
import type { Product } from "./product.js";

const product: Product = { title: "Demo item", price: 7.5 };
console.log(label(product));
```

**Expected:** `Demo item: $7.50`.

**Try it:** inspect the emitted `dist/index.js`. The type import is gone; the function import remains.

**Remember:** for this Node ESM configuration, write `.js` in relative imports even though the source file is `.ts`. TypeScript resolves the source; emitted JavaScript resolves the built `.js` file. Bundler-based React/Next.js projects have different module-resolution conventions. Keep `src/product.ts` or remove it after this lab; later single-file labs don't depend on it. [Docs](https://www.typescriptlang.org/docs/handbook/modules/reference.html)

## 17. Classes and structural typing

**What it does:** implements a typed contract using a class and a plain object. A JavaScript private field keeps class state private at runtime.

```ts
interface Counter {
  increment(): number;
}

class MemoryCounter implements Counter {
  #value = 0;

  increment(): number {
    this.#value += 1;
    return this.#value;
  }
}

function advance(counter: Counter): void {
  console.log(counter.increment());
}

const counter = new MemoryCounter();
advance(counter);
advance(counter);
advance({ increment: () => 100 });

// advance({ increment: () => 'wrong' }); // error: must return number

export {};
```

**Expected:** `1`, `2`, `100`.

**Try it:** add another method to the `Counter` interface. Both implementations must now satisfy it.

**Remember:** compatible shape often matters more than an explicit class relationship. `implements` checks the instance contract; it doesn't add missing methods. JavaScript `#private` fields are runtime-private; TypeScript's `private` keyword primarily enforces access through the checker. [Docs](https://www.typescriptlang.org/docs/handbook/2/classes.html)

## 18. Function overloads

**What it does:** connects different input types to different return types while sharing one implementation.

```ts
function normalize(value: string): string;
function normalize(value: readonly string[]): string[];
function normalize(value: string | readonly string[]): string | string[] {
  if (typeof value === "string") return value.trim().toLowerCase();
  return value.map((item) => item.trim().toLowerCase());
}

const one = normalize(" HELLO ");
const many = normalize([" ONE ", " TWO "]);

console.log(one.toUpperCase());
console.log(many.join(", "));

// normalize(42); // error: no matching overload

export {};
```

**Expected:** `HELLO`, then `one, two`.

**Try it:** hover `one` and `many`. Remove the overload signatures and notice callers now see a union return type.

**Remember:** callers see the overload signatures, not a separate callable implementation signature. A union-typed argument may need a union overload or prior narrowing. Prefer a simple union parameter when overloads don't improve the return-type relationship. [Docs](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads)

## 19. Browser lab: typed DOM events

**Separate project.** This uses Vite to transform TypeScript for the browser. Run the following from a directory **outside** the Node practice project. Vite currently requires Node.js 20.19+ or 22.12+; use a supported LTS release meeting its requirements.

```bash
pnpm create vite@latest typescript-browser --template vanilla-ts
cd typescript-browser
pnpm install
```

Replace the two files below. Remove unused template source files if the generated project includes them and its lint settings flag them.

**`index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TypeScript DOM lab</title>
  </head>
  <body>
    <main>
      <h1>Typed task list</h1>
      <form id="task-form">
        <label for="task-input">Task</label>
        <input id="task-input" required />
        <button>Add</button>
      </form>
      <p id="summary" role="status"></p>
      <ul id="tasks"></ul>
    </main>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

**`src/main.ts`**

```ts
type Task = { id: string; title: string; done: boolean };

const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#tasks");
const summary = document.querySelector("#summary");

if (
  !(form instanceof HTMLFormElement) ||
  !(input instanceof HTMLInputElement) ||
  !(list instanceof HTMLUListElement) ||
  !(summary instanceof HTMLParagraphElement)
) {
  throw new Error("Required UI elements are missing");
}

// Pass narrowed elements into a function so its callbacks have precise types.
function setup(
  form: HTMLFormElement,
  input: HTMLInputElement,
  list: HTMLUListElement,
  summary: HTMLParagraphElement,
): void {
  let tasks: Task[] = [];

  function render(): void {
    list.replaceChildren();
    summary.textContent = `${tasks.filter((task) => !task.done).length} remaining`;

    for (const task of tasks) {
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = `${task.done ? "✓" : "○"} ${task.title}`;
      button.setAttribute("aria-pressed", String(task.done));
      button.addEventListener("click", () => {
        tasks = tasks.map((current) =>
          current.id === task.id
            ? { ...current, done: !current.done }
            : current,
        );
        render();
      });
      item.append(button);
      list.append(item);
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = input.value.trim();
    if (!title) return;
    tasks.push({ id: crypto.randomUUID(), title, done: false });
    input.value = "";
    render();
    input.focus();
  });

  render();
}

setup(form, input, list, summary);

export {};
```

Run:

```bash
pnpm exec tsc --noEmit
pnpm dev
```

Open the printed local URL. Add tasks and click them to toggle completion. Reload to reset the in-memory list.

**Try it:** rename the input's HTML `id` without changing the selector. The runtime check reports a missing element. Then add `priority: 'low' | 'high'` to `Task` and update task creation.

**Remember:** DOM queries may return `null` or the wrong element. `instanceof` checks actual elements; `querySelector<HTMLInputElement>(...)` only supplies a type assumption. Vite's dev server transforms TypeScript but doesn't replace a separate type-check command. `textContent` treats task text as text, not HTML. [DOM tutorial](https://www.typescriptlang.org/docs/handbook/dom-manipulation.html) · [Vite](https://vite.dev/guide/)

## 20. Checking intentional type errors

**Return to the Node practice project.** This exercise checks a type contract without executing invalid calls.

**Replace `src/index.ts`:**

```ts
type Status = "queued" | "done";

function describe(status: Status): string {
  return `Status: ${status}`;
}

// The checker inspects this function, but the program never calls it.
function typeChecks(): void {
  // @ts-expect-error: unknown status must be rejected
  describe("missing");

  // @ts-expect-error: status must not accept numbers
  describe(123);
}

console.log(describe("queued"));

export {};
```

**Expected:** type checking passes and runtime output is `Status: queued`.

**Try it:** change the first invalid call to `describe('done')`. TypeScript reports an unused `@ts-expect-error`, because that line no longer has an error. Restore it afterward.

**Remember:** `@ts-expect-error` expects some diagnostic on the next line; it doesn't prove a particular error message. Use it sparingly for negative type tests. Unlike `@ts-ignore`, it warns when no error remains. The setup intentionally doesn't enable `noUnusedLocals`, so this uncalled demonstration function is allowed. [Docs](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html#ts-expect-error-comments)

## Quick reference and challenges

### Types versus runtime behavior

| Syntax                      | Meaning                                     | Does it validate runtime data?      |
| --------------------------- | ------------------------------------------- | ----------------------------------- |
| `value: T`                  | Declare an expected type                    | No                                  |
| `value as T`                | Assert a type to the checker                | No                                  |
| `value!`                    | Assert non-null/defined                     | No                                  |
| `value satisfies T`         | Check compatibility while keeping inference | No                                  |
| `as const`                  | Keep literal/readonly types                 | No                                  |
| `typeof value === 'string'` | Inspect a runtime primitive type            | Yes, for this condition             |
| `value instanceof Error`    | Inspect a runtime class relationship        | Yes, for this condition             |
| Schema / custom validator   | Inspect external data at runtime            | Only what its checks actually cover |

### Frequently confused types

| Type                      | Use                                                                |
| ------------------------- | ------------------------------------------------------------------ | ----------- |
| `unknown`                 | Input whose type has not yet been established                      |
| `any`                     | Escape hatch that bypasses checks and can propagate unsafety       |
| `never`                   | Impossible values / functions that never return normally           |
| `void`                    | A function result the caller should ignore                         |
| `object`                  | A non-primitive value; doesn't identify its fields                 |
| `{}`                      | Any non-nullish value, including primitives; not “an empty object” |
| `Record<string, unknown>` | A string-keyed dictionary of not-yet-validated values              |
| `T[]`                     | Array of values of type `T`                                        |
| `[A, B]`                  | Tuple with specific positions                                      |
| `A                        | B`                                                                 | Either type |
| `A & B`                   | Must satisfy both types                                            |

### Common mistakes

- **Annotating every local variable:** inference often produces clearer code.
- **Using `any` to fix an error:** narrow `unknown` or improve the data model instead.
- **Asserting API responses:** `as Product` neither converts values nor validates JSON.
- **Treating types as sanitization:** `Pick`/`Omit` don't remove runtime properties.
- **Confusing readonly with immutability:** aliases and nested objects can remain mutable.
- **Assuming `number` means valid business data:** check finiteness, ranges and integer requirements at runtime.
- **Ignoring missing array values:** account for empty arrays and invalid indexes.
- **Using `!` everywhere:** a non-null assertion can hide a real missing value.
- **Trusting a generic `parse<T>`:** the caller's type parameter cannot establish input validity.
- **Expecting declarations to implement behavior:** `.d.ts` files describe runtime APIs; they don't create them.
- **Running `tsc src/index.ts` and assuming project settings apply:** use `pnpm typecheck` or `pnpm exec tsc -p tsconfig.json` to use the config.
- **Changing module settings randomly:** runtime, bundler, file extensions and package `type` must agree.
- **Relying only on a dev server:** many tools transpile without checking types.

### Practical workflow

```bash
# Check without emitting JavaScript
pnpm typecheck

# Compile and run the current core lab
pnpm start

# Keep the checker running as you edit
pnpm exec tsc --noEmit --watch

# Check the local compiler version
pnpm exec tsc --version
```

### Practice challenges

- [ ] Create a `Result<T, E>` generic with independently typed success and error values.
- [ ] Add a new state to lab 8 and use exhaustiveness checking to find every missing branch.
- [ ] Write a validator for an array of products; reject invalid elements without using `any`.
- [ ] Create a generic `groupBy` that returns arrays grouped by a typed string key.
- [ ] Write `Readonly<...>` examples demonstrating shallow readonly behavior.
- [ ] Extend the DOM lab with delete and filter controls using a literal union for filter modes.
- [ ] Add localStorage persistence to the DOM lab and validate stored JSON before using it.
- [ ] Extract the DOM task model into a type-only module.
- [ ] Compare an explicit type annotation, `satisfies` and `as` on the same config object.

### Further reading

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Playground](https://www.typescriptlang.org/play) — inspect inferred types and emitted JavaScript without installing tools
- [TSConfig reference](https://www.typescriptlang.org/tsconfig/)
- [Utility types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [Module configuration guidance](https://www.typescriptlang.org/docs/handbook/modules/guides/choosing-compiler-options.html)
- [React with TypeScript](https://react.dev/learn/typescript) — apply these ideas to props, state, events and refs

Reference baseline: official TypeScript and Vite documentation, checked **1 October 2026**. Examples use modern TypeScript syntax and the explicit configs shown above. They are original teaching exercises, not production-ready application code.

Validation: all 19 Node-based exercises passed the supplied strict compiler configuration and their expected console outputs were checked using TypeScript 6.0.3 and Node.js 24.19.0. The browser exercise passed strict type checking with DOM libraries; browser interaction was not run.
