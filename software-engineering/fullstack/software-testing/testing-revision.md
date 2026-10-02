# Vitest / Jest + React Testing Library + Playwright

[Back to the topic index](./README.md)

A hands-on revision guide for **JavaScript, React, pnpm, and Ubuntu**. Build one small task app, then test its logic, components, and browser behavior.

**Learning route:** sections 1–5 for Vitest + React Testing Library; section 6 for the equivalent Jest setup; section 7 for Playwright. Sections 8–12 are revision and practice material. In a normal project, choose one unit/component runner. Both are included here for learning.

## Contents

- [1. What each tool does](#1-what-each-tool-does)
- [2. Create the project](#2-create-the-project)
- [3. Build the practice app](#3-build-the-practice-app)
- [4. Configure Vitest + React Testing Library](#4-configure-vitest--react-testing-library)
- [5. Write and run Vitest tests](#5-write-and-run-vitest-tests)
- [6. Try the same app with Jest](#6-try-the-same-app-with-jest)
- [7. Add Playwright browser tests](#7-add-playwright-browser-tests)
- [8. Revision cheat sheets](#8-revision-cheat-sheets)
- [9. Mocking and fake timers](#9-mocking-and-fake-timers)
- [10. Learn by doing](#10-learn-by-doing)
- [11. Optional GitHub Actions workflow](#11-optional-github-actions-workflow)
- [12. Troubleshooting and official docs](#12-troubleshooting-and-official-docs)

## 1. What each tool does

| Tool                            | Responsibility                                                                                                          | Typical use                                                |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| **Vitest**                      | Finds/runs tests; provides assertions, mocks, hooks, and coverage. Integrates with Vite's transforms/configuration.     | Test a function or React component in a Vite project.      |
| **Jest**                        | Another test runner with assertions, mocks, hooks, and coverage. This guide uses Babel to transform JSX and imports.    | Test JavaScript/React in a project that uses Jest.         |
| **React Testing Library (RTL)** | Renders React components into a DOM and finds elements using user-facing queries. Uses a runner such as Vitest or Jest. | Check what a user sees and can do in a component.          |
| **`user-event`**                | Simulates interactions such as typing, clicking, and keyboard navigation.                                               | Fill a form and submit it in an RTL test.                  |
| **`jest-dom`**                  | Adds DOM assertions to Vitest/Jest, such as `toBeInTheDocument()` and `toBeChecked()`.                                  | Assert that a control is disabled or a message is visible. |
| **Playwright Test**             | Runs tests against real browser engines; supplies fixtures, locators, retrying assertions, and traces.                  | Test an app through its running web server.                |

**Unit test:** one piece of logic. **Component/integration test:** a component and its collaborating logic. **End-to-end (E2E) test:** a user flow through the running app.

The Vitest/Jest examples use **jsdom**, a DOM implementation in Node.js. It does not provide a real browser's layout or rendering. Use Playwright for behavior that depends on the browser. Browser tests with mocked responses still test the frontend in a browser; they do not verify a real backend.

Sources: [Vitest overview](https://vitest.dev/guide/), [Jest overview](https://jestjs.io/), [RTL setup](https://testing-library.com/docs/react-testing-library/setup/), [Playwright introduction](https://playwright.dev/docs/intro).

## 2. Create the project

Use a current **Node.js 24.x** release and an installed pnpm. The commands below run in an Ubuntu terminal. No global test-runner installation is needed.

```bash
node --version
pnpm --version

mkdir react-testing-lab
cd react-testing-lab
mkdir -p src/test public e2e jest-tests
```

All paths below are relative to `react-testing-lab/`. Create each file at its labelled path. Start with this complete `package.json`; dependency commands will add its dependency fields.

### `package.json`

```json
{
  "name": "react-testing-lab",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:jest": "jest",
    "test:jest:watch": "jest --watchAll",
    "test:jest:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

Install the app and the Vitest/RTL tools:

```bash
pnpm add react@19 react-dom@19
pnpm add -D vite@8 @vitejs/plugin-react@6 vitest@5 @vitest/coverage-v8@5 jsdom@30 \
  @testing-library/react@16 @testing-library/dom@10 \
  @testing-library/jest-dom@7 @testing-library/user-event@14
```

`@testing-library/dom` is a peer dependency of RTL. Install the Vitest coverage package alongside Vitest and keep their versions aligned. Jest and Playwright scripts become usable after installing those tools in sections 6 and 7.

These commands pin compatible major versions; the lockfile records the exact releases. Commit **`package.json` and `pnpm-lock.yaml`** after installation. On another machine, use `pnpm install --frozen-lockfile`.

### `.gitignore`

```gitignore
node_modules/
dist/
coverage/
.vitest/
test-results/
playwright-report/
playwright/.cache/
.env
.env.*
!.env.example
```

| Location            | Purpose                           |
| ------------------- | --------------------------------- |
| `src/`              | App source and Vitest test files. |
| `src/test/`         | Vitest setup.                     |
| `jest-tests/`       | Jest setup and Jest-only tests.   |
| `e2e/`              | Playwright-only tests.            |
| `public/tasks.json` | Local sample data served by Vite. |

Sources: [Vite setup and Node requirements](https://vite.dev/guide/), [Vitest requirements](https://vitest.dev/guide/), [RTL installation](https://testing-library.com/docs/react-testing-library/intro/).

## 3. Build the practice app

The app adds tasks, validates input, marks tasks complete, and loads example tasks from a local JSON file. There is no backend to set up. Reloading resets its in-memory state.

### `index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React testing lab</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### `vite.config.js`

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
```

### `src/main.jsx`

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

### `src/tasks.js`

```js
export function normalizeTask(input) {
  const text = input.trim();

  if (!text) throw new Error("Task is required");
  if (text.length > 60) {
    throw new Error("Task must be 60 characters or fewer");
  }

  return text;
}
```

### `src/api.js`

```js
export async function fetchTasks() {
  const response = await fetch("/tasks.json");

  if (!response.ok) throw new Error("Could not load tasks");

  return response.json();
}
```

### `public/tasks.json`

```json
["Review assertions", "Write a browser test"]
```

### `src/App.jsx`

```jsx
import { useRef, useState } from "react";
import { normalizeTask } from "./tasks.js";
import { fetchTasks } from "./api.js";

export default function App({ loadTasks = fetchTasks, onAdd = () => {} }) {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nextId = useRef(1);

  function handleSubmit(event) {
    event.preventDefault();

    try {
      const text = normalizeTask(input);
      const task = { id: nextId.current++, text, done: false };
      setTasks((current) => [...current, task]);
      setInput("");
      setError("");
      onAdd(text);
    } catch (cause) {
      setError(cause.message);
    }
  }

  function toggleTask(id) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    );
  }

  async function handleLoad() {
    setLoading(true);
    setError("");

    try {
      const texts = await loadTasks();
      setTasks(
        texts.map((text) => ({
          id: nextId.current++,
          text,
          done: false,
        })),
      );
    } catch (cause) {
      setError(cause.message);
    } finally {
      setLoading(false);
    }
  }

  const completed = tasks.filter((task) => task.done).length;

  return (
    <main>
      <h1>Task practice</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="task">Task</label>
        <input
          id="task"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <button type="submit">Add task</button>
      </form>

      {error && <p role="alert">{error}</p>}
      <p>
        Tasks: {tasks.length}; completed: {completed}
      </p>
      {tasks.length === 0 && <p>No tasks yet</p>}

      <ul aria-label="Tasks">
        {tasks.map((task) => (
          <li key={task.id}>
            <label>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(task.id)}
              />
              {task.text}
            </label>
          </li>
        ))}
      </ul>

      <button type="button" onClick={handleLoad} disabled={loading}>
        Load examples
      </button>
      {loading && <p role="status">Loading tasks…</p>}
    </main>
  );
}
```

`loadTasks` lets a component test control async results. `onAdd` lets a test verify a callback's contract. These are ordinary props; the production app uses their defaults. Loading examples replaces the existing list.

Try it manually:

```bash
pnpm dev
```

Open the URL Vite prints. Add a task, submit an empty task, tick a checkbox, then load examples. Stop the server with **Ctrl+C** when finished.

## 4. Configure Vitest + React Testing Library

### `vitest.config.js`

```js
import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.js";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      globals: false,
      setupFiles: ["./src/test/setup-vitest.js"],
      include: ["src/**/*.test.{js,jsx}"],
      clearMocks: true,
      restoreMocks: true,
      unstubGlobals: true,
      coverage: {
        provider: "v8",
        include: ["src/**/*.{js,jsx}"],
        exclude: ["src/main.jsx", "src/test/**", "src/**/*.test.{js,jsx}"],
        reportsDirectory: "coverage/vitest",
        reporter: ["text", "html"],
      },
    },
  }),
);
```

### `src/test/setup-vitest.js`

```js
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});
```

`jsdom` supplies the DOM; `setupFiles` runs before each test file; `jest-dom/vitest` adds DOM matchers. With Vitest globals disabled, this explicit `afterEach` removes rendered components between tests. `include` keeps Jest and Playwright files out of this runner. Merging the Vite config preserves its React transform.

Sources: [Vitest config](https://vitest.dev/config/), [RTL cleanup](https://testing-library.com/docs/react-testing-library/setup/#auto-cleanup-in-vitest), [jest-dom with Vitest](https://github.com/testing-library/jest-dom#with-vitest), [coverage](https://vitest.dev/guide/coverage).

## 5. Write and run Vitest tests

### 5.1 Pure logic — `src/tasks.test.js`

```js
import { describe, expect, test } from "vitest";
import { normalizeTask } from "./tasks.js";

describe("normalizeTask", () => {
  test.each([
    ["  Learn assertions  ", "Learn assertions"],
    ["Review mocks", "Review mocks"],
    ["x".repeat(60), "x".repeat(60)],
  ])("normalizes %j", (input, expected) => {
    expect(normalizeTask(input)).toBe(expected);
  });

  test.each(["", "   ", "\n\t"])("rejects blank input %j", (input) => {
    expect(() => normalizeTask(input)).toThrow("Task is required");
  });

  test("rejects 61 characters", () => {
    expect(() => normalizeTask("x".repeat(61))).toThrow(
      "Task must be 60 characters or fewer",
    );
  });
});
```

`describe` groups tests; `test.each` repeats a test with several inputs. Pass a **function** to `toThrow`, so the runner can observe the thrown error. Testing 60 and 61 checks the boundary.

### 5.2 User behavior — `src/App.test.jsx`

```jsx
import { expect, test, vi } from "vitest";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App.jsx";

test("starts with an empty list", () => {
  render(<App />);

  expect(
    screen.getByRole("heading", { name: "Task practice" }),
  ).toBeInTheDocument();
  expect(screen.getByText("No tasks yet")).toBeVisible();
  expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
});

test("adds a trimmed task and calls onAdd", async () => {
  const user = userEvent.setup();
  const onAdd = vi.fn();
  render(<App onAdd={onAdd} />);

  await user.type(
    screen.getByRole("textbox", { name: "Task" }),
    "  Read docs  ",
  );
  await user.click(screen.getByRole("button", { name: "Add task" }));

  const list = screen.getByRole("list", { name: "Tasks" });
  expect(
    within(list).getByRole("checkbox", { name: "Read docs" }),
  ).not.toBeChecked();
  expect(within(list).getAllByRole("listitem")).toHaveLength(1);
  expect(screen.getByRole("textbox", { name: "Task" })).toHaveValue("");
  expect(onAdd).toHaveBeenCalledTimes(1);
  expect(onAdd).toHaveBeenCalledWith("Read docs");
});

test("shows validation and does not add a blank task", async () => {
  const user = userEvent.setup();
  const onAdd = vi.fn();
  render(<App onAdd={onAdd} />);

  await user.click(screen.getByRole("button", { name: "Add task" }));

  expect(screen.getByRole("alert")).toHaveTextContent("Task is required");
  expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  expect(onAdd).not.toHaveBeenCalled();
});

test("marks a task complete", async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.type(screen.getByLabelText("Task"), "Practice testing");
  await user.click(screen.getByRole("button", { name: "Add task" }));
  const checkbox = screen.getByRole("checkbox", { name: "Practice testing" });
  await user.click(checkbox);

  expect(checkbox).toBeChecked();
  expect(screen.getByText("Tasks: 1; completed: 1")).toBeVisible();
});

test("shows loading until the async request finishes", async () => {
  const user = userEvent.setup();
  let resolveTasks;
  const pending = new Promise((resolve) => {
    resolveTasks = resolve;
  });
  const loadTasks = vi.fn().mockReturnValue(pending);
  render(<App loadTasks={loadTasks} />);

  await user.click(screen.getByRole("button", { name: "Load examples" }));

  expect(screen.getByRole("status")).toHaveTextContent("Loading tasks");
  expect(screen.getByRole("button", { name: "Load examples" })).toBeDisabled();

  // Resolving outside an interaction can trigger React updates: wrap in act.
  await act(async () => {
    resolveTasks(["Review async tests"]);
    await pending;
  });

  expect(
    await screen.findByRole("checkbox", { name: "Review async tests" }),
  ).toBeInTheDocument();
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Load examples" })).toBeEnabled();
  expect(loadTasks).toHaveBeenCalledTimes(1);
});

test("shows an async failure", async () => {
  const user = userEvent.setup();
  const loadTasks = vi.fn().mockRejectedValue(new Error("Service unavailable"));
  render(<App loadTasks={loadTasks} />);

  await user.click(screen.getByRole("button", { name: "Load examples" }));

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Service unavailable",
  );
  expect(screen.getByRole("button", { name: "Load examples" })).toBeEnabled();
});
```

Use **Arrange → Act → Assert**: create/render what the test needs, perform the action, then check its observable result. `within(list)` scopes queries. `userEvent.setup()` creates an interaction session; await its actions. A controlled promise keeps the loading test deterministic.

RTL already wraps normal rendering/interactions in React's `act`. Explicit `act` is useful here because the test manually resolves a promise. Prefer awaiting the correct interaction/query before reaching for it elsewhere.

### 5.3 HTTP success/failure — `src/api.test.js`

```js
import { expect, test, vi } from "vitest";
import { fetchTasks } from "./api.js";

test("requests the task file and returns its data", async () => {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ["Test the API helper"],
  });
  vi.stubGlobal("fetch", fetchMock);

  await expect(fetchTasks()).resolves.toEqual(["Test the API helper"]);
  expect(fetchMock).toHaveBeenCalledWith("/tasks.json");
});

