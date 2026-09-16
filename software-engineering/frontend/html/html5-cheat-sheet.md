# HTML5 Cheat Sheet

[Back to the HTML main index](./README.md)

A quick reference for structuring web pages with modern HTML5.

---

## Table of Contents

- [HTML5 Cheat Sheet](#html5-cheat-sheet)
  - [Table of Contents](#table-of-contents)
  - [What is HTML?](#what-is-html)
  - [Basic Document Structure](#basic-document-structure)
  - [Anatomy of an HTML Element](#anatomy-of-an-html-element)
  - [Adding CSS](#adding-css)
    - [1. External Stylesheet (recommended)](#1-external-stylesheet-recommended)
    - [2. Internal (Embedded) CSS](#2-internal-embedded-css)
    - [3. Inline CSS](#3-inline-css)
  - [Adding JavaScript](#adding-javascript)
    - [1. External Script File (recommended)](#1-external-script-file-recommended)
    - [2. Internal (Embedded) Script](#2-internal-embedded-script)
    - [3. Inline JavaScript (event attribute)](#3-inline-javascript-event-attribute)
    - [Script Loading Attributes](#script-loading-attributes)
  - [Common HTML Elements](#common-html-elements)
  - [Text Formatting](#text-formatting)
  - [Layout / Semantic Elements](#layout--semantic-elements)
  - [Forms \& Input Elements](#forms--input-elements)
    - [Common `<input>` Types (HTML5)](#common-input-types-html5)
    - [Useful Form Attributes](#useful-form-attributes)
  - [Tables](#tables)
  - [Media Elements](#media-elements)
  - [Common Attributes](#common-attributes)
  - [Nesting Elements](#nesting-elements)
  - [Comments](#comments)
  - [Full HTML5 Tag Reference](#full-html5-tag-reference)
  - [New HTML5 Tags](#new-html5-tags)
  - [Tags Removed / Not Supported in HTML5](#tags-removed--not-supported-in-html5)
  - [Event Handler Attributes](#event-handler-attributes)
    - [Mouse \& UI Events](#mouse--ui-events)
    - [Keyboard Events](#keyboard-events)
    - [Form Events](#form-events)
    - [Window / Document Events](#window--document-events)
    - [Media Events (audio/video)](#media-events-audiovideo)
    - [Touch Events](#touch-events)
  - [The `<canvas>` Element \& API](#the-canvas-element--api)
    - [Canvas Element](#canvas-element)
    - [2D Context — Rectangles](#2d-context--rectangles)
    - [2D Context — Paths](#2d-context--paths)
    - [2D Context — Colors, Styles \& Shadows](#2d-context--colors-styles--shadows)
    - [2D Context — Line Styles](#2d-context--line-styles)
    - [2D Context — Text](#2d-context--text)
    - [2D Context — Images](#2d-context--images)
    - [2D Context — Pixel Manipulation](#2d-context--pixel-manipulation)
    - [2D Context — Transformation](#2d-context--transformation)
    - [Composite Operations](#composite-operations)
  - [Best Practices](#best-practices)

---

## What is HTML?

HTML (HyperText Markup Language) is the standard language for creating web pages. It uses a system of tags to structure and present content in the browser. HTML5 is the current, modern version, adding semantic elements, native media support, and form enhancements.

---

## Basic Document Structure

Every HTML document follows a standard structure using nested tags:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Page Title</title>
  </head>
  <body>
    <h1>This is a heading</h1>
    <p>This is a paragraph.</p>
  </body>
</html>
```

| Tag                          | Description                                                              |
| ---------------------------- | ------------------------------------------------------------------------ |
| `<!DOCTYPE html>`            | Declares the document type and version (HTML5)                           |
| `<html lang="en">`           | The root element; `lang` improves accessibility & SEO                    |
| `<head>`                     | Contains metadata, links to stylesheets/scripts, and the page title      |
| `<meta charset="utf-8">`     | Sets character encoding                                                  |
| `<meta name="viewport" ...>` | Enables responsive scaling on mobile devices                             |
| `<title>`                    | Sets the title shown in the browser tab                                  |
| `<body>`                     | Contains all visible content — headings, paragraphs, images, links, etc. |

---

## Anatomy of an HTML Element

An HTML element consists of:

- **Opening tag** — marks where the element starts, e.g. `<p>`
- **Content** — the information inside the element
- **Closing tag** — marks where the element ends, e.g. `</p>`

```html
<p>This is a paragraph.</p>
```

Some elements are **self-closing / void elements** (no content, no closing tag), such as:

```html
<br />
<hr />
<img src="photo.jpg" alt="description" />
<input type="text" />
<meta charset="utf-8" />
<link rel="stylesheet" href="styles.css" />
```

---

## Adding CSS

There are three ways to add CSS to an HTML page:

### 1. External Stylesheet (recommended)

Link a separate `.css` file — keeps styling separate from structure, cacheable, reusable across pages.

```html
<head>
  <link rel="stylesheet" href="styles.css" />
</head>
```

### 2. Internal (Embedded) CSS

Place styles inside a `<style>` tag in the `<head>` — useful for page-specific styling.

```html
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
    }
    h1 {
      color: navy;
    }
  </style>
</head>
```

### 3. Inline CSS

Apply styles directly to an element via the `style` attribute — highest specificity, but hardest to maintain. Use sparingly.

```html
<p style="color: red; font-weight: bold;">Warning text</p>
```

> **Best practice:** Prefer external stylesheets for maintainability; use internal/inline only for quick tests or one-off overrides.

---

## Adding JavaScript

There are three ways to add JavaScript to an HTML page:

### 1. External Script File (recommended)

```html
<head>
  <script src="script.js" defer></script>
</head>
```

or placed right before the closing `</body>` tag:

```html
<body>
  ...
  <script src="script.js"></script>
</body>
```

### 2. Internal (Embedded) Script

```html
<body>
  <script>
    console.log("Hello from an internal script!");
  </script>
</body>
```

### 3. Inline JavaScript (event attribute)

```html
<button onclick="alert('Hello!')">Click Me</button>
```

### Script Loading Attributes

| Attribute | Behavior                                                                                             |
| --------- | ---------------------------------------------------------------------------------------------------- |
| _(none)_  | Blocks HTML parsing until script downloads & executes                                                |
| `defer`   | Downloads in background, executes **after** HTML is parsed, preserves order — best for most cases    |
| `async`   | Downloads in background, executes **as soon as ready** (may interrupt parsing), order not guaranteed |

```html
<script src="analytics.js" async></script>
<script src="app.js" defer></script>
```

> **Best practice:** Place external scripts in `<head>` with `defer`, or right before `</body>`. Prefer external files over inline `onclick`-style handlers — use `addEventListener()` in JS instead.

---

## Common HTML Elements

| Element                                   | Description                                         |
| ----------------------------------------- | --------------------------------------------------- |
| `<h1>` – `<h6>`                           | Headings, largest (`<h1>`) to smallest (`<h6>`)     |
| `<p>`                                     | Paragraph                                           |
| `<a href="url">`                          | Link to another page or resource                    |
| `<img src="image.jpg" alt="description">` | Image                                               |
| `<ul>`, `<ol>`, `<li>`                    | Unordered / ordered lists and list items            |
| `<dl>`, `<dt>`, `<dd>`                    | Description list, term, and definition              |
| `<div>`                                   | Generic block-level container for grouping elements |
| `<span>`                                  | Generic inline container for text or other elements |
| `<br>`                                    | Line break                                          |
| `<hr>`                                    | Horizontal rule (thematic break)                    |

```html
<a href="https://example.com" target="_blank" rel="noopener">Visit Example</a>
<img src="cat.jpg" alt="A sleeping cat" width="300" height="200" />

<ul>
  <li>Item one</li>
  <li>Item two</li>
</ul>

<ol>
  <li>Step one</li>
  <li>Step two</li>
</ol>
```

---

## Text Formatting

| Tag                  | Description                              |
| -------------------- | ---------------------------------------- |
| `<strong>`           | Important text (bold, semantic)          |
| `<em>`               | Emphasized text (italic, semantic)       |
| `<b>`                | Bold text (visual only)                  |
| `<i>`                | Italic text (visual only)                |
| `<u>`                | Underlined text                          |
| `<small>`            | Smaller text                             |
| `<mark>`             | Highlighted text                         |
| `<sub>` / `<sup>`    | Subscript / superscript                  |
| `<blockquote>`       | Block quotation                          |
| `<q>`                | Inline quotation                         |
| `<code>`             | Inline code snippet                      |
| `<pre>`              | Preformatted text (preserves whitespace) |
| `<abbr title="...">` | Abbreviation with tooltip                |

```html
<p><strong>Warning:</strong> This is <em>important</em>.</p>
<p>Water is <mark>H<sub>2</sub>O</mark>.</p>
<pre><code>function hello() {
  console.log("Hi!");
}</code></pre>
```

---

## Layout / Semantic Elements

Semantic elements clearly describe their meaning to both browser and developer — improving accessibility and SEO.

| Element                     | Description                                              |
| --------------------------- | -------------------------------------------------------- |
| `<header>`                  | Introductory content or navigation links                 |
| `<nav>`                     | Main navigation for the page                             |
| `<main>`                    | Main content unique to the page (one per page)           |
| `<section>`                 | Thematic grouping of content                             |
| `<article>`                 | Independent, self-contained content (e.g. blog post)     |
| `<aside>`                   | Content related indirectly to the main content (sidebar) |
| `<footer>`                  | Footer for a page or section                             |
| `<figure>` / `<figcaption>` | Self-contained media with a caption                      |
| `<details>` / `<summary>`   | Native collapsible/expandable widget                     |
| `<dialog>`                  | Native modal/dialog box                                  |

```html
<body>
  <header>
    <h1>Website Title</h1>
    <nav>
      <a href="#home">Home</a>
      <a href="#about">About</a>
    </nav>
  </header>

  <main>
    <section>
      <h2>Section Heading</h2>
      <p>Section content goes here.</p>
    </section>

    <article>
      <h2>Blog Post Title</h2>
      <p>Article content...</p>
    </article>

    <aside>
      <p>Related links or ads.</p>
    </aside>
  </main>

  <footer>
    <p>&copy; 2026 My Website</p>
  </footer>
</body>
```

---

## Forms & Input Elements

```html
<form action="/submit" method="post">
  <label for="name">Name:</label>
  <input type="text" id="name" name="name" placeholder="Your name" required />

  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required />

  <label for="age">Age:</label>
  <input type="number" id="age" name="age" min="0" max="120" />

  <label for="password">Password:</label>
  <input type="password" id="password" name="password" />

  <label for="bio">Bio:</label>
  <textarea id="bio" name="bio" rows="4"></textarea>

  <label for="country">Country:</label>
  <select id="country" name="country">
    <option value="us">United States</option>
    <option value="ca">Canada</option>
  </select>

  <label><input type="checkbox" name="subscribe" /> Subscribe</label>
  <label><input type="radio" name="plan" value="free" /> Free</label>
  <label><input type="radio" name="plan" value="pro" /> Pro</label>

  <input type="submit" value="Submit" />
  <button type="button">Cancel</button>
</form>
```

### Common `<input>` Types (HTML5)

| Type       | Description                 |
| ---------- | --------------------------- |
| `text`     | Single-line text            |
| `email`    | Validates email format      |
| `password` | Masked input                |
| `number`   | Numeric input with steppers |
| `date`     | Date picker                 |
| `time`     | Time picker                 |
| `color`    | Color picker                |
| `range`    | Slider control              |
| `checkbox` | Toggleable checkbox         |
| `radio`    | Single-choice option group  |
| `file`     | File upload                 |
| `search`   | Search field                |
| `tel`      | Telephone number            |
| `url`      | URL, validated              |
| `hidden`   | Hidden field                |

### Useful Form Attributes

| Attribute              | Description                        |
| ---------------------- | ---------------------------------- |
| `required`             | Field must be filled before submit |
| `placeholder`          | Hint text shown when empty         |
| `disabled`             | Disables the field                 |
| `readonly`             | Field is visible but not editable  |
| `autofocus`            | Automatically focuses on page load |
| `min` / `max` / `step` | Constrain numeric/date values      |
| `pattern`              | Regex validation pattern           |

---

## Tables

```html
<table>
  <caption>
    Monthly Sales
  </caption>
  <thead>
    <tr>
      <th>Month</th>
      <th>Revenue</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>January</td>
      <td>$1,000</td>
    </tr>
    <tr>
      <td>February</td>
      <td>$1,500</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td>Total</td>
      <td>$2,500</td>
    </tr>
  </tfoot>
</table>
```

| Tag                             | Description                     |
| ------------------------------- | ------------------------------- |
| `<table>`                       | Table container                 |
| `<caption>`                     | Table title/caption             |
| `<thead>`, `<tbody>`, `<tfoot>` | Header, body, footer row groups |
| `<tr>`                          | Table row                       |
| `<th>`                          | Header cell                     |
| `<td>`                          | Data cell                       |
| `colspan` / `rowspan`           | Merge cells across columns/rows |

---

## Media Elements

```html
<!-- Image -->
<img src="photo.jpg" alt="Description" loading="lazy" />

<!-- Audio -->
<audio controls>
  <source src="song.mp3" type="audio/mpeg" />
  Your browser does not support the audio element.
</audio>

<!-- Video -->
<video controls width="640" poster="thumbnail.jpg">
  <source src="movie.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

<!-- Embedded iframe -->
<iframe src="https://example.com" title="Embedded page"></iframe>

<!-- Responsive/vector image -->
<svg width="100" height="100">
  <circle cx="50" cy="50" r="40" fill="blue" />
</svg>
```

---

## Common Attributes

| Attribute  | Description                                            |
| ---------- | ------------------------------------------------------ |
| `id`       | Unique identifier for an element                       |
| `class`    | One or more class names for CSS/JS targeting           |
| `style`    | Inline CSS                                             |
| `title`    | Tooltip text on hover                                  |
| `alt`      | Alternative text for images (accessibility)            |
| `href`     | Link destination (for `<a>`, `<link>`)                 |
| `src`      | Source path (for `<img>`, `<script>`, `<video>`, etc.) |
| `target`   | Where to open a link (`_blank`, `_self`, etc.)         |
| `data-*`   | Custom data attributes, e.g. `data-user-id="42"`       |
| `disabled` | Disables an interactive element                        |
| `hidden`   | Hides an element                                       |
| `tabindex` | Controls keyboard tab order                            |
| `aria-*`   | Accessibility attributes, e.g. `aria-label`            |

```html
<div id="profile" class="card highlight" data-user-id="42">
  <p>User profile</p>
</div>
```

---

## Nesting Elements

HTML elements can be nested inside each other to create complex structures:

```html
<body>
  <header>
    <h1>Website Title</h1>
  </header>
  <main>
    <section>
      <h2>Section Heading</h2>
      <p>Section content goes here.</p>
    </section>
  </main>
  <footer>
    <p>Copyright &copy; 2026</p>
  </footer>
</body>
```

> **Rule of thumb:** Block-level elements (`<div>`, `<section>`, `<p>`) can contain other elements; inline elements (`<span>`, `<a>`, `<strong>`) should generally only contain text or other inline elements.

---

## Comments

```html
<!-- This is an HTML comment and won't render in the browser -->
```

---

## Full HTML5 Tag Reference

★ = new in HTML5 &nbsp;&nbsp; ✽ = not supported in HTML5 (legacy/deprecated)

| Tag                   | Description                                                 | Key Attributes                                                                                                                                             |
| --------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<!--...-->`          | Defines a comment                                           | —                                                                                                                                                          |
| `<!DOCTYPE html>`     | Defines the document type                                   | —                                                                                                                                                          |
| `<a>`                 | Defines a hyperlink                                         | `href`, `hreflang`, `media`, `ping`, `rel`, `target`, `type`                                                                                               |
| `<abbr>`              | Defines an abbreviation                                     | —                                                                                                                                                          |
| ✽ `<acronym>`         | Used to define an embedded acronym                          | —                                                                                                                                                          |
| `<address>`           | Defines an address element                                  | —                                                                                                                                                          |
| ✽ `<applet>`          | Used to define an embedded applet                           | —                                                                                                                                                          |
| `<area>`              | Defines an area inside an image map                         | `alt`, `coords`, `href`, `hreflang`, `media`, `ping`, `rel`, `shape`, `target`, `type`                                                                     |
| ★ `<article>`         | Defines an article                                          | `cite`, `pubdate`                                                                                                                                          |
| ★ `<aside>`           | Content tangentially related to the surrounding content     | —                                                                                                                                                          |
| ★ `<audio>`           | Defines sound content                                       | `autoplay`, `controls`, `loop`, `muted`, `preload`, `src`                                                                                                  |
| `<b>`                 | Defines bold text                                           | —                                                                                                                                                          |
| `<base>`              | Defines a base URL for all links on a page                  | `href`, `target`                                                                                                                                           |
| ✽ `<basefont>`        | Used to define a default font color/size/family             | —                                                                                                                                                          |
| ★ `<bdi>`             | Isolates text for bidirectional formatting                  | —                                                                                                                                                          |
| `<bdo>`               | Defines the direction of text display                       | `dir`                                                                                                                                                      |
| ✽ `<big>`             | Used to make text bigger                                    | —                                                                                                                                                          |
| `<blockquote>`        | Defines a long quotation                                    | `cite`                                                                                                                                                     |
| `<body>`              | Defines the document body                                   | —                                                                                                                                                          |
| `<br>`                | Inserts a single line break                                 | —                                                                                                                                                          |
| `<button>`            | Defines a push button                                       | `autofocus`, `disabled`, `form`, `formaction`, `formmethod`, `name`, `type`, `value`                                                                       |
| ★ `<canvas>`          | Defines an area for drawing graphics via JS                 | `height`, `width`                                                                                                                                          |
| `<caption>`           | Defines a table caption                                     | —                                                                                                                                                          |
| ✽ `<center>`          | Used to center align text/content                           | —                                                                                                                                                          |
| `<cite>`              | Defines a citation                                          | —                                                                                                                                                          |
| `<code>`              | Defines computer code text                                  | —                                                                                                                                                          |
| `<col>`               | Defines attributes for table columns                        | `span`                                                                                                                                                     |
| `<colgroup>`          | Defines groups of table columns                             | `span`                                                                                                                                                     |
| ★ `<command>`         | Defines a command button                                    | `checked`, `disabled`, `icon`, `label`, `radiogroup`, `type`                                                                                               |
| ★ `<datalist>`        | Defines a dropdown list of options                          | —                                                                                                                                                          |
| `<dd>`                | Defines a definition description                            | —                                                                                                                                                          |
| `<del>`               | Defines deleted text                                        | `cite`, `datetime`                                                                                                                                         |
| ★ `<details>`         | Defines additional details the user can view/hide           | `open`                                                                                                                                                     |
| ★ `<dialog>`          | Defines a dialog box or window                              | `open`                                                                                                                                                     |
| `<dfn>`               | Defines a definition term                                   | —                                                                                                                                                          |
| ✽ `<dir>`             | Used to define a directory list                             | —                                                                                                                                                          |
| `<div>`               | Defines a section/division in a document                    | —                                                                                                                                                          |
| `<dl>`                | Defines a description/definition list                       | —                                                                                                                                                          |
| `<dt>`                | Defines a term in a definition list                         | —                                                                                                                                                          |
| `<em>`                | Defines emphasized text                                     | —                                                                                                                                                          |
| ★ `<embed>`           | Defines a container for external content/plugin             | `height`, `src`, `type`, `width`                                                                                                                           |
| `<fieldset>`          | Groups related form elements                                | `disabled`, `form`, `name`                                                                                                                                 |
| ★ `<figcaption>`      | Defines a caption for a `<figure>`                          | —                                                                                                                                                          |
| ★ `<figure>`          | Groups media content with a caption                         | —                                                                                                                                                          |
| ★ `<footer>`          | Defines a footer for a section or page                      | —                                                                                                                                                          |
| `<form>`              | Defines an HTML form                                        | `action`, `autocomplete`, `enctype`, `method`, `name`, `novalidate`, `target`                                                                              |
| ✽ `<frame>`           | Defines a window/frame within a frameset                    | —                                                                                                                                                          |
| ✽ `<frameset>`        | Defines a set of frames                                     | —                                                                                                                                                          |
| `<h1>`–`<h6>`         | Defines headings 1 through 6                                | —                                                                                                                                                          |
| `<head>`              | Contains metadata about the document                        | —                                                                                                                                                          |
| ★ `<header>`          | Defines a header for a section or page                      | —                                                                                                                                                          |
| ★ `<hgroup>`          | Groups a set of heading elements                            | —                                                                                                                                                          |
| `<hr>`                | Defines a horizontal rule/thematic break                    | —                                                                                                                                                          |
| `<html>`              | Defines the root of an HTML document                        | `lang`, `manifest`, `xmlns`                                                                                                                                |
| `<i>`                 | Defines italic text                                         | —                                                                                                                                                          |
| `<iframe>`            | Defines an inline frame/sub-window                          | `height`, `name`, `sandbox`, `src`, `width`                                                                                                                |
| `<img>`               | Defines an image                                            | `alt`, `src`, `height`, `ismap`, `loading`, `usemap`, `width`                                                                                              |
| `<input>`             | Defines an input control                                    | `accept`, `autofocus`, `checked`, `disabled`, `max`, `maxlength`, `min`, `name`, `pattern`, `placeholder`, `readonly`, `required`, `step`, `type`, `value` |
| `<ins>`               | Defines inserted text                                       | `cite`, `datetime`                                                                                                                                         |
| `<kbd>`               | Defines keyboard input text                                 | —                                                                                                                                                          |
| ★ `<keygen>`          | _(Deprecated)_ Defines a key-pair generator field           | `autofocus`, `challenge`, `disabled`, `form`, `keytype`, `name`                                                                                            |
| `<label>`             | Defines a label for an `<input>`                            | `for`, `form`                                                                                                                                              |
| `<legend>`            | Defines a caption for a `<fieldset>`                        | —                                                                                                                                                          |
| `<li>`                | Defines a list item                                         | `value`                                                                                                                                                    |
| `<link>`              | Defines a resource link (e.g. stylesheets)                  | `href`, `hreflang`, `media`, `rel`, `sizes`, `type`                                                                                                        |
| ★ `<main>`            | Specifies the main content area of a document               | —                                                                                                                                                          |
| `<map>`               | Defines a client-side image map                             | `name`                                                                                                                                                     |
| ★ `<mark>`            | Defines marked/highlighted text                             | —                                                                                                                                                          |
| `<menu>`              | Defines a list/menu of commands                             | `label`, `type`                                                                                                                                            |
| `<meta>`              | Defines metadata about the document                         | `charset`, `content`, `http-equiv`, `name`                                                                                                                 |
| ★ `<meter>`           | Defines a scalar measurement within a range                 | `high`, `low`, `max`, `min`, `optimum`, `value`                                                                                                            |
| ★ `<nav>`             | Defines navigation links                                    | —                                                                                                                                                          |
| ✽ `<noframes>`        | Alternate content for browsers without frame support        | —                                                                                                                                                          |
| `<noscript>`          | Alternate content when scripts are disabled                 | —                                                                                                                                                          |
| `<object>`            | Defines an embedded object                                  | `data`, `form`, `height`, `name`, `type`, `usemap`, `width`                                                                                                |
| `<ol>`                | Defines an ordered list                                     | `reversed`, `start`, `type`                                                                                                                                |
| `<optgroup>`          | Groups related options in a `<select>`                      | `label`, `disabled`                                                                                                                                        |
| `<option>`            | Defines an option in a dropdown list                        | `disabled`, `label`, `selected`, `value`                                                                                                                   |
| ★ `<output>`          | Represents the result of a calculation                      | `for`, `form`, `name`                                                                                                                                      |
| `<p>`                 | Defines a paragraph                                         | —                                                                                                                                                          |
| `<param>`             | Defines a parameter for an `<object>`                       | `name`, `value`                                                                                                                                            |
| `<pre>`               | Defines preformatted text                                   | —                                                                                                                                                          |
| ★ `<progress>`        | Represents the progress of a task                           | `max`, `value`                                                                                                                                             |
| `<q>`                 | Defines a short inline quotation                            | `cite`                                                                                                                                                     |
| ★ `<rp>`              | Fallback text for browsers without ruby support             | —                                                                                                                                                          |
| ★ `<rt>`              | Defines explanation/pronunciation for ruby annotation       | —                                                                                                                                                          |
| ★ `<ruby>`            | Defines a ruby annotation (East Asian typography)           | —                                                                                                                                                          |
| ✽ `<s>` / `<strike>`  | Defines strikethrough text                                  | —                                                                                                                                                          |
| `<samp>`              | Defines sample computer output                              | —                                                                                                                                                          |
| `<script>`            | Defines a client-side script                                | `async`, `defer`, `src`, `type`                                                                                                                            |
| ★ `<section>`         | Defines a generic section of a document                     | `cite`                                                                                                                                                     |
| `<select>`            | Defines a dropdown selection list                           | `autofocus`, `disabled`, `form`, `multiple`, `name`, `size`                                                                                                |
| `<small>`             | Defines smaller text                                        | —                                                                                                                                                          |
| ★ `<source>`          | Defines media resources for `<video>`/`<audio>`/`<picture>` | `media`, `src`, `type`                                                                                                                                     |
| `<span>`              | Generic inline container                                    | —                                                                                                                                                          |
| `<strong>`            | Defines strong/important text                               | —                                                                                                                                                          |
| `<style>`             | Defines embedded CSS styles                                 | `media`, `type`                                                                                                                                            |
| `<sub>` / `<sup>`     | Defines subscript / superscript text                        | —                                                                                                                                                          |
| ★ `<summary>`         | Defines a visible heading for `<details>`                   | —                                                                                                                                                          |
| `<table>`             | Defines a table                                             | `summary`                                                                                                                                                  |
| `<tbody>`             | Groups the body content of a table                          | —                                                                                                                                                          |
| `<td>`                | Defines a table cell                                        | `colspan`, `headers`, `rowspan`                                                                                                                            |
| ★ `<template>`        | Holds client-side content not rendered on load              | —                                                                                                                                                          |
| `<textarea>`          | Defines a multi-line text input                             | `autofocus`, `cols`, `maxlength`, `name`, `placeholder`, `readonly`, `required`, `rows`, `wrap`                                                            |
| `<tfoot>` / `<thead>` | Groups footer / header content of a table                   | —                                                                                                                                                          |
| `<th>`                | Defines a table header cell                                 | `colspan`, `headers`, `rowspan`, `scope`                                                                                                                   |
| ★ `<time>`            | Defines a date/time                                         | `datetime`                                                                                                                                                 |
| `<title>`             | Defines the document title                                  | —                                                                                                                                                          |
| `<tr>`                | Defines a table row                                         | —                                                                                                                                                          |
| ★ `<track>`           | Defines text tracks for `<video>`/`<audio>`                 | `default`, `kind`, `label`, `src`, `srclang`                                                                                                               |
| ✽ `<tt>`              | Defines teletype text                                       | —                                                                                                                                                          |
| ✽ `<u>`               | Defines underlined text                                     | —                                                                                                                                                          |
| `<ul>`                | Defines an unordered list                                   | —                                                                                                                                                          |
| `<var>`               | Defines a variable                                          | —                                                                                                                                                          |
| ★ `<video>`           | Defines video content                                       | `autoplay`, `controls`, `height`, `loop`, `poster`, `src`, `width`                                                                                         |
| ★ `<wbr>`             | Defines a possible (optional) line break                    | —                                                                                                                                                          |

---

## New HTML5 Tags

Elements introduced in HTML5 that didn't exist in HTML4:

```
article    aside      audio      bdi        canvas     command
datalist   details    dialog     embed      figcaption figure
footer     header     hgroup     keygen     main       mark
menuitem   meter      nav        output     progress   rp
rt         rtc        ruby       section    source     summary
template   time       track      video      wbr
```

## Tags Removed / Not Supported in HTML5

Legacy tags deprecated in favor of CSS or modern equivalents — avoid using these:

| Old Tag                                             | Replaced By                                                                                                                            |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `<acronym>`                                         | `<abbr>`                                                                                                                               |
| `<applet>`                                          | `<object>` / `<embed>`                                                                                                                 |
| `<basefont>`, `<font>`, `<center>`, `<big>`, `<tt>` | CSS (`font-family`, `font-size`, `text-align`, etc.)                                                                                   |
| `<dir>`                                             | `<ul>`                                                                                                                                 |
| `<frame>`, `<frameset>`, `<noframes>`               | `<iframe>` or modern layout techniques                                                                                                 |
| `<isindex>`                                         | `<input>`                                                                                                                              |
| `<strike>`, `<s>`\*                                 | CSS `text-decoration: line-through` (note: `<s>` is still valid in HTML5 for a different semantic meaning — non-accuracy, not styling) |
| `<u>`                                               | CSS `text-decoration: underline` (note: `<u>` is still valid in HTML5 for non-textual annotation)                                      |
| `<xmp>`                                             | `<pre><code>`                                                                                                                          |

---

## Event Handler Attributes

HTML lets events trigger JavaScript actions directly via attributes (though `addEventListener()` in JS is generally preferred for separation of concerns).

### Mouse & UI Events

| Attribute                                  | Fires When                                  |
| ------------------------------------------ | ------------------------------------------- |
| `onclick`                                  | Element is clicked                          |
| `ondblclick`                               | Element is double-clicked                   |
| `onmousedown` / `onmouseup`                | Mouse button pressed / released             |
| `onmousemove`                              | Mouse moves over the element                |
| `onmouseover` / `onmouseout`               | Mouse enters / exits the element            |
| `onmouseenter` / `onmouseleave`            | Mouse enters / leaves (no bubbling)         |
| `onmousewheel` / `onwheel`                 | Mouse wheel is rotated                      |
| `oncontextmenu`                            | Right-click context menu triggered          |
| `ondrag`, `ondragstart`, `ondragend`       | Element drag lifecycle                      |
| `ondragenter`, `ondragover`, `ondragleave` | Drag enters/over/leaves a valid drop target |
| `ondrop`                                   | Dragged element is dropped                  |

### Keyboard Events

| Attribute    | Fires When                                       |
| ------------ | ------------------------------------------------ |
| `onkeydown`  | A key is pressed down                            |
| `onkeypress` | A key is pressed (deprecated — prefer `keydown`) |
| `onkeyup`    | A key is released                                |

### Form Events

| Attribute            | Fires When                                     |
| -------------------- | ---------------------------------------------- |
| `onchange`           | An element's value changes and loses focus     |
| `oninput`            | An element's value changes (fires immediately) |
| `onfocus` / `onblur` | Element gains / loses focus                    |
| `onsubmit`           | A form is submitted                            |
| `onreset`            | A form is reset                                |
| `oninvalid`          | An input fails validation                      |
| `onselect`           | Text is selected                               |
| `onsearch`           | User submits a search field                    |

### Window / Document Events

| Attribute                     | Fires When                                          |
| ----------------------------- | --------------------------------------------------- |
| `onload`                      | Page or resource finishes loading                   |
| `onunload` / `onbeforeunload` | Page is about to be unloaded                        |
| `onresize`                    | Browser window is resized                           |
| `onscroll`                    | Element's scrollbar is scrolled                     |
| `onhashchange`                | The URL fragment identifier changes                 |
| `onstorage`                   | Web Storage area is updated                         |
| `onorientationchange`         | Device orientation changes                          |
| `onmessage`                   | Element receives a message (e.g. via `postMessage`) |

### Media Events (audio/video)

| Attribute                           | Fires When                                            |
| ----------------------------------- | ----------------------------------------------------- |
| `onplay` / `onpause`                | Media starts / pauses playback                        |
| `onplaying`                         | Media has started playing after being paused/buffered |
| `onended`                           | Media playback has reached the end                    |
| `oncanplay` / `oncanplaythrough`    | Media can (fully) start playing                       |
| `onloadstart`                       | Browser starts loading media data                     |
| `onloadeddata` / `onloadedmetadata` | Media data / metadata has loaded                      |
| `onprogress`                        | Browser is fetching media data                        |
| `ontimeupdate`                      | Playback position has changed                         |
| `onvolumechange`                    | Volume (or mute state) has changed                    |
| `onratechange`                      | Playback rate has changed                             |
| `ondurationchange`                  | Length of the media has changed                       |
| `onseeking` / `onseeked`            | Seeking is in progress / has completed                |
| `onstalled`                         | Browser is unable to fetch media data                 |
| `onsuspend`                         | Browser has stopped fetching media data               |
| `onwaiting`                         | Media has paused, waiting for more data               |
| `onemptied`                         | Media resource becomes empty                          |

### Touch Events

| Attribute                                           | Fires When                             |
| --------------------------------------------------- | -------------------------------------- |
| `ontouchstart`                                      | Touch point placed on the surface      |
| `ontouchmove`                                       | Touch point moves                      |
| `ontouchend`                                        | Touch point is removed                 |
| `ontouchcancel`                                     | Touch is interrupted                   |
| `ongesturestart`, `ongesturechange`, `ongestureend` | Multi-touch gesture lifecycle (Safari) |

```html
<button onclick="alert('Clicked!')">Click me</button>
<video onplay="console.log('playing')" controls src="movie.mp4"></video>
```

> **Best practice:** Use inline event attributes sparingly; prefer `element.addEventListener('click', handler)` in your JS files for cleaner separation of structure and behavior.

---

## The `<canvas>` Element & API

`<canvas>` is a container for drawing 2D graphics on the fly via JavaScript — it does nothing on its own until you script it.

```html
<canvas id="myCanvas" width="400" height="200"></canvas>
<script>
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "blue";
  ctx.fillRect(10, 10, 150, 100);
</script>
```

### Canvas Element

| Attribute | Type          | Default |
| --------- | ------------- | ------- |
| `width`   | unsigned long | 300     |
| `height`  | unsigned long | 150     |

| Method                  | Returns | Description                                        |
| ----------------------- | ------- | -------------------------------------------------- |
| `getContext(contextId)` | Object  | Gets the drawing context, e.g. `"2d"` or `"webgl"` |
| `toDataURL([type])`     | String  | Exports canvas content as a data URL image         |

### 2D Context — Rectangles

```js
ctx.fillRect(x, y, w, h); // draw a filled rectangle
ctx.strokeRect(x, y, w, h); // draw a rectangle outline
ctx.clearRect(x, y, w, h); // clear a rectangular area
```

### 2D Context — Paths

```js
ctx.beginPath();
ctx.moveTo(x, y);
ctx.lineTo(x, y);
ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
ctx.arcTo(x1, y1, x2, y2, radius);
ctx.quadraticCurveTo(cpx, cpy, x, y);
ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
ctx.closePath();
ctx.fill();
ctx.stroke();
ctx.clip();
ctx.isPointInPath(x, y);
```

### 2D Context — Colors, Styles & Shadows

| Attribute                         | Type                   | Default           |
| --------------------------------- | ---------------------- | ----------------- |
| `strokeStyle`                     | color/gradient/pattern | black             |
| `fillStyle`                       | color/gradient/pattern | black             |
| `shadowOffsetX` / `shadowOffsetY` | float                  | 0.0               |
| `shadowBlur`                      | float                  | 0.0               |
| `shadowColor`                     | string                 | transparent black |

```js
const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
gradient.addColorStop(offset, color);
ctx.fillStyle = gradient;

const pattern = ctx.createPattern(image, "repeat"); // repeat, repeat-x, repeat-y, no-repeat
```

### 2D Context — Line Styles

| Attribute    | Values                    | Default |
| ------------ | ------------------------- | ------- |
| `lineWidth`  | float                     | 1       |
| `lineCap`    | `butt`, `round`, `square` | butt    |
| `lineJoin`   | `round`, `bevel`, `miter` | miter   |
| `miterLimit` | float                     | 10      |

### 2D Context — Text

| Attribute      | Values                                                            | Default         |
| -------------- | ----------------------------------------------------------------- | --------------- |
| `font`         | CSS font string                                                   | 10px sans-serif |
| `textAlign`    | `start`, `end`, `left`, `right`, `center`                         | start           |
| `textBaseline` | `top`, `hanging`, `middle`, `alphabetic`, `ideographic`, `bottom` | alphabetic      |

```js
ctx.fillText("Hello", x, y [, maxWidth]);
ctx.strokeText("Hello", x, y [, maxWidth]);
ctx.measureText("Hello").width;
```

### 2D Context — Images

```js
ctx.drawImage(image, dx, dy [, dw, dh]);
ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh); // crop + draw
```

`image` can be an `HTMLImageElement`, `HTMLCanvasElement`, or `HTMLVideoElement`.

### 2D Context — Pixel Manipulation

```js
const imgData = ctx.createImageData(sw, sh);
const imgData2 = ctx.getImageData(sx, sy, sw, sh);
ctx.putImageData(imgData, dx, dy);
```

`ImageData` interface: `width`, `height` (readonly), `data` (readonly `Uint8ClampedArray` of RGBA pixel values).

### 2D Context — Transformation

```js
ctx.save();
ctx.restore();
ctx.scale(x, y);
ctx.rotate(angle);
ctx.translate(x, y);
ctx.transform(m11, m12, m21, m22, dx, dy);
ctx.setTransform(m11, m12, m21, m22, dx, dy);
```

### Composite Operations

`globalAlpha` (float, default `1`) and `globalCompositeOperation` (string, default `"source-over"`) control how new drawing blends with existing canvas content. Common values: `source-over`, `source-in`, `source-out`, `source-atop`, `destination-over`, `destination-in`, `destination-out`, `destination-atop`, `lighter`, `copy`, `xor`, `multiply`, `screen`, `darken`, `lighten`.

---

## Best Practices

- Always include `<!DOCTYPE html>` and a `lang` attribute on `<html>`.
- Use semantic elements (`<header>`, `<main>`, `<article>`, etc.) instead of generic `<div>`s where meaning matters.
- Always provide `alt` text for images.
- Use external CSS/JS files for maintainability; load scripts with `defer`.
- Use `<label>` with a matching `for`/`id` on every form input for accessibility.
- Validate your HTML with the [W3C Validator](https://validator.w3.org/).
- Keep markup and styling/behavior separated (structure in HTML, style in CSS, behavior in JS).

---
