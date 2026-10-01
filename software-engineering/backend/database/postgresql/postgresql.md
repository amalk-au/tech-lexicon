# PostgreSQL

## Install PostgreSQL on a Ubuntu Linux machine

[Installing PostgreSQL - The Odin Project](https://www.theodinproject.com/lessons/nodejs-installing-postgresql)

## Setting a new database

- Start the PostgreSQL shell : `psql`
- To create a database named "messages_web_app_db" (Keep the database name as short as possible but if you require to set a longer name use underscores) : `CREATE DATABASE messages_web_app_db;`

## PostgreSQL database URL Format / Connection setup

- `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA` USER: The name of your database user | PASSWORD: The password for your database user | HOST: The name of your host name (for the local environment, it is localhost) | PORT: The port where your database server is running (typically 5432 for PostgreSQL) | DATABASE: The name of the database | SCHEMA: The name of the schema inside the database | If you're unsure what to provide for the schema parameter for a PostgreSQL connection URL, you can probably omit it. In that case, the default schema name public will be used.
- Example for Local PostgreSQL installation: `DATABASE_URL="postgresql://your_user:your_password@localhost:5432/messages_web_app_db?schema=public"` DATABASE_URL should be in the .env file
- When running PostgreSQL locally on Ubuntu Linux, your user and password as well as the database name typically correspond to the current user of your OS.
- To test that the database URL is correct : `psql postgresql://your_user:your_password@localhost:5432/messages_web_app_db`

## PostgreSQL shell (psql) Commands

- Start the PostgreSQL shell : `psql`
- View the current DB's : `\l`
- Connect to a PostgreSQL database : `psql -U username -d dbname`
- To connect to the db i.e to top_users table: `\c top_users`
- List all tables in the current database : `\dt`
- Show schema (columns, types, constraints) of a table : `\d tablename`
- List all schemas : `\dn`
- List all functions : `\df`
- Quit the PostgreSQL shell : `\q`

## Postgresql create a new database

- First enter the PostgreSQL shell by running `psql` in your terminal. You can view the current dbs using the `\l` command.
- To create a new db by running from PostgreSQL shell the following SQL statement (assuming db name to be top_users):
  `CREATE DATABASE top_users;`
- `\l` again to see if the db was created.
- To connect to the db from PostgreSQL shell:
  `\c top_users`
- Verify that the PostgreSQL shell prompt should be: `top_users=#`
- Use PostgreSQL shell to create a sample table using following SQL:
  `CREATE TABLE users (id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,username VARCHAR ( 255 ),password VARCHAR ( 255 ));`
- Verify that the table has been created by running `\d` from PostgreSQL shell, you should see the table in the output if you followed above instructions.