# Git

[Back to Git topic index](./README.md)

## Basics

- `git status` : command gives us all the necessary information about the current branch.
- `git add` : We need to use the git add command to include the changes of a file(s) into our next commit.
- `git add [filename]` : To add a single file
- `git add -A` : To add all files in repo at once
- `git commit` : Is like setting a checkpoint in the development process which you can go back to later if needed. `git commit -m "commit message"` if you want to write a short message to explain what we have developed or changed in the source code.
- `git push` : After committing your changes, the next thing you want to do is send your changes to the remote server. Git push uploads your commits to the remote repository.
- `git push [remote][branch-name]`
- `git push --set-upstream [remote] [name-of-your-branch]` : However, if your branch is newly created, then you also need to upload the branch with the following command:

- `git push -u origin [branch_name]` : alternatively you can also use:
- `git pull` : command is used to get updates from the remote repo. This command is a combination of git fetch and git merge which means that, when we use git pull, it gets the updates from remote repository (git fetch) and immediately applies the latest changes in your local (git merge).
- `git pull [remote]`
- `git log -- oneline` : To see our commit history
- `.gitignore` : Git can specify which files or parts of your project should be ignored by Git using a .gitignore file. Step 1: touch .gitignore Step 2: # text comment | name All name files, name folders, and files and folders in any name folder | name/ Ending with / specifies the pattern is for a folder. Matches all files and folders in any name folder For more information go to : Git Ignore
- `git revert` : A safer way that we can undo our commits is by using git revert. We just need to specify the hash code next to our commit that we would like to undo:
  git revert 3321844
  The Git revert command will undo the given commit, but will create a new commit without deleting the older one: The advantage of using git revert is that it doesn't touch the commit history. This means that you can still see all of the commits in your history, even the reverted ones. Another safety measure here is that everything happens in our local system unless we push them to the remote repo. That's why git revert is safer to use and is the preferred way to undo our commits.
- `git pull origin main` : Update local copy with the remote copy
- `git fetch` : Use git fetch to retrieve new work done by other people. Fetching from a repository grabs all the new remote-tracking branches and tags without merging those changes into your own branches.
- `git diff` : Show you all of your local changes since you last committed.
- `git diff index.html` : To check what changes made to a certain file simply add the path of a file as an option
- `git diff --color-words index.html` : this option shows a more concise view
- `git diff --staged index.html` : Staged changes in a certain file
- `git diff --staged` : Staged changes in all local files
- `git diff main (NAME OF OTHER BRANCH)` : It's also possible to compare two branches to each other. This helps you find out how exactly the code in both branches is different:
  git diff main feature/login index.html : Compare a certain file in two different branches. You can do this simply by adding the file's path: This will show you how the file "index.html" was changed in the feature/login branch, compared to how it looks in the main branch.
- `git remote update origin --prune` : To update the local list of remote branches
- `git branch -a` : To show all local and remote branches that (local) Git knows about
- `git checkout dev` : When you've completed development in your branch and everything works fine, the final step is merging the branch with the parent branch (dev or master). This is done with the git merge command. Git merge basically integrates your feature branch with all of its commits back to the dev (or master) branch. It's important to remember that you first need to be on the specific branch that you want to merge with your feature branch. For example, when you want to merge your feature branch into the dev branch. First you should switch to the dev branch:
- `git fetch` : Before merging, you should update your local dev branch
- `git merge [branch-name]` : Finally, you can merge your feature branch into dev
- `git remote -v` : Check the fetch and push locations
- `git config --global user.email "email@example.com"` : Set an email address in Git. You can use your GitHub-provided noreply email address or any email address.

## Links

- [Git Handbook](https://git-scm.com/book/en/v2)
