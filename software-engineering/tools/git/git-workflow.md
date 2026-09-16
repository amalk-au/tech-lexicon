# Git & GitHub Workflow

[Back to Git topic index](./README.md)

## Overview

Git manages your local repository history. GitHub hosts the remote repository and provides collaboration features such as pull requests, reviews, and CI/CD.

Typical workflow:

```text
Create branch
      ↓
Make changes
      ↓
Commit changes
      ↓
Push branch
      ↓
Open Pull Request
      ↓
Review + CI checks
      ↓
Merge into main
      ↓
Delete branch
```

---

# 1. Daily Git Workflow

## Check repository status

```bash
git status
```

Shows:
- Modified files
- Staged files
- Current branch
- Untracked files

---

## Stage changes

Stage a specific file:

```bash
git add file.js
```

Stage all changes:

```bash
git add -A
```

---

## Commit changes

```bash
git commit -m "Add user authentication"
```

A commit creates a checkpoint in Git history.

Good commits are:
- Small
- Focused
- Descriptive

Examples:

```text
Add login form validation
Fix navbar mobile layout
Update database migration
```

---

## Push changes

```bash
git push
```

Uploads commits to the remote repository.

---

# 2. Repository Setup

## Check remote repositories

```bash
git remote -v
```

Example:

```text
origin git@github.com:user/project.git
```

---

## Clone repositories

SSH:

```bash
git clone git@github.com:user/repository.git
```

HTTPS:

```bash
git clone https://github.com/user/repository.git
```

---

## Configure `.gitignore`

`.gitignore` prevents files from being tracked.

Example:

```gitignore
# Environment variables
.env

# Dependencies
node_modules/

# Logs
*.log

# Build output
dist/
```

---

# 3. Branch Workflow

Branches isolate work so changes can be developed safely.

## Create a feature branch

Modern syntax:

```bash
git switch -c feature/login
```

Equivalent older syntax:

```bash
git checkout -b feature/login
```

---

## List branches

Local branches:

```bash
git branch
```

All branches:

```bash
git branch -a
```

---

## Switch branches

```bash
git switch main
```

or:

```bash
git checkout main
```

---

## Push a new branch

```bash
git push -u origin feature/login
```

`-u` sets the upstream branch so future:

```bash
git push
git pull
```

work without specifying the remote branch.

---

# 4. Professional Feature Branch Workflow

Start from an updated main branch:

```bash
git switch main
git pull origin main
```

Create a feature branch:

```bash
git switch -c feature/navbar
```

Work:

```bash
git add -A
git commit -m "Add responsive navbar"
```

Push:

```bash
git push -u origin feature/navbar
```

Create a Pull Request on GitHub.

---

# 5. Pull Requests

Recommended GitHub workflow:

```text
feature branch
       |
       |
       ↓
Pull Request
       |
       ↓
Code review
       |
       ↓
CI checks
       |
       ↓
Merge into main
```

Common merge strategies:

## Squash and merge

Combines all PR commits into one commit.

Example:

Before:

```text
A---B---C---D---E---F
```

After:

```text
A---B---C---S
```

Best for:
- Feature branches
- Keeping main history clean

---

## Rebase and merge

Keeps individual commits but creates a linear history.

Before:

```text
A---B---C
     \
      D---E
```

After:

```text
A---B---C---D'---E'
```

Best when commits are meaningful.

---

## Merge commit

Preserves branch history.

```text
A---B---C------M
        \     /
         D---E
```

Best for:
- Long-running branches
- Release branches

---

# 6. Syncing Changes

## Fetch

```bash
git fetch
```

Downloads remote changes without applying them.

Useful when you want to inspect changes first.

---

## Pull

```bash
git pull
```

Equivalent to:

```bash
git fetch
git merge
```

Downloads and merges remote changes.

---

## Update your feature branch

Before starting work:

```bash
git switch main
git pull

git switch feature/login
git merge main
```

or:

```bash
git rebase main
```

Rebase keeps a cleaner history.

---

# 7. Comparing Changes

## Unstaged changes

```bash
git diff
```

---

## Specific file

```bash
git diff index.html
```

---

## Word-level comparison

```bash
git diff --color-words index.html
```

---

## Staged changes

```bash
git diff --staged
```

---

## Compare branches

```bash
git diff main feature/login
```

---

# 8. Undo Changes

## Revert a commit (recommended)

```bash
git revert <commit-hash>
```

Creates a new commit that reverses another commit.

Use when:
- Commit is already pushed
- Working on shared branches

---

## Discard local file changes

```bash
git restore filename
```

---

## Unstage a file

```bash
git restore --staged filename
```

---

# 9. Temporary Changes (Stash)

Save unfinished work:

```bash
git stash
```

Restore later:

```bash
git stash pop
```

Useful when you need to quickly switch branches.

---

# 10. Commit History

Compact history:

```bash
git log --oneline
```

Detailed history:

```bash
git log
```

Visual branch history:

```bash
git log --oneline --graph --all
```

---

# 11. Branch Cleanup

Delete local branch:

```bash
git branch -d feature/login
```

If using **Squash and Merge**, Git may not detect it as merged:

```bash
git branch -D feature/login
```

Delete remote branch:

```bash
git push origin --delete feature/login
```

Remove stale remote references:

```bash
git fetch --prune
```

---

# 12. File Permission Issues

If Linux/Windows causes permission-only changes:

Current repository:

```bash
git config core.filemode false
```

Global:

```bash
git config --global core.filemode false
```

---

# 13. GitHub Pages Deployment

For frontend builds using `dist`:

Remove `dist` from `.gitignore`.

Build:

```bash
npm run build
```

Deploy:

```bash
git add dist
git commit -m "Deploy website"
git subtree push --prefix dist origin gh-pages
```

Package script:

```json
{
  "scripts": {
    "deploy": "git subtree push --prefix dist origin gh-pages"
  }
}
```

Run:

```bash
npm run deploy
```

---

# 14. Releases and Tags

Create a version tag:

```bash
git tag v1.0.0
```

Push tags:

```bash
git push origin --tags
```

Useful for:
- Releases
- Production versions
- Deployment tracking

---

# 15. Recommended Professional Practices

## Branch naming

Examples:

```text
feature/user-auth
feature/payment-flow
bugfix/login-error
hotfix/security-patch
```

---

## Commit messages

Prefer:

```text
Add password reset flow
Fix mobile navigation issue
Update API validation
```

Avoid:

```text
changes
fix
update stuff
```

---

## Team practices

- Never commit directly to `main`.
- Use pull requests.
- Require code reviews.
- Run tests before merging.
- Keep commits focused.
- Keep branches short-lived.
- Pull latest changes before starting work.
- Use `.gitignore` correctly.
- Protect production branches.

---

# 16. Quick Reference

```bash
git status                    # Repository status
git add -A                    # Stage changes
git commit -m "message"       # Commit changes
git push                      # Push commits

git fetch                     # Download remote changes
git pull                      # Fetch + merge

git branch                    # List branches
git switch main               # Switch branch
git switch -c feature/name    # Create branch

git merge branch-name         # Merge branch
git rebase main               # Rebase branch

git diff                      # Show changes
git log --oneline             # View history

git stash                     # Temporarily save work
git stash pop                 # Restore work

git revert <hash>             # Safely undo commit

git branch -D branch-name     # Delete local branch
git push origin --delete name # Delete remote branch
```