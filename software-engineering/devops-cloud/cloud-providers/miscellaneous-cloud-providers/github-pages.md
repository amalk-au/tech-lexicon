# Github Pages

[Back to the topic index](../README.md)

## Deploy React App to Github Pages

- Install Github pages: `npm install --save-dev gh-pages`
- Make sure vite.config.js is configured with:
  `export default defineConfig({ base: '/<your-repo-name>/', plugins: [react()],})` Normally this should work. If it doesn't work make sure to put the correct domain name otherwise you will get CORS errors. i.e. if the github account is configured with a custom domain use it other wise use your github username `base: 'https://<your-username>.github.io/<your-repo-name>/')`
- Add Deployment Scripts to package.json (predeploy: runs npm run build before deploying | deploy: pushes the built dist folder to the gh-pages branch)
  `"scripts": {"predeploy": "npm run build",  "deploy": "gh-pages -d dist"}`
- Make sure your .gitignore does not ignore the dist/ folder if you're using git subtree.
  However, if you're using the gh-pages package (as shown above), this step is not necessary — gh-pages doesn't require committing dist/
- Build and Deploy to GitHub Pages, This builds the app and Publishes the dist/ folder to the gh-pages branch : `npm run deploy`
- GitHub Settings : On your repo: Go to Settings → Pages then Choose the source as gh-pages branch → /(root)

### Alternative : Using git subtree manually instead of gh-pages package

Only do this if you're not using the gh-pages npm package.If you want to push manually using git subtree:
`npm run build `
`git add dist`
`git commit -m "Initial dist subtree commit"`
`git subtree push --prefix dist origin gh-pages`


[Back to Main Index](../../../../README.md)