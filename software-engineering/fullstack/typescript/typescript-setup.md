## Setup

[Back to the topic index](./README.md)

- [Official Microsoft TypeScript setup instructions](https://www.typescriptlang.org/download/)
- TypeScript can be installed through three installation routes depending on how you intend to use it: an npm module, a NuGet package or a Visual Studio Extension.
- If you are using Node.js, you want the npm version.
- Having TypeScript set up on a per-project basis lets you have many projects with many different versions of TypeScript, this keeps each project working consistently.
- TypeScript is available as a package on the npm registry available as "typescript".
- All of these dependency managers support lockfiles, ensuring that everyone on your team is using the same version of the language. You can then run the TypeScript compiler using one of the following commands: `npx tsc`

## per-project based installation

- `npm init -y` : Initialize an empty package.json
- You will need a copy of Node.js as an environment to run the package. Then you use a dependency manager like npm, yarn or pnpm to download TypeScript into your project. `npm install typescript --save-dev`

## Global installation

It can be handy to have TypeScript available across all projects, often to test one-off ideas. Long-term, codebases should prefer a project-wide installation over a global install so that they can benefit from reproducible builds across different machines.
You can use npm to install TypeScript globally, this means that you can use the tsc command anywhere in your terminal.

- `run npm install -g typescript` : This will install the latest version (currently 5.8).

## Working with TypeScript-compatible transpilers

There are other tools which convert TypeScript files to JavaScript files. You might use these tools for speed or consistency with your existing build tooling.

Each of these projects handle the file conversion, but do not handle the type-checking aspects of the TypeScript compiler. So it's likely that you will still need to keep the above TypeScript dependency around, and you will want to enable isolatedModules.

### Babel

Babel is a very popular JavaScript transpiler which supports TypeScript files via the plugin [@babel/plugin-transform-typescript](https://babeljs.io/docs/en/babel-preset-typescript#docsNav)
