# Prisma ORM revision: learn by doing

A practical reference for **pnpm, Ubuntu, PostgreSQL, and TypeScript**. Build a small blog database, run queries, change the schema, and repeat the exercises.

**Version target:** Prisma ORM **7.10.0**, Node.js **24 LTS**, TypeScript **5.9**. The Prisma packages below use the same exact version. Commit `pnpm-lock.yaml` to preserve the resolved dependencies.

**Version note, checked 1 October 2026:** Prisma 8 is a release candidate with a different API; this guide deliberately uses the supported Prisma 7 API. Keep the pinned versions when following it. See the official [release status](https://www.prisma.io/docs/orm/release-status).

All identities and credentials below are fictional, local practice values. Use this project with an empty practice database.

## Contents

- [1. What Prisma does](#1-what-prisma-does)
- [2. Set up PostgreSQL on Ubuntu](#2-set-up-postgresql-on-ubuntu)
- [3. Create the pnpm project](#3-create-the-pnpm-project)
- [4. Define the database schema](#4-define-the-database-schema)
- [5. Configure Prisma and create the client](#5-configure-prisma-and-create-the-client)
- [6. Seed and run the project](#6-seed-and-run-the-project)
- [7. Query exercises](#7-query-exercises)
- [8. Change the schema with a migration](#8-change-the-schema-with-a-migration)
- [9. Bonus: compound keys with bookmarks](#9-bonus-compound-keys-with-bookmarks)
- [10. Command cheat sheet](#10-command-cheat-sheet)
- [11. Common mistakes and troubleshooting](#11-common-mistakes-and-troubleshooting)
- [12. Revision challenges](#12-revision-challenges)
- [13. Official references](#13-official-references)

## 1. What Prisma does

| Piece | Purpose |
| --- | --- |
| `schema.prisma` | Describes models, fields, constraints, and relationships. |
| Prisma Migrate | Produces SQL migration files and applies them to the database. |
| Prisma Client | Provides a query API and TypeScript types generated from the schema. |
| Prisma Studio | Opens a browser UI for inspecting and editing database records. |
| PostgreSQL | Stores the actual data and enforces database constraints. |

The usual workflow is **edit schema → create/apply migration → generate client → query**. Generating the client changes your application code; it does not create database tables.

This lab has four models:

| Relationship | Meaning | How it is represented |
| --- | --- | --- |
| `User` → `Post` | One user can write many posts. | `Post.authorId` is a foreign key. |
| `User` → `Profile` | A user can have one profile. | `Profile.userId` is unique. |
| `Post` ↔ `Tag` | A post can have many tags; a tag can label many posts. | Prisma manages an implicit join table. |

## 2. Set up PostgreSQL on Ubuntu

You need Node.js 24 LTS and pnpm installed. Check them:

```bash
node --version
pnpm --version
```

Install PostgreSQL from Ubuntu's package repositories and start the service:

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl enable --now postgresql
```

Create a dedicated practice role and database. Run this **once**:

```bash
sudo -u postgres psql <<'SQL'
CREATE ROLE prisma_lab WITH LOGIN PASSWORD 'local_only_password' CREATEDB;
CREATE DATABASE prisma_lab OWNER prisma_lab;
SQL
```

`CREATEDB` allows Prisma Migrate to create its temporary **shadow database**, used to check migration history. This is a local development role; production migration permissions should be configured separately.

Verify the connection; enter `local_only_password` when prompted:

```bash
psql -h 127.0.0.1 -U prisma_lab -d prisma_lab -W \
  -c 'SELECT current_database();'
```

Expected database name: `prisma_lab`. If PostgreSQL is already installed, use an empty database and a role with the required development permissions instead.

## 3. Create the pnpm project

Run all later commands from this project's root directory:

```bash
mkdir prisma-orm-lab
cd prisma-orm-lab
pnpm init

pnpm add --save-exact @prisma/client@7.10.0 @prisma/adapter-pg@7.10.0 pg@8 dotenv@17
pnpm add -D --save-exact prisma@7.10.0 typescript@5.9 tsx@4 @types/node@24 @types/pg@8

pnpm exec prisma init --datasource-provider postgresql --output ../src/generated/prisma
mkdir -p src
```

| Package | What it does |
| --- | --- |
| `prisma` | Runs schema, migration, generation, and Studio commands. |
| `@prisma/client` | Supplies the Prisma Client runtime. |
| `@prisma/adapter-pg`, `pg` | Connect Prisma Client to PostgreSQL. |
| `dotenv` | Loads environment variables from `.env`. |
| `typescript`, `tsx` | Check TypeScript and run `.ts` files directly. |
| `@types/node`, `@types/pg` | Supply types for Node.js and PostgreSQL's driver. |

Prisma 7.10 normally creates `prisma7.config.ts`. This guide uses that filename. If initialization created `prisma.config.ts`, rename it:

```bash
if [ -f prisma.config.ts ]; then
  mv prisma.config.ts prisma7.config.ts
fi
```

Keep a single Prisma config file. Prisma 7.10 discovers `prisma7.config.ts` automatically.

### Configure `package.json`

Keep the dependencies installed by pnpm. Set these top-level values and replace the `scripts` object:

```json
{
  "type": "module",
  "private": true,
  "scripts": {
    "lab": "tsx src/lab.ts",
    "check": "tsc --noEmit",
    "db:migrate": "prisma migrate dev",
    "db:generate": "prisma generate",
    "db:seed": "prisma db seed",
    "db:studio": "prisma studio"
  }
}
```

This is a **fragment to merge**, not a replacement for the entire file. `type: module` enables ES modules; `tsx` runs the examples without a build step.

### Create `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noEmit": true,
    "types": ["node"]
  },
  "include": ["src/**/*.ts", "prisma/**/*.ts", "prisma7.config.ts"]
}
```

`strict` catches type mistakes. These settings are for execution through `tsx`; they are not a configuration for emitting JavaScript and running it directly with `node`.

### Create `.env.example` and `.env`

Put this in `.env.example`:

```dotenv
# Fictional credentials for the local practice database only.
DATABASE_URL="postgresql://prisma_lab:local_only_password@127.0.0.1:5432/prisma_lab?schema=public"
```

Copy it to the local environment file:

```bash
cp .env.example .env
```

The URL identifies the role, password, host, port, database, and schema. Percent-encode special characters if you replace the sample password with one containing URL-reserved characters.

### Add to `.gitignore`

Preserve any entries created by `prisma init`, and add:

```gitignore
node_modules/
src/generated/prisma/
dist/
.env
.env.*
!.env.example
```

Commit `.env.example`, schema/config files, source files, migrations, and `pnpm-lock.yaml`. Keep actual credentials out of Git.

## 4. Define the database schema

Replace `prisma/schema.prisma` with:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

enum Role {
  USER
  ADMIN
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  posts     Post[]
  profile   Profile?
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String
  userId Int    @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Post {
  id        Int      @id @default(autoincrement())
  slug      String   @unique
  title     String
  content   String?
  published Boolean  @default(false)
  views     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id], onDelete: Restrict)
  tags      Tag[]

  @@index([authorId])
  @@index([published, id])
}

model Tag {
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts Post[]
}
```

### Schema syntax to remember

| Syntax | Meaning in this lab |
| --- | --- |
| `@id` | Primary key. |
| `@default(autoincrement())` | Database generates the integer ID. |
| `@unique` | Duplicate values are rejected by the database. |
| `String?` | Optional field; stored as `NULL` when absent. |
| `Post[]` | Relation to multiple posts; not a column containing an array of posts. |
| `@default(now())` | Sets the initial creation timestamp. |
| `@updatedAt` | Prisma maintains this timestamp on updates through Prisma Client. |
| `@relation(fields: [authorId], references: [id])` | `authorId` references `User.id`. |
| `@@index(...)` | Adds a database index; does not enforce uniqueness. |
| `onDelete: Cascade` | Deleting a user also deletes that user's profile. |
| `onDelete: Restrict` | A user with posts cannot be deleted until those posts are handled. |

`author` is a Prisma relation field; `authorId` is the actual foreign key column. The unique `Profile.userId` makes that relationship one-to-one. Use an explicit join model when a many-to-many relationship needs extra fields, such as `addedAt`.

## 5. Configure Prisma and create the client

### Replace `prisma7.config.ts`

```ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
```

This config tells the CLI where the schema and migrations live, how to run the seed script, and which database to use. In Prisma 7, the connection URL belongs here rather than in `schema.prisma`.

### Create `src/db.ts`

```ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing. Create .env before running the lab.");
}

const adapter = new PrismaPg({ connectionString });

export const prisma = new PrismaClient({ adapter });
```

The PostgreSQL adapter supplies the connection pool. The generated import path matches the schema's `output`; run `prisma generate` before importing it.

Create the tables and generate the client:

```bash
pnpm exec prisma format
pnpm exec prisma validate
pnpm db:migrate --name init
pnpm db:generate
```

The migration command creates `prisma/migrations/<timestamp>_init/migration.sql` and applies it. In Prisma 7, generation and seeding are explicit steps.

## 6. Seed and run the project

### Create `prisma/seed.ts`

**This seed replaces every record in this practice schema.** It deletes posts before users because the author relationship uses `Restrict`. Keep `.env` pointed at `prisma_lab`.

```ts
import { prisma } from "../src/db";

async function main() {
  await prisma.$transaction(async (tx) => {
    await tx.post.deleteMany();
    await tx.profile.deleteMany();
    await tx.user.deleteMany();
    await tx.tag.deleteMany();

    await tx.tag.createMany({
      data: [{ name: "prisma" }, { name: "postgresql" }],
    });

    await tx.user.create({
      data: {
        email: "writer@example.test",
        name: "Writer",
        profile: { create: { bio: "Writes practice posts." } },
        posts: {
          create: [
            {
              slug: "prisma-basics",
              title: "Prisma basics",
              content: "Models, migrations, and queries.",
              published: true,
              views: 10,
              tags: { connect: { name: "prisma" } },
            },
            {
              slug: "postgresql-relations",
              title: "PostgreSQL relations",
              published: true,
              views: 5,
              tags: { connect: { name: "postgresql" } },
            },
            {
              slug: "draft-notes",
              title: "Draft notes",
              tags: { connect: { name: "prisma" } },
            },
          ],
        },
      },
    });

    await tx.user.create({
      data: {
        email: "editor@example.test",
        name: "Editor",
        role: "ADMIN",
        profile: { create: { bio: "Reviews practice posts." } },
        posts: {
          create: [
            {
              slug: "type-safe-queries",
              title: "Type-safe queries",
              published: true,
              views: 20,
              tags: { connect: { name: "prisma" } },
            },
            {
              slug: "migration-checklist",
              title: "Migration checklist",
              views: 2,
              tags: { connect: { name: "postgresql" } },
            },
          ],
        },
      },
    });
  });

  console.log({
    users: await prisma.user.count(),
    profiles: await prisma.profile.count(),
    posts: await prisma.post.count(),
    tags: await prisma.tag.count(),
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

The transaction makes the reset and inserts succeed or fail together. Nested `create` inserts related records; `connect` links tags that already exist.

### Create `src/lab.ts`: the exercise runner

```ts
import { Prisma } from "./generated/prisma/client";
import { prisma } from "./db";

async function main() {
  // Replace this body with ONE exercise snippet from section 7.
  const users = await prisma.user.findMany({
    select: { email: true, name: true, role: true },
    orderBy: { email: "asc" },
  });

  console.table(users);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

`Prisma` is used in the error-handling, raw-query, and type exercises. The runner reports failures and closes the pool after this short-lived script finishes.

Run the initial project:

```bash
pnpm db:seed
pnpm check
pnpm lab
```

Expected seed result:

```text
{ users: 2, profiles: 2, posts: 5, tags: 2 }
```

The lab prints the fictional Editor and Writer rows. Inspect the records visually:

```bash
pnpm db:studio
```

Open the local URL printed by Studio, then stop it with `Ctrl+C` when finished.

### How to use the exercises

1. Replace only the body of `main()` in `src/lab.ts` with one snippet.
2. Run `pnpm db:seed` to restore the baseline before each exercise.
3. Run `pnpm check`, then `pnpm lab`.
4. Change the query and predict the result before rerunning it.

IDs and timestamps can change after a reseed. These snippets use unique emails and slugs instead of assuming `id: 1`. Mutation snippets may need a reseed before a second run; read-only snippets can be rerun directly.

## 7. Query exercises

Every TypeScript snippet in this section belongs **inside `main()`**. Keep the runner's imports and cleanup code.

### A. Read: `findMany`, `findUnique`, `findFirst`

```ts
const posts = await prisma.post.findMany({
  orderBy: { id: "asc" },
});

const writer = await prisma.user.findUnique({
  where: { email: "writer@example.test" },
});

const mostViewed = await prisma.post.findFirst({
  where: { published: true },
  orderBy: [{ views: "desc" }, { id: "asc" }],
});

const missing = await prisma.user.findUnique({
  where: { email: "missing@example.test" },
});

console.table(posts);
console.log({ writer, mostViewed, missing });
```

**What it does:** Reads all five posts, finds a user by a unique field, and returns the first matching published post after sorting. The most viewed post is `type-safe-queries`; `missing` is `null`.

**Remember:** `findUnique` needs a unique selector such as `id`, `email`, or `slug`. `findFirst` accepts arbitrary filters. Their `OrThrow` variants throw when nothing matches. `findMany` returns `[]` for no matches.

**Try:** Change `published: true` to `false` and predict the top draft.

### B. Choose fields with `select`; fetch relations with `include`

```ts
const summaries = await prisma.user.findMany({
  select: {
    email: true,
    posts: { select: { slug: true, title: true } },
    _count: { select: { posts: true } },
  },
  orderBy: { email: "asc" },
});

const post = await prisma.post.findUnique({
  where: { slug: "prisma-basics" },
  include: {
    author: { select: { email: true } },
    tags: true,
  },
});

console.dir({ summaries, post }, { depth: null });
```

**What it does:** Returns selected user fields, post summaries, and relation counts; then returns a post's scalar fields plus its author and tags.

**Remember:** Relations are not included by default. Do not put `select` and `include` at the same level; nesting `select` inside `include` is valid.

**Try:** Filter the nested `posts` list to `where: { published: true }`.

### C. Create a user and related records

```ts
const created = await prisma.user.create({
  data: {
    email: "new-writer@example.test",
    name: "New Writer",
    profile: { create: { bio: "Learning nested writes." } },
    posts: {
      create: {
        slug: "first-practice-post",
        title: "First practice post",
        tags: { connect: { name: "prisma" } },
      },
    },
  },
  include: { profile: true, posts: { include: { tags: true } } },
});

console.dir(created, { depth: null });
```

**What it does:** Creates a user, profile, and post together and links an existing tag. Nested writes are atomic: failure rolls back the whole operation.

**Try:** Omit `name`. Then change the tag name to one that does not exist and observe the failure after reseeding.

### D. Insert many rows and use `upsert`

```ts
const inserted = await prisma.user.createMany({
  data: [
    { email: "reader-one@example.test", name: "Reader One" },
    { email: "reader-two@example.test", name: "Reader Two" },
  ],
  skipDuplicates: true,
});

const reader = await prisma.user.upsert({
  where: { email: "reader-one@example.test" },
  update: { name: "Returning Reader" },
  create: { email: "reader-one@example.test", name: "First-time Reader" },
});

console.log({ inserted, reader });
```

**What it does:** Inserts two users; on PostgreSQL, `skipDuplicates` skips conflicting unique values. `upsert` updates an existing unique match or creates it if missing. Here it takes the update branch.

**Remember:** `createMany` returns a count, not the inserted records. Top-level `createMany` does not perform nested relation writes. `createManyAndReturn` is available on PostgreSQL when you need the rows.

**Try:** Run twice without reseeding. The second insert count should be `0`. Change the upsert email to `reader-three@example.test` to take the create branch.

### E. Filter and sort

```ts
const posts = await prisma.post.findMany({
  where: {
    published: true,
    views: { gte: 5 },
    OR: [
      { title: { contains: "PRISMA", mode: "insensitive" } },
      { title: { contains: "queries", mode: "insensitive" } },
    ],
  },
  select: { slug: true, title: true, views: true },
  orderBy: [{ views: "desc" }, { id: "asc" }],
});

console.table(posts);
```

**What it does:** Combines published status, a numeric threshold, and either text match. Expect `type-safe-queries` and `prisma-basics`, in that order.

| Operator | Use |
| --- | --- |
| `equals`, `not` | Equality and negation. |
| `in`, `notIn` | Match or exclude values from a list. |
| `gt`, `gte`, `lt`, `lte` | Numeric or date comparisons. |
| `contains`, `startsWith`, `endsWith` | String matching. |
| `AND`, `OR`, `NOT` | Combine conditions. |
| `content: null` | Match SQL `NULL`. |

**Try:** Replace `gte: 5` with `gt: 10`. `mode: "insensitive"` enables case-insensitive matching for this PostgreSQL example.

### F. Update one, update many, and increment atomically

```ts
const updated = await prisma.post.update({
  where: { slug: "prisma-basics" },
  data: {
    title: "Prisma basics revised",
    views: { increment: 1 },
  },
});

const publishedDrafts = await prisma.post.updateMany({
  where: { published: false },
  data: { published: true },
});

console.log({ views: updated.views, publishedDrafts });
```

**What it does:** Updates one uniquely identified post, increases its views from `10` to `11`, and publishes the two drafts. `updateMany` returns `{ count: 2 }`.

**Remember:** `increment` avoids a read-then-write race for this counter. `update` throws if the record is missing; `updateMany` returns a zero count if nothing matches. `updatedAt` changes on these updates.

**Try:** Use `decrement: 1`, then filter `updateMany` to just the Writer's drafts.

### G. Delete safely and understand referential actions

```ts
const temporary = await prisma.user.create({
  data: {
    email: "temporary@example.test",
    profile: { create: { bio: "This profile will be deleted too." } },
  },
});

await prisma.user.delete({ where: { id: temporary.id } });

const remainingProfiles = await prisma.profile.count({
  where: { userId: temporary.id },
});

const removedDrafts = await prisma.post.deleteMany({
  where: { published: false },
});

console.log({ remainingProfiles, removedDrafts });
```

**What it does:** Deletes a temporary user and cascades the profile deletion; then deletes two drafts. Expect `remainingProfiles: 0` and `{ count: 2 }` for drafts.

**Remember:** The Writer still has published posts, so deleting that user would violate the `Restrict` relation. Deleting a post removes its implicit join links, not the tags themselves. An unfiltered `deleteMany()` deletes every row in that model.

**Try:** After a fresh seed, attempt to delete the Writer and inspect the foreign key error.

### H. Connect, connect-or-create, and disconnect relations

```ts
const updated = await prisma.post.update({
  where: { slug: "prisma-basics" },
  data: {
    tags: {
      connect: { name: "postgresql" },
      connectOrCreate: {
        where: { name: "typescript" },
        create: { name: "typescript" },
      },
    },
  },
  include: { tags: true },
});

const disconnected = await prisma.post.update({
  where: { slug: "prisma-basics" },
  data: { tags: { disconnect: { name: "postgresql" } } },
  include: { tags: true },
});

console.dir({ updated, disconnected }, { depth: null });
```

**What it does:** Links an existing tag, creates or links `typescript`, and then removes the PostgreSQL association. The PostgreSQL tag row still exists.

**Remember:** `connect` requires an existing record; `disconnect` removes a link. A required single relation such as `Post.author` cannot be disconnected without changing the schema.

**Try:** Replace all tag links with `tags: { set: [{ name: "prisma" }] }` in a separate update.

### I. Filter through relations

```ts
const authors = await prisma.user.findMany({
  where: { posts: { some: { published: true, views: { gte: 10 } } } },
  select: { email: true },
});

const taggedPosts = await prisma.post.findMany({
  where: {
    author: { is: { role: "USER" } },
    tags: { some: { name: "prisma" } },
  },
  select: { slug: true },
  orderBy: { slug: "asc" },
});

console.log({ authors, taggedPosts });
```

**What it does:** Finds authors with at least one popular published post, then finds posts written by a regular user and tagged `prisma`. Expect both authors; tagged slugs are `draft-notes` and `prisma-basics`.

**Remember:** List relations use `some`, `none`, or `every`; single relations use `is` or `isNot`. `every` also matches a user with zero posts. Combine it with `some: {}` if at least one post is required.

**Try:** Find users with no draft posts using `none: { published: false }`.

### J. Offset and cursor pagination

```ts
const page = 2;
const pageSize = 2;

const offsetPage = await prisma.post.findMany({
  orderBy: { id: "asc" },
  skip: (page - 1) * pageSize,
  take: pageSize,
  select: { id: true, slug: true },
});

const firstPage = await prisma.post.findMany({
  orderBy: { id: "asc" },
  take: pageSize,
  select: { id: true, slug: true },
});

const lastPost = firstPage.at(-1);
const nextPage = lastPost
  ? await prisma.post.findMany({
      orderBy: { id: "asc" },
      cursor: { id: lastPost.id },
      skip: 1,
      take: pageSize,
      select: { id: true, slug: true },
    })
  : [];

console.log({ offsetPage, firstPage, nextPage });
```

**What it does:** Fetches page two by offset and fetches a second page after the first page's final ID. `skip: 1` excludes the cursor row.

**Remember:** Use a deterministic order. Offset pagination supports numbered pages but large offsets get expensive. This cursor example uses the same unique, sequential `id` for its cursor and ordering. Cursor pagination does not freeze data against concurrent changes.

**Try:** Fetch a third page using the last ID from `nextPage`.

### K. Count, aggregate, and group

```ts
const publishedCount = await prisma.post.count({
  where: { published: true },
});

const totals = await prisma.post.aggregate({
  where: { published: true },
  _sum: { views: true },
  _avg: { views: true },
  _max: { views: true },
});

const byAuthor = await prisma.post.groupBy({
  by: ["authorId"],
  _count: { _all: true },
  _sum: { views: true },
  orderBy: { authorId: "asc" },
});

console.log({ publishedCount, totals, byAuthor });
```

**What it does:** Counts three published posts, sums their `35` views, calculates average/max, and groups all five posts by author. Writer has three posts and `15` views; Editor has two posts and `22` views.

**Remember:** `where` filters rows before grouping; `having` filters groups after aggregation. Aggregates such as `_avg` can be `null` when there are no matching rows.

**Try:** Add `where: { published: true }` to `groupBy` and compare the counts.

### L. Batch transaction: operations that do not need generated IDs

```ts
const [post, changed] = await prisma.$transaction([
  prisma.post.update({
    where: { slug: "prisma-basics" },
    data: { views: { increment: 2 } },
  }),
  prisma.user.updateMany({
    where: { email: "writer@example.test" },
    data: { name: "Writer Revised" },
  }),
]);

console.log({ views: post.views, changed });
```

**What it does:** Commits both updates together; a failure rolls back the batch. Expect `views: 12` and `{ count: 1 }`.

**Remember:** Pass Prisma query promises without awaiting each one first. Use a nested write or interactive transaction when a later operation needs an ID produced by an earlier operation.

**Try:** Change the post slug to a missing slug and verify that the Writer's name stays unchanged after the failed run.

### M. Interactive transaction and visible rollback

```ts
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({
    data: { email: "transaction@example.test", name: "Transaction Writer" },
  });

  const post = await tx.post.create({
    data: {
      slug: "transaction-post",
      title: "Created inside a transaction",
      author: { connect: { id: user.id } },
    },
  });

  return { user, post };
});

try {
  await prisma.$transaction(async (tx) => {
    await tx.user.create({ data: { email: "rollback@example.test" } });
    throw new Error("Intentional rollback");
  });
} catch (error) {
  if (!(error instanceof Error) || error.message !== "Intentional rollback") {
    throw error;
  }
  console.log(error.message);
}

const rolledBackUser = await prisma.user.findUnique({
  where: { email: "rollback@example.test" },
});

console.log({ result, rolledBackUser });
```

**What it does:** Creates a user and a post using the new user ID, then demonstrates a separate failed transaction. `rolledBackUser` is `null`.

**Remember:** Use `tx` for every query inside the callback. Keep transactions short; avoid network calls inside them. Database transactions do not roll back external actions such as emails or HTTP requests.

**Try:** Throw after creating the post in the first transaction and confirm that neither record remains.

### N. Handle a known constraint error

```ts
try {
  await prisma.user.create({
    data: { email: "writer@example.test" },
  });
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    console.log("That email already exists.");
  } else {
    throw error;
  }
}
```

**What it does:** Intentionally violates the unique email constraint and handles the expected error without hiding unrelated failures.

| Code | Common cause |
| --- | --- |
| `P2002` | A unique constraint was violated. |
| `P2003` | A foreign key constraint was violated. |
| `P2025` | A required record was missing, for example in `update` or `delete`. |

**Try:** Handle `P2025` after updating a post with a nonexistent slug. Validate API input separately: generated types do not validate incoming JSON at runtime.

### O. Parameterized raw SQL

```ts
const minimumViews = 5;

const rows = await prisma.$queryRaw<Array<{ slug: string; views: number }>>`
  SELECT slug, views
  FROM "Post"
  WHERE published = true AND views >= ${minimumViews}
  ORDER BY views DESC, id ASC
`;

console.table(rows);
```

**What it does:** Runs SQL against the same database; the tagged template binds `minimumViews` as a parameter. Expect view counts `20`, `10`, and `5`.

**Remember:** Parameter placeholders represent values, not table or column names. Avoid concatenating untrusted text into SQL or using unsafe raw methods with it. The generic type describes the expected result to TypeScript; it does not validate the returned rows.

**Try:** Raise the minimum to `11`, then write the equivalent `findMany` query.

### P. Derive a TypeScript result type from a selection

```ts
const query = {
  select: {
    slug: true,
    title: true,
    author: { select: { email: true } },
  },
  orderBy: { id: "asc" },
} satisfies Prisma.PostFindManyArgs;

type PostSummary = Prisma.PostGetPayload<typeof query>;

const summaries: PostSummary[] = await prisma.post.findMany(query);

console.table(
  summaries.map((post) => ({
    slug: post.slug,
    title: post.title,
    authorEmail: post.author.email,
  })),
);
```

**What it does:** Checks the query shape with `satisfies` and derives the returned row type from the selected fields. This avoids manually maintaining a duplicate interface.

**Try:** Add `console.log(summaries[0]?.views)` and run `pnpm check`. It should fail because `views` was not selected; remove that line or add `views: true` to the selection.

## 8. Change the schema with a migration

Add this field **inside `model Post`** in `prisma/schema.prisma`:

```prisma
readingTimeMinutes Int @default(1)
```

Create the migration without applying it yet:

```bash
pnpm exec prisma format
pnpm exec prisma migrate dev --name add_reading_time --create-only
cat prisma/migrations/*_add_reading_time/migration.sql
```

**What it does:** Generates SQL for the schema change so you can inspect it. For this field, expect a non-null integer column with a default of `1`, which also gives existing rows a value.

Apply the pending migration and regenerate the types:

```bash
pnpm exec prisma migrate dev
pnpm db:generate
pnpm check
```

Paste this inside `main()` and run `pnpm lab`:

```ts
const post = await prisma.post.update({
  where: { slug: "prisma-basics" },
  data: { readingTimeMinutes: 4 },
  select: { slug: true, readingTimeMinutes: true },
});

console.log(post);
```

**Remember:** Editing the schema alone changes neither the database nor the generated client. For important existing data, plan defaults/backfills before adding required fields. Review generated SQL before dropping or renaming columns, and keep applied migration files unchanged.

### Production workflow to remember

Commit the migration files and generate the client during the build. In the deployment environment, apply committed migrations with:

```bash
pnpm exec prisma migrate deploy
```

`migrate deploy` applies pending migrations; it does not create migrations or generate the client. Use development commands against development databases.

## 9. Bonus: compound keys with bookmarks

An explicit join model can store information about a relationship.

Add this field to **both** `User` and `Post`:

```prisma
bookmarks Bookmark[]
```

Then add this model:

```prisma
model Bookmark {
  userId    Int
  postId    Int
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@id([userId, postId])
  @@index([postId])
}
```

Migrate and regenerate:

```bash
pnpm db:migrate --name add_bookmarks
pnpm db:generate
pnpm check
```

Paste this inside `main()`:

```ts
const user = await prisma.user.findUniqueOrThrow({
  where: { email: "editor@example.test" },
});

const post = await prisma.post.findUniqueOrThrow({
  where: { slug: "prisma-basics" },
});

const bookmark = await prisma.bookmark.upsert({
  where: {
    userId_postId: { userId: user.id, postId: post.id },
  },
  update: {},
  create: { userId: user.id, postId: post.id },
});

console.log(bookmark);
```

**What it does:** Creates one bookmark per user/post pair. `@@id([userId, postId])` produces the compound selector `userId_postId`; duplicate pairs are prevented by the database. `createdAt` belongs to the relationship itself.

The existing seed still works: deleting posts or users cascades to their bookmark records.

## 10. Command cheat sheet

Use the **installed local CLI** with `pnpm exec prisma` so these commands use the project's pinned version.

| Command | Purpose | Changes database data/schema? |
| --- | --- | --- |
| `pnpm exec prisma init` | Scaffolds config, schema, and environment files in a new project. | No. |
| `pnpm exec prisma format` | Formats the Prisma schema file. | No. |
| `pnpm exec prisma validate` | Checks schema/config validity. | No. |
| `pnpm db:generate` | Generates client code and types from the schema. | No. |
| `pnpm db:migrate --name change_name` | Creates/applies a development migration. | Yes. |
| `pnpm exec prisma migrate dev --create-only` | Creates a migration for review. | Normally no application of the new migration; may prompt to reset on drift. |
| `pnpm exec prisma migrate deploy` | Applies committed migrations during deployment. | Yes. |
| `pnpm exec prisma migrate status` | Checks migration history/status. | No. |
| `pnpm exec prisma db pull` | Introspects a database into the Prisma schema file. | No, but updates the local schema file. |
| `pnpm exec prisma db push` | Syncs the schema without creating migration files; useful for prototypes. | Yes; inspect any data-loss warnings. |
| `pnpm db:seed` | Runs the configured seed script. | Yes; this lab's script replaces its data. |
| `pnpm db:studio` | Opens the visual database editor. | Edits through the UI change data. |
| `pnpm exec prisma migrate reset` | Rebuilds the development schema from migrations. | Yes; deletes existing data in that schema. |

After `migrate reset`, explicitly run `pnpm db:generate` and `pnpm db:seed` for this Prisma 7 lab. Use a reset only for disposable practice data.

`db pull` is the starting point for an existing database. If you also adopt Prisma Migrate there, [baseline its existing schema](https://www.prisma.io/docs/orm/v7/prisma-migrate/workflows/baselining) rather than applying a fresh initial migration to tables that already exist.

## 11. Common mistakes and troubleshooting

| Symptom | Check or fix |
| --- | --- |
| Prisma CLI has no `generate` or `migrate dev` command | Run `pnpm exec prisma --version`; confirm the project's CLI is `7.10.0`. Restore the pinned dependency and use the local CLI. |
| Node version is rejected | Use Node.js 24 LTS for this guide; check `node --version` in the same shell running pnpm. |
| Cannot connect to PostgreSQL | Check `sudo systemctl status postgresql`, host/port, and the `psql` connection command from section 2. |
| Password authentication fails | Make sure `.env` uses the role/password created for the practice database. |
| `role already exists` / `database already exists` | The setup SQL is intended to run once. Reuse the existing practice role/database and verify its credentials. |
| `DATABASE_URL` is missing | Create `.env` at the project root; keep `import "dotenv/config"` in the config and database module. |
| Shadow database creation fails, often `P3014` | The development role needs `CREATEDB`, or configure a dedicated `shadowDatabaseUrl`; never point it at the main database. |
| Generated client cannot be found | Run `pnpm db:generate`; check the generator output and import path. |
| New field is missing in TypeScript | Regenerate the client after editing the schema. |
| Database reports a missing table/column | Apply the migration to the database referenced by `.env`; client generation alone does not update the database. |
| Unique email/slug error on a second run | Reseed before repeating mutation exercises, or deliberately use `upsert`. |
| pnpm reports blocked dependency build scripts | Use `pnpm approve-builds` if supported by your pnpm version, review only the packages reported as blocked, then rerun the failed command. |
| Git appears ready to commit `.env` | Confirm `.gitignore`; if already tracked, run `git rm --cached .env`. Rotate any real secret that was published. |

### Application habits to remember

- Run Prisma in server code, such as a Node.js service or a Next.js server route. Keep database credentials on the server.
- Reuse a client/pool in a running service; creating a client per request multiplies connections. Hot-reloading frameworks often use a development singleton.
- Use `$disconnect()` when a short script finishes. A long-running server should not disconnect the shared client after each request.
- Validate incoming JSON and check authorization before queries. TypeScript types and database constraints serve different purposes.
- Select only needed fields, index common filters, and paginate large lists. Review actual query plans when performance matters.
- Fetch related records with nested queries rather than issuing one query per item in a loop.
- Treat `null` as a value. With Prisma 7's default behavior, omitted fields and `undefined` are generally skipped; build filters explicitly so a missing API value cannot accidentally broaden a write.
- A transaction's all-or-nothing behavior does not solve every concurrent-update problem. Atomic counters, unique constraints, isolation settings, and retries address different cases.

## 12. Revision challenges

Start from `pnpm db:seed`. Write the query yourself before consulting section 7.

| Challenge | Check your result |
| --- | --- |
| Find published posts with at least 10 views. | `prisma-basics`, `type-safe-queries`. |
| Return only slugs and titles for drafts. | `draft-notes`, `migration-checklist`. |
| Return each user with a count of posts. | Writer: 3; Editor: 2. |
| Find posts with no content. | Four rows; only `prisma-basics` has content. |
| Find users with at least one draft. | Both seeded users. |
| Count posts tagged `prisma`. | 3. |
| Sum views across all posts. | 37. |
| Publish only the Writer's draft posts. | One row updated. |
| Delete drafts without deleting users or tags. | 3 posts, 2 users, 2 tags remain. |
| Give the Editor a bookmark on a Writer post. | One join record; repeating the upsert preserves one record. |
| Make two writes fail together deliberately. | Confirm neither write persists. |

Explain these without opening the guide:

- How do `generate`, `migrate dev`, `migrate deploy`, and `db push` differ?
- What makes `findUnique` different from `findFirst`?
- What does `include` add to the response?
- Why does a one-to-one relation need a unique foreign key?
- How does `disconnect` differ from `delete`?
- When would you use a nested write, a batch transaction, or an interactive transaction?
- What does a composite key prevent?
- Why can an omitted filter be dangerous on `updateMany` or `deleteMany`?

## 13. Official references

These links are versioned for Prisma 7 where relevant. Revisit the release page before changing major versions.

- [Release status and version pinning](https://www.prisma.io/docs/orm/release-status)
- [Prisma 7 system requirements](https://www.prisma.io/docs/orm/v7/reference/system-requirements)
- [PostgreSQL quickstart](https://www.prisma.io/docs/v7/prisma-orm/quickstart/postgresql)
- [Prisma config reference](https://www.prisma.io/docs/orm/v7/reference/prisma-config-reference)
- [Models and fields](https://www.prisma.io/docs/orm/v7/prisma-schema/data-model/models)
- [Relations](https://www.prisma.io/docs/orm/v7/prisma-schema/data-model/relations)
- [Referential actions](https://www.prisma.io/docs/orm/v7/prisma-schema/data-model/relations/referential-actions)
- [CRUD](https://www.prisma.io/docs/orm/v7/prisma-client/queries/crud)
- [Select fields](https://www.prisma.io/docs/orm/v7/prisma-client/queries/select-fields)
- [Relation queries](https://www.prisma.io/docs/orm/v7/prisma-client/queries/relation-queries)
- [Filtering and sorting](https://www.prisma.io/docs/orm/v7/prisma-client/queries/filtering-and-sorting)
- [Pagination](https://www.prisma.io/docs/orm/v7/prisma-client/queries/pagination)
- [Aggregation and grouping](https://www.prisma.io/docs/orm/v7/prisma-client/queries/aggregation-grouping-summarizing)
- [Transactions](https://www.prisma.io/docs/orm/v7/prisma-client/queries/transactions)
- [Raw queries](https://www.prisma.io/docs/orm/v7/prisma-client/using-raw-sql/raw-queries)
- [Prisma Client type safety](https://www.prisma.io/docs/orm/v7/prisma-client/type-safety)
- [Seeding](https://www.prisma.io/docs/orm/v7/prisma-migrate/workflows/seeding)
- [Development and production migrations](https://www.prisma.io/docs/orm/v7/prisma-migrate/workflows/development-and-production)
- [Error codes](https://www.prisma.io/docs/orm/v7/reference/error-reference)
- [PostgreSQL installation on Ubuntu](https://www.postgresql.org/download/linux/ubuntu/)
