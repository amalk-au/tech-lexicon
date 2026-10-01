# Git & GitHub: Learn by Doing

[Back to the topic index](./README.md)

Build a small web app, practice Git locally, then use GitHub pull requests and Actions.

**How to use:** follow the main sections in order. Run terminal blocks one at a time from the project root unless instructed otherwise. Alternatives and reference commands are not extra steps to run. The advanced exercises use a separate copy.

All identities and repository owners below are fictional or placeholders. Replace uppercase placeholders only on your own machine; do not publish credentials or personal contact details.

## Contents

- [Git \& GitHub: Learn by Doing](#git--github-learn-by-doing)
  - [Contents](#contents)
  - [Mental model](#mental-model)
  - [Tools and commit identity](#tools-and-commit-identity)
  - [Build the practice web app](#build-the-practice-web-app)
    - [Create a pnpm + Vite project](#create-a-pnpm--vite-project)
    - [Add the app files](#add-the-app-files)
    - [Run and build](#run-and-build)
  - [Make and inspect commits](#make-and-inspect-commits)
    - [Exercise 1: initialize and save a baseline](#exercise-1-initialize-and-save-a-baseline)
    - [Exercise 2: edit, inspect, stage, commit](#exercise-2-edit-inspect-stage-commit)
  - [Create and merge a branch](#create-and-merge-a-branch)
    - [Exercise 3: change the button color](#exercise-3-change-the-button-color)
  - [Cause and resolve a merge conflict](#cause-and-resolve-a-merge-conflict)
    - [Exercise 4: edit the same line on two branches](#exercise-4-edit-the-same-line-on-two-branches)
  - [Stash unfinished work](#stash-unfinished-work)
    - [Exercise 5: temporarily put edits aside](#exercise-5-temporarily-put-edits-aside)
  - [Undo changes and correct commits](#undo-changes-and-correct-commits)
    - [Exercise 6: unstage, then discard a file edit](#exercise-6-unstage-then-discard-a-file-edit)
    - [Exercise 7: amend an unpushed commit](#exercise-7-amend-an-unpushed-commit)
    - [Exercise 8: revert a commit](#exercise-8-revert-a-commit)
  - [Publish the practice repository to GitHub](#publish-the-practice-repository-to-github)
    - [Authenticate](#authenticate)
    - [Create and push: choose one route](#create-and-push-choose-one-route)
  - [Use a pull request](#use-a-pull-request)
    - [Exercise 9: propose a button-label change](#exercise-9-propose-a-button-label-change)
  - [Fetch, pull, clone, and fork](#fetch-pull-clone-and-fork)
    - [Inspect remote updates before integrating](#inspect-remote-updates-before-integrating)
    - [Clone into a fresh folder](#clone-into-a-fresh-folder)
    - [Forking: a separate collaboration pattern](#forking-a-separate-collaboration-pattern)
  - [Add GitHub Actions](#add-github-actions)
    - [Exercise 10: build every PR and every push to main](#exercise-10-build-every-pr-and-every-push-to-main)
  - [Advanced local exercises](#advanced-local-exercises)
    - [Exercise 11: rebase an unpushed feature branch](#exercise-11-rebase-an-unpushed-feature-branch)
    - [Exercise 12: reset a local commit and recover it](#exercise-12-reset-a-local-commit-and-recover-it)
    - [Exercise 13: cherry-pick one commit](#exercise-13-cherry-pick-one-commit)
    - [Inspect an older snapshot](#inspect-an-older-snapshot)
    - [Tag a version](#tag-a-version)
  - [Quick command reference](#quick-command-reference)
  - [Troubleshooting and revision challenges](#troubleshooting-and-revision-challenges)
  - [Keep this guide in GitHub](#keep-this-guide-in-github)
  - [Official references](#official-references)

## Mental model

**Git** records your project's history on your computer. **GitHub** hosts Git repositories and adds pull requests, reviews, issues, and automation. A local commit works without GitHub or an internet connection.

| Term | Meaning |
| --- | --- |
| Repository | Project files plus Git's history, stored in `.git/`. |
| Working tree | The files you are currently editing. |
| Staging area / index | The selected versions of files for your next commit. |
| Commit | A recorded snapshot with an ID, parent commit(s), and metadata. |
| Branch | A movable reference to a commit; it advances when you commit on it. |
| `HEAD` | Usually points to your current branch; can also point directly to a commit. |
| Remote | A named connection to another repository, commonly `origin`. |
| `origin/main` | Your local record of the remote's `main`, refreshed by fetching. |
| Upstream branch | The remote branch your local branch tracks for pull/push. |
| Pull request (PR) | A GitHub proposal to merge changes from one branch into another. |

The daily loop: **edit → inspect → stage → commit → push**. `git add` stages the file's content at that moment; later edits need staging again. A commit does not automatically upload anything.

## Tools and commit identity

Check your tools:

```bash
git --version
node --version
pnpm --version
```

Use **Node.js 24.x** for this guide. The current Vite requirements also allow Node.js 20.19+ or 22.12+, but using Node 24 keeps local development aligned with the CI example. Use the official installation links below if Node or pnpm is missing.

On Ubuntu, install Git and the optional GitHub CLI (`gh`) if needed:

```bash
sudo apt update
sudo apt install git gh
```

`git config user.name` and `user.email` are commit metadata, not GitHub login credentials. We will set fictional values **only inside the practice repository** after initializing it.

For GitHub attribution, you can instead use a public alias and the exact GitHub-provided `noreply` address from **Settings → Emails**. Copy that address rather than inventing one. It hides your personal email address but still identifies your GitHub account. Changing these settings affects future commits; it does not edit existing history.

## Build the practice web app

### Create a pnpm + Vite project

Start in a directory where you keep disposable practice projects. Use a new folder, not an existing application's repository.

```bash
mkdir git-practice-web
cd git-practice-web

cat > package.json <<'EOF'
{
  "name": "git-practice-web",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
EOF

# Record the exact installed pnpm version for CI.
PRACTICE_PNPM_VERSION="$(pnpm --version)" node --input-type=module <<'NODE'
import { readFileSync, writeFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
pkg.packageManager = `pnpm@${process.env.PRACTICE_PNPM_VERSION}`;
writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
NODE

pnpm add -D vite
mkdir src
```

The manifest defines development/build commands. The Node script records your installed pnpm version. `pnpm add -D vite` installs Vite as a development dependency and creates a lockfile.

### Add the app files

Copy this entire block into your terminal:

```bash
cat > index.html <<'EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Git Practice Lab</title>
  </head>
  <body>
    <main>
      <h1>Git Practice Lab</h1>
      <p id="message"></p>
      <button id="counter" type="button">Add one</button>
      <p aria-live="polite">Count: <span id="count">0</span></p>
    </main>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
EOF

cat > src/message.js <<'EOF'
export const message = 'Practice Git by changing this page.';
EOF

cat > src/main.js <<'EOF'
import './style.css';
import { message } from './message.js';

document.querySelector('#message').textContent = message;

let count = 0;
document.querySelector('#counter').addEventListener('click', () => {
  count += 1;
  document.querySelector('#count').textContent = String(count);
});
EOF

cat > src/style.css <<'EOF'
:root {
  font-family: system-ui, sans-serif;
  color: #1f2937;
  background: #f8fafc;
}

main {
  max-width: 40rem;
  margin: 4rem auto;
  padding: 2rem;
}

button {
  background: #2563eb;
  color: white;
  border: 0;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
}
EOF

cat > .gitignore <<'EOF'
node_modules/
dist/
.env
.env.*
!.env.example
*.log
EOF

cat > README.md <<'EOF'
# Git Practice Web App

A small counter app for practicing Git and GitHub.

## Run locally

Use Node.js 24.x and the pnpm version recorded in package.json.

- Install: `pnpm install --frozen-lockfile`
- Develop: `pnpm dev`
- Build: `pnpm run build`
- Preview the build: `pnpm preview`
EOF
```

| File | Purpose |
| --- | --- |
| `index.html` | Page structure and the JavaScript entry point. |
| `src/main.js` | Displays a message and increments the counter. |
| `src/message.js` | A single line we will edit to create a Git conflict. |
| `src/style.css` | Appearance; changing the button color makes branches visible. |
| `package.json` | Scripts, dependency declarations, and pnpm version. |
| `pnpm-lock.yaml` | Resolved dependency versions; commit this file. |
| `.gitignore` | Keeps generated files and local environment files out of new commits. |

`cat > file <<'EOF'` writes the enclosed text to a file. `>` replaces its content; `>>` appends. Quoting `'EOF'` prevents Bash from expanding the JavaScript inside the block.

### Run and build

```bash
pnpm dev
```

Open the URL printed by Vite, usually `http://localhost:5173`. Clicking **Add one** should increment the count. Stop the server with **Ctrl+C** before continuing, or leave it running in a second terminal.

```bash
pnpm run build
```

**Expected:** the production files appear in `dist/`. A successful build checks that Vite can bundle the app; it does not prove every UI behavior is correct.

## Make and inspect commits

### Exercise 1: initialize and save a baseline

```bash
git init -b main
git config --local user.name "Practice Contributor"
git config --local user.email "practice@example.invalid"
git config --local core.editor "nano"

git status
git add .
git diff --cached --stat
git commit -m "Create counter web app"
git tag practice-start
git status
```

`init -b main` creates the repository with a `main` branch. `--local` keeps the configuration inside this repository. The email uses a reserved, non-deliverable domain for practice. `git add .` stages additions, edits, and deletions below the current directory; check them before committing.

`git diff --cached --stat` summarizes the staged changes. `commit` records them. The lightweight tag `practice-start` keeps a convenient reference to this baseline.

**Expected:** `git status` reports a clean working tree. Neither `node_modules/` nor `dist/` is tracked.

### Exercise 2: edit, inspect, stage, commit

```bash
sed -i 's/Git Practice Lab/Git and GitHub Practice/g' index.html
git status --short
git diff -- index.html

git add index.html
git diff --cached -- index.html
git commit -m "Update practice page title"

git log --oneline --graph --decorate --all
git show --stat HEAD
```

`sed -i` changes the matching text in the file. `git diff` compares tracked working files with the index; `git diff --cached` compares the index with the current commit. An untracked file does not appear in a normal `git diff` until staged.

`log` shows history. `show HEAD` inspects the latest commit. Press **q** if output opens in a pager.

**Expected:** two commits on `main`, with a clean working tree. Refresh the page to see the changed heading.

Try staging a file, editing it again, then comparing both diffs. The staged copy and your latest file can be different. Run `git add` again if you want both edits in the same commit.

## Create and merge a branch

### Exercise 3: change the button color

Start with a clean working tree. If you tried the extra staging experiment, commit or discard that change first.

```bash
git switch -c feature/green-theme
sed -i 's/#2563eb/#16a34a/' src/style.css
git add src/style.css
git commit -m "Make counter button green"

git diff main...feature/green-theme -- src/style.css
git switch main
git merge --ff-only feature/green-theme
git branch -d feature/green-theme
git log --oneline --graph --decorate --all
```

`switch -c` creates a branch and checks it out. The three-dot diff shows changes on the feature branch since its common ancestor with `main`.

`merge --ff-only` advances `main` to the feature commit when there is no divergence; otherwise it refuses. No merge commit is needed here. `branch -d` deletes the merged local branch; its commits remain in `main`.

**Expected:** the button is green on `main`. Switching branches changes your tracked files to match the chosen branch.

## Cause and resolve a merge conflict

### Exercise 4: edit the same line on two branches

```bash
git switch -c feature/message
cat > src/message.js <<'EOF'
export const message = 'Message from the feature branch.';
EOF
git add src/message.js
git commit -m "Change message on feature branch"

git switch main
cat > src/message.js <<'EOF'
export const message = 'Message from the main branch.';
EOF
git add src/message.js
git commit -m "Change message on main branch"

git merge --no-edit feature/message
```

**Expected:** the last command stops with a conflict. This is intentional: both branches changed the same line after their common ancestor. Continue with the next block even though the merge command failed.

```bash
git status
cat src/message.js
```

The file contains conflict markers similar to:

```text
<<<<<<< HEAD
export const message = 'Message from the main branch.';
=======
export const message = 'Message from the feature branch.';
>>>>>>> feature/message
```

For this merge, the top side is your current branch; the bottom side is the incoming branch. Choose the final content and remove **all** markers:

```bash
cat > src/message.js <<'EOF'
export const message = 'Merged message from both branches.';
EOF

git add src/message.js
pnpm run build
git commit -m "Merge feature message and resolve conflict"
git branch -d feature/message
git status
git log --oneline --graph --decorate --all
```

`git add` marks the file as resolved. `git commit` completes the merge. The resulting merge commit has two parents.

**Expected:** a clean working tree and a merged message in the browser. For a real conflict, review the behavior as well as removing the markers.

**Alternative, only while the merge is unresolved:** `git merge --abort` cancels it. If you choose this alternative, rerun the merge and resolve it before continuing the guided path.

## Stash unfinished work

### Exercise 5: temporarily put edits aside

```bash
printf '\nbody { border-top: 6px solid #9333ea; }\n' >> src/style.css
printf 'Unfinished practice note\n' > scratch-note.txt

git stash push -u -m "Unfinished border experiment"
git stash list
git status

git switch -c practice/temporary
git switch main

git stash pop
git diff -- src/style.css
git status --short
```

`stash push` stores unfinished changes and cleans the working tree. `-u` includes untracked files; it does not include ignored files. `pop` reapplies the latest stash and removes it if application succeeds. `apply` restores changes while keeping the stash.

Clean up **only these disposable exercise changes**:

```bash
git restore -- src/style.css
rm scratch-note.txt
git branch -d practice/temporary
git status
```

**Expected:** the working tree is clean again. If `stash pop` conflicts in another situation, resolve the conflict; Git keeps that stash rather than dropping it automatically.

## Undo changes and correct commits

### Exercise 6: unstage, then discard a file edit

```bash
printf '\n/* Temporary practice note */\n' >> src/style.css
git add src/style.css

git restore --staged -- src/style.css
git diff -- src/style.css

git restore -- src/style.css
git status
```

`restore --staged` removes the edit from the next commit but keeps it in your working file. Plain `restore` then replaces the working file with the staged version; after unstaging here, that version matches `HEAD`.

**Expected:** the temporary comment disappears. Plain `restore` discards those uncommitted edits, so use it only when you intend to lose them.

### Exercise 7: amend an unpushed commit

```bash
printf '# Revision notes\n' > NOTES.md
git add NOTES.md
git commit -m "Add revision notes"

printf '\nReview staged changes before committing.\n' >> NOTES.md
git add NOTES.md
git commit --amend --no-edit
git show HEAD -- NOTES.md
```

`--amend` replaces the latest commit with a new one that includes the staged change. `--no-edit` keeps its message. The commit ID changes. Use this on your own unpushed work; amending published commits rewrites shared history.

### Exercise 8: revert a commit

```bash
printf 'This file will be reverted.\n' > revert-demo.txt
git add revert-demo.txt
git commit -m "Add temporary revert demo"

git revert --no-edit HEAD
git log -2 --oneline
git status
```

`revert` creates a new commit that reverses the selected commit's changes. It preserves the original history, which makes it suitable for undoing published changes. Reverting can still conflict when later changes overlap.

**Expected:** `revert-demo.txt` disappears, and both the original commit and the reversal appear in history.

| Need | Choose | What changes |
| --- | --- | --- |
| Remove a file from staging | `git restore --staged FILE` | Index; your edits remain. |
| Discard an unstaged file edit | `git restore FILE` | Working file, restored from the index. |
| Correct your latest unpushed commit | `git commit --amend` | Replaces the latest commit. |
| Undo a published commit | `git revert COMMIT` | Adds a reversal commit. |
| Remove a local commit, keep edits staged | `git reset --soft HEAD~1` | Moves the branch back; index and files remain. |
| Remove a local commit, keep edits unstaged | `git reset --mixed HEAD~1` | Moves the branch back and resets the index. |
| Move back and discard tracked changes | `git reset --hard COMMIT` | Resets branch, index, and tracked files. Destructive; can also remove obstructing untracked paths. |

The reset exercise is in the separate advanced copy below. `reset` does not upload changes or automatically undo a remote branch.

## Publish the practice repository to GitHub

### Authenticate

```bash
gh auth login --hostname github.com --git-protocol https --web
gh auth setup-git
gh auth status
```

Follow the browser/device-code prompts. `gh auth setup-git` configures Git to use GitHub CLI authentication for HTTPS. `gh` is optional for Git itself, but this guide uses it for GitHub tasks. GitHub account passwords are not accepted for HTTPS Git authentication.

Before publishing, check the files and the most recent commit identity:

```bash
git status
git ls-files
git log -1 --format='%an <%ae>'
```

The exercise commits use fictional metadata. Keep it for practice, or configure a GitHub `noreply` email for future commits. Never add tokens, SSH private keys, or real `.env` values to a public repository.

### Create and push: choose one route

**Route A — GitHub CLI:** from the project root:

```bash
gh repo create git-practice-web --public --source=. --remote=origin --push
```

This creates a **public** repository in your authenticated GitHub account, adds `origin`, and pushes the current branch. Choose an unused repository name if this one already exists. It does not deploy the web app.

**Route B — GitHub website:** create an empty repository named `git-practice-web`. Do not initialize it with a README, license, or `.gitignore`; those would create a separate initial history. Copy its HTTPS URL and replace `OWNER` below:

```bash
git remote add origin https://github.com/OWNER/git-practice-web.git
git push -u origin main
```

`remote add` saves the connection. `push` uploads commits. `-u` sets the upstream so later pushes and pulls can usually omit the remote and branch.

After **either** route:

```bash
git remote -v
git branch -vv
```

**Expected:** `main` tracks `origin/main`, and your project files appear on GitHub. A plain branch push does not push the `practice-start` tag.

## Use a pull request

### Exercise 9: propose a button-label change

```bash
git switch main
git pull --ff-only
git switch -c feature/button-label

sed -i 's/>Add one</>Increase count</' index.html
pnpm run build
git diff -- index.html
git add index.html
git commit -m "Improve counter button label"
git push -u origin feature/button-label

gh pr create --base main --head feature/button-label \
  --title "Improve counter button label" \
  --body "Changes the button text to Increase count. Verified with pnpm run build."

gh pr view --web
```

The PR's **base** is the destination branch; its **head** is the source branch. Inspect **Files changed**, add a short description, and request a review when collaborating. New commits pushed to the same branch update the existing PR.

Merge it after reviewing the diff:

```bash
gh pr merge --squash --delete-branch
git switch main
git pull --ff-only
git fetch --prune
```

Squash merging adds one combined commit to `main`. `--delete-branch` removes the source branch locally and remotely when the CLI can do so. `fetch --prune` removes stale remote-tracking references; it does not delete other local branches.

**Expected:** the PR is merged, and local `main` contains the updated label. Repository rules may require checks or another person's review before a merge is allowed.

| GitHub feature | Use it for |
| --- | --- |
| Issues | Bugs, ideas, and work to track before implementation. |
| Pull requests | Proposing changes, discussing diffs, and recording reviews. |
| Rulesets / branch protection | Requiring PRs, passing checks, or approvals for important branches. |
| Actions | Running build/test workflows on events. |
| Releases | Publishing a version description and assets associated with a tag. |
| README | Explaining the project and how to run it. |
| License | Stating reuse permissions; public visibility alone is not a reuse license. |

Optional: create an issue in GitHub and reference its actual number in a PR description with `Closes #ISSUE_NUMBER`. Merging a qualifying PR into the default branch closes that linked issue. Replace the placeholder with a real issue number.

## Fetch, pull, clone, and fork

### Inspect remote updates before integrating

Run on `main` with a clean working tree:

```bash
git switch main
git fetch origin
git log --oneline HEAD..origin/main
git diff HEAD..origin/main
git pull --ff-only
```

`fetch` downloads commits and updates remote-tracking references without changing your working files. `pull` fetches and then integrates changes. `--ff-only` refuses when your local and remote histories have diverged.

**Expected:** if nothing changed on GitHub, the log/diff are empty and the pull reports that you are up to date.

### Clone into a fresh folder

Replace `OWNER` before running; the new folder must not already exist:

```bash
cd ..
git clone https://github.com/OWNER/git-practice-web.git git-practice-web-copy
cd git-practice-web-copy
pnpm install --frozen-lockfile
pnpm dev
```

`clone` downloads history, creates a working copy, and sets `origin`. Installation recreates ignored dependencies from the committed lockfile. `--frozen-lockfile` fails if the manifest and lockfile need updating.

Stop the server and return to the original repository for the next section:

```bash
cd ../git-practice-web
```

A clone has its own local configuration. If you commit in another clone, set its commit identity there too.

### Forking: a separate collaboration pattern

| Operation | Result |
| --- | --- |
| Clone | A repository copy on your computer. |
| Fork | A repository copy under your GitHub account. |
| Branch | A named line of work inside a repository. |

Fork when contributing to a project where you cannot push a branch directly. Click **Fork** on GitHub, clone your fork, then add the original project as `upstream`.

**Reference only — run inside a separate clone of your fork**, replacing `ORIGINAL_OWNER/PROJECT`:

```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/PROJECT.git
git fetch upstream
git switch main
git merge --ff-only upstream/main
git push origin main
```

Then create a feature branch, push it to your fork's `origin`, and open a PR against the original project's base branch. This example assumes both projects use `main`; adapt the branch name if needed.

## Add GitHub Actions

### Exercise 10: build every PR and every push to main

In the original practice repository:

```bash
git switch main
git pull --ff-only
git switch -c ci/build
mkdir -p .github/workflows

cat > .github/workflows/ci.yml <<'EOF'
name: Build

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

permissions:
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Check out the repository
        uses: actions/checkout@v7

      - name: Set up Node.js
        uses: actions/setup-node@v7
        with:
          node-version: '24'
          package-manager-cache: false

      - name: Set up pnpm
        uses: pnpm/action-setup@v6

      - name: Install locked dependencies
        run: pnpm install --frozen-lockfile

      - name: Build the app
        run: pnpm run build
EOF

pnpm run build
git add .github/workflows/ci.yml
git commit -m "Add GitHub Actions build workflow"
git push -u origin ci/build

gh pr create --base main --head ci/build \
  --title "Add build workflow" \
  --body "Builds the web app for pull requests and pushes to main using pnpm."

gh pr view --web
```

| Workflow part | What it does |
| --- | --- |
| `on` | Runs for pushes to `main` and PRs targeting `main`. |
| `permissions` | Gives this workflow read access to repository contents. |
| `runs-on` | Selects an Ubuntu runner. |
| `checkout` | Places repository files on the runner. |
| `setup-node` | Installs Node 24. |
| `pnpm/action-setup` | Reads the pinned pnpm version from `package.json`. |
| Frozen installation | Uses the lockfile and rejects dependency mismatches. |
| Build | Checks that Vite can create the production bundle. |

Wait for the check to pass in the PR. You can also watch it from your terminal:

```bash
gh pr checks --watch
gh pr merge --squash --delete-branch
git switch main
git pull --ff-only
```

**Expected:** a green build check on the PR and a run in the repository's **Actions** tab. This workflow builds the app; hosting requires a separate deployment step.

Keep the local pnpm version and `packageManager` field aligned when upgrading. The action versions above follow the linked upstream examples; check those references when revisiting the guide.

## Advanced local exercises

These exercises modify history. Use a separate copy and keep them local:

```bash
git switch main
git status
git clone . ../git-practice-advanced
cd ../git-practice-advanced
git config --local user.name "Practice Contributor"
git config --local user.email "practice@example.invalid"
git config --local core.editor "nano"
```

The source is a local path, so this copy's `origin` points to your original local repository. The exercises below do not use `push`. Git clone copies committed history, not unfinished working-tree changes.

### Exercise 11: rebase an unpushed feature branch

```bash
git switch -c feature/rebase-demo
printf 'Feature branch notes\n' > feature-notes.txt
git add feature-notes.txt
git commit -m "Add feature notes"

git switch main
printf 'Main branch notes\n' > main-notes.txt
git add main-notes.txt
git commit -m "Add main notes"

git switch feature/rebase-demo
git log --oneline --graph --all
git rebase main
git log --oneline --graph --all

git switch main
git merge --ff-only feature/rebase-demo
git branch -d feature/rebase-demo
```

Rebase replays your feature changes on top of the newer `main`, creating new commit IDs. The two files are different, so this example should not conflict. After rebasing, `main` can fast-forward to the feature branch.

| Merge | Rebase |
| --- | --- |
| Joins histories; may create a two-parent commit. | Replays commits onto a new base. |
| Keeps existing commit IDs. | Rewrites replayed commit IDs. |
| Useful for integrating shared branches. | Useful for updating your own unpushed feature work. |

**If another rebase conflicts:** edit the conflicted files, stage them, then run `git rebase --continue`. Git may open your editor. `git rebase --abort` cancels the operation. Do not create a separate normal merge commit during a rebase.

Avoid rebasing history other people are using. If your own already-pushed branch is deliberately rewritten under your team's workflow, `git push --force-with-lease` adds a check against unexpected remote updates. It still rewrites remote history; never treat it as the default fix for a rejected push.

### Exercise 12: reset a local commit and recover it

```bash
git switch -c practice/reset-demo
printf 'A commit to recover\n' > recovery-note.txt
git add recovery-note.txt
git commit -m "Add recovery note"

git reset --soft HEAD~1
git status --short
git diff --cached

git restore --staged -- recovery-note.txt
rm recovery-note.txt
git reflog -5

# In this exact sequence, the prior HEAD entry is the removed commit.
git branch recovered-commit 'HEAD@{1}'
git show recovered-commit:recovery-note.txt

git switch main
git branch -d practice/reset-demo
```

`HEAD~1` means the first parent of the current commit. Soft reset moves the branch back while keeping that commit's changes staged. Unstaging the new file makes it untracked; removing it here cleans up the disposable example.

`reflog` records local reference movements. The new `recovered-commit` branch keeps the removed commit reachable. `HEAD@{1}` works for the exact sequence above; after other checkouts or commits, inspect the reflog and use the actual commit ID instead.

**Expected:** `git show` prints `A commit to recover`. Reflog is local and entries can expire. It cannot reliably recover edits that were never committed or stashed.

### Exercise 13: cherry-pick one commit

```bash
git switch -c practice/cherry-source practice-start
printf 'One useful change\n' > picked-note.txt
git add picked-note.txt
git commit -m "Add a useful practice note"

git switch main
git cherry-pick practice/cherry-source
git log -1 --oneline
cat picked-note.txt
```

`cherry-pick` applies the change from a selected commit to your current branch. Here, the branch name resolves to its latest commit; it does not merge the whole branch. The new commit has a different parent from the source commit.

If a cherry-pick conflicts, resolve and stage the files, then run `git cherry-pick --continue`; use `git cherry-pick --abort` to cancel. Leave the source branch in this disposable copy so you can compare histories.

### Inspect an older snapshot

```bash
git switch --detach practice-start
git log -1 --oneline
git switch main
```

Detached `HEAD` lets you inspect a commit without checking out a branch. If you decide to keep new work there, create a branch with `git switch -c experiment/old-snapshot` before leaving it.

Return to the original repository when finished:

```bash
cd ../git-practice-web
```

### Tag a version

On a clean, updated `main` in your GitHub-connected practice repository:

```bash
git switch main
git pull --ff-only
git tag -a v0.1.0 -m "First practice version"
git push origin v0.1.0
```

An annotated tag gives a version a name and message. Tags do not move with new commits. Pushing a branch does not normally push tags, so this command publishes the tag explicitly. You can then create a GitHub release from it.

## Quick command reference

These are lookup examples, not a sequence. Replace `FILE`, `BRANCH`, and `COMMIT` with real values.

| Command | Purpose |
| --- | --- |
| `git status` | Check staged, unstaged, and untracked changes. |
| `git diff` | View tracked, unstaged changes. |
| `git diff --cached` | View the changes selected for the next commit. |
| `git add FILE` | Stage one file's current content. |
| `git add -p` | Interactively stage selected change hunks. |
| `git commit -m "Message"` | Record the staged changes. |
| `git commit -am "Message"` | Stage modified/deleted tracked files and commit; excludes new files. |
| `git log --oneline --graph --decorate --all` | Inspect branch history. |
| `git show COMMIT` | Inspect a commit and its patch. |
| `git switch -c BRANCH` | Create and enter a branch. |
| `git switch BRANCH` | Change branches. |
| `git branch -vv` | Show local branches and their tracking information. |
| `git branch -d BRANCH` | Delete a local branch after Git's merged-history check. |
| `git merge BRANCH` | Integrate the named branch into your current branch. |
| `git merge --no-ff BRANCH` | Create a merge commit even when fast-forward is possible. |
| `git merge --abort` | Cancel an unresolved merge. |
| `git fetch origin` | Download remote updates without integrating them. |
| `git pull --ff-only` | Fetch and update only if a fast-forward is possible. |
| `git push -u origin BRANCH` | Publish a branch and set its upstream. |
| `git push` | Push using your configured upstream/default behavior. |
| `git push origin --delete BRANCH` | Delete a remote branch; check that it is no longer needed. |
| `git remote -v` | Show configured remote URLs. |
| `git stash push -u -m "Note"` | Save unfinished changes, including untracked files. |
| `git stash apply` | Restore the latest stash while retaining it. |
| `git restore --staged FILE` | Unstage a file without discarding its working edits. |
| `git restore FILE` | Discard unstaged changes in that file. |
| `git revert COMMIT` | Create a commit reversing another commit's changes. |
| `git rebase main` | Replay current branch commits on top of `main`. |
| `git cherry-pick COMMIT` | Apply one commit's change to the current branch. |
| `git reflog` | Find recent local reference movements for recovery. |
| `git blame FILE` | Show the last commit associated with each line. |
| `git diff main...BRANCH` | Compare branch changes since the common ancestor. |
| `git log main..BRANCH` | List commits reachable from the branch but not from `main`. |
| `git check-ignore -v FILE` | Explain which ignore rule matches a file. |

Useful GitHub CLI lookups: `gh issue list`, `gh pr list`, `gh pr view --web`, `gh pr checks`, and `gh run list`.

## Troubleshooting and revision challenges

| Problem | What to do |
| --- | --- |
| `not a git repository` | Enter the project root; check `pwd` and `git status`. |
| `Author identity unknown` | Set repository-local `user.name` and `user.email`. |
| Nothing to commit | Check you saved the file, staged it, and are on the intended branch. |
| `remote origin already exists` | Inspect `git remote -v`; if incorrect, use `git remote set-url origin REPOSITORY_URL`. |
| Authentication failed | Check `gh auth status`, the selected account, remote URL, and repository permissions. |
| Push rejected / non-fast-forward | Fetch and inspect remote changes; integrate them before pushing. Do not immediately force-push. |
| `pull --ff-only` refuses | Histories diverged. On your own unpushed work, `git pull --rebase` may be appropriate; otherwise follow the project's merge policy. |
| Cannot switch because local edits would be overwritten | Commit or stash them first. |
| File stays tracked after adding `.gitignore` | Ignore rules do not untrack existing files. `git rm --cached FILE` untracks it while keeping the local file; commit the change. |
| Frozen install fails in CI | Run `pnpm install` locally with the intended pnpm version, review, then commit the updated manifest and lockfile together. |
| Vite reports an unsupported Node version | Switch to Node 24.x, reinstall dependencies if needed, and retry. |

`.gitignore` does not remove secrets from earlier commits. If a real credential was published, revoke or rotate it immediately; deleting the file in a later commit leaves earlier history intact.

When an editor opens: in Nano, **Ctrl+O**, **Enter** saves, and **Ctrl+X** exits. In Vim, **Esc**, `:wq`, **Enter** saves and exits.

Try these without looking up the answer first:

- [ ] Explain why staging a file twice can change the next commit.
- [ ] Predict which files `git commit -am` will miss.
- [ ] Create a branch that adds a reset-counter button, then open a PR.
- [ ] Create a conflict and resolve it with a third, combined version.
- [ ] Stash both a tracked edit and a new untracked file.
- [ ] Choose between restore, amend, reset, and revert for four different mistakes.
- [ ] Explain why `fetch` does not change your browser's running app.
- [ ] Explain what changes after squash merging compared with a normal merge.
- [ ] Break an import on a new branch and observe a failed Actions build; fix it with another commit.
- [ ] Recover the removed practice commit using the reflog.

## Keep this guide in GitHub

Save this document as **`GIT_GITHUB_REVISION.md`** in the repository where you want to keep your notes. Commit it through your normal branch/PR workflow. For a personal notes repository where direct pushes to `main` are allowed:

```bash
git switch main
git pull --ff-only
git add GIT_GITHUB_REVISION.md
git commit -m "Add Git and GitHub revision guide"
git push
```

## Official references

- [Git reference](https://git-scm.com/docs) and [free Pro Git book](https://git-scm.com/book/en/v2)
- [Git restore](https://git-scm.com/docs/git-restore), [reset](https://git-scm.com/docs/git-reset), and [revert](https://git-scm.com/docs/git-revert)
- [Git rebase](https://git-scm.com/docs/git-rebase), [stash](https://git-scm.com/docs/git-stash), and [reflog](https://git-scm.com/docs/git-reflog)
- [GitHub: add locally hosted code](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github)
- [GitHub: commit email settings](https://docs.github.com/en/account-and-profile/how-tos/email-preferences/setting-your-commit-email-address)
- [GitHub: pull requests](https://docs.github.com/en/pull-requests)
- [GitHub CLI manual](https://cli.github.com/manual/) and [installation](https://github.com/cli/cli#installation)
- [Node.js downloads](https://nodejs.org/en/download)
- [pnpm installation](https://pnpm.io/installation) and [continuous integration](https://pnpm.io/continuous-integration)
- [Vite getting started](https://vite.dev/guide/)
- [Actions checkout](https://github.com/actions/checkout), [setup-node](https://github.com/actions/setup-node), and [pnpm/action-setup](https://github.com/pnpm/action-setup)