test("rejects an unsuccessful HTTP response", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

  await expect(fetchTasks()).rejects.toThrow("Could not load tasks");
});

test("propagates a network failure", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockRejectedValue(new Error("Network offline")),
  );

  await expect(fetchTasks()).rejects.toThrow("Network offline");
});
```

`vi.stubGlobal` replaces `fetch` for the test. `unstubGlobals: true` in the config restores it between tests. These assertions check the helper's request/result contract; they do not contact a server.

### Run the tests

```bash
pnpm test                         # Watch while editing; q quits
pnpm test:run                     # One run; useful in CI
pnpm exec vitest run src/App.test.jsx
pnpm exec vitest run -t 'marks a task complete'
pnpm test:coverage                # Terminal + coverage/vitest/index.html
pnpm build                       # Check the app bundles
```

**Checkpoint:** 16 tests pass before the optional timer example. Watch mode stays open by design. Coverage shows which code executed; high coverage alone does not prove the assertions are useful.

Sources: [Vitest test API](https://vitest.dev/api/test), [user-event](https://testing-library.com/docs/user-event/intro/), [RTL API and act](https://testing-library.com/docs/react-testing-library/api/), [Vitest global stubs](https://vitest.dev/api/vi#vi-stubglobal).

## 6. Try the same app with Jest

Use the same app files from section 3. Jest has its **own transform pipeline** here: it runs source through Babel, rather than using Vite plugins. This plain JSX/import example is deliberately compatible with that setup.

If you later add Vite aliases, CSS/assets imports, or `import.meta.env`, configure their Jest handling separately. Jest does not inherit Vite's configuration.

From the project root:

```bash
pnpm add -D jest@30 @jest/globals@30 babel-jest@30 jest-environment-jsdom@30 \
  @babel/core@7 @babel/preset-env@7 @babel/preset-react@7
