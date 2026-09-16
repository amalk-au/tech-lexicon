# VS Code Cheat Sheet

[Back to the topic index](./README.md)

A practical reference for Visual Studio Code — interface basics, setup/config (Prettier & ESLint), Remote-SSH, and Linux keyboard shortcuts.

---

## Table of Contents
- [VS Code Cheat Sheet](#vs-code-cheat-sheet)
  - [Table of Contents](#table-of-contents)
  - [What is VS Code?](#what-is-vs-code)
  - [Main Interface Components](#main-interface-components)
  - [Basic Actions](#basic-actions)
  - [Coding Features](#coding-features)
  - [Tips](#tips)

---

## What is VS Code?

**Visual Studio Code** is a free, highly customizable code editor from Microsoft, designed for fast, efficient development across virtually any language or framework — backed by a large extension marketplace, built-in Git support, and an integrated debugger/terminal.

---

## Main Interface Components

| Component | How to Open |
|---|---|
| **File Explorer** | View and manage files/folders in your workspace |
| **Search** | Find text across files — `Ctrl+Shift+F` |
| **Source Control** | Git (and other VCS) integration — `Ctrl+Shift+G` |
| **Run and Debug** | Breakpoints, watch variables, step-through debugging — `Ctrl+Shift+D` |
| **Extensions** | Language support, themes, and tools from the marketplace — `Ctrl+Shift+X` |
| **Integrated Terminal** | Built-in command line — `` Ctrl+` `` |
| **Command Palette** | Access every command by name — `Ctrl+Shift+P` |

---

## Basic Actions

- **Start from terminal at current folder ** `code .`
- **New File:** `Ctrl+N`
- **Save:** `Ctrl+S` (or enable **Auto Save** under **File > Auto Save**)
- **Open/close tabs:** each file opens in its own tab; split the editor to view multiple files side by side (`Ctrl+\`)
- **Change theme:** `Ctrl+K Ctrl+T`, or **File > Preferences > Theme > Color Theme**
- **Adjust font size / layout:** **File > Preferences > Settings** (`Ctrl+,`)

---

## Coding Features

- **IntelliSense** — smart code completions and type-aware suggestions as you type (`Ctrl+Space`)
- **Code Actions** — quick fixes and refactors, surfaced via the lightbulb icon or `Ctrl+.`
- **Snippets** — insert common code patterns quickly (built-in or custom, via `.code-snippets` files)
- **Emmet** — write HTML/CSS faster with abbreviations, e.g. `div.card>h2+p` expands to a full nested structure
- **Debugging** — set breakpoints (`F9`) and step through code (`F10`/`F11`) via the Run and Debug panel

---

## Tips

- **Workspace Trust:** VS Code may ask if you trust a newly opened folder's code — only trust folders/code you know is safe, since untrusted workspaces run with restricted extension/feature access.
- **Profiles:** Save and sync your settings, extensions, keybindings, and UI state across devices/projects — **File > Preferences > Profiles**.
- **Settings Sync:** Sign in with a Microsoft or GitHub account to sync settings across machines automatically.
- **Multi-root workspaces:** Open several unrelated project folders in one window via **File > Add Folder to Workspace**.

