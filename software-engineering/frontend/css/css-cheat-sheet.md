# CSS Cheat Sheet

[Back to the CSS main index](./README.md)

A practical, modern reference for CSS — covering fundamentals, layout systems, selectors, and how to use CSS in React (CSS Modules & styled-components).

---

## Table of Contents

1. [What is CSS?](#what-is-css)
2. [Linking CSS to HTML](#linking-css-to-html)
3. [Selectors](#selectors)
4. [Specificity & Cascade](#specificity--cascade)
5. [The Box Model](#the-box-model)
6. [Units](#units)
7. [Colors](#colors)
8. [CSS Custom Properties (Variables)](#css-custom-properties-variables)
9. [Typography & Text](#typography--text)
10. [Backgrounds](#backgrounds)
11. [Borders & Radius](#borders--radius)
12. [Display & Positioning](#display--positioning)
13. [Flexbox](#flexbox)
14. [CSS Grid](#css-grid)
15. [Responsive Design](#responsive-design)
16. [Pseudo-classes](#pseudo-classes)
17. [Pseudo-elements](#pseudo-elements)
18. [Transitions & Animations](#transitions--animations)
19. [Transforms](#transforms)
20. [Modern Layout Helpers](#modern-layout-helpers)
21. [CSS in React](#css-in-react)
22. [Best Practices](#best-practices)

---

## What is CSS?

**CSS (Cascading Style Sheets)** is the stylesheet language used to control the presentation of HTML — colors, fonts, spacing, layout, responsiveness, and interactivity.

### Key concepts

- **Separation of concerns** — structure (HTML) stays separate from presentation (CSS).
- **Selectors** — target elements by tag, class, ID, attribute, relationship, or state.
- **Cascade & specificity** — determines which rule wins when multiple rules match the same element.
- **The box model** — every element is a box made of content, padding, border, and margin.
- **Responsive design** — media queries (and now container queries) adapt layout to screen/container size.
- **Modern layout** — Flexbox and Grid replace older float/table-based layout techniques.

---

## Linking CSS to HTML

There are three ways to apply CSS to a page — same options as JS, with the same trade-offs.

### 1. External Stylesheet (recommended)

```html
<head>
  <link rel="stylesheet" href="styles.css" />
</head>
```

Cacheable, reusable across pages, keeps concerns separated — use this for anything beyond a quick test.

### 2. Internal (Embedded) CSS

```html
<head>
  <style>
    body {
      background-color: powderblue;
    }
    h1 {
      color: blue;
    }
    p {
      color: red;
    }
  </style>
</head>
```

Useful for page-specific styles or quick prototypes.

### 3. Inline CSS

```html
<h1 style="color: blue;">A Blue Heading</h1>
<p style="color: red;">A red paragraph.</p>
```

Highest specificity, hardest to maintain — use sparingly (e.g. dynamic styles set via JS).

---

## Selectors

| Type                   | Info                          | Example                                       |
| ---------------------- | ----------------------------- | --------------------------------------------- |
| Universal              | Any element                   | `* { margin: 0; }`                            |
| Type                   | Any element of that tag       | `h1 { text-decoration: underline; }`          |
| Class                  | Elements with a given class   | `.btn { color: white; }`                      |
| ID                     | A single, unique element      | `#header { padding: 20px; }`                  |
| Grouping               | Multiple selectors, same rule | `h1, h2, h3 { font-family: sans-serif; }`     |
| Descendant             | Any nested element, any depth | `#gallery h1 { text-decoration: underline; }` |
| Child (`>`)            | Direct child only             | `#title > p { font-weight: bold; }`           |
| Adjacent sibling (`+`) | Immediately-following sibling | `h1 + p { font-style: italic; }`              |
| General sibling (`~`)  | Any following sibling         | `h1 ~ p { font-style: italic; }`              |
| Attribute              | Matches an attribute/value    | `input[type="text"] { border: 1px solid; }`   |

### Attribute Selector Variants

```css
a[target]          /* has the attribute, any value */
a[target="_blank"] /* exact value */
a[class~="btn"]    /* value in a whitespace-separated list */
a[href^="https"]   /* starts with */
a[href$=".pdf"]    /* ends with */
a[href*="example"] /* contains */
```

---

## Specificity & Cascade

Specificity determines which conflicting rule "wins." From lowest to highest:

1. **Type selectors & pseudo-elements** — `div`, `::before` (weight: 0-0-1)
2. **Class, attribute & pseudo-class selectors** — `.btn`, `[type="text"]`, `:hover` (weight: 0-1-0)
3. **ID selectors** — `#header` (weight: 1-0-0)
4. **Inline styles** — `style="..."` (beats all selectors)
5. **`!important`** — overrides everything above (use sparingly — it breaks the cascade and makes debugging harder)

> When specificity is equal, the **last rule declared** (in source order) wins.

---

## The Box Model

Every element is a rectangular box: `content` → `padding` → `border` → `margin`.

```css
.box {
  width: 300px;
  padding: 20px;
  border: 2px solid #333;
  margin: 10px;
  box-sizing: border-box; /* width/height include padding & border */
}
```

| Value                   | Behavior                                                                  |
| ----------------------- | ------------------------------------------------------------------------- |
| `content-box` (default) | `width`/`height` apply to content only — padding/border add on top        |
| `border-box`            | `width`/`height` include padding and border — much easier to reason about |

```css
/* Common reset: apply border-box everywhere */
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

### Box Model Properties Quick Reference

```css
margin: 10px; /* all sides */
margin: 10px 20px; /* vertical | horizontal */
margin: 10px 20px 5px 15px; /* top | right | bottom | left */
margin: auto; /* center a block element horizontally */

padding: 10px 20px;
border: 1px solid #ccc;
```

---

## Units

### Absolute

| Unit             | Description                           |
| ---------------- | ------------------------------------- |
| `px`             | Pixels — most common for fine control |
| `cm`, `mm`, `in` | Physical units — mainly for print     |
| `pt`, `pc`       | Points, picas — mainly for print      |

### Relative

| Unit                  | Description                                                                      |
| --------------------- | -------------------------------------------------------------------------------- |
| `%`                   | Relative to the parent element                                                   |
| `em`                  | Relative to the font size of the current element                                 |
| `rem`                 | Relative to the root (`<html>`) font size — **preferred for consistent scaling** |
| `vw` / `vh`           | 1% of viewport width / height                                                    |
| `vmin` / `vmax`       | 1% of the smaller / larger of viewport width or height                           |
| `ch`                  | Width of the "0" character in the current font                                   |
| `svh` / `lvh` / `dvh` | Small/large/dynamic viewport height — account for mobile browser UI chrome       |

> **Practical tip:** Use `rem` for font sizes and spacing (predictable, scales with root font-size for accessibility), `%`/`vw`/`vh` for fluid layout, and `px` for things that shouldn't scale (e.g. 1px borders).

---

## Colors

```css
color: red; /* named color */
color: #ff0000; /* hex */
color: #f00; /* hex shorthand */
color: rgb(255, 0, 0); /* RGB */
color: rgba(255, 0, 0, 0.5); /* RGB + alpha */
color: hsl(0, 100%, 50%); /* hue, saturation, lightness */
color: hsl(0 100% 50% / 0.5); /* modern space-separated + alpha */
color: currentColor; /* inherits the element's `color` value */
color: transparent;
```

### Modern Color Functions

```css
/* oklch — perceptually uniform, increasingly recommended over hsl */
color: oklch(65% 0.25 25);

/* color-mix() — blend two colors */
background: color-mix(in srgb, blue 50%, white);
```

---

## CSS Custom Properties (Variables)

```css
:root {
  --main-color: #007bff;
  --spacing-unit: 8px;
  --font-stack: system-ui, sans-serif;
}

.button {
  background: var(--main-color);
  padding: calc(var(--spacing-unit) * 2);
  font-family: var(--font-stack);
}

/* Fallback value if the variable isn't defined */
.card {
  color: var(--text-color, #333);
}
```

- Scoped to whatever selector they're defined on — `:root` makes them globally available.
- Can be overridden per-component or per-theme (e.g. `[data-theme="dark"] { --main-color: #4dabf7; }`).
- Unlike Sass variables, custom properties are **live** — they can be read and changed at runtime with JavaScript (`element.style.setProperty()`), making them ideal for theming.

---

## Typography & Text

```css
p {
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 1rem;
  font-weight: 400; /* normal | bold | 100–900 */
  font-style: normal; /* italic | oblique */
  line-height: 1.5;
  letter-spacing: 0.02em;
  text-align: left; /* center | right | justify */
  text-decoration: none; /* underline | line-through */
  text-transform: none; /* uppercase | lowercase | capitalize */
  white-space: normal; /* nowrap | pre | pre-wrap */
  text-overflow: ellipsis; /* pairs with overflow: hidden; white-space: nowrap */
}
```

### Modern Font Loading

```css
@font-face {
  font-family: "MyFont";
  src: url("/fonts/myfont.woff2") format("woff2");
  font-display: swap; /* avoid invisible text while loading */
}
```

---

## Backgrounds

```css
.hero {
  background-color: #f5f5f5;
  background-image: url("bg.jpg");
  background-size: cover; /* contain | auto | <length> | % */
  background-position: center; /* top left | 50% 50% | x-pos y-pos */
  background-repeat: no-repeat; /* repeat-x | repeat-y | repeat */
  background-attachment: fixed; /* scroll */

  /* shorthand */
  background: #f5f5f5 url("bg.jpg") center / cover no-repeat;
}

/* Gradients */
.gradient-bg {
  background: linear-gradient(to right, #ff7e5f, #feb47b);
  background: radial-gradient(circle, #ff7e5f, #feb47b);
}
```

---

## Borders & Radius

```css
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  border-top-right-radius: 4px; /* individual corners */

  /* Different sides */
  border-bottom: 2px dashed #333;

  /* Shadow */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.15),
    inset 0 0 4px #fff; /* multiple */
}
```

---

## Display & Positioning

### Display

```css
display: block; /* inline | inline-block | flex | grid | none */
```

### Position

```css
position: static; /* default — normal document flow */
position: relative; /* offset relative to its normal position */
position: absolute; /* removed from flow, positioned relative to nearest positioned ancestor */
position: fixed; /* positioned relative to the viewport, stays on scroll */
position: sticky; /* toggles between relative and fixed based on scroll */

.absolute-box {
  position: absolute;
  top: 0;
  right: 0;
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 10;
}
```

### Stacking

```css
z-index: 10; /* only works on positioned elements (not static) */
```

### Overflow

```css
overflow: visible; /* hidden | scroll | auto */
overflow-x: hidden;
overflow-y: auto;
```

---

## Flexbox

`display: flex` creates a **flex container**; its direct children become **flex items**. Any element can be both a flex container and a flex item.

```css
.flex-container {
  display: flex;
  flex-direction: row; /* row (default) | row-reverse | column | column-reverse */
  justify-content: center; /* aligns items along the MAIN axis */
  align-items: center; /* aligns items along the CROSS axis */
  flex-wrap: nowrap; /* wrap | wrap-reverse */
  gap: 8px; /* space between items */
}
```

### Main Axis vs Cross Axis

- `flex-direction: row` → main axis is **horizontal**, cross axis is **vertical**.
- `flex-direction: column` → main axis is **vertical**, cross axis is **horizontal**.

### `justify-content` values

`flex-start` | `flex-end` | `center` | `space-between` | `space-around` | `space-evenly`

### `align-items` values

`stretch` (default) | `flex-start` | `flex-end` | `center` | `baseline`

### Flex Item Properties

```css
.flex-item {
  flex-grow: 1; /* how much this item grows relative to siblings */
  flex-shrink: 1; /* how much this item shrinks if space is tight */
  flex-basis: auto; /* initial size before growing/shrinking */

  /* shorthand: flex-grow flex-shrink flex-basis */
  flex: 1; /* = flex: 1 1 0 — common: makes items grow evenly */
  flex: auto; /* = flex: 1 1 auto — grow/shrink based on content size */
  flex-shrink: 0; /* prevent an item from shrinking */

  align-self: flex-end; /* override align-items for a single item */
  order: 2; /* visually reorder without changing the DOM */
}
```

> **In practice:** `flex: 1;` to make items grow evenly, and `flex-shrink: 0;` to stop specific items from shrinking, cover the vast majority of real use cases. `flex-flow` is shorthand for `flex-direction` + `flex-wrap`.

**Further reading:** [An Interactive Guide to Flexbox](https://www.joshwcomeau.com/css/interactive-guide-to-flexbox/) · [CSS-Tricks Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) · [flexbox.malven.co](https://flexbox.malven.co/)

---

## CSS Grid

`display: grid` for two-dimensional layouts (rows _and_ columns at once) — Flexbox is one-dimensional, Grid is two.

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 equal columns */
  grid-template-rows: auto 1fr auto; /* header / content / footer */
  gap: 16px; /* row-gap column-gap, or one value for both */
}

.grid-item {
  grid-column: 1 / 3; /* span from column line 1 to 3 */
  grid-row: 2;
}
```

### Responsive Grid Without Media Queries

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}
```

Columns automatically wrap based on available space — no breakpoints needed.

### Named Areas

```css
.layout {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-areas:
    "sidebar header"
    "sidebar main"
    "sidebar footer";
}
.sidebar {
  grid-area: sidebar;
}
.header {
  grid-area: header;
}
.main {
  grid-area: main;
}
.footer {
  grid-area: footer;
}
```

---

## Responsive Design

### Media Queries

```css
/* Mobile-first: base styles apply to smallest screens, then override upward */
.container {
  padding: 10px;
}

@media (min-width: 768px) {
  .container {
    padding: 20px;
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 40px;
  }
}

/* Max-width (desktop-first) approach */
@media (max-width: 600px) {
  .container {
    flex-direction: column;
    padding: 10px;
  }
}
```

### Container Queries (modern — style based on a container's size, not the viewport)

```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card {
    display: flex;
  }
}
```

> Container queries are ideal for reusable components that need to adapt based on where they're placed, not just overall screen size — supported in all major evergreen browsers.

---

## Pseudo-classes

Select elements based on **state** or **position**, not structure.

| Selector                           | Matches                                                     |
| ---------------------------------- | ----------------------------------------------------------- |
| `:hover`                           | Element under the mouse pointer                             |
| `:focus`                           | Element with keyboard/input focus                           |
| `:focus-visible`                   | Focus shown only for keyboard navigation (not mouse clicks) |
| `:active`                          | Element being activated (e.g. mid-click)                    |
| `:link` / `:visited`               | Unvisited / visited links                                   |
| `:disabled` / `:enabled`           | Form controls based on availability                         |
| `:checked`                         | Checked checkbox/radio                                      |
| `:first-child` / `:last-child`     | First / last sibling                                        |
| `:only-child`                      | The only child of its parent                                |
| `:nth-child(n)`                    | n-th sibling (`:nth-child(2n)` = even, `:nth-child(odd)`)   |
| `:nth-last-child(n)`               | n-th sibling, counting from the end                         |
| `:first-of-type` / `:last-of-type` | First/last sibling of a given tag                           |
| `:nth-of-type(n)`                  | n-th sibling of a given tag                                 |
| `:empty`                           | Element with no children                                    |
| `:not(selector)`                   | Element that does **not** match the selector                |
| `:is(selector-list)`               | Matches any selector in the list (reduces repetition)       |
| `:where(selector-list)`            | Like `:is()` but with **zero specificity**                  |
| `:has(selector)`                   | Element containing a match — the "parent selector"          |
| `:root`                            | The document root (`<html>`)                                |
| `:target`                          | Element matching the URL's fragment (`#id`)                 |

```css
/* :has() example — style a card differently if it contains an image */
.card:has(img) {
  display: grid;
  grid-template-columns: 100px 1fr;
}

/* :is() reduces repetition */
:is(h1, h2, h3) a {
  color: inherit;
}
```

---

## Pseudo-elements

Target a **specific part** of an element, or insert generated content.

| Selector         | Description                                 |
| ---------------- | ------------------------------------------- |
| `::before`       | Inserts content before an element's content |
| `::after`        | Inserts content after an element's content  |
| `::first-letter` | Styles the first letter                     |
| `::first-line`   | Styles the first line                       |
| `::selection`    | Styles user-selected/highlighted text       |
| `::placeholder`  | Styles input placeholder text               |
| `::marker`       | Styles list item markers/bullets            |

```css
.quote::before {
  content: "“";
  color: #999;
}

.tooltip::after {
  content: attr(data-tooltip); /* pull content from a data attribute */
}
```

---

## Transitions & Animations

### Transitions (state A → state B)

```css
.button {
  background: #007bff;
  transition:
    background-color 0.2s ease-in-out,
    transform 0.2s ease;
}
.button:hover {
  background: #0056b3;
  transform: translateY(-2px);
}
```

Timing functions: `linear` | `ease` | `ease-in` | `ease-out` | `ease-in-out` | `cubic-bezier(...)`

### Animations (multi-step, can loop)

```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-in {
  animation: fadeIn 0.5s ease-in forwards;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.bouncing {
  animation: bounce 1s infinite; /* duration | iteration-count */
}
```

> **Performance tip:** Animate `transform` and `opacity` where possible — they can be handled by the GPU compositor without triggering layout/paint, making them far smoother than animating `width`, `top`, or `margin`.

---

## Transforms

```css
transform: translateX(20px);
transform: translate(20px, 10px);
transform: scale(1.2);
transform: rotate(45deg);
transform: skew(10deg, 0deg);

/* Combine multiple transforms */
transform: translateX(20px) rotate(10deg) scale(1.1);

transform-origin: center; /* top left | 50% 50% | etc. */
```

---

## Modern Layout Helpers

```css
/* Aspect ratio without the old padding-hack */
.video-wrapper {
  aspect-ratio: 16 / 9;
}

/* Clamp — fluid sizing between a min and max, based on viewport */
h1 {
  font-size: clamp(1.5rem, 4vw, 3rem);
}

/* Logical properties — adapt automatically to writing direction (LTR/RTL) */
.card {
  margin-inline: auto; /* instead of margin-left/right */
  padding-block: 1rem; /* instead of padding-top/bottom */
}

/* gap works in Flexbox AND Grid */
.flex-or-grid {
  gap: 16px;
}

/* CSS Nesting (native, no preprocessor needed — modern browsers) */
.card {
  padding: 16px;

  & .title {
    font-weight: bold;
  }

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}
```

---

## CSS in React

### 1. CSS Modules

Scopes class names locally to the component, avoiding global collisions.

```jsx
// Button.module.css
.btn {
  width: 90px;
  height: 40px;
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
}
```

```jsx
// Button.jsx
import styles from "./Button.module.css";

export default function Button() {
  return <button className={styles.btn}>Submit</button>;
}
```

Any file named `*.module.css` is treated as a CSS Module — importing it returns an object mapping class names to auto-generated, uniquely-scoped names. Bare element selectors (`ul`, `li`, `a`) inside a module are **not** scoped automatically — wrap them in a component-specific class to avoid leaking styles globally:

```css
.menuContainer {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
.menuContainer li {
  float: left;
}
.menuContainer li a:hover:not(.active) {
  background-color: #2cbe08;
}
```

> Works out of the box with Vite ([docs](https://vite.dev/guide/features#css-modules)) and most modern React tooling.

### 2. styled-components (CSS-in-JS)

```bash
npm install styled-components
```

Uses tagged template literals to attach styles directly to a component:

```jsx
import styled from "styled-components";

const Heading1 = styled.h1`
  font-size: 1.8em;
  text-align: center;
  color: #bf4f74;
`;

function ShoppingCart() {
  return (
    <div>
      <h1>Shopping Cart</h1>
      <Heading1>Hey</Heading1>
    </div>
  );
}

export default ShoppingCart;
```

- Removes the mapping between components and stylesheet class names — `Heading1` **is** a React component with its styles built in.
- Supports props-based dynamic styling: `background: ${props => props.primary ? "blue" : "gray"};`
- Styles are automatically scoped — no naming collisions.

### CSS Modules vs styled-components

|                 | CSS Modules                       | styled-components                               |
| --------------- | --------------------------------- | ----------------------------------------------- |
| Syntax          | Regular `.css` files              | JS template literals                            |
| Scoping         | Automatic via hashed class names  | Automatic via generated component classes       |
| Dynamic styling | Via conditional class names       | Directly via props in the template literal      |
| Runtime cost    | None (plain CSS, build-time only) | Small runtime overhead (styles injected via JS) |
| Learning curve  | Low if you already know CSS       | Requires learning the styled-components API     |

> **Modern alternative worth knowing:** [Tailwind CSS](https://tailwindcss.com/) (utility-first, no custom CSS files) and zero-runtime CSS-in-JS tools like [vanilla-extract](https://vanilla-extract.style/) or [Panda CSS](https://panda-css.com/) are increasingly popular alternatives to both approaches above.

---

## Best Practices

- Use a `box-sizing: border-box` reset — it makes sizing far more predictable.
- Prefer `rem` for font sizes/spacing, `%`/`vw`/`vh`/`fr` for fluid layout.
- Use Flexbox for one-dimensional layouts, Grid for two-dimensional ones — they're complementary, not competing.
- Design **mobile-first**: write base styles for small screens, then use `min-width` media queries to add complexity for larger screens.
- Use CSS custom properties for themeable values (colors, spacing) instead of hardcoding or relying solely on a preprocessor.
- Avoid `!important` — fix specificity issues at the selector level instead.
- Animate `transform`/`opacity` for smooth, GPU-accelerated motion; avoid animating layout-triggering properties like `width`/`top`/`margin`.
- Keep selectors shallow and prefer classes over deep descendant chains (`.card .title` beats `div > div > span`) for both performance and maintainability.
- In React apps, choose **one** styling approach per project (CSS Modules, styled-components, Tailwind, etc.) rather than mixing several.

---
