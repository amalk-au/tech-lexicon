# React.js revision: learn by running

[Back to the topic index](./README.md)

A practical refresher for JavaScript + JSX function components. Each numbered example is independent and includes everything needed in `src/App.jsx`. Examples 1–14 work with React 18+; example 15 requires React 19+. No component libraries or backend required.

## Run the examples

In an existing client-side React project, replace **all** of `src/App.jsx` with one example, including its imports. Keep your entry file (`src/main.jsx`) as it is. Do not paste multiple examples into the same file.

For a new practice project, use [Vite](https://vite.dev/guide/). Use a supported Node.js version (Vite currently requires Node.js 20.19+ or 22.12+) alternatively use the [Web Development template](https://github.com/amalk-au/web-development-template)

```bash
pnpm create vite@latest react-revision -- --template react
cd react-revision
pnpm install
pnpm run dev
```

Open the local URL printed in your terminal. Leave the server running while editing. The examples need no custom CSS; you can clear the template's `src/index.css` if you want plain browser styling. In a TypeScript project, use a separate JavaScript/JSX practice project to avoid unrelated type errors.

**Workflow:** read → paste → predict → interact → change one thing. Use browser DevTools for examples that log to the console. After switching examples, reload the page if hot reload preserves unexpected state.

## Contents

- [React.js revision: learn by running](#reactjs-revision-learn-by-running)
  - [Run the examples](#run-the-examples)
  - [Contents](#contents)
  - [The mental model](#the-mental-model)
  - [1. Components, JSX, props and children](#1-components-jsx-props-and-children)
  - [2. State, events and update queues](#2-state-events-and-update-queues)
  - [3. Controlled forms and object state](#3-controlled-forms-and-object-state)
  - [4. Lists, keys and immutable array updates](#4-lists-keys-and-immutable-array-updates)
  - [5. Lifting state up](#5-lifting-state-up)
  - [6. Effects and cleanup](#6-effects-and-cleanup)
  - [7. Async loading and stale responses](#7-async-loading-and-stale-responses)
  - [8. Refs and DOM access](#8-refs-and-dom-access)
  - [9. Reducers](#9-reducers)
  - [10. Context](#10-context)
  - [11. Custom hooks](#11-custom-hooks)
  - [12. Memoization](#12-memoization)
  - [13. Resetting state with a key](#13-resetting-state-with-a-key)
  - [14. Accessible IDs](#14-accessible-ids)
  - [15. React 19 form actions](#15-react-19-form-actions)
  - [Quick reference and practice](#quick-reference-and-practice)
    - [Common mistakes](#common-mistakes)
    - [Practice challenges](#practice-challenges)
    - [Further revision](#further-revision)

## The mental model

A component describes UI from its current **props**, **state**, and **context**. Rendering calls your components; committing applies the necessary DOM changes. A render does not necessarily change the DOM.

| Concept       | Meaning                                                                          |
| ------------- | -------------------------------------------------------------------------------- |
| Props         | Read-only inputs from a parent                                                   |
| State         | Component memory; a setter requests a new render                                 |
| Hook          | A React function that connects a component to features such as state or effects  |
| Event handler | Code that runs because the user did something                                    |
| Effect        | Synchronization with something outside React, such as a timer or subscription    |
| Ref           | A retained mutable value or DOM reference; changing it does not request a render |

Call the hooks used here at the top level of components or custom hooks, before early returns. Do not call them inside loops, conditions or event handlers. Keep rendering pure: don't mutate inputs or start timers/network requests during rendering.

## 1. Components, JSX, props and children

**What it does:** composes reusable UI. Props configure a component; `children` contains its nested content. JSX uses braces for JavaScript, `className` for CSS classes and camelCase style properties.

```jsx
function Card({ title, children }) {
  return (
    <section style={{ border: "1px solid gray", padding: 16, margin: 12 }}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function Badge({ active }) {
  return <strong>{active ? "Available" : "Away"}</strong>;
}

export default function App() {
  return (
    <main>
      <h1>Team</h1>
      <Card title="Amal">
        <p>Full Stack Engineer</p>
        <Badge active={true} />
      </Card>
      <Card title="Guest">
        <Badge active={false} />
      </Card>
    </main>
  );
}
```

**Try it:** change a title and flip `active`. Add another `Card` with different children.

**Remember:** component names start with a capital letter. Props flow down; a child requests changes by calling a callback prop. [Docs](https://react.dev/learn)

## 2. State, events and update queues

**What it does:** `useState` keeps a value between renders. A setter queues an update; it does not change the variable in the already-running event handler.

```jsx
import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  function addUsingSnapshot() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  }

  function addUsingUpdaters() {
    setCount((c) => c + 1);
    setCount((c) => c + 1);
    setCount((c) => c + 1);
  }

  return (
    <main>
      <h1>Count: {count}</h1>
      <button onClick={addUsingSnapshot}>Three replacements</button>
      <button onClick={addUsingUpdaters}>Three updater functions</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </main>
  );
}
```

**Try it:** the first button adds **1**, the second adds **3**. All replacements use the same render's `count`; updater functions process the queued value in order.

**Remember:** use `setCount(c => c + 1)` when the next value depends on the previous one. Pass handlers, as in `onClick={handleClick}`; don't call them while rendering. [Docs](https://react.dev/reference/react/useState)

## 3. Controlled forms and object state

**What it does:** makes React state the source of truth for form fields. The spread operator copies existing object fields before replacing one.

```jsx
import { useState } from "react";

export default function App() {
  const [profile, setProfile] = useState({ name: "", subscribed: false });
  const [message, setMessage] = useState("");
  const valid = profile.name.trim().length >= 2;

  function handleSubmit(event) {
    event.preventDefault();
    setMessage(
      `Saved ${profile.name.trim()}. Subscribed: ${profile.subscribed}`,
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input
          value={profile.name}
          onChange={(event) =>
            setProfile((p) => ({ ...p, name: event.target.value }))
          }
        />
      </label>
      <label>
        <input
          type="checkbox"
          checked={profile.subscribed}
          onChange={(event) =>
            setProfile((p) => ({ ...p, subscribed: event.target.checked }))
          }
        />
        Subscribe
      </label>
      <button disabled={!valid}>Save</button>
      <p role="status">{message}</p>
    </form>
  );
}
```

**Try it:** type one character, then two. Save becomes enabled. Submit and check the message; the page stays loaded.

**Remember:** text fields use `value`; checkboxes use `checked`. Compute `valid` during rendering rather than storing duplicate state. Never assign directly to `profile.name`. [Docs](https://react.dev/learn/updating-objects-in-state)

## 4. Lists, keys and immutable array updates

**What it does:** adds, toggles and deletes tasks using new arrays and objects. Stable keys let React match each rendered row to its data.

```jsx
import { useState } from "react";

export default function App() {
  const [text, setText] = useState("");
  const [tasks, setTasks] = useState([
    { id: "first", text: "Revise state", done: false },
  ]);
  const remaining = tasks.filter((task) => !task.done).length;

  function addTask(event) {
    event.preventDefault();
    if (!text.trim()) return;
    const task = { id: crypto.randomUUID(), text: text.trim(), done: false };
    setTasks((current) => [...current, task]);
    setText("");
  }

  function toggleTask(id) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    );
  }

  return (
    <main>
      <form onSubmit={addTask}>
        <label>
          New task
          <input
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
        </label>
        <button>Add</button>
      </form>
      <p>{remaining} remaining</p>
      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <label>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                />
                <span
                  style={{
                    textDecoration: task.done ? "line-through" : "none",
                  }}
                >
                  {task.text}
                </span>
              </label>
              <button
                onClick={() =>
                  setTasks((current) => current.filter((t) => t.id !== task.id))
                }
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
```

**Try it:** add three tasks, complete the middle one, then delete the first. The correct task stays checked. `crypto.randomUUID()` works on localhost or HTTPS.

**Remember:** use spread to add, `map` to replace, and `filter` to remove. Avoid `push`, in-place `sort`, and changing existing objects. Generate IDs when creating data, never while rendering rows. Avoid array-index keys for changing lists. [Docs](https://react.dev/learn/updating-arrays-in-state)

## 5. Lifting state up

**What it does:** keeps shared state in the closest common parent. Both children receive the same value and a callback to update it.

```jsx
import { useState } from "react";

function CounterButton({ count, onIncrement }) {
  return <button onClick={onIncrement}>Shared count: {count}</button>;
}

export default function App() {
  const [count, setCount] = useState(0);
  const increment = () => setCount((c) => c + 1);

  return (
    <main>
      <CounterButton count={count} onIncrement={increment} />
      <CounterButton count={count} onIncrement={increment} />
    </main>
  );
}
```

**Try it:** click either button. Both labels change together. Move the state into `CounterButton` as an exercise to make the counters independent.

**Remember:** sharing a component function doesn't share its state. Sharing state means giving components a common owner. [Docs](https://react.dev/learn/sharing-state-between-components)

## 6. Effects and cleanup

**What it does:** synchronizes a browser interval with the `running` state. Cleanup removes the old interval when the effect is replaced or the component unmounts.

```jsx
import { useEffect, useState } from "react";

export default function App() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const intervalId = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(intervalId);
  }, [running]);

  return (
    <main>
      <h1>{seconds} seconds</h1>
      <button onClick={() => setRunning((value) => !value)}>
        {running ? "Pause" : "Start"}
      </button>
      <button onClick={() => setSeconds(0)}>Reset count</button>
    </main>
  );
}
```

**Try it:** start, pause and restart. Reset changes the count without pausing the timer.

| Dependencies | Effect timing                                      |
| ------------ | -------------------------------------------------- |
| Omitted      | After every commit of this component               |
| `[]`         | On mount; cleanup on unmount                       |
| `[running]`  | On mount and after commits where `running` changed |

**Remember:** include all reactive values read by the effect. The updater avoids reading `seconds`. Strict Mode may run an extra setup/cleanup cycle in development; cleanup makes this safe. Use effects for external synchronization, not calculating derived values or handling a known button click. [Docs](https://react.dev/reference/react/useEffect)

## 7. Async loading and stale responses

**What it does:** handles loading, success and failure while ignoring obsolete results. A local mock API makes response timing reproducible without an external service.

```jsx
import { useEffect, useState } from "react";

function loadLesson(id) {
  return new Promise((resolve, reject) => {
    setTimeout(
      () => {
        if (id === "error") reject(new Error("Demo request failed"));
        else
          resolve({
            title: id === "state" ? "State lesson" : "Effects lesson",
          });
      },
      id === "state" ? 1500 : 300,
    );
  });
}

function Lesson({ id }) {
  const [result, setResult] = useState({
    status: "loading",
    data: null,
    error: "",
  });

  useEffect(() => {
    let ignore = false;
    async function run() {
      try {
        const data = await loadLesson(id);
        if (!ignore) setResult({ status: "success", data, error: "" });
      } catch (error) {
        if (!ignore)
          setResult({ status: "error", data: null, error: error.message });
      }
    }
    run();
    return () => {
      ignore = true;
    };
  }, [id]);

  if (result.status === "loading") return <p role="status">Loading {id}…</p>;
  if (result.status === "error") return <p role="alert">{result.error}</p>;
  return <h2>{result.data.title}</h2>;
}

export default function App() {
  const [id, setId] = useState("state");
  const [attempt, setAttempt] = useState(0);

  return (
    <main>
      <label>
        Lesson
        <select value={id} onChange={(event) => setId(event.target.value)}>
          <option value="state">State (slow)</option>
          <option value="effects">Effects (fast)</option>
          <option value="error">Error demo</option>
        </select>
      </label>
      <button onClick={() => setAttempt((a) => a + 1)}>Reload</button>
      <Lesson key={`${id}-${attempt}`} id={id} />
    </main>
  );
}
```

**Try it:** choose State, then immediately Effects. The slow response cannot replace the current lesson. Choose Error to see failure; Reload retries it (and deliberately fails again).

**Remember:** the key creates fresh loading state for each selection/retry. Cleanup ignores old responses but doesn't cancel their work. With real `fetch`, check `response.ok`, parse the body, and consider `AbortController` to cancel requests. Framework loaders or query libraries can handle caching and deduplication in larger apps. [Docs](https://react.dev/reference/react/useEffect#fetching-data-with-effects)

## 8. Refs and DOM access

**What it does:** stores a DOM reference and a mutable click count without making those values render state.

```jsx
import { useRef, useState } from "react";

export default function App() {
  const inputRef = useRef(null);
  const clicksRef = useRef(0);
  const [message, setMessage] = useState("No report yet");

  function focusInput() {
    clicksRef.current += 1;
    inputRef.current?.focus();
  }

  return (
    <main>
      <label>
        Your name <input ref={inputRef} />
      </label>
      <button onClick={focusInput}>Focus input</button>
      <button
        onClick={() => setMessage(`Focus clicked ${clicksRef.current} times`)}
      >
        Report clicks
      </button>
      <p>{message}</p>
    </main>
  );
}
```

**Try it:** click Focus input three times. The report changes only when you click Report clicks.

**Remember:** refs persist across renders, but modifying `.current` doesn't request a render. Use state for changing visible data. Access refs in handlers/effects, not as a substitute for state during rendering. [Docs](https://react.dev/reference/react/useRef)

## 9. Reducers

**What it does:** `useReducer` puts related state transitions in one pure function. Events dispatch actions describing what happened.

```jsx
import { useReducer } from "react";

const initialState = { quantity: 1, giftWrap: false };

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { ...state, quantity: state.quantity + 1 };
    case "decrement":
      return { ...state, quantity: Math.max(1, state.quantity - 1) };
    case "toggleWrap":
      return { ...state, giftWrap: !state.giftWrap };
    case "reset":
      return initialState;
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

export default function App() {
  const [cart, dispatch] = useReducer(reducer, initialState);
  const total = cart.quantity * 10 + (cart.giftWrap ? 3 : 0);

  return (
    <main>
      <h1>Quantity: {cart.quantity}</h1>
      <button onClick={() => dispatch({ type: "decrement" })}>−</button>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <label>
        <input
          type="checkbox"
          checked={cart.giftWrap}
          onChange={() => dispatch({ type: "toggleWrap" })}
        />
        Gift wrap ($3)
      </label>
      <p>Total: ${total}</p>
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
    </main>
  );
}
```

**Try it:** increase quantity, toggle wrap and reset. Quantity never drops below one.

**Remember:** reducers return new state; they must not mutate state, fetch data or perform side effects. Prefer `useState` when transitions are simple. [Docs](https://react.dev/reference/react/useReducer)

## 10. Context

**What it does:** passes a theme through the component tree without threading a prop through every intermediate component.

```jsx
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext("light");

function Preview() {
  const theme = useContext(ThemeContext);
  return (
    <p
      style={{
        padding: 20,
        background: theme === "dark" ? "#222" : "#eee",
        color: theme === "dark" ? "#fff" : "#111",
      }}
    >
      Current theme: {theme}
    </p>
  );
}

function Panel() {
  return (
    <section>
      <Preview />
    </section>
  );
}

export default function App() {
  const [theme, setTheme] = useState("light");
  return (
    <ThemeContext.Provider value={theme}>
      <button
        onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
      >
        Toggle theme
      </button>
      <Panel />
    </ThemeContext.Provider>
  );
}
```

**Try it:** toggle the theme. `Preview` updates even though `Panel` receives no theme prop.

**Remember:** consumers read the closest matching provider above them. Context transports a value; state still lives somewhere. Provider value changes update consumers, so avoid one huge context for unrelated frequently changing data. `.Provider` works in React 18 and 19. [Docs](https://react.dev/reference/react/useContext)

## 11. Custom hooks

**What it does:** packages reusable stateful logic into a `use...` function. This hook subscribes to browser resize events.

```jsx
import { useEffect, useState } from "react";

function useWindowWidth() {
  const [width, setWidth] = useState(() => window.innerWidth);
  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return width;
}

export default function App() {
  const width = useWindowWidth();
  return (
    <main>
      <h1>Window: {width}px</h1>
      <p>{width < 700 ? "Compact layout" : "Wide layout"}</p>
    </main>
  );
}
```

**Try it:** resize the browser across 700px or use DevTools device mode.

**Remember:** custom hooks share logic, not a single state instance. Each call owns its own state and subscription. This example is browser-only because it reads `window`; server rendering needs a server-safe strategy. For purely visual responsive layouts, prefer CSS media queries. [Docs](https://react.dev/learn/reusing-logic-with-custom-hooks)

## 12. Memoization

**What it does:** `useMemo` caches a calculation result; `useCallback` caches a function reference. `memo` can skip a child's parent-driven render when its props are unchanged.

```jsx
import { memo, useCallback, useMemo, useState } from "react";

const topics = ["State", "Props", "Effects", "Context", "Reducers", "Refs"];

const TopicList = memo(function TopicList({ items, onPick }) {
  console.log("TopicList rendered");
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>
          <button onClick={() => onPick(item)}>{item}</button>
        </li>
      ))}
    </ul>
  );
});

export default function App() {
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(0);
  const [selected, setSelected] = useState("None");

  const filtered = useMemo(() => {
    console.log("Filtering topics");
    return topics.filter((topic) =>
      topic.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query]);

  const pick = useCallback((topic) => setSelected(topic), []);

  return (
    <main>
      <label>
        Filter{" "}
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
      <button onClick={() => setCount((c) => c + 1)}>
        Unrelated count: {count}
      </button>
      <p>Selected: {selected}</p>
      <TopicList items={filtered} onPick={pick} />
    </main>
  );
}
```

**Try it:** watch the console. Count updates can reuse the calculation and child props; changing the query recalculates the list. Replace `useCallback` with `const pick = topic => setSelected(topic)` and compare. Strict Mode may duplicate development logs; React Compiler can make manual comparisons less obvious if enabled.

**Remember:** this tiny list doesn't need optimization; it demonstrates identity. Measure before memoizing. Include all reactive dependencies, and never rely on memoization for correctness. React Compiler can reduce the need for manual memoization. [useMemo](https://react.dev/reference/react/useMemo) · [useCallback](https://react.dev/reference/react/useCallback)

## 13. Resetting state with a key

**What it does:** changes a component's identity to deliberately reset its local state.

```jsx
import { useState } from "react";

function Draft({ recipient }) {
  const [text, setText] = useState("");
  return (
    <label>
      Message to {recipient}
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
    </label>
  );
}

export default function App() {
  const [recipient, setRecipient] = useState("Alex");
  return (
    <main>
      <select
        aria-label="Recipient"
        value={recipient}
        onChange={(event) => setRecipient(event.target.value)}
      >
        <option>Alex</option>
        <option>Sam</option>
      </select>
      <Draft key={recipient} recipient={recipient} />
    </main>
  );
}
```

**Try it:** type a draft, then change recipient. The draft clears. Remove `key={recipient}` and repeat: the component retains its state at the same position.

**Remember:** a changed key resets the entire subtree, including input focus and effects. Switching back doesn't restore the previous draft; preserving separate drafts would require storing them elsewhere. [Docs](https://react.dev/learn/preserving-and-resetting-state)

## 14. Accessible IDs

**What it does:** `useId` creates an ID for associating a reusable input with its label and help text.

```jsx
import { useId } from "react";

function EmailField({ label }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="email" aria-describedby={`${id}-help`} />
      <small id={`${id}-help`}>Use an address you can access.</small>
    </div>
  );
}

export default function App() {
  return (
    <main>
      <EmailField label="Personal email" />
      <EmailField label="Work email" />
    </main>
  );
}
```

**Try it:** click each label; its matching input receives focus. Inspect the DOM to see distinct IDs.

**Remember:** `useId` is for accessibility relationships, not list keys. List keys come from your data. [Docs](https://react.dev/reference/react/useId)

## 15. React 19 form actions

**Requires React 19+.** Check your project's installed versions with `npm ls react react-dom`.

**What it does:** `useActionState` tracks the result and pending state of an async form action. This client-side demo simulates a save; no server is involved.

```jsx
import { useActionState } from "react";

async function saveName(previousState, formData) {
  const name = String(formData.get("name") ?? "").trim();
  await new Promise((resolve) => setTimeout(resolve, 800));
  if (name.length < 2) return { message: "Enter at least two characters." };
  return { message: `Saved ${name}!` };
}

export default function App() {
  const [state, formAction, pending] = useActionState(saveName, {
    message: "",
  });
  return (
    <form action={formAction}>
      <label>
        Name <input name="name" />
      </label>
      <button disabled={pending}>{pending ? "Saving…" : "Save"}</button>
      <p role="status">{state.message}</p>
    </form>
  );
}
```

**Try it:** submit one character, then a full name. Observe the pending label and returned message. This is an uncontrolled input: React resets it when the action completes successfully, including when this demo returns a validation message rather than throwing.

**Remember:** the action receives previous state first and `FormData` second. The input needs a `name` to appear in `FormData`. An async client action is not automatically a Server Function. [Docs](https://react.dev/reference/react/useActionState)

## Quick reference and practice

| Need                                   | Reach for                       | Caution                                 |
| -------------------------------------- | ------------------------------- | --------------------------------------- |
| Remember visible data                  | `useState`                      | Don't mutate objects/arrays             |
| Coordinate complex updates             | `useReducer`                    | Keep the reducer pure                   |
| Calculate from existing data           | Ordinary render-time expression | Don't duplicate it in state             |
| Synchronize with an external system    | `useEffect`                     | Dependencies and cleanup matter         |
| Focus an input / retain a non-UI value | `useRef`                        | Changes don't trigger rendering         |
| Share state between siblings           | Lift state to their parent      | One source of truth                     |
| Read data across a deep tree           | `useContext`                    | Consumers update when the value changes |
| Reuse stateful logic                   | A custom hook                   | Calls have independent state            |
| Cache expensive pure work              | `useMemo`                       | Measure first                           |
| Stabilize a callback prop              | `useCallback`                   | Usually useful with a memoized consumer |
| Reset a subtree                        | Change its `key`                | All subtree state is discarded          |
| Associate labels/help with inputs      | `useId`                         | Never use it for list keys              |
| Track a form action result             | `useActionState` (19+)          | Understand pending and reset behavior   |

### Common mistakes

- **Calling hooks conditionally:** put conditions inside an effect or render branch after hooks.
- **Expecting a setter to change the current variable:** each render sees its own snapshot.
- **Mutating state:** replace arrays/objects, including any nested object you change.
- **Using an effect for derived data:** calculate filtered lists/totals during rendering.
- **Suppressing dependency warnings:** restructure the code instead of hiding stale closures.
- **Unstable keys:** don't generate random keys while mapping a list.
- **Defining a component inside another component:** define it at module scope to avoid accidental remounts.
- **Using `count && <Badge />`:** zero can render as `0`; use `count > 0 && <Badge />`.
- **Missing cleanup:** remove listeners, clear timers and handle obsolete async results.
- **Assuming extra development renders are production bugs:** keep Strict Mode enabled and make setup/cleanup correct.

### Practice challenges

- [ ] Add a completed-only filter to the task list; derive the filtered array from existing state.
- [ ] Add an edit action to a task using `map` and object spread.
- [ ] Add a two-second step setting to the timer and update its dependencies correctly.
- [ ] Extract the timer into `useTimer()` and render two independent timers.
- [ ] Combine context and a reducer to share a shopping cart across components.
- [ ] Replace the mock API with a local JSON endpoint; handle non-2xx responses and cancellation.
- [ ] Explain why the two counter buttons in section 2 produce different results.

### Further revision

Once these feel comfortable, explore [transitions](https://react.dev/reference/react/useTransition), [deferred values](https://react.dev/reference/react/useDeferredValue), [lazy loading](https://react.dev/reference/react/lazy), [Suspense](https://react.dev/reference/react/Suspense), and [error boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary). Routing, server rendering, and data libraries are separate topics beyond this browser-focused refresher.

Reference baseline: official [React documentation](https://react.dev/) and [Vite guide](https://vite.dev/guide/), checked 1 October 2026. Examples are original teaching exercises.