```

The matching Jest majors and Babel 7 keep this setup consistent. `jest-environment-jsdom` is installed separately. Use **`.cjs`** for the two config files because the app's `package.json` declares `"type": "module"`.

If pnpm reports ignored dependency build scripts, run `pnpm approve-builds` and review the packages it lists, then rerun the install command. Keep the generated build-policy file with the project so the same decisions apply in CI. See section 12 for details.

### `babel.config.cjs`

```js
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      { targets: { node: "current" }, modules: "commonjs" },
    ],
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
};
```

### `jest.config.cjs`

```js
module.exports = {
  testEnvironment: "jsdom",
  injectGlobals: false,
  setupFilesAfterEnv: ["<rootDir>/jest-tests/setup.js"],
  testMatch: ["<rootDir>/jest-tests/**/*.test.{js,jsx}"],
  transform: { "^.+\\.jsx?$": "babel-jest" },
  clearMocks: true,
  restoreMocks: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/main.jsx",
    "!src/test/**",
    "!src/**/*.test.{js,jsx}",
  ],
  coverageDirectory: "coverage/jest",
};
```

### `jest-tests/setup.js`

```js
import "@testing-library/jest-dom/jest-globals";
import { cleanup } from "@testing-library/react";
import { afterEach } from "@jest/globals";

afterEach(() => {
  cleanup();
});
```

`injectGlobals: false` makes the runner imports explicit. The `jest-globals` entry extends the imported Jest `expect`; explicit cleanup works with globals disabled.

### `jest-tests/tasks.test.js`

```js
import { describe, expect, test } from "@jest/globals";
import { normalizeTask } from "../src/tasks.js";

