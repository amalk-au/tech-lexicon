# Git Best Practices

[Back to Git topic index](./README.md)

## Work in Branches (Even on your own)

Don't always code directly on the main branch. Use a "Feature Branch" workflow.

1. Create a branch for a new idea: git checkout -b feature/dark-mode

2. Code and commit your changes there.

3. Merge it back into main once it’s perfect.

Why this is better for your portfolio?

- This prevents you from "breaking" your live website while you are experimenting with new code.

- Clean History: It keeps your main timeline clean.

- Shows Intent: Each feature branch (e.g., feature/add-contact-form) tells a story of what you were working on.

- Safety: If you try a new CSS layout in a branch and hate it, you just delete the branch. Your live site stays perfect.

## The "GitHub Flow" Strategy

In this model, the main branch is always "production-ready." You never work directly on it.
Even if you are the only one on the project, always use Pull Requests. It creates a "paper trail" of your thought process.

Pro-tip: When you open a PR, write a description. Explain what you changed and why. If someone clicks into your "closed" PRs, they’ll see someone who documents their work clearly.

Instead of keeping a permanent develop branch, you treat your main branch as the stable "Production" version of your site and use temporary branches for everything else.

1. Create a branch from main for a specific task.

2. Commit your changes to that branch.

3. Open a Pull Request (PR) on GitHub to merge it back to main.

4. Merge and delete the branch.

### Step-by-Step: How to do a "GitHub Flow" the right way

1. Start on main: `git checkout main` and `git pull` (ensure you have the latest).

2. Create a branch: `git checkout -b feature/about-me-section` i.e. to create feature/about-me-section branch

3. Code & Commit: Do your work, committing as you go.

4. Push to GitHub: `git push origin feature/about-me-section`

5. Open a Pull Request (PR): Go to GitHub and open a PR from your feature branch into main.

6. Self-Review: Look at your own code in the "Files Changed" tab. This is where you'll spot typos before they go live!

7. Merge & Delete: Merge the PR on GitHub, then delete the feature branch.

8. Delete branch, step 1, Delete on GitHub (The Remote) :
   After you click the green "Merge Pull Request" button on GitHub, a purple status box will appear saying "Pull request successfully merged and closed." Right there, you will see a button that says Delete branch. Click it. GitHub will remove the feature/about-me-section branch from its servers. Note: You can also go to your Repository Settings and toggle "Automatically delete head branches" so GitHub does this for you every time you merge.

9. Delete branch, step 2, Delete branch from Your Computer : Even though you deleted it on GitHub, your computer still has its own copy of that branch. You need to tell your computer to "tidy up" its local list.

- Switch back to your main branch : `git checkout main`
- Update your local main with the new code you just merged on GitHub
  `git pull origin main`
- Delete the local feature branch : `git branch -d feature/about-me-section`
- If you don't do step 2, your computer will keep a list of branches that no longer exist on the server. If you run git branch, you might see 50 branches, making it very hard to find the one you are actually working on today.

- What if I make a mistake and delete a branch too early? Don't panic! On GitHub: If you just deleted it, there is usually a "Restore branch" button that appears immediately. Remember, the commits are still part of your history. As long as you merged them into main, the work is safe. You can't "accidentally" delete the work you just merged.

## Professional Branch Naming

Use kebab-case (all lowercase with hyphens).

- `feature/` | Purpose: New sections or functionality | example: `feature/add-contact-form`
- `fix/` | Purpose: Fixing a bug or alignment issue | example: `fix/mobile-nav-overlap`
- `style/`| Purpose: Purely visual/CSS changes | example: `style/update-brand-colors`
- `refactor/` | Purpose: Cleaning up code without changing features | example: `refactor/modularize-js`
- `docs/`| Purpose: Updating README or comments | example: `docs/update-install-guide`

## Git Best Practices Summary

- Delete Merged Branches: Don't leave 50 "zombie" branches in your repo. Once a branch is merged into main, delete it. You can set GitHub to do this automatically in Settings > General > Pull Requests.

- Pull Before You Branch: Before starting new work, always run git checkout main and git pull origin main to ensure you are starting from the absolute latest version.

- Squash and Merge: On your own project, "Squash and Merge" is a great setting. It takes all your small "typo fix" commits on a branch and turns them into one clean, professional commit on the main timeline.

## When to use a "Development" Branch

If you decide to add a complex backend later or want to experiment with a massive redesign that might take weeks, you can add a develop branch.

- main = The site everyone sees.
- develop = Where you merge your features first to test them together.
- You are building a complex web app (not just a static portfolio) where you need to integrate multiple large features before "releasing" them to the public.
- You have a staging environment (e.g., dev.amalk.au) where you test code before it goes live.

## Atomic Commits

Avoid the "giant commit" (e.g., one commit with 50 changed files called "finished site"). Instead, commit every time you finish a small, logical piece of work.

Bad:

`git commit -m "added everything"`

Good:

```

git commit -m "feat: add responsive navigation bar"

git commit -m "fix: mobile alignment on project cards"

git commit -m "docs: update resume link and contact info"
```

## Use Conventional Commits

Professional teams use a specific prefix for their messages.
`feat`: A new feature (e.g., adding a contact form).

`fix`: A bug fix (e.g., fixing a broken link).

`style`: Changes that don't affect code logic (e.g., CSS formatting, whitespace).

`refactor`: Changing code to make it cleaner without changing what it does.

`docs`: Changes to the README or documentation.

## Create a Professional .gitignore

Don't upload "garbage" files to your repo. Even for a static site, create a .gitignore file in your root folder and add these common entries:

```Plaintext

# OS generated files
.DS_Store
Thumbs.db

# Editor folders
.vscode/
.idea/

# Local environment files (if you use them later)
.env
```

## Leverage the README.md

The README is the "cover" of your book. For a portfolio, it should include:

- A Screenshot or GIF of the site.

- The Tech Stack: (e.g., "Built with Vanilla HTML/CSS/JS, Hosted on GitHub Pages, Managed via Cloudflare").

- Links: A clear link to the live URL (amalk.au).

- Purpose: A one-sentence summary of why you built it.

## Protect your "Main" Branch

Once your site is live, go to your GitHub repository Settings > Branches and add a protection rule for main. This prevents you from accidentally deleting your live site or force-pushing something that breaks it.

## The "GitHub Pages" Deploy Workflow

If you are using a custom domain, remember that GitHub Pages typically deploys from the main branch.

Warning: If you use a tool like Vite or a static site generator later, you will need to push the build folder (usually dist or docs) to GitHub. For a plain HTML/CSS site, your root folder is fine.
