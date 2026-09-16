# Git/Github Workflow

[Back to Git topic index](./README.md)

## Git clone

- Is a command for downloading existing source code from a remote repository (like Github, for example). Git clone basically makes an identical copy of the latest version of a project in a repository and saves it to your computer. There are a couple of ways to download the source code,
- Clone using SSH: `git clone git@github.com:1Amal/python-webapp-https-amaldevelops.pythonanywhere.com.git`
- Clone using HTTPS: `git clone git@github.com:1Amal/python-webapp-https-amaldevelops.pythonanywhere.com.git`
- When the repo is cloned between Windows and Linux/Unix machines.Just tell git to ignore filemode change. Here are several ways to do so:
- Config ONLY for current repo: `git config core.filemode false`
- Config globally: `git config --global core.filemode false Add in ~/.gitconfig: [core] filemode = false`

## Working With Branches

- Create a new branch in Git: First check your current branch using git branch. Then, create and switch to a new branch with git checkout -b [new-branch-name]. If you want to push the new branch to the remote repository, use git push -u origin [new-branch-name]. To switch back to the main branch or any other branch, run git checkout main (or the branch name you wish to switch to).Working With Branches, Long Version below:
- Make a new branch and change to it with the command `git checkout -b [branch name]`
- Push this new branch to your remote repo with the command `git push origin [branch name]`
- You can check current branch, with the `git branch` command. The branch you are currently on will have an (\*)asterisk next to it.
- Now you’re all set to work on your new feature! Note: You can add files, commit to this branch, and push changes to your repo, just like you would with the main branch. Everything is the same except when you push the changes, you’d use `git push origin [New Branch Name]` instead of git push origin main, since we’re pushing to our new branch.
- To merge the changes from our New branch back to our main branch; Checkout the branch we want to merge INTO i.e. main with the command git checkout main. Now let’s merge our [new branch] into [`main`], our current branch, with git merge [new branch].
- If everything goes fine, new branch is now successfully merged with main! Use git log and you’ll see all the commits you’ve made to your new branch on top of the commits you made to the main branch.
- To push main branch into our remote repo by running git push origin main.
  Go to your GitHub repo and you’ll see that our main branch will have all the changes and commits you made to the [new branch] Now that we have all our code in the main branch, we don’t really need our [new branch] branch anymore. Let’s do some cleanup, both locally and in the remote repo.
- Delete the branch from our local repo with git branch -d [new branch name] and also delete it from the remote repo on GitHub with git push origin --delete [new branch name]

## GitHub Pages

- Remove the 'dist' directory from the project’s .gitignore file.
- Make sure git knows about your subtree (the subfolder with your site) `git add dist && git commit -m "Initial dist subtree commit"`
- Use subtree push to send it to the gh-pages branch on GitHub. `git subtree push --prefix dist origin gh-pages` Boom. If your folder isn’t called dist, then you’ll need to change that in each of the commands above.
- By adding this to the packages.json, you can simply push the commit to both the main branch and the gh-pages branch (Git Hub pages will be served from gh-pages branch) `"scripts": {"gh-pages": "git subtree push --prefix dist origin gh-pages && git push"}`
- To Push to Github pages : `npm run gh-pages`
