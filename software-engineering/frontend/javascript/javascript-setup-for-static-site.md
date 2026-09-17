# JavaScript Setup for Static HTML Sites

[Back to JavaScript topic Index](./README.md)

JavaScript can be added to an HTML document in several ways:

1.  **Inline JavaScript** — directly inside an HTML attribute.

2.  **Internal JavaScript** — inside a `<script>` element in the HTML document.

3.  **External JavaScript** — in a separate `.js` file linked from the HTML document.

For most projects, **prefer external JavaScript files**. This keeps HTML focused on structure and JavaScript focused on behavior.

---

## 1\. External JavaScript — Recommended

JavaScript files normally use the `.js` extension.

To load an external JavaScript file, use the `src` attribute of the `<script>` element:

```html
<script src="script.js" defer></script>
```

A common and recommended approach for static sites is to place the script in the `<head>` and use `defer`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>My Website</title>

    <script src="script.js" defer></script>
  </head>

  <body>
    <h1>Hello, World!</h1>
  </body>
</html>
```

### Why use `defer`?

For a classic external script, `defer` provides several useful behaviors:

#### 1\. HTML parsing is not blocked by downloading the script

Without `defer`, a script encountered during HTML parsing can pause parsing while the browser fetches and executes the script.

With `defer`:

```html
<script src="script.js" defer></script>
```

the browser can download the script while continuing to parse the HTML.

#### 2\. The script executes after HTML parsing

Deferred scripts execute after the HTML document has been fully parsed.

This means your JavaScript can safely interact with elements that appear later in the HTML:

```html
<script src="script.js" defer></script>
```

```javascript
const heading = document.querySelector("h1");

heading.textContent = "Hello from JavaScript!";
```

You generally don't need:

```javascript
window.onload = () => {
  // ...
};
```

or:

```javascript
document.addEventListener("DOMContentLoaded", () => {
  // ...
});
```

just to wait for the HTML to be parsed.

#### 3\. Multiple deferred scripts maintain their order

If you have:

```html
<script src="one.js" defer></script>
<script src="two.js" defer></script>
<script src="three.js" defer></script>
```

they execute in the order they appear:

```text
one.js
  ↓
two.js
  ↓
three.js
```

This can be useful when one script depends on another.

---

# 2\. Internal JavaScript

JavaScript can also be written directly inside an HTML document using a `<script>` element.

For example:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Internal JavaScript</title>

    <script>
      function myFunction() {
        document.getElementById("demo").textContent = "Paragraph changed.";
      }
    </script>
  </head>

  <body>
    <p id="demo">Original paragraph.</p>

    <button onclick="myFunction()">Click me</button>
  </body>
</html>
```

The `<script>` element can be placed in the `<head>` or `<body>`.

However, for anything beyond a small example, **external JavaScript is generally preferable**.

### Why prefer external JavaScript?

External files provide:

- Better separation of concerns

- Easier maintenance

- Better code organization

- Reusability across multiple HTML pages

- Browser caching

- Easier debugging

- Cleaner HTML

For example:

```text
project/
├── index.html
├── about.html
├── contact.html
└── js/
    └── script.js
```

Multiple pages can use the same JavaScript:

```html
<script src="js/script.js" defer></script>
```

---

# 3\. JavaScript in the `<head>`

You can place a `<script>` element in the `<head>`.

### Recommended approach

Use an external script with `defer`:

```html
<head>
  <script src="script.js" defer></script>
</head>
```

This allows the browser to download the JavaScript without blocking HTML parsing and execute it after parsing is complete.

### Avoid this for normal page scripts

```html
<head>
  <script src="script.js"></script>
</head>
```

Without `defer` or `async`, a classic external script can block HTML parsing while it is downloaded and executed.

---

# 4\. JavaScript in the `<body>`

You can also place JavaScript inside the `<body>`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>JavaScript in Body</title>
  </head>

  <body>
    <h2>Demo JavaScript in Body</h2>

    <p id="demo">Original paragraph.</p>

    <script>
      function myFunction() {
        document.getElementById("demo").textContent = "Paragraph changed.";
      }
    </script>

    <button onclick="myFunction()">Click me</button>
  </body>
</html>
```

Historically, putting scripts at the end of `<body>` was a common technique because the HTML elements had already been parsed before the script executed.

Today, for most external scripts, this is usually cleaner:

```html
<head>
  <script src="script.js" defer></script>
</head>
```

---

# 5\. `defer` vs `async`

When loading external JavaScript, `defer` and `async` have different behaviors.

## `defer`

```html
<script src="script.js" defer></script>
```

Behavior:

```text
HTML parsing ────────────────────────────────►
             │
             │ download JS
             │
             ▼
             Execute after HTML parsing
```

Characteristics:

- Downloads while HTML is being parsed

- Executes after HTML parsing

- Maintains execution order between deferred scripts

- Good for most application/page JavaScript

---

## `async`

```html
<script src="script.js" async></script>
```

Behavior:

```text
HTML parsing ────────────────────────────────►
             │
             │ download JS
             │
             ▼
          Execute immediately
          when download finishes
