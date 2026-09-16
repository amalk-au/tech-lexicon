# JEST testing basics

[Back to the Jest main index](./README.md)

**Jest** is a popular JavaScript testing framework developed by Facebook, widely used for unit testing JavaScript and React applications due to its simplicity and built-in features[^3][^4][^8].

## Getting Started with Jest

**1. Installation**

- For most projects, install Jest as a development dependency:

```bash
npm install --save-dev jest
```

- If you want to use the CLI globally, you can run:

```bash
npm install -g jest
```

- For React projects created with Create React App, Jest comes pre-installed[^3][^1].

**2. Project Setup**

- Initialize your project if you haven’t already:

```bash
npm init -y
```

- In your `package.json`, set up the test script:

```json
"scripts": {
  "test": "jest"
}
```

This allows you to run tests with `npm test` or `npm run test`[^1][^3].

**3. Writing a Test**

- Create a JavaScript file with the code you want to test, for example, `sum.js`:

```js
function sum(a, b) {
  return a + b;
}
module.exports = sum;
```

- Create a test file, e.g., `sum.test.js`:

```js
const sum = require("./sum");
test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});
```

- Run your tests:

```bash
npm test
```

Jest will automatically find files with `.test.js` or `.spec.js` extensions[^3][^1].

## Core Jest Syntax

- **test or it**: Defines a test case.

```js
test("description", () => {
  /* assertions */
});
// or
it("description", () => {
  /* assertions */
});
```

- **expect**: Used to create assertions about values.

```js
expect(value).toBe(expectedValue);
```

- **Matchers**: Methods like `.toBe()`, `.toEqual()`, `.toBeTruthy()`, etc., are used to compare values[^1][^3].

## Organizing Tests

- **describe**: Groups related tests together for better organization.

```js
describe("sum function", () => {
  test("adds numbers", () => {
    /* ... */
  });
});
```

## Testing Asynchronous Code

Jest supports testing asynchronous code using `async/await` or by returning Promises[^3].

## Advanced Features

- **Mocking**: Jest can mock functions, modules, and timers to isolate units of code[^2].
- **React Testing**: Jest integrates well with React for component testing[^4].
- **Configuration**: Jest can be configured via a `jest.config.js` file or in `package.json`[^2].

Jest is known for its fast performance, zero-config setup for many projects, and powerful features like snapshot testing and mocking[^4] [^8].

<div style="text-align: center">⁂</div>

[^1]: https://www.testim.io/blog/jest-testing-a-helpful-introductory-tutorial/

[^2]: https://www.tutorialspoint.com/jest/index.htm

[^3]: https://www.geeksforgeeks.org/javascript/testing-with-jest/

[^4]: https://www.lambdatest.com/jest

[^5]: https://saucelabs.com/resources/blog/jest

[^6]: https://jestjs.io/docs/getting-started

[^7]: https://www.youtube.com/watch?v=x6NUZ8dc9Qg

[^8]: https://jestjs.io

[^9]: https://www.browserstack.com/guide/jest-framework-tutorial
