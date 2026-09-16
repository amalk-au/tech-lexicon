# Git Configuration

[Back to Git topic index](./README.md)

## Setting up Git & GitHub on a new Ubuntu/Linux installation

### 1. Install Git

```bash
sudo apt update
sudo apt install git
```

After installing, verify Git was installed successfully:

```bash
git --version
```

---

### 2. Configure Git Username \& Email

Set your name (used for commits):

```bash
git config --global user.name "Amal K"
git config --global user.name     # Confirm username
```

Set your email address:

```bash
git config --global user.email "email@example.com"
git config --global user.email    # Confirm email
```

You may use your GitHub-provided noreply email, or any valid email address.

---

### 3. Generate a New SSH Key

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

For additional details on SSH keys, see the [GitHub Docs](https://docs.github.com/en/authentication/connecting-to-github-with-ssh).

---

### 4. Add Your SSH Key to the SSH Agent

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

---

### 5. Add SSH Key to Your GitHub Account

Display your public key:

```bash
cat ~/.ssh/id_ed25519.pub
```

**Copy the contents of the terminal output.**

- On GitHub: Click your profile photo → Settings.
- In the "Access" section, click **SSH and GPG keys**.
- Click **New SSH Key** and paste your key.

---

### 6. Connect Your Local Git Repo to GitHub

```bash
git remote set-url origin [your-repo-url]
```

Replace `[your-repo-url]` with the HTTPS or SSH link for your GitHub repository.

### Set VSCode as Git Commit Editor

`git config --global core.editor "code --wait"`

## How to connect local folder to new/existing GitHub repository:

- First register a project as a local Git repository the first thing you need to do is perform the following command at your project root: `git init`
- Above will create a .git folder at your project root and will allow you to start using Git in that repository.You can call origin whatever you like, really, but origin is the standard name for Git remote repositories. [Repository_Location] is the URL to your remote repository. For example, if I had a new project called reactResumeCVWebApp which I want `git remote add origin git@github.com:1Amal/reactResumeCVWebApp.git` Then `git push --set-upstream origin main` to set the default upstream branch
- Then git pull to download the github repo to local folder `git pull origin main` Most of the time you will get an error as you have different files on Github (initial repository files such as .gitignore) and different files in your local repo i.e. Vite created src, public folders and other files if so use `git pull origin main --allow-unrelated-histories`

## Renaming a GitHub Repo

- After renaming a Github repo make sure to update the Local clone to direct to correct repo URLgit remote set-url origin git@github.com:1Amal/TechLexicon.git

## Public e-mail address change

- If you get this error ! [remote rejected] main -> main (push declined due to email privacy restrictions) You can see your personal e-mail address, which is used by default for your commits in Git:
- `git config --global user.email` Find your GitHub noreply address in your GitHub's Personal Settings → Emails. It's mentioned in the description of the Keep my email address private checkbox. Usually, it starts with a unique identifier, plus your username:{ID}+{username}@users.noreply.github.com
- Change the global user e-mail address setting to be your GitHub noreply address: git config --global user.email {ID}+{username}@users.noreply.github.com
- Reset the author information on your last commit: git commit --amend --reset-author If you have multiple commits with your private e-mail address, see this answer. Now you can push the commit with the noreply e-mail address, and future commits will have the noreply e-mail address as well.
