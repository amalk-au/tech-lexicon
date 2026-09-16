# React Cheat Sheet

[Back to React topic Index](./README.md)

A consolidated reference covering React fundamentals, components, hooks, state management, and the virtual DOM — merged and refreshed from your notes.

---

## Table of Contents

- [React Cheat Sheet](#react-cheat-sheet)
  - [Table of Contents](#table-of-contents)
  - [What is React?](#what-is-react)
    - [Key Characteristics](#key-characteristics)
  - [How React Works (Render Cycle)](#how-react-works-render-cycle)
  - [The Virtual DOM](#the-virtual-dom)
    - [Why it matters](#why-it-matters)
  - [JSX Basics](#jsx-basics)
  - [Components: Functional vs Class](#components-functional-vs-class)
    - [Functional Component](#functional-component)
    - [Class Component](#class-component)
    - [Comparison](#comparison)
  - [Props vs State](#props-vs-state)
  - [React Hooks](#react-hooks)
    - [Why Hooks were introduced](#why-hooks-were-introduced)
    - [Core Hooks](#core-hooks)
    - [Examples](#examples)
    - [Rules of Hooks](#rules-of-hooks)
  - [Conditional Rendering \& Lists](#conditional-rendering--lists)
  - [State Management](#state-management)
    - [Local State](#local-state)
    - [Lifting State Up](#lifting-state-up)
    - [Global State](#global-state)
    - [Server State (Async Data)](#server-state-async-data)
  - [State Management Decision Guide](#state-management-decision-guide)
  - [Best Practices](#best-practices)
  - [Scaffolding a React App (Vite)](#scaffolding-a-react-app-vite)
  - [React Router Setup](#react-router-setup)
  - [What's New in Modern React (18 \& 19)](#whats-new-in-modern-react-18--19)

---

## What is React?

React is an open-source JavaScript library for building user interfaces, particularly single-page applications. It lets you build encapsulated, reusable UI components that manage their own logic and rendering, then compose them into complex UIs.

### Key Characteristics

-   **Component-based architecture** — UIs are built from independent, reusable components.
-   **Declarative syntax** — you describe *what* the UI should look like for a given state; React handles the *how*.
-   **Virtual DOM** — an in-memory representation of the UI used to compute efficient updates.
-   **One-way (unidirectional) data flow** — data flows from parent to child via props, making state predictable.
-   **JSX** — an HTML-like syntax extension for JavaScript that represents UI elements.
-   **Hooks** — functions (`useState`, `useEffect`, etc.) that give functional components access to state, lifecycle, and other React features.

---

## How React Works (Render Cycle)

1.  **Render** — A component returns JSX, which is compiled (via Babel) into `React.createElement()` calls that build a virtual DOM tree.
2.  **Diffing (Reconciliation)** — On a state/prop change, React builds a new virtual DOM tree and compares it against the previous one to find the minimal set of differences.
3.  **Commit** — Only the real DOM nodes that actually changed are updated, rather than re-rendering the whole page.
4.  **Batching** — Multiple state updates within the same event/handler are grouped into a single re-render for efficiency.

---

## The Virtual DOM

The **Virtual DOM** is a lightweight, in-memory tree of JavaScript objects that mirrors the real DOM. Rather than mutating the real DOM directly on every state change, React updates this virtual representation first, diffs it against the previous version, and applies only the necessary changes to the real DOM.

### Why it matters

| Benefit | Explanation |
| --- | --- |
| **Performance** | Avoids costly, repeated real-DOM operations; only changed nodes are touched. |
| **Predictability** | You describe the desired UI for a given state, and React reconciles the real DOM to match it. |
| **Composability** | Integrates naturally with React's component model for modular, reusable UI. |

> **Modern note:** React 18+ uses a "concurrent renderer," which can prepare multiple versions of the UI in memory at once, pausing and resuming render work without blocking the main thread — building on top of the same diffing concept.

---

## JSX Basics

JSX lets you write HTML-like markup directly inside JavaScript.

```jsx
function HelloWorld() {
  return (
    <div>
      <h1>Hello, React!</h1>
      <p>This is a simple React component.</p>
    </div>
  );
}

export default HelloWorld;
```

**Rules of JSX:**

-   Must return a **single root element** (or use a Fragment: `<>...</>`).
-   Use `{}` to embed JavaScript expressions: `<p>{count}</p>`.
-   Use `className` instead of `class`, and `htmlFor` instead of `for`.
-   Self-close void elements: `<img />`, `<input />`, `<br />`.

---

## Components: Functional vs Class

Functional components (with Hooks) are the **modern standard**. Class components are mostly seen in legacy codebases or for specific edge cases (like error boundaries, which still require a class).

### Functional Component

```jsx
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

### Class Component

```jsx
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

### Comparison

| Feature | Functional Component | Class Component |
| --- | --- | --- |
| Syntax | Plain JavaScript function | ES6 class extending `React.Component` |
| State management | `useState`, `useReducer` (Hooks) | `this.state` / `this.setState()` |
| Lifecycle | `useEffect` (Hooks) | `componentDidMount`, `componentDidUpdate`, `componentWillUnmount` |
| `this` keyword | Not needed | Required |
| Boilerplate | Minimal | More verbose |
| Performance | Slightly lighter (difference usually negligible) | Slightly heavier |
| Modern usage | **Preferred for all new code** | Legacy code, error boundaries |

> **Error boundaries** are the one common case that still requires a class component (`componentDidCatch` / `getDerivedStateFromError`), since there's no Hook equivalent yet.

---

## Props vs State

|  | Props | State |
| --- | --- | --- |
| **Owned by** | Parent component (passed down) | The component itself |
| **Mutability** | Read-only from the child's perspective | Mutable via setter functions |
| **Purpose** | Configure/customize a component | Track data that changes over time |

---

## React Hooks

**Hooks** (introduced in React 16.8) let functional components use state, side effects, context, and more — removing the need to write class components for these features.

### Why Hooks were introduced

-   Functional components couldn't previously hold state or run side effects (e.g. data fetching, subscriptions) — this required converting them to classes, adding boilerplate.
-   Sharing stateful logic between components was awkward, relying on patterns like higher-order components (HOCs) or render props.
-   Hooks let you write simpler, more testable code without the `this` keyword, and extract reusable logic into **custom hooks**.

### Core Hooks

| Hook | Purpose |
| --- | --- |
| `useState` | Adds local state to a component |
| `useEffect` | Runs side effects (data fetching, subscriptions, DOM updates) after render |
| `useContext` | Reads a value from React Context without prop-drilling |
| `useReducer` | Manages more complex state logic via a reducer function (Redux-like pattern, local) |
| `useRef` | Persists a mutable value across renders without causing re-renders; also used for DOM refs |
| `useMemo` | Memoizes an expensive computed value between renders |
| `useCallback` | Memoizes a function reference between renders |
| `useLayoutEffect` | Like `useEffect`, but fires synchronously after DOM mutations (before paint) |
| `useId` | Generates a stable unique ID (great for form/label accessibility) |
| `useTransition` | Marks a state update as non-urgent so the UI stays responsive (React 18+) |
| `useDeferredValue` | Defers re-rendering a non-critical part of the UI until more urgent updates finish (React 18+) |
| `useSyncExternalStore` | Subscribes to external (non-React) state stores safely (React 18+) |
| `useOptimistic` | Shows an optimistic UI state while an async action is pending (React 19+) |
| `useActionState` | Manages state driven by a form action, including pending/error state (React 19+) |

### Examples

```jsx
import { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  }, [count]); // re-runs only when `count` changes

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

```jsx
// Custom hook: reusable stateful logic
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}
```

### Rules of Hooks

-   Only call Hooks at the **top level** — never inside loops, conditions, or nested functions.
-   Only call Hooks from **React function components** or **custom hooks** (whose names start with `use`).

---

## Conditional Rendering & Lists

```jsx
// Conditional rendering
function Status({ isLoggedIn }) {
  return isLoggedIn ? <p>Welcome back!</p> : <p>Please log in.</p>;
}

// Lists — always use a stable, unique `key`
function ItemList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

> Avoid using array index as `key` when the list can be reordered, filtered, or have items inserted/removed — it can cause subtle rendering bugs.

---

## State Management

Choosing a state management approach depends on scope: does the data belong to one component, a few related components, or the whole app?

### Local State

Use `useState` or `useReducer` for state scoped to a single component or small group — UI toggles, form inputs, component-specific data.

```js
const [count, setCount] = useState(0);
```

### Lifting State Up

When sibling components need to share state, move it to their nearest common parent and pass it down via props.

### Global State

For state shared across many, possibly distant, components:

| Approach | Best for |
| --- | --- |
| **React Context API** | Static or infrequently-changing data (theme, auth status, locale). Avoid for high-frequency updates — it can trigger unnecessary re-renders across all consumers. |
| **Redux Toolkit** | Large, complex apps needing a centralized, predictable state container with strong dev tooling. |
| **Zustand / Jotai** | Lightweight, modern alternatives to Redux with less boilerplate — increasingly popular for new projects. |
| **MobX** | Reactive, observable-based state management. |

```jsx
// Global state with Redux (simplified)
import { useSelector, useDispatch } from 'react-redux';

function Counter() {
  const count = useSelector(state => state.count);
  const dispatch = useDispatch();
  return (
    <button onClick={() => dispatch({ type: 'INCREMENT' })}>
      Clicked {count} times
    </button>
  );
}
```

### Server State (Async Data)

For data fetched from APIs, use a dedicated data-fetching library rather than rolling your own with `useEffect` + `useState`:

| Library | Notes |
| --- | --- |
| **TanStack Query** (formerly React Query) | Caching, background refetching, retries, pagination — the current standard. |
| **SWR** | Lightweight alternative from Vercel, similar caching/revalidation model. |
| **RTK Query** | Built into Redux Toolkit for teams already using Redux. |

---

## State Management Decision Guide

```
Does only ONE component need this data?
 └─ Yes → useState / useReducer (local state)

Do a few SIBLING components need it?
 └─ Yes → Lift state to their common parent

Is it needed across MANY / distant components,
and changes infrequently?
 └─ Yes → React Context

Is it complex, high-frequency, or app-wide
(cart, auth, multi-step flows)?
 └─ Yes → Redux Toolkit / Zustand / Jotai

Is it data fetched from a server/API?
 └─ Yes → TanStack Query / SWR
```

---

## Best Practices

-   **Keep state minimal and flat** — only store what's necessary for rendering; avoid deeply nested or duplicated state.
-   **Colocate state** — keep state as close as possible to where it's used to reduce prop-drilling and improve testability.
-   **Never mutate state directly** — always use the setter function (`setState`, `dispatch`) so React can detect the change and re-render.
-   **Handle loading and error states explicitly**, especially for async/server data.
-   **Compute derived data with selectors/`useMemo`** rather than storing it redundantly in state.
-   **Use a stable `key`** prop for list items — not array index if the list can reorder.
-   **Extract reusable logic into custom hooks** rather than duplicating `useEffect`/`useState` logic across components.

---

## Scaffolding a React App (Vite)

> Use the current LTS version of Node.js to avoid version-related errors.

```bash
# New project
npm create vite@latest my-first-react-app -- --template react

# Using an existing (already-cloned) GitHub repo
# cd into the cloned repo first, then:
npm create vite@latest . -- --template react
```

After scaffolding, follow the CLI prompts to finish setup, then:

```bash
npm install
npm run dev
```

To connect a new local project to GitHub: create an empty repo on GitHub, then follow the instructions on the repo's page to link your local directory to the remote.

---

## React Router Setup

```bash
npm install react-router-dom
```

Set up routing in your entry files (typically `main.jsx` / `App.jsx` and a `routes.jsx` file), and define an error/fallback page (e.g. `ErrorPage.jsx`) for unmatched or failed routes.

```jsx
// routes.jsx (example, react-router-dom v6+)
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import ErrorPage from './ErrorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
  },
]);

export default router;
```

```jsx
// main.jsx
import { RouterProvider } from 'react-router-dom';
import router from './routes';

<RouterProvider router={router} />
```

> For a full walkthrough, see [The Odin Project's React Router lesson](https://www.theodinproject.com/lessons/node-path-react-new-react-router).

---

## What's New in Modern React (18 & 19)

Since Hooks and the classic Virtual DOM model, React has continued to evolve:

-   **Concurrent rendering (React 18)** — React can interrupt, pause, and resume rendering work, keeping the UI responsive during large updates.
-   **Automatic batching (React 18)** — state updates are now batched even inside promises, timeouts, and native event handlers (previously only inside React event handlers).
-   **`useTransition` / `useDeferredValue` (React 18)** — mark updates as low-priority so urgent interactions (typing, clicking) stay smooth.
-   **React Server Components (RSC)** — components that render on the server and send serialized output to the client, reducing client-side JS bundle size (used by frameworks like Next.js App Router).
-   **Actions & `useActionState` (React 19)** — first-class support for async form submissions with built-in pending/error state, reducing manual `useState`/`useEffect` boilerplate.
-   **`useOptimistic` (React 19)** — simplifies showing optimistic UI while an async action resolves.
-   **The `use()` API (React 19)** — reads the value of a promise or context directly during render, including inside conditionals.
-   **Native document metadata support (React 19)** — `<title>`, `<meta>`, and `<link>` can be rendered directly from components without a separate head-management library.

> React's official docs at [react.dev](https://react.dev) are the most reliable source for keeping up with API changes — the legacy docs site (`legacy.reactjs.org`) reflects the pre-Hooks/pre-18 era and should be treated as historical reference only.

---

