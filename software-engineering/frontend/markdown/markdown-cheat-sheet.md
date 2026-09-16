# Markdown Cheat Sheet

[Back to the Markdown main index](./README.md)

**Markdown** is a lightweight markup language for formatting plain text. It's widely used for documentation, README files, blogs, wikis, and comments in developer tools like GitHub, GitLab, and Slack. It's valued for being easy to write *and* easy to read, even in its raw, unrendered form.

---

## Table of Contents
- [Markdown Cheat Sheet](#markdown-cheat-sheet)
  - [Table of Contents](#table-of-contents)
  - [Headings](#headings)
  - [Text Formatting](#text-formatting)
  - [Blockquotes](#blockquotes)
  - [Lists](#lists)
    - [Unordered List](#unordered-list)
    - [Ordered List](#ordered-list)
  - [Code](#code)
    - [Inline Code](#inline-code)
    - [Code Block (fenced, with syntax highlighting)](#code-block-fenced-with-syntax-highlighting)
    - [Code Block (indented — legacy style)](#code-block-indented--legacy-style)
  - [Links](#links)
  - [Images](#images)
  - [Tables](#tables)
  - [Horizontal Rule](#horizontal-rule)
  - [Task Lists](#task-lists)
  - [Footnotes](#footnotes)
  - [Escaping Characters](#escaping-characters)
  - [Line Breaks](#line-breaks)
  - [HTML in Markdown](#html-in-markdown)
  - [Emoji (GitHub-flavored)](#emoji-github-flavored)
  - [Full Example](#full-example)
  - [Notes on Markdown Flavors](#notes-on-markdown-flavors)

---

## Headings

Use `#` through `######` for heading levels 1–6 (a space after the `#` is required).

| Syntax | Renders As |
|---|---|
| `# Heading 1` | Largest heading |
| `## Heading 2` | |
| `### Heading 3` | |
| `#### Heading 4` | |
| `##### Heading 5` | |
| `###### Heading 6` | Smallest heading |

Alternative underline syntax (only supports H1/H2):
```markdown
Heading 1
=========

Heading 2
---------
```

---

## Text Formatting

| Feature | Syntax | Output |
|---|---|---|
| Bold | `**bold text**` or `__bold text__` | **bold text** |
| Italic | `*italic text*` or `_italic text_` | *italic text* |
| Bold & Italic | `***bold and italic***` | ***bold and italic*** |
| Strikethrough | `~~strikethrough~~` | ~~strikethrough~~ |
| Highlight† | `==highlighted==` | ==highlighted== |
| Subscript† | `H~2~O` | H₂O |
| Superscript† | `x^2^` | x² |

† Not part of core Markdown — supported by some flavors (e.g. GitHub for highlight in certain contexts, or via extensions).

---

## Blockquotes

```markdown
> This is a quote.
>
> It can span multiple lines.

> Blockquotes can be nested:
>> Like this.
```

Renders as:
> This is a quote.
>
> It can span multiple lines.

---

## Lists

### Unordered List
```markdown
- First item
- Second item
  - Nested item
  - Another nested item
- Third item
```
(`*` and `+` also work as bullet markers.)

### Ordered List
```markdown
1. First item
2. Second item
   1. Nested item
3. Third item
```
> Markdown auto-numbers ordered lists based on rendering, not the literal numbers you type — `1.` repeated for every item still renders as 1, 2, 3...

---

## Code

### Inline Code
```markdown
Use the `git status` command.
```
Renders as: Use the `git status` command.

### Code Block (fenced, with syntax highlighting)
````markdown
```javascript
function greet(name) {
  return `Hello, ${name}!`;
}
```
````

### Code Block (indented — legacy style)
```markdown
    function greet(name) {
      return "Hello, " + name;
    }
```
(Indent every line with 4 spaces or a tab. Fenced code blocks with a language tag are preferred — they support syntax highlighting.)

---

## Links

| Type | Syntax |
|---|---|
| Basic link | `[title](https://example.com)` |
| Link with tooltip | `[title](https://example.com "Tooltip text")` |
| Reference-style link | `[title][ref]` then elsewhere: `[ref]: https://example.com` |
| Automatic link | `<https://example.com>` |
| Link to a heading in the same doc | `[Jump to Lists](#lists)` |
| Email link | `<name@example.com>` |

```markdown
See more at [My Website](https://example.com).
```

---

## Images

```markdown
![Alt text](https://example.com/image.jpg)
![Alt text](https://example.com/image.jpg "Optional tooltip")
```

Turn an image into a clickable link by wrapping it in a link:
```markdown
[![Alt text](image.jpg)](https://example.com)
```

---

## Tables

```markdown
| Column A | Column B | Column C |
| :------- | :------: | -------: |
| left     | center   | right    |
| row 2    | data     | data     |
```

- `:---` = left-align, `:---:` = center-align, `---:` = right-align, `---` = default.
- Outer pipes (`|`) at the start/end of a row are optional but improve readability.

Renders as:

| Column A | Column B | Column C |
| :------- | :------: | -------: |
| left     | center   | right    |
| row 2    | data     | data     |

---

## Horizontal Rule

Any of these on their own line produce a horizontal rule:
```markdown
---
***
___
```

---

## Task Lists

GitHub-flavored Markdown (GFM) supports interactive checkboxes:

```markdown
- [x] Completed task
- [ ] Incomplete task
- [ ] Another to-do
```

Renders as:
- [x] Completed task
- [ ] Incomplete task
- [ ] Another to-do

---

## Footnotes

Supported in GFM and many static-site generators:

```markdown
Here's a statement with a footnote.[^1]

[^1]: This is the footnote content.
```

---

## Escaping Characters

Prefix a special character with `\` to render it literally instead of as formatting:

```markdown
\*not italic\*
\# not a heading
\[not a link\](example.com)
```

Common characters that may need escaping: `\` `` ` `` `*` `_` `{ }` `[ ]` `( )` `#` `+` `-` `.` `!` `|`

---

## Line Breaks

- A **blank line** starts a new paragraph.
- To force a line break *within* a paragraph, end the line with **two or more trailing spaces**, or use `<br>`.

```markdown
First line.
Second line (no break — renders as one paragraph/line).

First line.  
Second line (two trailing spaces above force a break).
```

---

## HTML in Markdown

Most Markdown processors allow raw HTML to be mixed in for things Markdown can't do natively:

```markdown
<div align="center">
  <strong>Centered bold text</strong>
</div>

Text with a <sub>subscript</sub> and <sup>superscript</sup>.
```

> Support and sanitization of raw HTML varies by platform (e.g. GitHub strips some tags/attributes for security).

---

## Emoji (GitHub-flavored)

```markdown
:tada: :rocket: :white_check_mark:
```
Renders as: 🎉 🚀 ✅ (on platforms that support emoji shortcodes, like GitHub).

---

## Full Example

```markdown
# My Project

Welcome to **My Project**! This is a *simple* example combining several elements.

## Features

- [x] Core functionality
- [ ] Documentation
- [ ] Tests

1. Clone the repo
2. Install dependencies: `npm install`
3. Run it: `npm start`

> **Note:** This project is under active development.

| Command | Description |
| ------- | ------------ |
| `npm start` | Runs the app |
| `npm test` | Runs the test suite |

See more at [My Website](https://example.com).

![Project logo](https://example.com/logo.png)
```

---

## Notes on Markdown Flavors

Core Markdown (as originally specified) covers headings, emphasis, lists, blockquotes, links, images, and code. Features like **tables, task lists, strikethrough, footnotes, and auto-linking** are extensions defined by **GitHub Flavored Markdown (GFM)** and adopted by most modern tools (GitLab, VS Code, static site generators, etc.) — but support can vary by platform, so it's worth checking the docs for wherever you're writing.

---

*A quick-reference guide to Markdown syntax for documentation, READMEs, and technical writing.*