describe("normalizeTask", () => {
  test.each([
    ["  Learn assertions  ", "Learn assertions"],
    ["x".repeat(60), "x".repeat(60)],
  ])("normalizes %j", (input, expected) => {
    expect(normalizeTask(input)).toBe(expected);
  });

  test("rejects blank input", () => {
    expect(() => normalizeTask("   ")).toThrow("Task is required");
  });

  test("rejects 61 characters", () => {
    expect(() => normalizeTask("x".repeat(61))).toThrow(
      "Task must be 60 characters or fewer",
    );
  });
});
```

### `jest-tests/App.test.jsx`

```jsx
import { expect, jest, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../src/App.jsx";

test("adds a task and calls the callback", async () => {
  const user = userEvent.setup();
  const onAdd = jest.fn();
  render(<App onAdd={onAdd} />);

  await user.type(
    screen.getByRole("textbox", { name: "Task" }),
    "  Read docs  ",
  );
  await user.click(screen.getByRole("button", { name: "Add task" }));

  expect(
    screen.getByRole("checkbox", { name: "Read docs" }),
  ).toBeInTheDocument();
  expect(onAdd).toHaveBeenCalledTimes(1);
  expect(onAdd).toHaveBeenCalledWith("Read docs");
});

test("loads tasks asynchronously", async () => {
  const user = userEvent.setup();
  const loadTasks = jest.fn().mockResolvedValue(["Practice Jest"]);
  render(<App loadTasks={loadTasks} />);

  await user.click(screen.getByRole("button", { name: "Load examples" }));

  expect(
    await screen.findByRole("checkbox", { name: "Practice Jest" }),
  ).toBeInTheDocument();
  expect(loadTasks).toHaveBeenCalledTimes(1);
});

test("shows an async error", async () => {
  const user = userEvent.setup();
  const loadTasks = jest
    .fn()
    .mockRejectedValue(new Error("Service unavailable"));
  render(<App loadTasks={loadTasks} />);

  await user.click(screen.getByRole("button", { name: "Load examples" }));

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Service unavailable",
  );
});
```

```bash
pnpm test:jest                    # One run: 7 tests pass
pnpm test:jest:watch              # Watch all tests, including outside a Git repo
pnpm exec jest jest-tests/App.test.jsx --runInBand
pnpm exec jest -t 'loads tasks asynchronously'
pnpm test:jest:coverage
```

To port the full Vitest component suite, copy it into `jest-tests/`, change its runner import to `@jest/globals`, replace `vi.fn()` with `jest.fn()`, and change `./App.jsx` to `../src/App.jsx`. RTL interactions, queries, and the assertions used here stay the same.

For a Jest test of `fetchTasks`, use the **Node environment**, which supplies `fetch` in Node 24, then spy on it. This also demonstrates running a non-DOM test:

### `jest-tests/api.test.js`

```js
/** @jest-environment node */
import { expect, jest, test } from "@jest/globals";
import { fetchTasks } from "../src/api.js";

test("returns task data", async () => {
  const fetchSpy = jest.spyOn(globalThis, "fetch").mockResolvedValue({
    ok: true,
    json: async () => ["Practice Jest mocks"],
  });

  await expect(fetchTasks()).resolves.toEqual(["Practice Jest mocks"]);
  expect(fetchSpy).toHaveBeenCalledWith("/tasks.json");
});

test("rejects HTTP errors", async () => {
  jest.spyOn(globalThis, "fetch").mockResolvedValue({ ok: false });

  await expect(fetchTasks()).rejects.toThrow("Could not load tasks");
});
```

With this API file added, Jest runs **9 tests**. `restoreMocks: true` restores the original `fetch` before each test. The shared setup does not render a component in the Node tests.

Sources: [Jest getting started/Babel](https://jestjs.io/docs/getting-started), [Jest configuration](https://jestjs.io/docs/configuration), [Babel React preset](https://babeljs.io/docs/babel-preset-react), [jest-dom with imported globals](https://github.com/testing-library/jest-dom#with-jestglobals).

## 7. Add Playwright browser tests

Install Playwright and its Chromium browser. On Ubuntu, `--with-deps` also installs required system libraries and may request sudo for that step.

```bash
pnpm add -D @playwright/test@1
pnpm exec playwright install --with-deps chromium
```

### `playwright.config.js`

```js
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:5173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "pnpm dev --host 127.0.0.1 --port 5173 --strictPort",
    url: "http://127.0.0.1:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
```

`webServer` starts Vite, waits until it is ready, and stops the process it started. Locally it can reuse a server already on that URL; ensure it is this app. `--strictPort` prevents silently switching ports. `baseURL` lets tests navigate with `page.goto('/')`. Traces capture failure details even without a retry.

### `e2e/tasks.spec.js`

```js
import { expect, test } from "@playwright/test";

test("adds and completes a task in the browser", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Task practice" }),
  ).toBeVisible();

  await page.getByRole("textbox", { name: "Task" }).fill("Read browser docs");
  await page.getByRole("button", { name: "Add task" }).click();
  const checkbox = page.getByRole("checkbox", { name: "Read browser docs" });
  await checkbox.check();

  await expect(checkbox).toBeChecked();
  await expect(
    page.getByText("Tasks: 1; completed: 1", { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Task" })).toHaveValue("");
});

test("shows validation for a blank task", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Add task" }).click();

  await expect(page.getByRole("alert")).toHaveText("Task is required");
  await expect(page.getByRole("listitem")).toHaveCount(0);
});

test("loads the actual local task file", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Load examples" }).click();

  await expect(
    page.getByRole("checkbox", { name: "Review assertions" }),
  ).toBeVisible();
  await expect(page.getByRole("listitem")).toHaveCount(2);
});

test("uses a controlled HTTP response", async ({ page }) => {
  // Register interception before triggering the request.
  await page.route("**/tasks.json", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(["Task from a mocked response"]),
    }),
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Load examples" }).click();

  await expect(
    page.getByRole("checkbox", { name: "Task from a mocked response" }),
  ).toBeVisible();
  await expect(page.getByRole("listitem")).toHaveCount(1);
});

