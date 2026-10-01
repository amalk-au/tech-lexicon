# Neon.tech

[Back to the topic index](../README.md)

## Neon.tech for PostgreSQL database deployment

- Click "New Project"
- Project name : `Enter the project name`
- Postgres version : `17`
- Database name : `Enter same as project name`
- Cloud service provider : `AWS`
- Region : `AWS Asia Pacific 2 (Sydney)`
- Click "Create"
- After project is created on `Project Dashboard` click `Connect to your database`
- Click "Show Password" and select `connection string` and copy the string (Make sure this is not published to github and save this as an environment variable i.e. DATABASE_URL)
- In the your local project in the .env save the connection string in `DATABASE_URL` so when Prisma is running it knows the correct URL of the database. Also save this in your Node app host i.e render so it can connect to the database.
- In you local project open terminal in the Prisma installation folder and migrate schema to Neon `npx prisma migrate dev --name init`. This will setup the newly created database schema in neon database.
- If you have a sample data seed you can run it now : `node src/prisma/SeedSampleData.js` Make sure when you run this that you are running from the root file where package.json and .env is located otherwise you will get errors.

[Back to Main Index](../../../../README.md)