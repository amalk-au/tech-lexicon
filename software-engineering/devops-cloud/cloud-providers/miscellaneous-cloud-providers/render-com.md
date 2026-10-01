# Render.com

[Back to the topic index](../README.md)

## Render.com for Node.js deployment

- Click add new `Web Service`
- Click `Public Git Repository` and paste the github url i.e:`https://github.com/amaldevelops/messaging-app`
- Branch - `main`
- Root Directory : `backend` (or the folder where package.json file for backend code is located)
- Build Command : `npm install`
- Pre-Deploy Command : ` `
- Start Command : `npm start`
- Auto-Deploy : `off`

### Environment Variables

- KEY : VALUE (Format of the Environment variables)
- CORS_URL :`https://www.amalk.au`
- PORT : `3000`
- DATABASE_URL=`postgresql://[User Name]:[Password]@localhost:5432/messages_web_app_db?schema=public` (Enter the URL obtained from PostgreSQL cloud provider, i.e. Neon Databases) 
JWT_SECRET_KEY=`""` (Enter if you are using JWT authentication) 
CORS_URL="" `https://www.amalk.au`(Enter the main url of the Front End)

[Back to Main Index](../../../../README.md)