test("shows an HTTP failure", async ({ page }) => {
  await page.route("**/tasks.json", (route) =>
    route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ error: "Unavailable" }),
    }),
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Load examples" }).click();

  await expect(page.getByRole("alert")).toHaveText("Could not load tasks");
  await expect(
    page.getByRole("button", { name: "Load examples" }),
  ).toBeEnabled();
});
```

**Checkpoint:** 5 Chromium tests pass. Playwright gives each test its own browser context/page, so tests start with separate browser state. Here, the app also starts with an empty list on each navigation.

```bash
pnpm test:e2e                          # Headless Chromium
pnpm test:e2e:ui                       # Interactive UI mode
pnpm exec playwright test --headed
pnpm exec playwright test --debug
pnpm exec playwright test -g 'adds and completes'
pnpm exec playwright show-report
```

To record actions, start the app in one terminal, then run the recorder in another:

```bash
# Terminal 1
pnpm dev --host 127.0.0.1 --port 5173 --strictPort
```

```bash
# Terminal 2
pnpm exec playwright codegen http://127.0.0.1:5173
```

Review generated locators and assertions before keeping them. To inspect a failed test, open its trace from the HTML report; a local trace can also be opened with `pnpm exec playwright show-trace path/to/trace.zip`.

For Firefox and WebKit, install their browsers and add the following entries to the existing `projects` array:

```bash
pnpm exec playwright install --with-deps firefox webkit
```

```js
{ name: 'firefox', use: { ...devices['Desktop Firefox'] } },
{ name: 'webkit', use: { ...devices['Desktop Safari'] } },
```

Sources: [installation](https://playwright.dev/docs/intro), [web server](https://playwright.dev/docs/test-webserver), [assertions](https://playwright.dev/docs/test-assertions), [network interception](https://playwright.dev/docs/network), [CLI/debugging](https://playwright.dev/docs/test-cli).

## 8. Revision cheat sheets

### Which test belongs where?

| Question                                                        | Tool in this guide                                                                                          |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Does trimming/validation work at the boundary?                  | Vitest/Jest unit test.                                                                                      |
| Does submitting the form show a task and call its callback?     | RTL + Vitest/Jest.                                                                                          |
| Does the component show loading, success, and failure?          | RTL + a controlled dependency.                                                                              |
| Does the app actually render and work after browser navigation? | Playwright.                                                                                                 |
| Does a real backend/database complete the flow?                 | Playwright pointed at that full stack, with isolated test data. The local JSON example does not cover this. |

### RTL queries

| Query                 | No match                          | Multiple matches                            | Use when                                                |
| --------------------- | --------------------------------- | ------------------------------------------- | ------------------------------------------------------- |
| `getByRole(...)`      | Throws immediately.               | Throws.                                     | One element should exist now.                           |
| `queryByRole(...)`    | Returns `null`.                   | Throws.                                     | Checking that an element is absent.                     |
| `findByRole(...)`     | Retries, then rejects on timeout. | Retries, then rejects if ambiguity remains. | One element should appear asynchronously; **await it**. |
| `getAllByRole(...)`   | Throws.                           | Returns an array.                           | Existing elements, such as list items.                  |
| `queryAllByRole(...)` | Returns `[]`.                     | Returns an array.                           | A count may legitimately be zero.                       |
| `findAllByRole(...)`  | Retries, then rejects.            | Returns an array.                           | A nonempty collection should appear asynchronously.     |

`findAllBy` waits for matches, not a particular final count. If the count changes asynchronously, use `waitFor` around the count assertion.

Prefer **role + accessible name**, or labels for form fields:

```js
// Fragments for an RTL test after render(<App />).
screen.getByRole("button", { name: "Add task" });
screen.getByRole("textbox", { name: "Task" });
screen.getByLabelText("Task");
screen.getByText("No tasks yet");
```

The accessible name comes from sources such as button text, labels, or `aria-label`; it is not necessarily an element's `name` attribute. Use `getByTestId` when a user-facing query cannot reasonably identify the target. Role queries encourage semantic HTML; they are not a complete accessibility audit.

Use `findBy` for an element that appears. Use `waitFor` for a condition/assertion that must eventually pass. For example, in the earlier async loading test after the click:

```js
// Add waitFor to the @testing-library/react import.
await waitFor(() => {
  expect(loadTasks).toHaveBeenCalledTimes(1);
});
```

`waitFor` retries when its callback throws. Keep actions such as clicking outside it; otherwise the action can repeat. Do not use `await waitFor(() => false)` to wait for a condition.

### Assertions

| Assertion                                          | Meaning                                                                     |
| -------------------------------------------------- | --------------------------------------------------------------------------- |
| `expect(value).toBe(expected)`                     | Primitive equality or the same object reference (`Object.is`).              |
| `expect(value).toEqual(expected)`                  | Deep equality for object/array contents.                                    |
| `expect(value).toStrictEqual(expected)`            | Stricter deep equality, including object types and undefined entries.       |
| `expect(list).toHaveLength(2)`                     | Array/string length.                                                        |
| `expect(() => action()).toThrow('message')`        | A synchronous function throws.                                              |
| `await expect(promise).resolves.toEqual(data)`     | A promise resolves with the expected data.                                  |
| `await expect(promise).rejects.toThrow('message')` | A promise rejects with an error.                                            |
| `expect(element).toBeInTheDocument()`              | A DOM node is attached to the document.                                     |
| `expect(element).toBeVisible()`                    | The DOM visibility checks pass; this does not verify pixel layout in jsdom. |
| `expect(element).toHaveTextContent('text')`        | The node contains the expected text.                                        |
| `expect(input).toHaveValue('value')`               | An input's value matches.                                                   |
| `expect(button).toBeDisabled()`                    | A control is disabled.                                                      |
| `expect(checkbox).toBeChecked()`                   | A checkbox is checked.                                                      |
| `expect(mock).toHaveBeenCalledWith(value)`         | A mock received those arguments on at least one call.                       |

**Playwright uses its own `expect` and locators.** Most web assertions retry until they pass or time out:

```js
// Fragments inside a Playwright test with the page fixture.
await expect(
  page.getByRole("heading", { name: "Task practice" }),
).toBeVisible();
await expect(page.getByRole("listitem")).toHaveCount(0);
```

`page.getByRole(...)` returns a locator; it does not immediately throw for a missing element. Actions resolve it and wait for applicable actionability checks. `await expect(locator).toBeVisible()` retries; `expect(await locator.isVisible()).toBe(true)` only checks a single snapshot. Avoid `waitForTimeout(1000)` as a synchronization strategy.

### Hooks and runner differences

| Purpose             | Vitest                                      | Jest                                                 |
| ------------------- | ------------------------------------------- | ---------------------------------------------------- |
| Import test APIs    | `import { test, expect, vi } from 'vitest'` | `import { test, expect, jest } from '@jest/globals'` |
| Group tests         | `describe`                                  | `describe`                                           |
| Arrange each test   | `beforeEach`                                | `beforeEach`                                         |
| Clean up each test  | `afterEach`                                 | `afterEach`                                          |
| Once per suite/file | `beforeAll`, `afterAll`                     | `beforeAll`, `afterAll`                              |
| Create a mock       | `vi.fn()`                                   | `jest.fn()`                                          |
| Spy on a method     | `vi.spyOn(object, 'method')`                | `jest.spyOn(object, 'method')`                       |
| Replace a module    | `vi.mock(...)`                              | `jest.mock(...)`                                     |
| Control timers      | `vi.useFakeTimers()`                        | `jest.useFakeTimers()`                               |
| Watch               | `pnpm test`                                 | `pnpm test:jest:watch`                               |
| Run once            | `pnpm test:run`                             | `pnpm test:jest`                                     |

Import hooks from the same runner as the test. Similar APIs do not make Vitest and Jest entirely interchangeable, especially for native ESM and module mocking. The Jest setup here transforms imports to CommonJS.

`test.only` temporarily focuses a test; `test.skip` skips it; `test.todo('description')` records an unfinished case. Remove `.only` before committing.

Snapshots record serialized output for later comparison. Review changes rather than automatically accepting them; targeted assertions usually explain a UI contract more clearly than a large DOM snapshot.

Sources: [RTL query behavior](https://testing-library.com/docs/queries/about/), [roles and accessible names](https://testing-library.com/docs/queries/byrole/), [async helpers](https://testing-library.com/docs/dom-testing-library/api-async/), [Vitest assertions](https://vitest.dev/api/expect), [Jest assertions](https://jestjs.io/docs/expect), [Playwright assertions](https://playwright.dev/docs/test-assertions).

## 9. Mocking and fake timers

Mock a boundary you need to control: a callback, network request, clock, or external module. Keep the behavior under test real. For example, the component tests use the real `normalizeTask` function while replacing the loader.

### Mock vocabulary

| API                                    | What it does                                                                                                     |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `vi.fn()` / `jest.fn()`                | Creates a function that records calls. Without an implementation it returns `undefined`.                         |
| `.mockReturnValue(value)`              | Supplies a synchronous return value.                                                                             |
| `.mockResolvedValue(value)`            | Returns a promise resolved with that value.                                                                      |
| `.mockRejectedValue(error)`            | Returns a rejected promise.                                                                                      |
| `.mockResolvedValueOnce(value)`        | Controls the next call; chain it to simulate a sequence.                                                         |
| `spyOn(object, 'method')`              | Observes the existing method. It still calls the real method unless you replace its implementation/return value. |
| `.mockClear()` / `clearAllMocks()`     | Clears call history while keeping implementations.                                                               |
| `.mockReset()` / `resetAllMocks()`     | Clears history and resets implementations; see the difference below.                                             |
| `.mockRestore()` / `restoreAllMocks()` | Restores methods replaced by spies. Direct assignments need their own cleanup.                                   |

Vitest's `vi.fn(original).mockReset()` restores the initial implementation; Jest's `jest.fn(original).mockReset()` replaces it with an empty function. `restoreAllMocks()` does not generally undo module mock registrations. Set return behavior inside each test to keep tests independent.

### Optional module mock

Use a module mock when the component's default dependency is the boundary you want to replace:

### `src/App.module.test.jsx`

```jsx
import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { fetchTasks } from "./api.js";
import App from "./App.jsx";

