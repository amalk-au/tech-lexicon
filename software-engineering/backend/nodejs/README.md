# Backend

- [Node.js Basics](./nodejs-basics.md)
- [Node.js revision](./nodejs-revision.md)
- [Node.js Event loop](./event-loop.md)
- [Express.js Basics](./expressjs-basics.md)

## Nodejs Commands

## New Installation

- Use Node.js LTS (Long-Term Support) — recommended unless you require cutting edge features in that case use the latest version (Not recommended as every six months support is discontinued [Node.js Releases](https://nodejs.org/en/about/previous-releases)). 
- [Go to Node.js official site](https://nodejs.org/en/download/current) and choose the latest version and follow the instructions on the official guide. Alternatively follow below steps which is for Node v22 LTS.
- Download and install nvm, i.e.: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash`
- Download and install Node.js: `nvm install 22`
- Verify the Node.js version: `node -v` and `nvm current`
- Verify npm version : `npm -v`

## Update Node.js

You can manage versions easily using nvm.

- `nvm ls` : List installed versions
- `nvm ls-remote` : List available versions
- `nvm install --lts` : Install the latest version of Node.js LTS (Long-Term Support)version
- `nvm use --lts` : Use the installed latest LTS (Long-Term Support) version
- `nvm --version` : Check for nvm version
- `source ~/.bashrc` : Restart a clean shell
- `nvm install 18` : Install specific version
- `nvm alias default 22` : Set default version
- `nvm use 18` : Use specific version
- `nvm uninstall 22.7.0` : Uninstall a version
- `nvm exec 22 node app.js` : Run file with specific version

### Follow these steps to set up a clean and flexible backend environment using Node.js, Express, and optional tools like Prisma, Passport, and EJS.

- Initialize an empty package.json: `npm init -y`
- Install the basic Nodejs middleware (express - Web framework to handle routes and server logic | dotenv - Loads environment variables from a .env file | cors or Cross-Origin Resource Sharing enables requests from different origins ): `npm install express dotenv cors`
- Express-validator to validate input. This package validates and sanitizes user input from forms or API requests: `npm install express-validator`
- EJS (Embedded JavaScript templates). EJS or Embedded JavaScript templates for server-side HTML is a templating engine for generating HTML using JavaScript, rendering. Only required if complex/separate front end is not required i.e. React/Vite: `npm install ejs`
- pg or PostgreSQL client for Node.js to connect and query the database, Recommended to use Prisma ORM: `npm install pg`
- Prisma ORM for PostgreSQL database setup, Please refer the Prisma ORM setup Readme for full setup information : `npm install prisma --save-dev`
- Prisma client for PostgreSQL database interaction, Please refer the Prisma ORM setup Readme for full setup information : `npm install @prisma/client`
- express-session - Stores session data (e.g., logged-in user info) : `npm install express-session`
- passport - Authentication middleware for managing login strategies : `npm install passport passport-local`
- passport-local - Local username/password login strategy
- bcryptjs - Hashes and verifies passwords securely : `npm install bcryptjs`
- Testing Frameworks (Recommended for larger projects) :
  `npm install --save-dev jest supertest`
- Setting the CORS (Cross-Origin Resource Sharing. It's a mechanism that allows web applications running on one domain to access resources from a different domain. This is a crucial security feature that helps prevent unauthorized access to sensitive information) URL : `app.use(cors({ origin: process.env.CORS_URL}));`. Update the .env file `process.env.CORS_URL`. Without setting this to the correct front end URL you will get CORS errors in the browser.

## Authentication using JWT (Without using Passport.js)

- Install jsonwebtoken package : `npm install jsonwebtoken`
- Refer the Authenticator.js for authentication functions. `createJWT` custom middleware will create a JWT token that can be sent as JSON via an API END Point. When authenticating routes custom middleware `authenticateJWT` can be used.
- To Protect a route add `authenticateJWT` middleware before all the other middleware that needs to be protected E.g: `mainRouter.get("/messaging-api/v1/contacts", authenticateJWT, getAllContacts);`
- Client will need to save the token received as JSON in the browser local storage in the front end/browser
- When authorizing routes with JWT token will need to be sent as an "Authorization" Headers
- It is required to use format under HTTP Headers `Authorization : "Bearer <JWT>"`
- E.g : `Authorization : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NDQwOTcyOTYsImV4cCI6MTc0NDA5OTA5Nn0.PboRrhU7xFTzQUltX_ZA59eWs-pxXfH8JHC_tU7jIKA"`


[Back to Main Index](../../../topics-index.md)