```

Characteristics:

- Downloads while HTML is being parsed

- Executes as soon as the script finishes downloading

- Does **not** guarantee execution order between multiple async scripts

- Can interrupt HTML parsing when it executes

- Useful for independent scripts

Examples include:

- Analytics

- Advertising scripts

- Independent third-party widgets

---

## `defer` vs `async` at a glance

| Behavior                                    | `defer`   | `async`   |
| ------------------------------------------- | --------- | --------- |
| Downloads during HTML parsing               | ✅        | ✅        |
| Waits for HTML parsing                      | ✅        | ❌        |
| Maintains script order                      | ✅        | ❌        |
| Good for application code                   | ✅        | Sometimes |
| Good for independent scripts                | Sometimes | ✅        |
| Can interrupt HTML parsing during execution | ❌        | ✅        |

### Simple rule

Use:

```html
<script src="app.js" defer></script>
```

for most of your application's JavaScript.

Use:

```html
<script src="analytics.js" async></script>
```

when a script is independent and doesn't need to execute in a particular order.

---

# 6\. Multiple JavaScript Files

You can load multiple scripts:

```html
<script src="config.js" defer></script>
<script src="app.js" defer></script>
```

Deferred scripts execute in document order:

```text
config.js
    ↓
app.js
```

This can be useful when `app.js` depends on something defined by `config.js`.

However, as applications grow, consider using **ES modules** rather than manually managing dependencies with multiple `<script>` tags.

---

# 7\. ES Modules

Modern JavaScript supports modules using:

```html
<script type="module" src="app.js"></script>
```

Example:

```text
project/
├── index.html
└── js/
    ├── app.js
    ├── api.js
    └── utils.js
```

### `index.html`

```html
<script type="module" src="js/app.js"></script>
```

### `app.js`

```javascript
import { getUser } from "./api.js";
import { formatName } from "./utils.js";

const user = await getUser();

console.log(formatName(user));
```

### `api.js`

```javascript
export async function getUser() {
  const response = await fetch("/api/user");

  return response.json();
}
```

### `utils.js`

```javascript
export function formatName(user) {
  return `${user.firstName} ${user.lastName}`;
}
```

Modules provide a much cleaner way to organize JavaScript as a project grows.

### Important

Module scripts are deferred by default.

Therefore:

```html
<script type="module" src="app.js"></script>
```

already has deferred-style execution behavior.

You normally don't need:

```html
<script type="module" src="app.js" defer></script>
```

---

# 8\. Recommended Static Site Structure

For a small static site:

```text
my-site/
├── index.html
├── about.html
├── contact.html
├── css/
│   └── style.css
├── js/
│   └── app.js
└── images/
    └── ...
```

HTML:

```html
<head>
  <link rel="stylesheet" href="css/style.css" />
  <script src="js/app.js" defer></script>
</head>
```

This gives you a clean separation:

```text
HTML
  ↓
Structure

CSS
  ↓
Presentation

JavaScript
  ↓
Behavior
```

---

# 9\. Avoid Inline Event Handlers

You may see examples like:

```html
<button onclick="myFunction()">Click me</button>
```

This works, but for maintainable applications, prefer attaching event listeners from JavaScript.

HTML:

```html
<button id="myButton">Click me</button>
```

JavaScript:

```javascript
const button = document.querySelector("#myButton");

button.addEventListener("click", () => {
  console.log("Button clicked!");
});
```

This keeps behavior in JavaScript rather than mixing it into your HTML.

---

# 10\. Recommended Pattern

For a modern static site, start with:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>My Website</title>

    <link rel="stylesheet" href="css/style.css" />
    <script src="js/app.js" defer></script>
  </head>

  <body>
    <header>
      <h1>My Website</h1>
    </header>

    <main>
      <p>Hello, World!</p>
    </main>
  </body>
</html>
```

For a modular application:

```html
<script type="module" src="js/app.js"></script>
```

---

# Quick Reference

## External script

```html
<script src="app.js" defer></script>
```

**Default choice for most static sites.**

---

## Module script

```html
<script type="module" src="app.js"></script>
```

**Recommended when using ES modules.**

---

## Async script

```html
<script src="analytics.js" async></script>
```

**Use for independent scripts where execution order doesn't matter.**

---

## Internal script

```html
<script>
  console.log("Hello!");
</script>
```

**Fine for small examples or very small pages; prefer external files for maintainable projects.**

---

## Inline event handler

```html
<button onclick="doSomething()">Click</button>
```

**Works, but generally avoid in production code.**

Prefer:

```html
<button id="button">Click</button>
```

```javascript
document.querySelector("#button").addEventListener("click", doSomething);
```

---

# Recommended Rules

For most static websites:

1.  **Keep JavaScript in external `.js` files.**

2.  **Use `defer` for classic external scripts.**

3.  **Use `type="module"` when using ES modules.**

4.  **Use `async` for independent scripts such as analytics.**

5.  **Avoid inline event handlers such as `onclick`.**

6.  **Keep HTML, CSS, and JavaScript responsibilities separate.**

7.  **Use modules as your JavaScript codebase grows.**

8.  **Don't use `window.onload` or `DOMContentLoaded` simply because your script is in `<head>` when `defer` already solves the parsing-order problem.**

9.  **Load only the JavaScript that a page actually needs.**

10. **For production sites, optimize and minimize JavaScript where appropriate.**

---

# Cheat Sheet

```text
                         JavaScript
                              │
             ┌────────────────┼────────────────┐
             │                │                │
          Classic           Module          Independent
           Script            Script           Script
             │                │                │
             ▼                ▼                ▼
          defer           type="module"      async
             │                │                │
             ▼                ▼                ▼
        Most page        Modern modular     Analytics /
        JavaScript          codebase       third-party
```

### Default choice

```html
<script src="app.js" defer></script>
```

### Modern modular application

```html
<script type="module" src="app.js"></script>
```

### Independent third-party script

```html
<script src="analytics.js" async></script>
```

> **Rule of thumb:** For a static site, put your application's JavaScript in an external file and load it with `defer`. When your codebase uses `import`/`export`, switch to `type="module"`.