vi.mock("./api.js", () => ({
  fetchTasks: vi.fn(),
}));

test("uses the mocked default loader", async () => {
  const user = userEvent.setup();
  fetchTasks.mockResolvedValue(["Practice module mocks"]);
  render(<App />);

  await user.click(screen.getByRole("button", { name: "Load examples" }));

  expect(
    await screen.findByRole("checkbox", { name: "Practice module mocks" }),
  ).toBeInTheDocument();
  expect(fetchTasks).toHaveBeenCalledTimes(1);
});
```

Vitest hoists `vi.mock` registrations before imports. Avoid referencing later ordinary variables in the factory; use `vi.hoisted` if shared factory state is needed. In this Jest/Babel setup, the equivalent is `jest.mock('../src/api.js', () => ({ fetchTasks: jest.fn() }))` in a Jest test that imports that path. Native Jest ESM uses different mocking rules.

### Optional timer exercise — `src/debounce.js`

```js
export function debounce(callback, delay = 300) {
  let timer;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delay);
  };
}
```

### `src/debounce.test.js`

```js
import { afterEach, expect, test, vi } from "vitest";
import { debounce } from "./debounce.js";

afterEach(() => {
  vi.useRealTimers();
});

test("waits 300ms and uses the most recent arguments", () => {
  vi.useFakeTimers();
  const callback = vi.fn();
  const search = debounce(callback);

  search("r");
  vi.advanceTimersByTime(100);
  search("react");
  vi.advanceTimersByTime(299);
  expect(callback).not.toHaveBeenCalled();

  vi.advanceTimersByTime(1);
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith("react");
});
```

Fake timers advance the clock without a real delay. Always restore real timers. To try this with Jest, copy the test into `jest-tests/`, change its import to `@jest/globals`, replace `vi` with `jest`, and import `../src/debounce.js`.

For RTL tests that use fake timers, create the user session with `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })` or the Jest equivalent. Wrap manually advanced timers that update React state in `act`. For timer callbacks that return promises, consider the runner's async timer APIs.

After adding both optional Vitest test files, `pnpm test:run` runs **18 tests**.

Sources: [Vitest mocks](https://vitest.dev/api/mock), [Vitest module mocks](https://vitest.dev/api/vi#vi-mock), [Jest mocks](https://jestjs.io/docs/mock-function-api), [Vitest timers](https://vitest.dev/guide/mocking/timers), [Jest timers](https://jestjs.io/docs/timer-mocks), [user-event timer option](https://testing-library.com/docs/user-event/options/#advancetimers).

## 10. Learn by doing

For a new feature: **write a failing behavior test → implement it → refactor while tests stay green**. Read the failure message before changing the code. Make one change at a time.

| Exercise                                      | Acceptance check                                                           | Practice                                           |
| --------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------- |
| Submit with Enter.                            | Typing `Read docs{Enter}` adds one task.                                   | Keyboard interactions.                             |
| Submit 61 characters through the UI.          | Alert appears, no task is added, callback is not called.                   | Unit rules wired to a form.                        |
| Untick a completed task.                      | Checkbox is unchecked; completed count returns to zero.                    | State transitions.                                 |
| Fix an invalid input and resubmit.            | A valid task appears and the previous alert disappears.                    | Error recovery.                                    |
| Add two tasks.                                | Both labels appear and the list has two items.                             | Collections and `within`.                          |
| Add deletion.                                 | A named delete button removes only its task.                               | New behavior with a failing test first.            |
| Retry after a load failure.                   | First click shows an error; second shows tasks and clears the error.       | `mockRejectedValueOnce` + `mockResolvedValueOnce`. |
| Persist tasks in `localStorage`.              | A Playwright test adds a task, reloads, and still sees it.                 | Browser persistence and test isolation.            |
| Run browser tests against a production build. | Tests pass against `pnpm build` + `pnpm preview`, with matching host/port. | Built assets rather than the dev server.           |

This **intentionally failing** test can be added inside `src/App.test.jsx`. It reuses that file's imports and specifies the next feature:

```jsx
test("deletes a task", async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.type(screen.getByLabelText("Task"), "Practice deletion");
  await user.click(screen.getByRole("button", { name: "Add task" }));

  await user.click(
    screen.getByRole("button", { name: "Delete Practice deletion" }),
  );

  expect(
    screen.queryByRole("checkbox", { name: "Practice deletion" }),
  ).not.toBeInTheDocument();
  expect(screen.getByText("No tasks yet")).toBeVisible();
});
```

Implement deletion with a button whose accessible name includes its task text, and filter the task out by ID. Then add an equivalent Playwright test. The checkbox label and delete button should be separate elements.

To check whether a passing test detects bugs, temporarily break a behavior: remove `.trim()`, stop clearing the input, or stop toggling `done`. Run the relevant test and confirm it fails, then restore the code.

**Revision prompts:** What does the runner do that RTL does not? Why use `queryBy` for absence? When do you use `findBy`? What is the difference between a mock function and a spy? Which assertion retries in Playwright? What does an HTTP mock leave untested?

## 11. Optional GitHub Actions workflow

Use this after sections 2–5 and 7 work locally. Put the app at your repository root and commit its lockfile. This example uses pnpm 11 and Node 24; match the pnpm major to the one used locally. It runs Vitest once, builds the app, runs Chromium, and saves reports.

```bash
mkdir -p .github/workflows
```

### `.github/workflows/tests.yml`

```yaml
name: Tests

