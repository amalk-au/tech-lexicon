# Vitest basics

[Back to the Vitest main index](./README.md)

**Vitest** is a modern JavaScript testing framework built on top of Vite, designed for speed, simplicity, and seamless integration with modern front-end projects (like React, Vue, and Svelte). It is especially well-suited for projects already using Vite as their build tool.

## Key Vitest Basics

- **Speed:** Vitest is significantly faster than Jest, especially in watch mode, because it leverages Vite’s lightning-fast dev server and hot module reloading. Tests only rerun for affected code, resulting in rapid feedback[^1] [^2] [^6].
- **Developer Experience:** Minimal setup is needed—Vitest uses your existing Vite configuration, so you don’t have to maintain separate pipelines for development and testing[^1][^5].
- **API Compatibility:** Vitest’s API is very similar to Jest’s. You can use familiar functions like `test`, `expect`, and mocking utilities, but you import them from `vitest` (using `vi` for mocks instead of `jest`)[^1] [^5] [^7].
- **TypeScript Support:** Native TypeScript support with no extra configuration required [^1].
- **Mocking:** Powerful mocking and spying tools are available via the `vi` object, mirroring Jest’s mocking capabilities[^1][^5].


## Basic Syntax Example

```js
import { test, expect, vi } from 'vitest';

function sum(a, b) {
  return a + b;
}

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

// Mocking example
const fetchData = vi.fn(() => Promise.resolve('data'));
test('fetchData mock returns data', async () => {
  await expect(fetchData()).resolves.toBe('data');
});
```

- You can use global test functions if you enable that in your config, or import them explicitly as shown above[^1].
- For mocking, use `vi.mock()` and `vi.fn()`, which are nearly identical to Jest’s `jest.mock()` and `jest.fn()`[^1].


## When to Use Vitest

- **Best for projects using Vite** (especially React, Vue, or Svelte).
- If you want **blazing-fast test runs** and instant feedback during development[^1] [^2] [^6].
- If you want a **minimal, modern setup** with TypeScript and ESM support out of the box[^1] [^5].


## Summary Table: Vitest vs Jest

| Feature | Vitest | Jest |
| :-- | :-- | :-- |
| **Speed** | Very fast, instant updates | Good, but slower for large projects |
| **Integration** | Seamless with Vite projects | Works everywhere |
| **API** | Jest-compatible, uses `vi` for mocks | Jest's own API, global functions |
| **TypeScript** | Native support | Needs config |
| **Watch Mode** | Ultra-fast, hot reload | Interactive, stable |
| **Snapshot** | Supported | Built-in |

Vitest is an excellent choice for modern JavaScript projects prioritizing speed and developer experience, especially if you are already using Vite[^1] [^2] [^5].

[^1]: https://betterstack.com/community/guides/scaling-nodejs/vitest-vs-jest/

[^2]: https://www.divotion.com/blog/why-vitest-might-be-better-than-jest-for-your-javascript-projects

[^3]: https://www.capicua.com/blog/jest-vs-vitest

[^4]: https://www.reddit.com/r/reactjs/comments/10zyse3/is_jest_still_faster_than_vitest/

[^5]: https://vitest.dev/guide/comparisons

[^6]: https://www.speakeasy.com/blog/vitest-vs-jest

[^7]: https://saucelabs.com/resources/blog/vitest-vs-jest-comparison

[^8]: https://dev.to/thejaredwilcurt/vitest-vs-jest-benchmarks-on-a-5-year-old-real-work-spa-4mf1

[^9]: https://news.ycombinator.com/item?id=42245442

[^10]: https://javascript.plainenglish.io/jest-vs-vitest-in-a-react-project-which-one-should-you-use-in-2025-2c254ddfd6f8

