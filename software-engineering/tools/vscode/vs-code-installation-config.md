# VS Code Configuration

[Back to the topic index](./README.md)

## Install VS Code (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install code
```

If `code` isn't found, add Microsoft's repository (see the [VS Code Linux installation guide](https://code.visualstudio.com/docs/setup/linux)) or install via Snap:

```bash
sudo snap install code --classic
```

Verify the installation:

```bash
code --version
```

---

## Extensions

List installed extensions:

```bash
code --list-extensions
```

### Recommended Extensions

| Extension | Purpose | Install |
| --- | --- | --- |
| **dbaeumer.vscode-eslint** | JavaScript/TypeScript linting and auto-fixes. | `code --install-extension dbaeumer.vscode-eslint` |
| **esbenp.prettier-vscode** | Formats JavaScript, TypeScript, HTML, CSS, JSON, and Markdown. | `code --install-extension esbenp.prettier-vscode` |
| **bradlc.vscode-tailwindcss** | IntelliSense and linting for Tailwind CSS. | `code --install-extension bradlc.vscode-tailwindcss` |
| **xabikos.JavaScriptSnippets** | JavaScript and React code snippets. | `code --install-extension xabikos.JavaScriptSnippets` |
| **dsznajder.es7-react-js-snippets** | React, Redux, and ES7 snippets. | `code --install-extension dsznajder.es7-react-js-snippets` |
| **formulahendry.auto-rename-tag** | Automatically renames matching HTML/JSX tags. | `code --install-extension formulahendry.auto-rename-tag` |
| **formulahendry.auto-close-tag** | Automatically inserts closing HTML/JSX tags. | `code --install-extension formulahendry.auto-close-tag` |
| **ms-ossdata.vscode-pgsql** | PostgreSQL explorer and query editor. | `code --install-extension ms-ossdata.vscode-pgsql` |
| **usernamehw.errorlens** | Displays diagnostics inline. | `code --install-extension usernamehw.errorlens` |
| **eamodio.gitlens** | Enhanced Git history, blame, and repository insights. | `code --install-extension eamodio.gitlens` |
| **ms-vscode.vscode-typescript-next** *(optional)* | Latest TypeScript language service. | `code --install-extension ms-vscode.vscode-typescript-next` |
| **ms-vscode.vscode-json** | Improved JSON editing and validation. | `code --install-extension ms-vscode.vscode-json` |
| **ritwickdey.liveserver** | Live-reloading web server for static sites. | `code --install-extension ritwickdey.liveserver` |
| **ms-vscode-remote.remote-ssh** | Develop on remote machines via SSH. | `code --install-extension ms-vscode-remote.remote-ssh` |
| **ms-vscode-remote.remote-ssh-edit** | Edit remote files over SSH without opening a workspace. | `code --install-extension ms-vscode-remote.remote-ssh-edit` |
| **ms-vscode.remote-explorer** | Manage Remote SSH, WSL, and Dev Containers. | `code --install-extension ms-vscode.remote-explorer` |
| **digitarald.paste-as-markdown** | Convert pasted rich text into Markdown. | `code --install-extension digitarald.paste-as-markdown` |
| **shd101wyy.markdown-preview-enhanced** | Advanced Markdown preview with diagrams and math. | `code --install-extension shd101wyy.markdown-preview-enhanced` |
| **yzhang.markdown-all-in-one** | Markdown shortcuts, TOC generation, and formatting. | `code --install-extension yzhang.markdown-all-in-one` |
| **streetsidesoftware.code-spell-checker** | Spell checking for code and documentation. | `code --install-extension streetsidesoftware.code-spell-checker` |
| **streetsidesoftware.code-spell-checker-australian-english** | Australian English dictionary. | `code --install-extension streetsidesoftware.code-spell-checker-australian-english` |
| **oleg-shilo.favorites** | Bookmark frequently used files and folders. | `code --install-extension oleg-shilo.favorites` |

---

## Configure Prettier

Prettier is an opinionated code formatter. It complements ESLint, which focuses on code quality.

### 1. Install the extension

Install **Prettier - Code formatter** from the Extensions view (`Ctrl+Shift+X`) or run:

```bash
code --install-extension esbenp.prettier-vscode
```

### 2. Set as the default formatter

In **Settings** (`Ctrl+,`):

- **Editor: Default Formatter** → `Prettier - Code formatter`
- Enable **Editor: Format On Save**

### 3. Install Prettier in your project (recommended)

```bash
npm install --save-dev --save-exact prettier
```

Create `.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 80
}
```

Format manually with **Format Document** or `Shift+Alt+F`.

---

## Configure ESLint

ESLint detects bugs and enforces JavaScript/TypeScript code quality.

### 1. Install the extension

```bash
code --install-extension dbaeumer.vscode-eslint
```

### 2. Install ESLint in your project

```bash
npm install --save-dev eslint
npx eslint --init
```

Follow the prompts for your stack (React, TypeScript, Node.js, etc.).

> **Note:** ESLint 9+ uses `eslint.config.js` (Flat Config) by default instead of `.eslintrc.*`.

### 3. Prevent conflicts with Prettier

If your ESLint configuration includes formatting rules (e.g. Airbnb), install:

```bash
npm install --save-dev eslint-config-prettier
```

This disables formatting rules that overlap with Prettier.

---

## Usage

With **Format On Save** enabled:

- **Prettier** formats your code.
- **ESLint** reports and fixes supported linting issues.

To format manually:

- Right-click → **Format Document**
- `Shift+Alt+F`