on: [push, pull_request]

permissions:
  contents: read

jobs:
  tests:
    runs-on: ubuntu-24.04
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v7
      - uses: pnpm/setup@v3
        with:
          version: "11"
          runtime: node@24
          cache: true
          install: false
      - run: pnpm install --frozen-lockfile
      - run: pnpm test:coverage
      # Enable this after completing the optional Jest setup:
      # - run: pnpm test:jest
      - run: pnpm build
      - run: pnpm exec playwright install --with-deps chromium
      - run: pnpm test:e2e
      - uses: actions/upload-artifact@v7
        if: always()
        with:
          name: test-reports
          path: |
            coverage/
            playwright-report/
            test-results/
          if-no-files-found: ignore
          retention-days: 7
```

`test:coverage` explicitly runs once. Playwright reads `CI` from the runner, forbids committed `.only` tests, and applies the configured retries. A retry that passes can reveal a flaky test; investigate its cause rather than relying on retries to hide it.

The build step verifies the bundle. This workflow's browser tests still use the **Vite dev server**, as configured in section 7. To test the production bundle, change `webServer.command` to `pnpm preview --host 127.0.0.1 --port 5173 --strictPort` and keep the build step before Playwright.

Sources: [pnpm CI](https://pnpm.io/continuous-integration), [pnpm setup action](https://github.com/pnpm/setup), [Playwright CI](https://playwright.dev/docs/ci), [upload-artifact](https://github.com/actions/upload-artifact).

## 12. Troubleshooting and official docs

| Symptom                                       | What to check                                                                                                                       |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `document is not defined`                     | The component test needs `environment: 'jsdom'` in Vitest or `testEnvironment: 'jsdom'` in Jest. Run from the project root.         |
| `toBeInTheDocument is not a function`         | Check the runner-specific `jest-dom` import and setup-file path. Playwright uses its own matchers.                                  |
| Jest cannot parse JSX/imports                 | Check `babel.config.cjs`, its two presets, and `babel-jest` in `transform`. This guide is using Babel/CommonJS for Jest.            |
| `module is not defined` in a config           | A CommonJS config needs a `.cjs` extension when `"type": "module"` is set.                                                          |
| `fetch is not defined` in a jsdom test        | Do not assume every browser API is present. Stub it, inject a loader, or use the Node environment for the API-helper test as shown. |
| A test passes before async work finishes      | Await `user` actions, `findBy` queries, promise assertions, and Playwright assertions. Return/await the promise from the test.      |
| React warns about an update outside `act`     | Await the user action/result first. Wrap direct state-triggering promise resolution or clock advancement in `act`.                  |
| Multiple matching elements                    | Add an accessible name, scope with `within`, or use an `AllBy` query if multiple matches are expected. Check cleanup too.           |
| `getBy...` fails while checking absence       | Use `queryBy...` with `.not.toBeInTheDocument()`.                                                                                   |
| Vitest/Jest tries to run Playwright files     | Check the exact `include`, `testMatch`, and `testDir` settings. Keep the test folders separate.                                     |
| Fake timers make typing hang                  | Configure `userEvent.setup({ advanceTimers: ... })` and restore real timers in cleanup.                                             |
| Coverage package mismatch                     | Keep `vitest` and `@vitest/coverage-v8` on the same release. Reinstall/update them together.                                        |
| Playwright cannot find its browser executable | Run `pnpm exec playwright install chromium` again after changing Playwright versions.                                               |
| Playwright reports missing Linux libraries    | Run `pnpm exec playwright install --with-deps chromium` on a supported Ubuntu release.                                              |
| Playwright cannot start the server            | Check whether port 5173 is occupied, and whether the configured command runs from the app root.                                     |
| Frozen-lockfile install fails                 | Run `pnpm install` locally after changing dependencies and commit the updated lockfile.                                             |

### pnpm dependency build scripts

Some dependency versions include install/build scripts. If pnpm reports `ERR_PNPM_IGNORED_BUILDS` or directs you to approve builds:

```bash
pnpm approve-builds
pnpm install
```

Review the listed dependencies and select those whose scripts you intend to allow. The selection saves a policy in `pnpm-workspace.yaml`; commit it if generated. Recent pnpm versions can also record explicit denials. For the versions used in this guide, the Jest installation may list **`unrs-resolver`** and **`@parcel/watcher`**, which are transitive dependencies. [Official approve-builds documentation](https://pnpm.io/cli/approve-builds).

With pnpm 11, the named command below allows those two pending scripts without selecting unrelated dependencies:

```bash
pnpm approve-builds @parcel/watcher unrs-resolver
pnpm install
```

### Inspect an RTL failure

Add either line temporarily inside a rendered component test:

```js
screen.debug(); // Print the current DOM
screen.logTestingPlaygroundURL(); // Get help choosing a query
```

### A useful test checklist

- [ ] Test name describes an observable outcome.
- [ ] Normal, boundary, and error cases are covered where relevant.
- [ ] Queries use roles/labels where practical.
- [ ] Async work is awaited; there are no arbitrary sleep calls.
- [ ] Each test can run alone and in any order.
- [ ] Mocks, DOM state, and timers are cleaned up.
- [ ] A small intentional behavior change makes the relevant test fail.
- [ ] `.only` is removed before committing; skipped tests have a reason.

### Validation snapshot

The copied file examples were checked with these versions:

| Tool                                        | Version           |
| ------------------------------------------- | ----------------- |
| Node.js / pnpm                              | 24.19.0 / 11.25.0 |
| React / React DOM                           | 19.3.0 / 19.3.0   |
| Vite / React plugin                         | 8.3.1 / 6.1.1     |
| Vitest / V8 coverage                        | 5.0.3 / 5.0.3     |
| Jest / babel-jest / Jest jsdom environment  | 30.5.2            |
| Babel core and presets                      | 7.29.7            |
| React Testing Library / DOM Testing Library | 16.3.3 / 10.4.2   |
| user-event / jest-dom                       | 14.6.7 / 7.0.1    |
| jsdom (Vitest)                              | 30.1.1            |
| Playwright Test                             | 1.63.0            |

**Verified:** 18 Vitest tests, including the two optional examples; 9 Jest tests; Vitest coverage generation; and a Vite production build. All passed. The five Playwright tests were parsed and discovered, but browser execution was not verified because the Chromium download returned an invalid archive in the validation environment. The GitHub Actions example was checked as YAML and has not been run on GitHub.

### Official reference links

| Topic                      | Documentation                                                                |
| -------------------------- | ---------------------------------------------------------------------------- |
| Vitest setup               | [Documentation](https://vitest.dev/guide/)                                   |
| Vitest assertions          | [Documentation](https://vitest.dev/api/expect)                               |
| Vitest mocks and timers    | [Documentation](https://vitest.dev/api/vi)                                   |
| Vitest coverage            | [Documentation](https://vitest.dev/guide/coverage)                           |
| Jest setup                 | [Documentation](https://jestjs.io/docs/getting-started)                      |
| Jest configuration         | [Documentation](https://jestjs.io/docs/configuration)                        |
| Jest assertions            | [Documentation](https://jestjs.io/docs/expect)                               |
| Jest mocks                 | [Documentation](https://jestjs.io/docs/mock-function-api)                    |
| RTL API                    | [Documentation](https://testing-library.com/docs/react-testing-library/api/) |
| Queries                    | [Documentation](https://testing-library.com/docs/queries/about/)             |
| Roles and accessible names | [Documentation](https://testing-library.com/docs/queries/byrole/)            |
| user-event                 | [Documentation](https://testing-library.com/docs/user-event/intro/)          |
| jest-dom                   | [Documentation](https://github.com/testing-library/jest-dom)                 |
| Playwright setup           | [Documentation](https://playwright.dev/docs/intro)                           |
| Playwright locators        | [Documentation](https://playwright.dev/docs/locators)                        |
| Playwright assertions      | [Documentation](https://playwright.dev/docs/test-assertions)                 |
| Playwright network mocking | [Documentation](https://playwright.dev/docs/network)                         |
| Playwright traces          | [Documentation](https://playwright.dev/docs/trace-viewer-intro)              |
