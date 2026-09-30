# Next.js revision: learn by doing

[Back to the topic index](./README.md)

A practical guide to **Next.js 16, App Router, JavaScript and JSX**, using **pnpm on Ubuntu**. Familiarity with React components, props, state and hooks is assumed.

Each exercise gives complete file contents, a browser URL, a concise explanation and something to change. Examples use generic demonstration data. No accounts, credentials or external APIs are required.

## 0. Set up the practice project

Check your tools:

```bash
node --version
pnpm --version
```

Next.js 16 requires Node.js **20.9 or later**; use a currently supported Node.js LTS release. These commands assume Node.js and pnpm are already installed. You can use the [Web Development template](https://github.com/amalk-au/web-development-template) or alternatively

```bash
pnpm create next-app@16 nextjs-revision
```

Choose **customize settings** if prompted:

| Setting                | Choice                                      |
| ---------------------- | ------------------------------------------- |
| TypeScript             | No                                          |
| Linter                 | ESLint                                      |
| React Compiler         | No, to keep these exercises straightforward |
| Tailwind CSS           | No                                          |
| `src/` directory       | Yes                                         |
| App Router             | Yes                                         |
| Customize import alias | No; keep `@/*`                              |
| Agent guidance files   | Either choice; not needed for this guide    |

```bash
cd nextjs-revision
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000), or the port printed in the terminal.

**File rules:** paths below are relative to the project root. Create missing folders. Replace the complete contents of a named file; don't append another default export. If a generated file uses `.js`, replace it with the indicated `.jsx` file and remove the old version. Never keep both `page.js` and `page.jsx` for one route. Linux paths are case-sensitive. When using the shell, quote paths containing brackets, such as `'src/app/products/[slug]'`.

For an existing project without `src/`, omit `src/` from the paths. These examples are JavaScript; use the practice project if your existing TypeScript setup requires explicit types.

### Choose one caching model

The core labs use the supported caching model with **Cache Components disabled**. This makes route-level rendering and `fetch` caching easier to inspect separately. In a fresh project, replace the generated Next config with this one, keeping only one `next.config.*` file.

**`next.config.mjs`**

```js
const nextConfig = {
  cacheComponents: false,
};

export default nextConfig;
```

Restart `pnpm dev` after changing config. If adapting an existing app, merge the setting rather than discarding its other configuration. Do not enable `cacheComponents` midway through these labs: its Suspense and caching rules differ. A further-reading link at the end covers that model.

### Shared root layout

**`src/app/layout.jsx`**

```jsx
import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: { default: "Next.js Lab", template: "%s | Next.js Lab" },
  description: "Hands-on framework exercises",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <Link href="/">Next.js Lab</Link>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
```

**`src/app/globals.css`**

```css
* {
  box-sizing: border-box;
}
body {
  font-family: system-ui, sans-serif;
  max-width: 850px;
  margin: 2rem auto;
  padding: 0 1rem;
}
a {
  color: #1455b5;
}
nav {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1rem 0;
}
button,
input,
select,
textarea {
  font: inherit;
  padding: 0.5rem;
  margin: 0.25rem;
}
button {
  cursor: pointer;
}
button:disabled {
  cursor: wait;
}
label {
  display: block;
  margin: 0.5rem 0;
}
pre {
  padding: 1rem;
  background: #f0f2f5;
  overflow: auto;
}
section {
  margin: 1rem 0;
}
```

The root layout must contain `html` and `body`. It wraps every route. This setup also removes the starter's font download dependency.

## Contents

- [Next.js revision: learn by doing](#nextjs-revision-learn-by-doing)
  - [0. Set up the practice project](#0-set-up-the-practice-project)
    - [Choose one caching model](#choose-one-caching-model)
    - [Shared root layout](#shared-root-layout)
  - [Contents](#contents)
  - [The mental model](#the-mental-model)
  - [1. Pages and navigation](#1-pages-and-navigation)
  - [2. Server and Client Components](#2-server-and-client-components)
  - [3. Nested layouts and persistent state](#3-nested-layouts-and-persistent-state)
  - [4. Dynamic routes and not-found UI](#4-dynamic-routes-and-not-found-ui)
  - [5. Search parameters and URL state](#5-search-parameters-and-url-state)
  - [6. Async Server Components and loading UI](#6-async-server-components-and-loading-ui)
  - [7. Streaming with Suspense](#7-streaming-with-suspense)
  - [8. Error boundaries](#8-error-boundaries)
  - [9. Route Handlers and browser fetching](#9-route-handlers-and-browser-fetching)
  - [10. Server Actions and form state](#10-server-actions-and-form-state)
  - [11. Cookies and persisted preferences](#11-cookies-and-persisted-preferences)
  - [12. Static generation and metadata](#12-static-generation-and-metadata)
  - [13. Images and CSS Modules](#13-images-and-css-modules)
  - [14. Environment variables](#14-environment-variables)
  - [15. Caching and revalidation](#15-caching-and-revalidation)
    - [Start the local origin](#start-the-local-origin)
    - [Add the page and invalidation action](#add-the-page-and-invalidation-action)
  - [16. Programmatic navigation](#16-programmatic-navigation)
  - [Quick reference and challenges](#quick-reference-and-challenges)
    - [Files and responsibilities](#files-and-responsibilities)
    - [Pick the right tool](#pick-the-right-tool)
    - [Common mistakes](#common-mistakes)
    - [Ubuntu / pnpm workflow](#ubuntu--pnpm-workflow)
    - [Practice challenges](#practice-challenges)
    - [Further reading](#further-reading)

## The mental model

Next.js adds routing, server rendering, data access and build tools around React. In the App Router, pages and layouts are Server Components unless a client boundary changes that.

| Concept           | Meaning                                                                                |
| ----------------- | -------------------------------------------------------------------------------------- |
| `page.jsx`        | UI for a URL                                                                           |
| `layout.jsx`      | Shared wrapper for a route subtree                                                     |
| Server Component  | Runs on the server, possibly during build; can await server work                       |
| Client Component  | Supports state, events and browser APIs; its initial HTML can still be server-rendered |
| `'use client'`    | Marks an entry point into the client module graph                                      |
| Server Action     | A server function invoked through an action, often to handle a form                    |
| `route.js`        | An HTTP endpoint returning a `Response`                                                |
| Static rendering  | Prepare route output ahead of requests                                                 |
| Dynamic rendering | Render using request-time information                                                  |
| Streaming         | Send ready UI while slower sections finish                                             |

`'use server'` marks Server Functions; it is **not** needed to make a page a Server Component. Browser hooks come from React or `next/navigation`; App Router examples do not use `next/router`, `getServerSideProps` or `getStaticProps`.

## 1. Pages and navigation

**What it does:** folders define URL segments, while `page.jsx` makes a route accessible. `Link` supports client-side navigation.

**`src/app/page.jsx`**

```jsx
import Link from "next/link";

const routes = [
  "/about",
  "/counter",
  "/dashboard",
  "/products/widget",
  "/search",
  "/slow",
  "/stream",
  "/errors",
  "/api-demo",
  "/forms",
  "/preferences",
  "/articles/routing",
  "/gallery",
  "/environment",
  "/cache",
  "/navigate",
];

export default function HomePage() {
  return (
    <>
      <h1>Next.js revision labs</h1>
      <p>Create each lab's files before opening its route.</p>
      <ul>
        {routes.map((href) => (
          <li key={href}>
            <Link href={href}>{href}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
```

**`src/app/about/page.jsx`**

```jsx
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <h1>About this lab</h1>
      <p>This page exists because of its folder and filename.</p>
      <Link href="/">Back home</Link>
    </>
  );
}
```

**Try it:** open `/about`, then navigate home. Create `src/app/about/team/page.jsx` with a default component to add `/about/team`.

**Remember:** a folder alone doesn't expose a page. `Link` prefetching is primarily a production behavior. [Docs](https://nextjs.org/docs/app/getting-started/linking-and-navigating)

## 2. Server and Client Components

**What it does:** keeps the page on the server while giving one small component browser interactivity.

**`src/app/counter/Counter.jsx`**

```jsx
"use client";

import { useState } from "react";

export default function Counter({ initialCount }) {
  const [count, setCount] = useState(initialCount);
  return (
    <section>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Add one</button>
      <button onClick={() => setCount(initialCount)}>Reset</button>
    </section>
  );
}
```

**`src/app/counter/page.jsx`**

```jsx
import Counter from "./Counter";

export default function CounterPage() {
  return (
    <>
      <h1>Server page, interactive child</h1>
      <Counter initialCount={3} />
    </>
  );
}
```

**Try it:** open `/counter`, increment and reset. Remove `'use client'` from `Counter.jsx` to see the hook boundary error, then restore it.

**Remember:** props crossing into Client Components must be serializable by React. Numbers and plain data work; arbitrary callbacks from a Server Component don't. Imported dependencies below the client boundary join the client bundle. Don't read `window` during rendering just because a file has `'use client'`; use an event handler or effect. [Docs](https://nextjs.org/docs/app/getting-started/server-and-client-components)

## 3. Nested layouts and persistent state

**What it does:** preserves a shared sidebar and its state while navigating between sibling dashboard pages.

**`src/app/dashboard/Sidebar.jsx`**

```jsx
"use client";

import Link from "next/link";
import { useState } from "react";

export default function Sidebar() {
  const [note, setNote] = useState("");
  return (
    <aside>
      <nav>
        <Link href="/dashboard">Overview</Link>
        <Link href="/dashboard/settings">Settings</Link>
      </nav>
      <label>
        Temporary note
        <input value={note} onChange={(event) => setNote(event.target.value)} />
      </label>
    </aside>
  );
}
```

**`src/app/dashboard/layout.jsx`**

```jsx
import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <section>
      <h1>Dashboard</h1>
      <Sidebar />
      {children}
    </section>
  );
}
```

**`src/app/dashboard/page.jsx`**

```jsx
export default function DashboardPage() {
  return <h2>Overview</h2>;
}
```

**`src/app/dashboard/settings/page.jsx`**

```jsx
export default function SettingsPage() {
  return <h2>Settings</h2>;
}
```

**Try it:** type a note at `/dashboard`, then click Settings and Overview. It stays. Reload the browser: it resets because it was only React state.

**Remember:** shared layouts persist across relevant client navigations. A `template.jsx` is an alternative wrapper that remounts its children on relevant navigation. [Docs](https://nextjs.org/docs/app/getting-started/layouts-and-pages)

## 4. Dynamic routes and not-found UI

**What it does:** reads a URL segment and renders matching data, or a deliberate not-found state.

**`src/app/products/[slug]/page.jsx`**

```jsx
import Link from "next/link";
import { notFound } from "next/navigation";

const products = {
  widget: { title: "Widget", price: 12 },
  gadget: { title: "Gadget", price: 25 },
};

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = Object.hasOwn(products, slug) ? products[slug] : null;
  if (!product) notFound();

  return (
    <>
      <h1>{product.title}</h1>
      <p>Price: ${product.price}</p>
      <nav>
        <Link href="/products/widget">Widget</Link>
        <Link href="/products/gadget">Gadget</Link>
        <Link href="/products/missing">Missing product</Link>
      </nav>
    </>
  );
}
```

**`src/app/products/[slug]/not-found.jsx`**

```jsx
import Link from "next/link";

export default function ProductNotFound() {
  return (
    <>
      <h1>Product not found</h1>
      <Link href="/products/widget">Open a known product</Link>
    </>
  );
}
```

**Try it:** open `/products/widget`, `/products/gadget` and `/products/missing`.

**Remember:** modern App Router `params` is a Promise; await it in async Server Components. `[slug]` matches one segment, `[...slug]` matches one or more, and `[[...slug]]` also accepts no segment. `notFound()` stops rendering the current segment; don't catch it as a generic error. [Docs](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes)

## 5. Search parameters and URL state

**What it does:** stores a filter in the URL, making it bookmarkable and shareable. A standard GET form works without a Client Component.

**`src/app/search/page.jsx`**

```jsx
const topics = ["Routing", "Layouts", "Server Components", "Caching", "Forms"];

export default async function SearchPage({ searchParams }) {
  const values = await searchParams;
  const query = typeof values.q === "string" ? values.q : "";
  const matches = topics.filter((topic) =>
    topic.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <h1>Search topics</h1>
      <form action="/search" method="get">
        <label>
          Query <input name="q" defaultValue={query} />
        </label>
        <button>Search</button>
      </form>
      <p>Query: {query || "(empty)"}</p>
      <ul>
        {matches.map((topic) => (
          <li key={topic}>{topic}</li>
        ))}
      </ul>
      {matches.length === 0 && <p>No matches.</p>}
    </>
  );
}
```

**Try it:** open `/search?q=ing`, search for `forms`, then refresh. The URL keeps the search value. This plain form performs a document navigation on submit.

**Remember:** page `searchParams` is also awaited and its values can be strings, arrays or absent. On the client, use `useSearchParams()` from `next/navigation`; static routes using that hook need an appropriate Suspense boundary. [Docs](https://nextjs.org/docs/app/api-reference/file-conventions/page)

## 6. Async Server Components and loading UI

**What it does:** waits for simulated server data while `loading.jsx` supplies a route fallback. `connection()` makes this lab run at request time instead of being completed during build.

**`src/app/slow/page.jsx`**

```jsx
import { connection } from "next/server";

export default async function SlowPage() {
  await connection();
  await new Promise((resolve) => setTimeout(resolve, 1800));
  const lessons = ["Routing", "Data loading", "Forms"];

  return (
    <>
      <h1>Lessons loaded</h1>
      <ul>
        {lessons.map((lesson) => (
          <li key={lesson}>{lesson}</li>
        ))}
      </ul>
    </>
  );
}
```

**`src/app/slow/loading.jsx`**

```jsx
export default function Loading() {
  return <p role="status">Loading lessons…</p>;
}
```

**Try it:** open `/slow`. Increase the delay to 3000ms and observe the fallback. Reload to force a new request if client navigation reuses previous output.

**Remember:** no `useEffect` is needed just to load data in a Server Component. `loading.jsx` wraps the page and descendants in a Suspense boundary; work awaited in the same segment's layout sits above it. Lab 15 replaces simulated data with real server-side `fetch`. [Loading docs](https://nextjs.org/docs/app/api-reference/file-conventions/loading) · [connection](https://nextjs.org/docs/app/api-reference/functions/connection)

## 7. Streaming with Suspense

**What it does:** gives a slow section its own fallback while the rest of the page remains visible.

**`src/app/stream/page.jsx`**

```jsx
import { Suspense } from "react";
import { connection } from "next/server";

async function SlowSummary() {
  await connection();
  await new Promise((resolve) => setTimeout(resolve, 2200));
  return <p>Summary ready: 8 completed exercises.</p>;
}

export default function StreamPage() {
  return (
    <>
      <h1>Learning dashboard</h1>
      <p>This section can appear before the summary.</p>
      <Suspense fallback={<p role="status">Preparing summary…</p>}>
        <SlowSummary />
      </Suspense>
    </>
  );
}
```

**Try it:** open `/stream`. The heading can display before the summary. Add a second async component with a different delay and its own Suspense boundary.

**Remember:** place the slow `await` inside the component below the boundary. Awaiting everything in the parent first prevents that boundary from showing while the work runs. Network/browser buffering can affect when small chunks become visible. [Docs](https://nextjs.org/docs/app/getting-started/fetching-data)

## 8. Error boundaries

**What it does:** catches an unexpected render error and offers recovery for the affected route.

**`src/app/errors/page.jsx`**

```jsx
"use client";

import { useState } from "react";

export default function ErrorsPage() {
  const [broken, setBroken] = useState(false);
  if (broken) throw new Error("Intentional render error for this exercise");

  return (
    <>
      <h1>Error boundary lab</h1>
      <button onClick={() => setBroken(true)}>Trigger render error</button>
    </>
  );
}
```

**`src/app/errors/error.jsx`**

```jsx
"use client";

export default function ErrorFallback({ reset }) {
  return (
    <section role="alert">
      <h2>This section could not render.</h2>
      <button onClick={() => reset()}>Reset this demo</button>
    </section>
  );
}
```

**Try it:** at `/errors`, click the trigger, then reset. The failed child remounts with its initial state. Development may show an error overlay; dismiss it or use a production build to inspect the fallback.

**Remember:** `error.jsx` must be a Client Component. It doesn't catch errors thrown directly inside event handlers or its own same-segment layout. Here the handler updates state and the error is thrown during the next render. `reset()` clears the boundary; newer Next.js 16 versions also expose `retry()` for re-fetching server content. [Docs](https://nextjs.org/docs/app/api-reference/file-conventions/error)

## 9. Route Handlers and browser fetching

**What it does:** exposes JSON over HTTP and requests it from an interactive component. The route validates input separately from the browser UI.

**`src/app/api/double/route.js`**

```js
export async function GET(request) {
  const raw = new URL(request.url).searchParams.get("value");
  const value = Number(raw);

  if (
    raw === null ||
    raw.trim() === "" ||
    !Number.isFinite(value) ||
    Math.abs(value) > 1_000_000
  ) {
    return Response.json(
      { error: "Enter a finite number between -1000000 and 1000000." },
      { status: 400 },
    );
  }

  return Response.json({ value, doubled: value * 2 });
}
```

**`src/app/api-demo/page.jsx`**

```jsx
"use client";

import { useState } from "react";

export default function ApiDemoPage() {
  const [value, setValue] = useState("6");
  const [message, setMessage] = useState("Submit a number.");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setPending(true);
    setMessage("Loading…");
    try {
      const response = await fetch(
        `/api/double?value=${encodeURIComponent(value)}`,
        { cache: "no-store" },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Request failed");
      setMessage(`${data.value} doubled is ${data.doubled}`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Browser → Route Handler</h1>
      <label>
        Number{" "}
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </label>
      <button disabled={pending}>{pending ? "Calculating…" : "Double"}</button>
      <p role="status">{message}</p>
    </form>
  );
}
```

**Try it:** use `/api-demo`, then enter `abc` or leave the field blank. Inspect the Network tab: success is HTTP 200; invalid input is 400. Open `/api/double?value=7` directly to see JSON.

**Remember:** export methods such as `GET` or `POST`; unsupported methods receive 405. A `route.js` and `page.jsx` cannot occupy the same route segment. Server Components usually access their data source directly rather than making HTTP requests to their own Route Handlers. [Docs](https://nextjs.org/docs/app/getting-started/route-handlers)

## 10. Server Actions and form state

**What it does:** submits a form to a server function and displays its returned result and pending state. This validates and previews a label; it does not save to a database.

**`src/app/forms/actions.js`**

```js
"use server";

export async function previewLabel(previousState, formData) {
  const label = String(formData.get("label") ?? "").trim();
  if (label.length < 2 || label.length > 40) {
    return { message: "Use between 2 and 40 characters." };
  }
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { message: `Server accepted: ${label.toUpperCase()}` };
}
```

**`src/app/forms/page.jsx`**

```jsx
"use client";

import { useActionState } from "react";
import { previewLabel } from "./actions";

export default function FormsPage() {
  const [state, formAction, pending] = useActionState(previewLabel, {
    message: "",
  });

  return (
    <form action={formAction}>
      <h1>Server Action lab</h1>
      <label>
        Label <input name="label" />
      </label>
      <button disabled={pending}>
        {pending ? "Sending…" : "Preview label"}
      </button>
      <p role="status">{state.message}</p>
    </form>
  );
}
```

**Try it:** at `/forms`, submit one character, then `demo label`. Observe validation, the pending label and uppercase result. The uncontrolled input resets after the action completes successfully, including when it returns this demo's validation message.

**Remember:** `useActionState` adds previous state as the action's first argument. Form fields need `name` attributes. Treat Server Actions as reachable server endpoints: validate input and check authorization inside actions that access protected data. A `'use server'` directive is not an authorization check. [Docs](https://nextjs.org/docs/app/guides/forms)

## 11. Cookies and persisted preferences

**What it does:** reads a preference on the server and updates it through a Server Action. This lab survives a page reload without a database.

**`src/app/preferences/actions.js`**

```js
"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function saveTheme(formData) {
  const theme = formData.get("theme");
  if (theme !== "light" && theme !== "dark") throw new Error("Invalid theme");

  const cookieStore = await cookies();
  cookieStore.set("lab-theme", theme, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  revalidatePath("/preferences");
}
```

**`src/app/preferences/page.jsx`**

```jsx
import { cookies } from "next/headers";
import { saveTheme } from "./actions";

export default async function PreferencesPage() {
  const cookieStore = await cookies();
  const theme =
    cookieStore.get("lab-theme")?.value === "dark" ? "dark" : "light";

  return (
    <section
      style={{
        padding: 24,
        background: theme === "dark" ? "#222" : "#eee",
        color: theme === "dark" ? "#fff" : "#111",
      }}
    >
      <h1>Saved theme: {theme}</h1>
      <form action={saveTheme}>
        <button name="theme" value="light">
          Light
        </button>
        <button name="theme" value="dark">
          Dark
        </button>
      </form>
    </section>
  );
}
```

**Try it:** open `/preferences`, choose Dark, then reload. Inspect the `lab-theme` cookie in browser DevTools. It is HttpOnly, so `document.cookie` cannot read it.

**Remember:** `cookies()` is async. Read cookies in Server Components; write them in a Server Action or Route Handler. This is a cosmetic preference, not authentication. For production HTTPS cookies, also set `secure: true`. [Docs](https://nextjs.org/docs/app/api-reference/functions/cookies)

## 12. Static generation and metadata

**What it does:** supplies known dynamic paths for build-time generation and gives each article its own browser-tab title.

**`src/app/articles/[slug]/page.jsx`**

```jsx
import { notFound } from "next/navigation";

const articles = {
  routing: {
    title: "Routing basics",
    body: "Folders and special files define routes.",
  },
  rendering: {
    title: "Rendering basics",
    body: "Server rendering can happen at build time or request time.",
  },
};

function getArticle(slug) {
  return Object.hasOwn(articles, slug) ? articles[slug] : null;
}

export function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  return { title: article.title, description: article.body };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  return (
    <article>
      <h1>{article.title}</h1>
      <p>{article.body}</p>
    </article>
  );
}
```

**Try it:** visit `/articles/routing` and `/articles/rendering`. Inspect the tab title; the root layout's title template applies. `/articles/unknown` is not generated and returns not-found UI.

For the actual build behavior, stop the dev server with **Ctrl+C**, then run:

```bash
pnpm build
pnpm start
```

**Remember:** `generateStaticParams` identifies paths; it does not return page props. Metadata exports belong in Server Components. `dynamicParams = false` rejects paths outside the generated list in this configuration. [Static params](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) · [Metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)

## 13. Images and CSS Modules

**What it does:** renders a local asset with `next/image` and uses a CSS Module to scope styles to this component.

For a self-contained asset, create this SVG. It is intentionally served unoptimized; try a local JPEG or PNG afterward to explore raster optimization.

**`public/lab-card.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
  <rect width="640" height="360" rx="24" fill="#e8f0fe" />
  <circle cx="320" cy="140" r="70" fill="#2458a6" />
  <text x="320" y="285" text-anchor="middle" font-family="sans-serif" font-size="36" fill="#17365d">Image lab</text>
</svg>
```

**`src/app/gallery/gallery.module.css`**

```css
.card {
  padding: 1rem;
  border: 2px solid #2458a6;
  border-radius: 1rem;
}
.image {
  display: block;
  width: 100%;
  height: auto;
}
```

**`src/app/gallery/page.jsx`**

```jsx
import Image from "next/image";
import styles from "./gallery.module.css";

export default function GalleryPage() {
  return (
    <section className={styles.card}>
      <h1>Local image</h1>
      <Image
        src="/lab-card.svg"
        alt="Blue circle above the words Image lab"
        width={640}
        height={360}
        className={styles.image}
        unoptimized
      />
    </section>
  );
}
```

**Try it:** open `/gallery` and resize the browser. Add a real `public/sample.jpg`, change `src` and its dimensions, remove `unoptimized`, and inspect image requests in DevTools.

**Remember:** `public/` assets are addressed from `/`, not `/public/`. Dimensions establish the aspect ratio and help prevent layout shifts. Remote images need an allowed `remotePatterns` configuration. [Docs](https://nextjs.org/docs/app/api-reference/components/image)

## 14. Environment variables

**What it does:** shows the difference between a server-only value and a deliberately public, build-time client value. The values below are dummy strings, never credentials.

**`.env.local`** — project root, not inside `src/`

```dotenv
DEMO_PRIVATE_TOKEN=demo-placeholder-not-a-real-secret
NEXT_PUBLIC_LAB_LABEL=Public demo label
```

**`src/app/environment/PublicLabel.jsx`**

```jsx
"use client";

export default function PublicLabel() {
  return (
    <p>Public label: {process.env.NEXT_PUBLIC_LAB_LABEL || "Not configured"}</p>
  );
}
```

**`src/app/environment/page.jsx`**

```jsx
import { connection } from "next/server";
import PublicLabel from "./PublicLabel";

export default async function EnvironmentPage() {
  await connection();
  const configured = Boolean(process.env.DEMO_PRIVATE_TOKEN);
  return (
    <>
      <h1>Environment lab</h1>
      <p>Server token configured: {configured ? "yes" : "no"}</p>
      <PublicLabel />
    </>
  );
}
```

**Try it:** restart the dev server and open `/environment`. Change the public label and restart. In production, rebuild to change the inlined public value.

**Remember:** `NEXT_PUBLIC_` values are exposed in client JavaScript. A server-only variable can still leak if you render it or pass it to a Client Component; this example only returns a boolean. Keep `.env.local` ignored by Git. Commit an `.env.example` containing placeholders if needed. [Docs](https://nextjs.org/docs/app/guides/environment-variables)

## 15. Caching and revalidation

**What it does:** caches a real server-side HTTP response from a local origin, then invalidates the route on demand. Origin logs make cache misses visible.

### Start the local origin

Create this file at the project root.

**`demo-origin.mjs`**

```js
import { createServer } from "node:http";

let requestCount = 0;

createServer((request, response) => {
  if (request.url !== "/sample") {
    response.writeHead(404);
    response.end("Not found");
    return;
  }
  requestCount += 1;
  const data = { requestCount, generatedAt: new Date().toISOString() };
  console.log("Origin request", data);
  response.writeHead(200, { "Content-Type": "application/json" });
  response.end(JSON.stringify(data));
}).listen(4001, "127.0.0.1", () => {
  console.log("Demo origin: http://127.0.0.1:4001/sample");
});
```

In a **second terminal**, from the project root:

```bash
node demo-origin.mjs
```

Leave it running. The Next.js server, not the browser, makes requests to this origin, so no CORS configuration is needed.

### Add the page and invalidation action

**`src/app/cache/actions.js`**

```js
"use server";

import { revalidatePath } from "next/cache";

export async function invalidateSample() {
  revalidatePath("/cache");
}
```

**`src/app/cache/page.jsx`**

```jsx
import { connection } from "next/server";
import { invalidateSample } from "./actions";

export default async function CachePage() {
  await connection();
  const response = await fetch("http://127.0.0.1:4001/sample", {
    cache: "force-cache",
    next: { revalidate: 15 },
  });
  if (!response.ok) throw new Error(`Origin returned ${response.status}`);
  const data = await response.json();

  return (
    <>
      <h1>Cached origin response</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <p>Page rendered at: {new Date().toISOString()}</p>
      <form action={invalidateSample}>
        <button>Invalidate cached sample</button>
      </form>
    </>
  );
}
```

**Try it in production mode:** keep the origin running. Stop the Next.js dev server, run `pnpm build`, then `pnpm start`.

1. Open `/cache`; note the origin's `requestCount` and timestamp.
2. Reload within 15 seconds. The page-render timestamp changes, but the cached origin response can stay the same.
3. After 15 seconds, reload. Time-based revalidation may first serve stale data and refresh in the background; reload again to see the refreshed response. It is request-driven, not a timer polling the origin.
4. Click **Invalidate cached sample**. The action invalidates this path and updates the page with revalidated data.
5. Replace the entire fetch options object with `{ cache: 'no-store' }`, rebuild/restart, and compare origin logs across reloads.

**Remember:** `connection()` makes the page request-rendered, while the explicit fetch option caches just its data. `router.refresh()` alone doesn't invalidate the server Data Cache. Development HMR and hard-refresh behavior can differ; use production mode for this exercise. Do not combine `no-store` with a positive `revalidate` duration.

This localhost origin is a learning fixture; it must be running wherever the Next.js server runs. Use a real reachable data source when deploying.

[Fetch docs](https://nextjs.org/docs/app/api-reference/functions/fetch) · [revalidatePath](https://nextjs.org/docs/app/api-reference/functions/revalidatePath)

## 16. Programmatic navigation

**What it does:** navigates after an event, and displays the current pathname from a client hook.

**`src/app/navigate/page.jsx`**

```jsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function NavigatePage() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  return (
    <>
      <h1>Navigation controls</h1>
      <p>Current path: {pathname}</p>
      <label>
        Search query{" "}
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
      <button
        onClick={() => router.push(`/search?q=${encodeURIComponent(query)}`)}
      >
        Search with history entry
      </button>
      <button onClick={() => router.replace("/about")}>
        Replace with About
      </button>
      <button onClick={() => router.back()}>Back</button>
    </>
  );
}
```

**Try it:** after creating labs 1 and 5, open `/navigate`, enter a query and search. Use browser Back. Then compare `replace`, which doesn't add another history entry. `back()` follows real browser history, which may leave the app.

**Remember:** use `Link` for ordinary links and `useRouter` for imperative navigation. `router.refresh()` requests fresh Server Component output while preserving unaffected client state; it doesn't necessarily fetch uncached data. Never pass arbitrary untrusted URLs to `push` or `replace`. [Docs](https://nextjs.org/docs/app/api-reference/functions/use-router)

## Quick reference and challenges

### Files and responsibilities

| File or folder             | Purpose                                      |
| -------------------------- | -------------------------------------------- |
| `src/app/page.jsx`         | Home page                                    |
| `src/app/layout.jsx`       | Root HTML structure and shared UI            |
| `src/app/example/page.jsx` | `/example` route                             |
| `[slug]/page.jsx`          | Dynamic segment                              |
| `(group)/`                 | Organize routes without adding a URL segment |
| `loading.jsx`              | Suspense fallback for a segment              |
| `error.jsx`                | Client error boundary fallback               |
| `not-found.jsx`            | Not-found UI                                 |
| `route.js`                 | HTTP handler                                 |
| `public/`                  | Files served from root URLs                  |
| `*.module.css`             | Component-scoped CSS class names             |
| `.env.local`               | Local environment values; keep out of Git    |

### Pick the right tool

| Need                                          | Use                                                        |
| --------------------------------------------- | ---------------------------------------------------------- |
| Initial server data                           | Async Server Component                                     |
| Clicks, local state, effects                  | Small Client Component                                     |
| Public JSON endpoint or webhook               | Route Handler                                              |
| Form-driven server mutation                   | Server Action with validation                              |
| Bookmarkable filter                           | URL search parameters                                      |
| Share a wrapper across pages                  | Layout                                                     |
| Show partial UI while waiting                 | Suspense / `loading.jsx`                                   |
| Return a missing resource state               | `notFound()`                                               |
| Redirect after server work                    | `redirect()` from `next/navigation`                        |
| Request server output again from client       | `router.refresh()`                                         |
| Invalidate route-associated server caches     | `revalidatePath()`                                         |
| Cache components/functions in the newer model | Enable Cache Components and learn `'use cache'` separately |

### Common mistakes

- **Putting `'use client'` everywhere:** keep it near the interactive parts to limit browser JavaScript.
- **Treating Client Components as browser-only:** initial rendering can still happen on the server.
- **Reading `params`, `searchParams`, or `cookies()` synchronously:** await the modern APIs where required.
- **Mixing Pages Router tutorials into App Router code:** check the docs' router selector.
- **Fetching from your own Route Handler during build:** call the underlying data source directly.
- **Assuming defaults mean fresh data on every request:** route prerendering and data caching are separate concerns; make freshness requirements explicit.
- **Using React state as server persistence:** reloads and server restarts do not provide database durability.
- **Using module-level arrays as a production database:** multiple workers/instances won't reliably share them.
- **Catching `redirect()` or `notFound()` accidentally:** these use special control-flow errors; keep them outside generic catches.
- **Expecting `revalidatePath` to mutate data:** it invalidates cached results; your action still has to perform the actual write.
- **Committing real environment values:** use dummy placeholders in public documentation and examples.

### Ubuntu / pnpm workflow

Run commands from the project root. Stop a running process with **Ctrl+C**.

```bash
# Development
pnpm dev

# Check installed framework versions
pnpm list next react react-dom

# Lint separately; Next.js 16 builds do not run the linter for you
pnpm exec eslint .

# Production check
pnpm build
pnpm start

# Use a different dev port if 3000 is busy
pnpm exec next dev -p 3001
```

Commit `pnpm-lock.yaml` with the project so dependency versions are reproducible. Do not commit `node_modules/`, `.next/` or `.env.local`. The standard generated `.gitignore` handles these; inspect it before publishing. Keep the local origin running for lab 15.

### Practice challenges

- [ ] Add a second dynamic route parameter, such as `/products/[slug]/reviews/[id]`.
- [ ] Add a GET-form category filter alongside `q` in the search lab.
- [ ] Give two slow dashboard sections independent Suspense fallbacks.
- [ ] Add a `POST` Route Handler that validates JSON and returns HTTP 400 for invalid input.
- [ ] Persist a form submission in a real database, then invalidate the affected page.
- [ ] Add a route group, such as `(marketing)`, and confirm it doesn't appear in URLs.
- [ ] Explain why a Client Component can still encounter a `window is not defined` error.
- [ ] Explain why refreshing a route doesn't necessarily clear its cached server data.

### Further reading

- [Next.js installation](https://nextjs.org/docs/app/getting-started/installation)
- [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Cache Components configuration](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents)
- [Migrating to Cache Components](https://nextjs.org/docs/app/guides/migrating-to-cache-components)
- [use cache directive](https://nextjs.org/docs/app/api-reference/directives/use-cache)
- [Authentication](https://nextjs.org/docs/app/guides/authentication)
- [Proxy](https://nextjs.org/docs/app/getting-started/proxy) — the Next.js 16 name for the convention previously called Middleware
- [Testing](https://nextjs.org/docs/app/guides/testing)

Documentation checked: **1 October 2026**. The labs target Next.js 16 with Cache Components disabled, not every past/future version or configuration. Examples are original teaching exercises. Markdown structure and file relationships were reviewed; a full Next.js build and browser run were not performed as part of producing this document.
