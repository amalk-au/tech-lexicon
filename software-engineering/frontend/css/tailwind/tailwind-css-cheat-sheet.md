# Tailwind CSS Cheat Sheet

[Back to the CSS main index](../README.md)

A practical, modern reference for Tailwind CSS — installation, configuration, and the utility classes you'll reach for 90% of the time.

---

## Table of Contents
- [Tailwind CSS Cheat Sheet](#tailwind-css-cheat-sheet)
  - [Table of Contents](#table-of-contents)
  - [What is Tailwind?](#what-is-tailwind)
  - [Installation \& Setup](#installation--setup)
    - [Vite (React, Vue, Svelte, etc.) — recommended for most SPAs](#vite-react-vue-svelte-etc--recommended-for-most-spas)
    - [Next.js](#nextjs)
    - [Plain HTML / PostCSS (framework-agnostic)](#plain-html--postcss-framework-agnostic)
    - [CDN (prototyping only — not for production)](#cdn-prototyping-only--not-for-production)
    - [Legacy v3 Setup](#legacy-v3-setup)
  - [Configuration](#configuration)
    - [v4: CSS-First Theming](#v4-css-first-theming)
    - [Content Detection](#content-detection)
    - [Plugins](#plugins)
    - [Editor Setup](#editor-setup)
  - [1. The Box Model (Spacing \& Sizing)](#1-the-box-model-spacing--sizing)
  - [2. Layout (Flexbox \& Grid)](#2-layout-flexbox--grid)
    - [Flexbox (One-Dimensional)](#flexbox-one-dimensional)
    - [Grid (Two-Dimensional)](#grid-two-dimensional)
    - [Common Alignment Utility (both)](#common-alignment-utility-both)
  - [3. Typography](#3-typography)
  - [4. Decoration (Borders, Backgrounds, Effects)](#4-decoration-borders-backgrounds-effects)
  - [5. Responsive Design (The Breakpoints)](#5-responsive-design-the-breakpoints)
    - [Container Queries (v4 built-in)](#container-queries-v4-built-in)
  - [6. Interactive States (Hovers \& Transitions)](#6-interactive-states-hovers--transitions)
  - [7. Dark Mode](#7-dark-mode)
    - [Manual toggle (class-based) — v4](#manual-toggle-class-based--v4)
  - [8. Modern "Extra" Utilities](#8-modern-extra-utilities)
  - [9. Arbitrary Values](#9-arbitrary-values)
  - [10. Component Patterns](#10-component-patterns)
    - [Extracting repeated utility strings with `@apply` (use sparingly)](#extracting-repeated-utility-strings-with-apply-use-sparingly)
    - [Merging conditional classes safely](#merging-conditional-classes-safely)
  - [The "Golden Rule" of Tailwind](#the-golden-rule-of-tailwind)

---

## What is Tailwind?

Tailwind is a **utility-first CSS framework** — instead of writing custom CSS classes and rules, you compose pre-defined utility classes directly in your markup (`p-4 bg-blue-500 rounded-lg`). It scans your source files at build time and generates a stylesheet containing only the classes you actually use.

> As of mid-2026, **Tailwind CSS v4.3.x** is the current stable line (v3.4 remains supported for teams that can't yet move to v4's browser requirements). This sheet reflects v4's CSS-first setup and utility set.

---

## Installation & Setup

> Tailwind CSS v4 (current) drastically simplified setup — no `tailwind.config.js` or `postcss.config.js` boilerplate is required by default, and configuration now lives in CSS itself. If you're on Tailwind v3, see the [legacy setup note](#legacy-v3-setup) below.

### Vite (React, Vue, Svelte, etc.) — recommended for most SPAs
```bash
npm install tailwindcss @tailwindcss/vite
```

```js
// vite.config.js
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
})
```

```css
/* src/index.css */
@import "tailwindcss";
```

Import that CSS file once in your app's entry point (e.g. `main.jsx`), and you're ready to use Tailwind classes anywhere.

### Next.js
```bash
npm install tailwindcss @tailwindcss/postcss postcss
```

```js
// postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

```css
/* app/globals.css */
@import "tailwindcss";
```

### Plain HTML / PostCSS (framework-agnostic)
```bash
npm install tailwindcss @tailwindcss/cli
```

```css
/* input.css */
@import "tailwindcss";
```

```bash
npx @tailwindcss/cli -i ./src/input.css -o ./dist/output.css --watch
```

```html
<link href="/dist/output.css" rel="stylesheet">
```

### CDN (prototyping only — not for production)
```html
<script src="https://cdn.tailwindcss.com"></script>
```

### Legacy v3 Setup
If your project is still on Tailwind v3:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```
```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
}
```
```css
/* index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Configuration

### v4: CSS-First Theming
Tailwind v4 configures design tokens directly in CSS using `@theme`, instead of a JS config file:

```css
@import "tailwindcss";

@theme {
  --color-brand: #6d28d9;
  --font-display: "Satoshi", sans-serif;
  --breakpoint-3xl: 1920px;
  --spacing-18: 4.5rem;
}
```

This immediately makes new utility classes available: `bg-brand`, `text-brand`, `font-display`, `3xl:grid-cols-4`, `p-18`, etc. — no rebuild config needed.

### Content Detection
v4 auto-detects source files via built-in heuristics (respecting `.gitignore`) — you generally **don't** need to manually configure `content` paths like in v3. If you need to explicitly include extra files (e.g. a monorepo package):

```css
@import "tailwindcss";
@source "../../packages/ui/src/**/*.{js,jsx}";
```

### Plugins
```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
@plugin "@tailwindcss/forms";
```

Popular official plugins: `@tailwindcss/typography` (prose styling for rendered markdown/CMS content), `@tailwindcss/forms` (better default form-element styling), `@tailwindcss/container-queries`.

### Editor Setup
Install the **Tailwind CSS IntelliSense** extension (VS Code) for autocomplete, hover previews, and linting of class names.

---

## 1. The Box Model (Spacing & Sizing)

Tailwind's scale: `1` unit = `0.25rem` (4px).

| Category | Classes | Example / Result |
|---|---|---|
| **Padding** | `p-{n}`, `px-{n}`, `py-{n}`, `pt-`, `pb-`, `pl-`, `pr-` | `p-4` (16px all sides) |
| **Margin** | `m-{n}`, `mx-{n}`, `my-{n}`, `mt-`, `mb-`, `ml-`, `mr-` | `mx-auto` (center block) |
| **Width** | `w-{n}`, `w-full`, `w-screen`, `w-1/2`, `w-max`, `w-fit` | `w-64` (256px) |
| **Height** | `h-{n}`, `h-full`, `h-screen`, `h-px`, `h-dvh` | `h-screen` (100vh) |
| **Max Width** | `max-w-xs`, `max-w-md`, `max-w-7xl`, `max-w-none`, `max-w-prose` | `max-w-7xl` (standard container) |
| **Min Width/Height** | `min-w-0`, `min-h-screen`, `min-h-full` | `min-h-screen` (full viewport height) |

> Negative spacing: prefix with `-`, e.g. `-mt-4` (negative top margin).

---

## 2. Layout (Flexbox & Grid)

### Flexbox (One-Dimensional)
- **Initialization:** `flex`, `inline-flex`
- **Direction:** `flex-row` (default), `flex-col`, `flex-row-reverse`, `flex-col-reverse`
- **Alignment (cross axis):** `items-start`, `items-center`, `items-end`, `items-stretch`, `items-baseline`
- **Distribution (main axis):** `justify-start`, `justify-center`, `justify-between`, `justify-around`, `justify-evenly`
- **Wrap:** `flex-wrap`, `flex-nowrap`, `flex-wrap-reverse`
- **Grow/Shrink:** `flex-1` (grow & shrink evenly), `flex-auto`, `flex-initial`, `flex-none`, `grow`, `shrink-0`
- **Gap:** `gap-{n}` (e.g. `gap-4` = 16px between items), `gap-x-{n}`, `gap-y-{n}`

### Grid (Two-Dimensional)
- **Initialization:** `grid`, `inline-grid`
- **Columns:** `grid-cols-1` … `grid-cols-12`, `grid-cols-none`
- **Auto-fit responsive grid:** `grid-cols-[repeat(auto-fit,minmax(200px,1fr))]`
- **Rows:** `grid-rows-{n}`
- **Spanning:** `col-span-2` (item takes 2 columns), `row-span-2`
- **Start/End lines:** `col-start-2`, `col-end-4`
- **Flow:** `grid-flow-row`, `grid-flow-col`, `grid-flow-dense`
- **Gap:** `gap-{n}`, `gap-x-{n}`, `gap-y-{n}` (shared with Flexbox)

### Common Alignment Utility (both)
```html
<div class="flex items-center justify-between">...</div>
<div class="grid place-items-center h-screen">...</div> <!-- center anything -->
```

---

## 3. Typography

| Feature | Classes | Result |
|---|---|---|
| **Size** | `text-xs`, `text-base`, `text-lg`, `text-4xl`, `text-9xl` | `text-base` is 1rem (16px) |
| **Weight** | `font-thin`, `font-normal`, `font-medium`, `font-semibold`, `font-bold`, `font-black` | `font-bold` is 700 |
| **Color** | `text-black`, `text-white`, `text-blue-500`, `text-gray-100` | `text-blue-500` = blue, 500 intensity |
| **Alignment** | `text-left`, `text-center`, `text-right`, `text-justify` | Horizontal alignment |
| **Decoration** | `underline`, `italic`, `uppercase`, `lowercase`, `capitalize` | Text styling |
| **Leading (line-height)** | `leading-none`, `leading-tight`, `leading-normal`, `leading-loose` | Controls line spacing |
| **Tracking (letter-spacing)** | `tracking-tight`, `tracking-normal`, `tracking-wide` | Controls letter spacing |
| **Truncation** | `truncate` (single-line ellipsis), `line-clamp-3` (multi-line clamp) | Cuts off overflowing text |
| **Font family** | `font-sans`, `font-serif`, `font-mono` | Default font stacks |

---

## 4. Decoration (Borders, Backgrounds, Effects)

- **Backgrounds:** `bg-current`, `bg-transparent`, `bg-white`, `bg-blue-500`, `bg-gradient-to-r from-blue-500 to-purple-500`
- **Opacity (color-level, v4):** `bg-blue-500/50` (50% opacity via slash notation — replaces the old `bg-opacity-*` utilities)
- **Borders:** `border`, `border-2`, `border-t-4`, `border-dashed`, `border-gray-200`
- **Rounded Corners:** `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-2xl`, `rounded-full` (circles/pills)
- **Shadows:** `shadow-sm`, `shadow-md`, `shadow-xl`, `shadow-inner`, `shadow-none`
- **Ring (focus outlines, box-shadow based):** `ring`, `ring-2`, `ring-blue-500`, `ring-offset-2`
- **Opacity:** `opacity-0`, `opacity-50`, `opacity-100`

---

## 5. Responsive Design (The Breakpoints)

Tailwind is **mobile-first**. Every class applies to all screen sizes unless you add a breakpoint prefix — prefixed classes apply at that width **and up**.

| Prefix | Breakpoint | Logic |
|---|---|---|
| *(none)* | `0px` | Mobile (default) |
| `sm:` | `640px` | Small tablets |
| `md:` | `768px` | Large tablets / small laptops |
| `lg:` | `1024px` | Standard desktops |
| `xl:` | `1280px` | Large monitors |
| `2xl:` | `1536px` | Ultra-wide monitors |

**Example:**
```html
<div class="w-full md:w-1/2 lg:w-1/3">
  <!-- Full width on mobile, half on tablet, one-third on desktop -->
</div>
```

### Container Queries (v4 built-in)
Style based on a parent container's size instead of the viewport — useful for reusable components:
```html
<div class="@container">
  <div class="flex flex-col @lg:flex-row">
    <!-- Switches to row layout when the CONTAINER (not viewport) is large -->
  </div>
</div>
```

---

## 6. Interactive States (Hovers & Transitions)

- **States:** `hover:`, `focus:`, `focus-visible:`, `active:`, `disabled:`, `visited:`, `checked:`
- **Group states** (style a child based on a parent's state): `group` (on parent) + `group-hover:` (on child)
- **Peer states** (style a sibling based on another element's state): `peer` (on trigger) + `peer-checked:` (on target)
- **Transitions:** `transition`, `transition-all`, `transition-colors`, `transition-opacity`, `transition-transform`
- **Duration:** `duration-100`, `duration-300`, `duration-500`
- **Easing:** `ease-in`, `ease-out`, `ease-in-out`
- **Delay:** `delay-150`

**Example (a button):**
```html
<button class="bg-blue-600 hover:bg-blue-700 active:bg-blue-800
               transition-colors duration-300 disabled:opacity-50
               disabled:cursor-not-allowed">
  Submit
</button>
```

**Example (group hover):**
```html
<div class="group">
  <img class="group-hover:scale-105 transition-transform" src="..." />
  <p class="opacity-0 group-hover:opacity-100 transition-opacity">Details</p>
</div>
```

---

## 7. Dark Mode

Enabled via the `dark:` variant. By default it follows the OS-level `prefers-color-scheme`; you can switch to manual/class-based toggling.

```html
<div class="bg-white dark:bg-gray-900 text-black dark:text-white">
  ...
</div>
```

### Manual toggle (class-based) — v4
```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
```
Then toggle a `dark` class on `<html>` via JavaScript (e.g. based on a user preference stored in local state or a cookie) to switch themes on demand instead of following the OS setting.

---

## 8. Modern "Extra" Utilities

- **Glassmorphism:** `backdrop-blur-md bg-white/30`
- **Z-Index:** `z-0`, `z-10` … `z-50`, `z-auto`
- **Filters:** `blur-sm`, `grayscale`, `brightness-150`, `contrast-125`, `saturate-150`
- **Aspect Ratio:** `aspect-video`, `aspect-square`, `aspect-[4/3]`
- **Scroll snapping:** `snap-x`, `snap-mandatory`, `snap-center`
- **Object fit (images/video):** `object-cover`, `object-contain`, `object-center`
- **Animations (built-in):** `animate-spin`, `animate-ping`, `animate-pulse`, `animate-bounce`
- **Scrollbar styling (v4.3+):** `scrollbar-thin`, `scrollbar-none`, `scrollbar-thumb-gray-400`, `scrollbar-track-gray-100`, `scrollbar-gutter-stable`
- **Zoom / tab-size (v4.3+):** `zoom-150`, `tab-4`
- **Logical properties (v4.2+, RTL/i18n-friendly):** `inline-s-4` / `inline-e-4` (replace the deprecated `start-*` / `end-*`), `ms-4` (margin-inline-start), `pe-4` (padding-inline-end)
- **Height-based container queries (v4.3+):** `@container-size` — pairs with `@min-h-*` / `@max-h-*` variants

---

## 9. Arbitrary Values

When the design scale doesn't have exactly what you need, use square-bracket syntax for one-off values without touching your theme config:

```html
<div class="top-[117px] bg-[#1da1f2] w-[calc(100%-2rem)] grid-cols-[1fr_2fr]">
  ...
</div>
```

Works with most utilities — sizing, color, positioning, grid templates, and even arbitrary CSS properties: `[mask-type:luminance]`.

---

## 10. Component Patterns

### Extracting repeated utility strings with `@apply` (use sparingly)
```css
.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white font-semibold
         py-2 px-4 rounded-lg transition-colors;
}
```
> Prefer extracting a **framework component** (React/Vue) over `@apply` where possible — see the Golden Rule below. `@apply` is best reserved for things outside component boundaries, like base typography in a markdown renderer.

### Merging conditional classes safely
When class names are built dynamically (e.g. conditional variants), use a helper to avoid conflicting utility collisions:
```bash
npm install clsx tailwind-merge
```
```jsx
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

<button className={cn("px-4 py-2 rounded", isActive && "bg-blue-600", className)} />
```

---

## The "Golden Rule" of Tailwind

If you find yourself repeating the same 10 classes on every button, **don't** write a CSS file. Instead, create a component (like `Button.jsx`) and use the classes there once — component composition is Tailwind's real reuse mechanism, not `@apply` or custom CSS.

```jsx
function Button({ children, ...props }) {
  return (
    <button
      className="bg-blue-600 hover:bg-blue-700 transition-colors
                 duration-300 text-white font-semibold py-2 px-4 rounded-lg"
      {...props}
    >
      {children}
    </button>
  );
}
```

---
