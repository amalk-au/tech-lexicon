# Docker Revision

A practical Docker reference for Ubuntu, with a pnpm project you can run in your browser. Each lab explains the concept, gives commands or complete files, and suggests something to change.

## Contents

- [1. Core concepts](#1-core-concepts)
- [2. Install Docker on Ubuntu](#2-install-docker-on-ubuntu)
- [3. Your first containers](#3-your-first-containers)
- [4. Create the pnpm practice project](#4-create-the-pnpm-practice-project)
- [5. Write the Dockerfile](#5-write-the-dockerfile)
- [6. Build and run the app](#6-build-and-run-the-app)
- [7. Container lifecycle and inspection](#7-container-lifecycle-and-inspection)
- [8. Ports and networking](#8-ports-and-networking)
- [9. Environment variables and build arguments](#9-environment-variables-and-build-arguments)
- [10. Named volumes and bind mounts](#10-named-volumes-and-bind-mounts)
- [11. Add PostgreSQL with Compose](#11-add-postgresql-with-compose)
- [12. Persistence and database initialization](#12-persistence-and-database-initialization)
- [13. Secrets](#13-secrets)
- [14. Health checks and startup order](#14-health-checks-and-startup-order)
- [15. Development with a bind mount](#15-development-with-a-bind-mount)
- [16. Development with Compose Watch](#16-development-with-compose-watch)
- [17. Build caching and multi-stage builds](#17-build-caching-and-multi-stage-builds)
- [18. CMD, ENTRYPOINT, and signals](#18-cmd-entrypoint-and-signals)
- [19. Runtime permissions and resource limits](#19-runtime-permissions-and-resource-limits)
- [20. Image tags, digests, and registries](#20-image-tags-digests-and-registries)
- [21. Compose commands and scaling](#21-compose-commands-and-scaling)
- [22. Back up and restore the practice database](#22-back-up-and-restore-the-practice-database)
- [23. Troubleshooting](#23-troubleshooting)
- [24. Cleanup](#24-cleanup)
- [25. Practice challenges](#25-practice-challenges)
- [26. Command cheat sheet](#26-command-cheat-sheet)
- [27. Official references](#27-official-references)

## How to use this document

Use Bash on Ubuntu. Start with sections 1–6; sections 11–16 extend the same project. Create each file at the stated path and copy the entire code block into it. Run project commands from `docker-revision/` unless a lab says otherwise.

The app uses Node.js 24, pnpm 11.25.0, and PostgreSQL 18. These are explicit learning targets, not automatic “latest” selections. Use the same pnpm version to generate the lockfile and build the image.

You need an internet connection for the initial package and image downloads. All published lab ports bind to `127.0.0.1`, so you can open the app on your own computer. The browser is the UI; the application process runs inside its container.

## 1. Core concepts

| Term | Meaning | Example |
| --- | --- | --- |
| Image | Packaged filesystem and configuration used to create containers. | `node:24-bookworm-slim` |
| Container | An instance of an image, with its own writable layer and process lifecycle. | The running revision app. |
| Dockerfile | Instructions for building an image. | Copy files, install dependencies, set a startup command. |
| Build context | Files available to the build, filtered by `.dockerignore`. | The final `.` in `docker build .`. |
| Layer | A cached filesystem change in an image. | Installing dependencies. |
| Registry | A service that stores and distributes images. | Docker Hub. |
| Volume | Docker-managed storage with a separate lifecycle from a container. | PostgreSQL data. |
| Bind mount | A host file or directory exposed inside a container. | Local source code mounted at `/app/src`. |
| Network | Connectivity and name resolution between containers. | The Compose network used by `app` and `db`. |
| Compose | A declarative way to run related services, networks, and volumes. | App + PostgreSQL in `compose.yaml`. |

Containers share the host kernel; they do not each boot a full operating system. An image does not keep an app running: the container stays running while its main process runs.

A stopped container still exists. Removing it deletes its writable layer, but does not automatically delete a separately managed named volume.

## 2. Install Docker on Ubuntu

Use [Docker's Ubuntu installation guide](https://docs.docker.com/engine/install/ubuntu/) for supported releases and any existing-package conflicts. If Docker already works, skip the installation commands.

### Install Docker Engine and the Compose plugin

```bash
sudo apt update
sudo apt install -y ca-certificates curl

sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

sudo tee /etc/apt/sources.list.d/docker.sources >/dev/null <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io \
  docker-buildx-plugin docker-compose-plugin

sudo systemctl enable --now docker
sudo docker run --rm hello-world
```

**What this does:** adds Docker's package repository, installs the engine and CLI plugins, starts the daemon, and runs a test container.

Use `docker compose` with a space throughout this guide. You do not need the legacy `docker-compose` installation.

### Choose how to access Docker

You can run the guide's Docker commands with `sudo`. Alternatively, enable access for your login account:

```bash
sudo groupadd --force docker
sudo usermod -aG docker "$USER"
```

Sign out and back in, then verify:

```bash
docker version
docker compose version
docker buildx version
docker run --rm hello-world
```

Membership in the `docker` group grants root-equivalent control of the host. [Rootless Docker](https://docs.docker.com/engine/security/rootless/) is another option.

**Try:** compare `docker --version`, which reports the CLI version, with `docker version`, which also contacts the engine.

## 3. Your first containers

### Run a one-off process

```bash
docker run --rm alpine:3.22 sh -c 'echo "Container started"; cat /etc/os-release'
```

**What this does:** downloads the image if necessary, creates a container, runs a shell command, and removes the container when it exits. The image remains available locally.

### Open an interactive shell

```bash
docker run --rm -it alpine:3.22 sh
```

Inside the container:

```sh
pwd
ls
echo "temporary file" > /tmp/example.txt
cat /tmp/example.txt
exit
```

Run the same `docker run` command again. The file is gone because this is a new container with a fresh writable layer.

### Serve a page in your browser

```bash
docker run -d --name revision-web \
  -p 127.0.0.1:8080:80 \
  nginx:stable-alpine
```

Open [http://localhost:8080](http://localhost:8080).

```bash
docker logs revision-web
docker stop revision-web
docker rm revision-web
```

**What this does:** publishes container port `80` at host port `8080`. `-d` runs in the background; `--name` gives the container a convenient identifier.

If port `8080` is occupied, use `127.0.0.1:8081:80` and open port `8081` instead.

## 4. Create the pnpm practice project

The app has a **Record visit** button. Initially, visits live in process memory. Later, Compose connects the same app to PostgreSQL so records survive container replacement.

### Create the directories

You need Node.js 24 and pnpm 11.25.0 locally to try the app before containerizing it. If you already have pnpm, the `packageManager` field below selects the project version when pnpm version management is enabled.

```bash
node --version
pnpm --version

mkdir -p docker-revision/src docker-revision/public docker-revision/db
cd docker-revision
```

If pnpm is missing, with a user-managed Node.js installation:

```bash
npm install --global pnpm@11.25.0
```

**What this does:** installs the package manager. Use `pnpm` for the project commands below. Docker installs the same pinned version during its dependency stage.

### Package manifest

**File: `package.json`**

```json
{
  "name": "docker-revision",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@11.25.0",
  "engines": {
    "node": ">=24"
  },
  "scripts": {
    "dev": "node --watch src/server.mjs",
    "start": "node src/server.mjs"
  },
  "dependencies": {
    "pg": "8.23.0"
  }
}
```

**What this does:** defines the start commands and PostgreSQL client dependency. `private: true` prevents accidental npm publication; you can still commit the project to GitHub.

### Application server

**File: `src/server.mjs`**

```js
import http from "node:http";
import { readFile } from "node:fs/promises";
import pg from "pg";

const port = Number(process.env.PORT ?? 3000);
const appLabel = process.env.APP_LABEL ?? "Docker revision";
const useDatabase = Boolean(process.env.PGHOST);

const password = process.env.PGPASSWORD_FILE
  ? (await readFile(process.env.PGPASSWORD_FILE, "utf8")).trim()
  : process.env.PGPASSWORD;

const pool = useDatabase
  ? new pg.Pool({
      host: process.env.PGHOST,
      port: Number(process.env.PGPORT ?? 5432),
      database: process.env.PGDATABASE ?? "revision_db",
      user: process.env.PGUSER ?? "revision_user",
      password,
      max: 4,
      connectionTimeoutMillis: 3000,
      idleTimeoutMillis: 10000
    })
  : null;

pool?.on("error", (error) => {
  console.error("Idle database connection error:", error.message);
});

let nextId = 1;
const memoryVisits = [];

function sendJson(response, status, data) {
  response.writeHead(status, { "Content-Type": "application/json" });
  response.end(JSON.stringify(data));
}

async function listVisits() {
  if (!pool) return [...memoryVisits].reverse().slice(0, 5);
  const result = await pool.query(
    "SELECT id, created_at FROM visits ORDER BY id DESC LIMIT 5"
  );
  return result.rows;
}

async function countVisits() {
  if (!pool) return memoryVisits.length;
  const result = await pool.query("SELECT COUNT(*)::int AS total FROM visits");
  return result.rows[0].total;
}

const server = http.createServer(async (request, response) => {
  try {
    const path = new URL(request.url, "http://app.local").pathname;

    if (request.method === "GET" && path === "/") {
      const html = await readFile(new URL("../public/index.html", import.meta.url));
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(html);
      return;
    }

    if (request.method === "GET" && path === "/health") {
      sendJson(response, 200, { status: "ok" });
      return;
    }

    if (request.method === "GET" && path === "/ready") {
      await countVisits();
      sendJson(response, 200, { status: "ready" });
      return;
    }

    if (request.method === "GET" && path === "/api/info") {
      sendJson(response, 200, {
        label: appLabel,
        storage: pool ? "PostgreSQL" : "memory",
        total: await countVisits()
      });
      return;
    }

    if (request.method === "GET" && path === "/api/visits") {
      sendJson(response, 200, await listVisits());
      return;
    }

    if (request.method === "POST" && path === "/api/visits") {
      if (pool) {
        await pool.query("INSERT INTO visits DEFAULT VALUES");
      } else {
        memoryVisits.push({ id: nextId++, created_at: new Date().toISOString() });
      }
      sendJson(response, 201, { total: await countVisits() });
      return;
    }

    sendJson(response, 404, { error: "Route not found" });
  } catch (error) {
    console.error("Request failed:", error.message);
    sendJson(response, 503, { error: "Storage temporarily unavailable" });
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log("App listening on port", port);
});

let shuttingDown = false;

async function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  const deadline = setTimeout(() => process.exit(1), 8000);
  deadline.unref();

  server.close(async () => {
    try {
      await pool?.end();
      clearTimeout(deadline);
      process.exit(0);
    } catch (error) {
      console.error("Shutdown failed:", error.message);
      process.exit(1);
    }
  });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
```

**What this does:** serves a web page and API, uses memory unless `PGHOST` is set, reads an optional password file, and closes connections when Docker stops the process.

The server listens on `0.0.0.0` **inside the container** so published ports can reach it. The host-side `127.0.0.1` binding still keeps access local.

### Browser interface

**File: `public/index.html`**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Docker revision</title>
  <style>
    body { font: 1rem system-ui; max-width: 44rem; margin: 3rem auto; padding: 1rem; }
    button { padding: 0.7rem 1rem; cursor: pointer; }
    #status { padding: 1rem; background: #eef3f8; border-radius: 0.5rem; }
    li { margin-block: 0.4rem; }
  </style>
</head>
<body>
  <h1>Docker revision</h1>
  <p id="status" aria-live="polite">Loading…</p>
  <button id="record" type="button">Record visit</button>
  <button id="refresh" type="button">Refresh</button>
  <h2>Latest five visits</h2>
  <ul id="visits"></ul>

  <script type="module">
    const status = document.querySelector("#status");
    const visits = document.querySelector("#visits");
    const record = document.querySelector("#record");

    async function request(path, options) {
      const response = await fetch(path, options);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Request failed");
      return data;
    }

    async function refresh() {
      try {
        const [info, rows] = await Promise.all([
          request("/api/info"),
          request("/api/visits")
        ]);
        status.textContent =
          info.label + " | Storage: " + info.storage + " | Visits: " + info.total;
        visits.replaceChildren(...rows.map((row) => {
          const item = document.createElement("li");
          item.textContent = "#" + row.id + " — " + new Date(row.created_at).toLocaleString();
          return item;
        }));
      } catch (error) {
        status.textContent = error.message;
      }
    }

    record.addEventListener("click", async () => {
      record.disabled = true;
      try {
        await request("/api/visits", { method: "POST" });
        await refresh();
      } catch (error) {
        status.textContent = error.message;
      } finally {
        record.disabled = false;
      }
    });

    document.querySelector("#refresh").addEventListener("click", refresh);
    await refresh();
  </script>
</body>
</html>
```

**What this does:** calls the API, shows the current storage mode, and records visits without requiring a frontend build tool.

### Ignore local files in Git and Docker builds

**File: `.gitignore`**

```gitignore
node_modules/
.env
.env.*
!.env.example
.secrets/
backups/
```

**File: `.dockerignore`**

```dockerignore
node_modules
.git
.env
.env.*
.secrets
backups
*.log
```

**What this does:** keeps installed host dependencies, local configuration, secrets, and backups out of the relevant destination. `.gitignore` controls Git; `.dockerignore` controls the build context.

### Install and try the app locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Click **Record visit**, then stop the process with `Ctrl+C` and run `pnpm dev` again. The count resets because the data was in memory.

`pnpm install` creates `pnpm-lock.yaml`. Commit that lockfile with the source; the Dockerfile requires it. Stop the local server before starting the container on the same host port.

**Project files so far:**

| Path | Purpose |
| --- | --- |
| `package.json` | Project scripts and dependency versions. |
| `pnpm-lock.yaml` | Resolved dependency graph, generated by pnpm. |
| `src/server.mjs` | HTTP server and storage logic. |
| `public/index.html` | Browser UI. |
| `.gitignore` | Git exclusions. |
| `.dockerignore` | Docker build-context exclusions. |

## 5. Write the Dockerfile

**File: `Dockerfile`**

```dockerfile
# syntax=docker/dockerfile:1

FROM node:24-bookworm-slim AS base
WORKDIR /app
RUN npm install --global pnpm@11.25.0

FROM base AS development
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=docker-revision-pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --store-dir=/pnpm/store
COPY --chown=node:node src ./src
COPY --chown=node:node public ./public
USER node
EXPOSE 3000
CMD ["node", "--watch", "src/server.mjs"]

FROM base AS production-dependencies
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=docker-revision-pnpm,target=/pnpm/store \
    pnpm install --prod --frozen-lockfile --store-dir=/pnpm/store

FROM node:24-bookworm-slim AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=production-dependencies /app/node_modules ./node_modules
COPY --chown=node:node src ./src
COPY --chown=node:node public ./public
USER node
EXPOSE 3000
CMD ["node", "src/server.mjs"]
```

**What this does:** provides a development target and a production target. The final image contains the runtime, production dependencies, and app files; pnpm is needed during the build.

| Instruction | Purpose in this file |
| --- | --- |
| `FROM … AS …` | Starts and names a build stage. |
| `WORKDIR` | Sets the working directory for following instructions and the startup process. |
| `RUN` | Executes a command during the image build. |
| `COPY` | Copies files from the build context. |
| `COPY --from=…` | Copies output from another stage. |
| `ENV` | Sets a default runtime environment variable. |
| `USER` | Selects the account used by the application process. |
| `EXPOSE` | Documents the intended container port; does not publish it. |
| `CMD` | Supplies the default command when a container starts. |

`--frozen-lockfile` fails if the manifest and lockfile disagree. The cache mount stores pnpm downloads between builds; installed `node_modules` still belongs to the image stage.

This sample has no compile step. For TypeScript or a bundled frontend, add a build stage, run `pnpm build` there, and copy its generated output into the runtime stage.

## 6. Build and run the app

```bash
docker build --target production -t docker-revision:1.0 .

docker run -d --init --name revision-app \
  -p 127.0.0.1:3000:3000 \
  -e APP_LABEL="Container practice" \
  docker-revision:1.0
```

Open [http://localhost:3000](http://localhost:3000).

```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/info
curl -X POST http://localhost:3000/api/visits
```

**What this does:** builds the production stage, tags the image, starts a container, and forwards a local host port. `--init` adds a small init process for signal forwarding and child-process cleanup.

**Try:** record three visits and run:

```bash
docker restart revision-app
```

Refresh the page. The count resets because the process's memory is gone. Container restart does not rebuild the image or update its files.

To rebuild after changing the source:

```bash
docker stop revision-app
docker rm revision-app
docker build --target production -t docker-revision:1.0 .
docker run -d --init --name revision-app \
  -p 127.0.0.1:3000:3000 \
  docker-revision:1.0
```

**Remember:** changing local files changes neither an already built image nor an existing container unless a development mount or sync workflow connects them.


## 7. Container lifecycle and inspection

Run these while `revision-app` from section 6 exists:

```bash
docker ps
docker ps -a
docker logs --tail 30 revision-app
docker logs --follow revision-app
```

Press `Ctrl+C` to stop following logs; the container continues running.

```bash
docker inspect --format '{{.State.Status}}' revision-app
docker inspect --format '{{.Config.Image}}' revision-app
docker port revision-app
docker stats --no-stream revision-app
docker exec revision-app node --version
docker exec -it revision-app sh
```

Inside the shell, run `id` and `ls /app`, then `exit`. This image includes `sh`; it does not need Bash.

| Command | Effect |
| --- | --- |
| `docker run` | Creates and starts a new container. |
| `docker start revision-app` | Starts the same stopped container. |
| `docker stop revision-app` | Requests graceful termination, then forces termination after its timeout. |
| `docker restart revision-app` | Stops and starts the same container. |
| `docker rm revision-app` | Removes a stopped container. |
| `docker exec …` | Runs an additional process inside a running container. |

`docker diff revision-app` shows filesystem changes in the container's writable layer. It is not a database backup or a complete listing of mounted volume changes.

**Try:** stop the container, compare `docker ps` and `docker ps -a`, then start it again.

## 8. Ports and networking

### Host port versus container port

```bash
docker run -d --rm --init --name revision-port \
  -p 127.0.0.1:3001:3000 \
  docker-revision:1.0
```

Open [http://localhost:3001](http://localhost:3001), then stop the lab:

```bash
docker stop revision-port
```

`127.0.0.1:3001:3000` means **host address : host port : container port**. Changing the host port does not change the app's internal listening port.

`EXPOSE 3000` alone does not make the app reachable from your browser. Publishing without an explicit host address can expose the port on other host interfaces.

### Container-to-container communication

```bash
docker network create revision-network

docker run -d --init --name revision-network-app \
  --network revision-network \
  docker-revision:1.0

docker run --rm --network revision-network alpine:3.22 \
  wget -qO- http://revision-network-app:3000/api/info
```

**What this does:** connects two containers to a user-defined network. The requesting container resolves `revision-network-app` through Docker's DNS and uses the destination's container port. No host port is required.

```bash
docker network inspect revision-network
docker stop revision-network-app
docker rm revision-network-app
docker network rm revision-network
```

| Where the request originates | Address for the app |
| --- | --- |
| Your browser, with `3001:3000` published | `http://localhost:3001` |
| Another container on the same user-defined network | `http://revision-network-app:3000` |
| The app container itself | `http://localhost:3000` |

Inside a container, `localhost` refers to that container. It does not refer to a sibling database container.

## 9. Environment variables and build arguments

### Runtime configuration

**File: `.env`**

```dotenv
APP_LABEL=Environment practice
APP_HOST_PORT=3000
```

```bash
docker run -d --rm --init --name revision-config \
  --env-file .env \
  -p 127.0.0.1:3001:3000 \
  docker-revision:1.0

curl http://localhost:3001/api/info
docker stop revision-config
```

**What this does:** passes values into the process when the container starts. `APP_LABEL` changes the browser status text. The standalone app does not use `APP_HOST_PORT`; Compose will use it for the host-side port mapping.

`docker run` does not automatically read `.env`. With Compose, `.env` supplies interpolation values; a value reaches a container only when its service configuration passes it, for example through `environment` or `env_file`.

### Build-time configuration

**File: `Dockerfile.args`**

```dockerfile
FROM docker-revision:1.0
ARG APP_VERSION=dev
LABEL org.opencontainers.image.version=$APP_VERSION
```

```bash
docker build -f Dockerfile.args \
  --build-arg APP_VERSION=2.0 \
  -t docker-revision:arg .

docker image inspect --format \
  '{{index .Config.Labels "org.opencontainers.image.version"}}' \
  docker-revision:arg
```

**What this does:** records a build-time version label. The `ARG` is not automatically available as a runtime environment variable.

| Mechanism | When it is used | Typical use |
| --- | --- | --- |
| `ARG` | During a build. | Build options or version labels. |
| `ENV` | Image default, available at runtime. | `NODE_ENV=production`. |
| `docker run -e` / Compose `environment` | When creating a container. | Runtime settings that override image defaults. |
| Secret mount | During a build or at runtime, when explicitly granted. | Credentials read from a file. |

Changing an environment value requires a new container to receive it. `docker restart` keeps the existing container's configuration.

Use secret mounts for credentials. Build arguments and environment variables can be exposed through image metadata, history, or container inspection.

## 10. Named volumes and bind mounts

### Persist a file with a named volume

```bash
docker volume create revision-data

docker run --rm \
  --mount type=volume,src=revision-data,dst=/data \
  alpine:3.22 sh -c 'echo "Stored outside the container layer" > /data/message.txt'

docker run --rm \
  --mount type=volume,src=revision-data,dst=/data \
  alpine:3.22 cat /data/message.txt

docker volume inspect revision-data
```

**What this does:** writes a file from one container and reads it from another. Both containers are removed, but the named volume remains.

A volume is not automatically used by every part of an app. Mounting `/data` would not persist the revision app's JavaScript memory; the app must actually write data to the mounted path.

### Share a host directory with a bind mount

```bash
mkdir -p mount-demo
printf '%s\n' '<h1>Bind mount practice</h1>' > mount-demo/index.html

docker run -d --rm --name revision-bind \
  -p 127.0.0.1:8080:80 \
  --mount type=bind,src="$PWD/mount-demo",dst=/usr/share/nginx/html,readonly \
  nginx:stable-alpine
```

Open [http://localhost:8080](http://localhost:8080). Edit `mount-demo/index.html` on the host, save, and refresh.

```bash
docker stop revision-bind
```

**What this does:** serves a local file without rebuilding the image. `readonly` prevents the container from changing the mounted directory.

| Storage | Survives removing a container? | Appropriate for |
| --- | --- | --- |
| Writable container layer | No. | Temporary changes. |
| Process memory | No; also lost on process restart. | Short-lived state. |
| Named volume | Yes, until the volume is removed. | Database files or persisted app files. |
| Bind mount | Yes; files belong to the host. | Source code, local configuration, selected files. |
| `tmpfs` mount | No; in-memory filesystem. | Temporary files that should disappear on stop. |

Mounting over an existing container path hides its original contents for that mount. A bind mount of the whole project onto `/app` can hide the image's installed `node_modules`.

## 11. Add PostgreSQL with Compose

This lab adds two services, a persistent volume, an initialization script, and a password file.

### Create the local password file

Run once before the first Compose startup:

```bash
mkdir -p .secrets
chmod 700 .secrets

if [ ! -f .secrets/db_password.txt ]; then
  openssl rand -hex 24 > .secrets/db_password.txt
fi

chmod 644 .secrets/db_password.txt
```

**What this does:** creates a random password without embedding it in the public project. The host directory is private; the file is readable by the app's non-root user when mounted into its container.

`openssl` is commonly available on Ubuntu; install it with `sudo apt install openssl` if necessary. Keep `.secrets/` excluded from both Git and the build context. Do not regenerate the password after database initialization without also changing the database role's password.

### Initialize the table

**File: `db/001-init.sql`**

```sql
CREATE TABLE visits (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

**What this does:** creates a table whose ID and timestamp are generated when the app inserts a visit.

### Define the services

**File: `compose.yaml`**

```yaml
name: docker-revision

services:
  app:
    image: docker-revision:compose
    build:
      context: .
      target: production
    init: true
    ports:
      - "127.0.0.1:${APP_HOST_PORT:-3000}:3000"
    environment:
      NODE_ENV: production
      APP_LABEL: "${APP_LABEL:-Compose practice}"
      PGHOST: db
      PGPORT: "5432"
      PGDATABASE: revision_db
      PGUSER: revision_user
      PGPASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test:
        - CMD
        - node
        - -e
        - >-
          fetch('http://127.0.0.1:3000/ready', {signal: AbortSignal.timeout(2000)})
            .then(r => process.exit(r.ok ? 0 : 1))
            .catch(() => process.exit(1))
      interval: 10s
      timeout: 3s
      retries: 3
      start_period: 10s

  db:
    image: postgres:18-bookworm
    environment:
      POSTGRES_DB: revision_db
      POSTGRES_USER: revision_user
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password
    volumes:
      - db_data:/var/lib/postgresql
      - ./db/001-init.sql:/docker-entrypoint-initdb.d/001-init.sql:ro
    healthcheck:
      test: ["CMD", "pg_isready", "-h", "127.0.0.1", "-U", "revision_user", "-d", "revision_db"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 10s

volumes:
  db_data:

secrets:
  db_password:
    file: ./.secrets/db_password.txt
```

**What this does:** builds the app, runs PostgreSQL, puts both services on a shared network, and stores database files separately from the database container.

The `postgres:18-bookworm` image uses a volume mounted at `/var/lib/postgresql`. The usual mount for PostgreSQL 17 and earlier is `/var/lib/postgresql/data`. Match the mount to the image version; changing a major-version tag is not a database migration.

The database has no host-published port. The app reaches it at `db:5432` through Compose's service DNS.

### Start and use the project

Release host port `3000` if the earlier standalone lab is still running:

```bash
docker stop revision-app
docker rm revision-app
```

Skip those two commands if that container no longer exists. Then:

```bash
docker compose config --quiet
docker compose up -d --build --wait
docker compose ps
```

Open [http://localhost:3000](http://localhost:3000), or the port you set in `APP_HOST_PORT`. The status should show **Storage: PostgreSQL**.

```bash
docker compose logs --tail 30 app db
docker compose exec db psql -U revision_user -d revision_db \
  -c "SELECT * FROM visits ORDER BY id DESC;"
```

**Try:** record several visits, then query the table. The rows you see in the browser are the same rows stored in PostgreSQL.

## 12. Persistence and database initialization

### Replace containers and keep the data

```bash
docker compose down
docker compose up -d --wait
```

**What this does:** removes the project's containers and network, then recreates them. The named `db_data` volume survives.

Refresh the browser. Previously recorded visits should remain.

```bash
docker volume inspect docker-revision_db_data
```

The volume name comes from the Compose project name and the volume key. This guide sets the project name to `docker-revision`.

### Initialization is a first-start operation

The PostgreSQL image runs files in `/docker-entrypoint-initdb.d` when it initializes an **empty data directory**. Editing `db/001-init.sql` and restarting an existing database will not rerun that file.

To change an existing schema, apply a migration explicitly. For a small experiment:

```bash
docker compose exec db psql -U revision_user -d revision_db \
  -c "ALTER TABLE visits ADD COLUMN note text NOT NULL DEFAULT 'practice';"
```

Inspect it:

```bash
docker compose exec db psql -U revision_user -d revision_db -c '\d visits'
```

The app still works because the new column has a default.

### Reset only this practice database

The following deletes this project's named volume and all recorded visits:

```bash
docker compose down --volumes
docker compose up -d --build --wait
```

Use this when you deliberately want a fresh lab database. A persisted volume protects data from container replacement; it is not a backup.

## 13. Secrets

The Compose file declares the host file once and grants it only to `app` and `db`. In each service, it appears at `/run/secrets/db_password`.

```bash
docker compose exec app sh -c 'test -r /run/secrets/db_password && echo "Secret is readable"'
docker compose exec app id
```

**What this does:** verifies access without printing the password.

`POSTGRES_PASSWORD_FILE` is supported by the PostgreSQL image. `PGPASSWORD_FILE` in this app is our own convention: the server code explicitly reads the file. Adding `_FILE` to an arbitrary environment variable does not make every program read a secret automatically.

For local Compose, file-backed secrets are bind-mounted files, not an encrypted vault. Keep the original host file protected. Local file ownership and permissions matter; Compose does not reliably remap them through `uid`, `gid`, or `mode` for a file source.

The initialization user in this learning database is a database superuser. Use a restricted application role when adapting the example beyond a local lab.

## 14. Health checks and startup order

| Check | What it establishes in this project |
| --- | --- |
| `GET /health` | The HTTP process can respond. |
| `GET /ready` | The app can query its storage, including the expected table. |
| `pg_isready` | PostgreSQL is accepting connections on the checked endpoint. |
| `depends_on: … service_healthy` | Compose waits for the dependency's health check during startup. |

A running process can still be unable to serve useful requests. A database health check does not prove that a particular app password or schema is correct.

```bash
docker compose exec app node -e \
  "fetch('http://127.0.0.1:3000/ready').then(async r => console.log(r.status, await r.text()))"

docker inspect --format '{{.State.Health.Status}}' \
  "$(docker compose ps -q app)"
```

### Simulate a dependency outage

```bash
docker compose stop db
curl -i http://localhost:3000/health
curl -i http://localhost:3000/ready
```

Expect `/health` to remain `200` and `/ready` to return `503` after its connection attempt fails. Click **Refresh** in the browser to see the storage error.

```bash
docker compose start db
```

Wait a few seconds and refresh again. The pool can establish new connections once PostgreSQL is available.

**Remember:** startup ordering does not guarantee that a dependency stays available. Health status alone does not make Docker restart a container; restart policies respond to process exit and other lifecycle rules.

## 15. Development with a bind mount

Use this overlay with the base Compose file.

**File: `compose.bind.yaml`**

```yaml
services:
  app:
    image: docker-revision:development
    build:
      target: development
    environment:
      NODE_ENV: development
    volumes:
      - type: bind
        source: ./src
        target: /app/src
        read_only: true
      - type: bind
        source: ./public
        target: /app/public
        read_only: true
```

```bash
docker compose -f compose.yaml -f compose.bind.yaml up -d --build --wait
docker compose -f compose.yaml -f compose.bind.yaml logs -f app
```

**What this does:** selects the development stage, mounts only source and UI files, and runs Node's watch mode. The image's Linux `node_modules` remains visible.

**Try:** change the default label in `src/server.mjs` and save to observe a process restart in the logs. Because Compose supplies `APP_LABEL`, the configured label still takes precedence. Change the page's `<h1>` in `public/index.html` and refresh to see a direct UI change.

For a visible server change, change the `/health` JSON from `"ok"` to `"running"`, save, and run `curl http://localhost:3000/health`. Keep `/ready` intact so the health check continues to work.

Installing a new dependency locally does not install it in an existing container. Run `pnpm add <package>`, then rerun the same `up -d --build` command.

Press `Ctrl+C` to leave log following. To return to the production target:

```bash
docker compose up -d --build --wait
```

## 16. Development with Compose Watch

This is an alternative to the bind-mount overlay. Use Compose **2.23.0 or later** for the `sync+restart` action below.

**File: `compose.watch.yaml`**

```yaml
services:
  app:
    image: docker-revision:development
    build:
      target: development
    command: ["node", "src/server.mjs"]
    environment:
      NODE_ENV: development
    develop:
      watch:
        - action: sync+restart
          path: ./src
          target: /app/src
        - action: sync
          path: ./public
          target: /app/public
        - action: rebuild
          path: ./package.json
        - action: rebuild
          path: ./pnpm-lock.yaml
        - action: rebuild
          path: ./Dockerfile
```

Stop the previous stack without deleting its volume, then start Watch:

```bash
docker compose down
docker compose -f compose.yaml -f compose.watch.yaml up --build --watch
```

**What this does:** copies changed server files and restarts the service; copies HTML changes without a restart; rebuilds when dependencies or the Dockerfile change.

Use the Watch overlay by itself with the base file. Combining it with the bind-mount overlay would try to sync into read-only mounts.

The Dockerfile uses `COPY --chown=node:node` so the non-root user can write to the watched source paths. The runtime starts `node` directly here because Compose handles server restarts.

**Try:** edit `public/index.html`, refresh the browser, then edit the `/health` response and watch the restart. Press `Ctrl+C` when finished.

Return to the base configuration:

```bash
docker compose up -d --build --wait
```


## 17. Build caching and multi-stage builds

The Dockerfile copies the manifest and lockfile **before** the source. Editing HTML therefore does not normally invalidate dependency installation.

```bash
docker build --progress=plain --target production \
  -t docker-revision:1.0 .

docker build --progress=plain --target production \
  -t docker-revision:1.0 .
```

**Try:** find `CACHED` steps on the second build. Edit the HTML and build again; dependency steps should remain reusable. Change a dependency with `pnpm add` and observe which steps rerun.

### Three different kinds of cache

| Cache | What it retains |
| --- | --- |
| Docker layer cache | Results of unchanged build steps. |
| BuildKit cache mount | Package downloads reused by an install step that must rerun. |
| pnpm lockfile | Resolved versions; this is a reproducibility record, not a download cache. |

```bash
docker build --no-cache --target production \
  -t docker-revision:fresh .
```

**What this does:** reruns image-building steps without using their layer cache. BuildKit cache mounts can still retain downloads. Add `--pull` when you also want Docker to check for an updated base image.

### Select a stage

```bash
docker build --target development -t docker-revision:development .
docker build --target production -t docker-revision:1.0 .
docker image ls docker-revision
```

The sample's final stage is `production`, so a build without `--target` selects that final stage. Dependencies required only for compilation should stay out of the runtime stage.

If adapting this recipe to a pnpm workspace, copy `pnpm-workspace.yaml` and other required configuration before installing. A monorepo may also need `pnpm deploy` to create a portable application directory.

### Build-time secret mount

Use a dummy token to explore how a secret can be available to one build step:

```bash
mkdir -p .secrets
chmod 700 .secrets
printf '%s\n' 'practice-token' > .secrets/build_token.txt
```

**File: `Dockerfile.secret`**

```dockerfile
# syntax=docker/dockerfile:1
FROM alpine:3.22
RUN --mount=type=secret,id=build_token,required=true \
    test -s /run/secrets/build_token && echo "Build secret is available"
```

```bash
docker build -f Dockerfile.secret \
  --secret id=build_token,src=.secrets/build_token.txt \
  -t revision-build-secret .

docker run --rm revision-build-secret sh -c \
  'test ! -e /run/secrets/build_token && echo "No runtime secret file"'
```

**What this does:** mounts the file during `RUN` without automatically including it in the finished image. Do not copy or print an actual secret from a build step. This dummy token performs no authentication.

## 18. CMD, ENTRYPOINT, and signals

### See how arguments are combined

```bash
mkdir -p scripts
```

**File: `scripts/args.mjs`**

```js
console.log("Arguments:", process.argv.slice(2));
```

**File: `Dockerfile.entrypoint`**

```dockerfile
FROM node:24-bookworm-slim
WORKDIR /demo
COPY scripts/args.mjs ./scripts/args.mjs
ENTRYPOINT ["node", "scripts/args.mjs"]
CMD ["hello"]
```

```bash
docker build -f Dockerfile.entrypoint -t revision-args .

docker run --rm revision-args
docker run --rm revision-args one two
docker run --rm --entrypoint node revision-args --version
```

**Expected:** the first prints `["hello"]`, the second prints `["one", "two"]`, and the third reports the Node.js version.

`ENTRYPOINT` supplies the executable and fixed arguments. `CMD` supplies defaults. Arguments after the image name replace `CMD`, while `--entrypoint` replaces the entrypoint.

The practice app uses the JSON/exec form of `CMD` so Node starts directly. Shell-form startup commands can add a shell between Docker and the app; a startup shell script should use `exec` when handing over to its final process.

### Graceful stopping

With the base Compose stack running:

```bash
docker compose stop -t 10 app
docker compose start app
```

**What this does:** gives the app up to ten seconds to stop. Its `SIGTERM` handler stops accepting new connections and closes the database pool. If the process does not exit in time, Docker forces it to stop.

`init: true` or `docker run --init` helps with signal forwarding and reaping exited child processes; it does not replace application shutdown handling.

### Restart policies

| Policy | Behavior |
| --- | --- |
| `no` | Default: leave the container stopped after exit. |
| `on-failure:2` | Retry a non-zero exit up to twice. |
| `always` | Restart after exit; a manual stop suppresses restarts until a manual start or daemon restart. |
| `unless-stopped` | Restart automatically, while preserving an intentional stop across daemon restarts. |

Try a process that fails after running for twelve seconds:

```bash
docker run -d --name revision-restart --restart on-failure:2 \
  alpine:3.22 sh -c 'echo "Attempt started"; sleep 12; exit 1'

docker logs revision-restart
```

After about forty seconds:

```bash
docker inspect --format \
  'Restarts: {{.RestartCount}}, exit code: {{.State.ExitCode}}' \
  revision-restart

docker stop revision-restart
docker rm revision-restart
```

**Expected:** two retries and a final exit code of `1`. Restarting the process does not fix its underlying failure. Automatic removal with `--rm` cannot be combined with a restart policy.

In Compose, put a policy under the service, for example `restart: unless-stopped`.

## 19. Runtime permissions and resource limits

The Dockerfile runs the application as the built-in `node` user. This differs from whether the Docker daemon itself runs as root.

### Harden the app container for an experiment

Use this overlay with the base production configuration.

**File: `compose.hardened.yaml`**

```yaml
services:
  app:
    read_only: true
    tmpfs:
      - /tmp
    cap_drop:
      - ALL
    security_opt:
      - no-new-privileges:true
    mem_limit: 256m
    cpus: 0.5
    pids_limit: 100
```

```bash
docker compose -f compose.yaml -f compose.hardened.yaml up -d --build --wait
docker compose exec app id
docker compose exec app sh -c 'touch /app/src/blocked.txt'
docker compose exec app sh -c 'touch /tmp/allowed.txt && ls /tmp/allowed.txt'
docker stats --no-stream
```

**Expected:** the write under `/app/src` fails; the write under `/tmp` succeeds.

| Setting | Effect |
| --- | --- |
| `read_only` | Makes the container's root filesystem read-only. |
| `tmpfs` | Provides a writable in-memory temporary directory. |
| `cap_drop` | Removes the listed Linux capabilities. |
| `no-new-privileges` | Prevents processes from gaining additional privileges through mechanisms such as setuid. |
| `mem_limit` | Caps container memory. |
| `cpus` | Limits the CPU time available to the container. |
| `pids_limit` | Limits its number of processes/tasks. |

These limits are lab values; measure a real application's needs. A writable mount can remain writable even when the root filesystem is read-only.

The Watch overlay needs writable source paths for syncing. Use this hardening lab with the base production configuration. Do not mount the Docker socket into the practice app.

Return to the base configuration:

```bash
docker compose up -d --build --wait
```

## 20. Image tags, digests, and registries

### Tags

```bash
docker tag docker-revision:1.0 docker-revision:practice
docker image ls docker-revision
docker image inspect --format '{{.Id}}' docker-revision:1.0
docker image inspect --format '{{.Id}}' docker-revision:practice
```

**What this does:** gives the same image another name. It does not duplicate all its filesystem layers.

A tag is a movable reference. `latest` is just a tag, and does not guarantee a release is suitable for your project.

### Digests

```bash
docker pull node:24-bookworm-slim
docker image inspect --format '{{index .RepoDigests 0}}' node:24-bookworm-slim
```

**What this does:** prints a registry reference containing `@sha256:…`. To pin content, use that full reference in `FROM` and update it deliberately when adopting fixes.

A local image ID and a registry digest serve different purposes. A locally built image may have no `RepoDigests` until registry interaction establishes one.

### Push an image to a registry

This optional lab requires a registry account and an appropriate repository. Replace the placeholder value locally; do not commit credentials.

```bash
REGISTRY_NAMESPACE=replace_with_your_registry_namespace

docker login
docker tag docker-revision:1.0 \
  "$REGISTRY_NAMESPACE/docker-revision:1.0"
docker push "$REGISTRY_NAMESPACE/docker-revision:1.0"
docker logout
```

**What this does:** signs into Docker Hub, tags the image for your repository, uploads it, and removes the stored login entry. Use an access token when your registry requires one.

For a private registry, include its hostname in the image reference and pass the hostname to `docker login`.

### Architecture

```bash
docker buildx ls
docker buildx imagetools inspect node:24-bookworm-slim
docker buildx build --platform linux/amd64 \
  --target production -t docker-revision:amd64 --load .
```

**What this does:** inspects available builders and image platforms, then builds one platform and loads it into the local image store.

Choose `linux/arm64` for an ARM target. Cross-platform builds may need emulation or a compatible builder; native dependencies must match the target image's operating system and architecture.

## 21. Compose commands and scaling

| Command | Effect |
| --- | --- |
| `docker compose config --quiet` | Validates the resolved Compose configuration. |
| `docker compose up -d --build --wait` | Builds, starts in the background, and waits for running/healthy services. |
| `docker compose ps` | Lists project containers and their state. |
| `docker compose logs -f app` | Follows one service's logs. |
| `docker compose exec app sh` | Opens a shell in the existing app container. |
| `docker compose run --rm --no-deps app node --version` | Runs a one-off app-service container without starting dependencies. |
| `docker compose restart app` | Restarts the existing app container. |
| `docker compose up -d app` | Applies changed service configuration by creating/recreating as needed. |
| `docker compose down` | Removes project containers and networks; preserves named volumes. |

Use the same `-f` file arguments while operating a stack with overlays, particularly when starting it or applying changes.

### Avoid fixed-port collisions when scaling

Two replicas cannot both publish host port `3000`. Use this separate overlay with Compose **2.24.4 or later**. `!override` replaces the base port list instead of merging it.

**File: `compose.scale.yaml`**

```yaml
services:
  app:
    ports: !override
      - "127.0.0.1::3000"
```

```bash
docker compose -f compose.yaml -f compose.scale.yaml \
  up -d --build --scale app=2 --wait

docker compose -f compose.yaml -f compose.scale.yaml ps
docker compose -f compose.yaml -f compose.scale.yaml port --index 1 app 3000
docker compose -f compose.yaml -f compose.scale.yaml port --index 2 app 3000
```

**What this does:** assigns a different available host port to each replica. Open `http://` followed by each printed address in your browser; both apps use the same PostgreSQL records.

This publishes two separate endpoints. Add a reverse proxy when you need one endpoint that distributes requests across replicas.

Remove the replicated containers while preserving the database, then restore the base stack:

```bash
docker compose -f compose.yaml -f compose.scale.yaml down
docker compose up -d --build --wait
```

## 22. Back up and restore the practice database

### Create a logical backup

```bash
mkdir -p backups

docker compose exec -T db \
  pg_dump -U revision_user -d revision_db --format=custom \
  > backups/revision_db.dump
```

**What this does:** writes a PostgreSQL archive to your host. `-T` disables the pseudo-terminal so the binary archive is not affected by terminal handling.

Keep backups private if they contain real data. The sample `.gitignore` excludes the backups directory.

### Restore into a separate database

Use a new restore database name if `revision_restore` already exists.

```bash
docker compose exec db createdb -U revision_user revision_restore

docker compose exec -T db \
  pg_restore -U revision_user -d revision_restore --exit-on-error \
  < backups/revision_db.dump

docker compose exec db psql -U revision_user -d revision_restore \
  -c "SELECT COUNT(*) FROM visits;"
```

**What this does:** checks that a backup can recreate the table and its records in another database, while the running app continues using `revision_db`.

For a running database, use its supported backup tools. Copying its live data directory as ordinary files can produce an unusable backup.

## 23. Troubleshooting

Start with the failing service's status and logs:

```bash
docker compose ps -a
docker compose logs --tail 80 app db
docker compose config --quiet
```

| Symptom | Check or fix |
| --- | --- |
| Cannot connect to Docker daemon | Check `sudo systemctl status docker` and your selected Docker context with `docker context ls`. |
| Permission denied on Docker socket | Use `sudo docker …` or finish the documented group/rootless setup. Do not make the socket world-writable. |
| Container immediately exits | Run `docker ps -a`, then `docker logs <container>`; check the startup command and required files. |
| Port already allocated | Stop the old server/container or change the host port. For Compose, change `APP_HOST_PORT` in `.env` and run `up -d`. |
| Browser cannot connect | Check the published port, app logs, and its `0.0.0.0` listener. `EXPOSE` does not publish a port. |
| App cannot reach database | Use `PGHOST=db` in Compose; verify both services share a network. `localhost` inside the app is the app container. |
| App returns `503` | Check database health, credentials, and the `visits` table. |
| Frozen lockfile error | Run `pnpm install` after changing `package.json`, commit the resulting lockfile, then rebuild. |
| Missing dependency after bind mount | Avoid mounting the whole host project over the image's `/app`; mount source paths separately. |
| Edited source has no effect | Rebuild/recreate, or start the bind-mount/Watch development configuration. |
| Edited environment value has no effect | Recreate with `docker compose up -d`; restarting preserves old container configuration. |
| Edited init SQL has no effect | The database already exists; apply a migration or deliberately reset the practice volume. |
| Database password fails after secret change | Initialization does not update existing role passwords; change the database password explicitly or reset disposable lab data. |
| Secret file permission denied | Check the host file mode and the container's user; a host-only `0600` file may be unreadable by the container user. |
| Compose rejects `develop` or `!override` | Check `docker compose version` and update the plugin for that lab's minimum version. |
| Container is unhealthy but still running | Inspect health output; health status and process restart policy are separate mechanisms. |
| `exec format error` | Check whether the image architecture matches the host or has emulation support. |
| Container exits with code `137` | Check `.State.OOMKilled`; memory exhaustion or an external kill can cause this exit code. |
| Disk space is low | Use `docker system df` to inspect images, containers, volumes, and build cache before selecting cleanup targets. |

Inspect recent health-check results:

```bash
docker inspect --format '{{json .State.Health}}' \
  "$(docker compose ps -q app)"

docker inspect --format '{{.State.OOMKilled}}' \
  "$(docker compose ps -q app)"

docker system df
```

If an image does not include `curl`, use an existing runtime tool. The app's Node.js `fetch` example in section 14 works without installing a debugging package into the production image.

## 24. Cleanup

### Stop the project and retain the database

```bash
docker compose down
```

### Delete this project's database deliberately

This removes all visits stored in its named volume:

```bash
docker compose down --volumes
```

### Remove the standalone storage lab

After section 10's one-off containers have exited:

```bash
docker volume rm revision-data
```

### Remove selected lab images

After all containers using them have been removed, run only the applicable commands:

```bash
docker image rm docker-revision:arg docker-revision:practice
docker image rm docker-revision:1.0 docker-revision:fresh docker-revision:amd64
docker image rm docker-revision:compose docker-revision:development
docker image rm revision-build-secret revision-args
```

**What this does:** removes the selected tags/images. Other tags can keep the same image layers referenced. Docker's build cache has its own lifecycle.

Keep `.secrets/db_password.txt` if you keep the database volume; you still need its matching password. Review global prune commands before using them: they can affect other projects, and volume pruning can remove data.

## 25. Practice challenges

| Challenge | What you should observe |
| --- | --- |
| Record visits in the standalone app, then restart it. | Memory state resets. |
| Record visits with Compose, then run `down` and `up`. | Named-volume data remains. |
| Change only the host port. | Browser URL changes; app still listens on container port `3000`. |
| Remove `PGHOST` from the app's Compose environment and recreate it. | App returns to memory mode; existing database records remain stored in PostgreSQL. |
| Edit HTML without rebuilding a production container. | The running image's page stays the same. |
| Repeat the edit using the bind-mount or Watch overlay. | Refresh shows the new page. |
| Stop only the database. | Liveness stays available; readiness/API storage operations fail until the database returns. |
| Change init SQL with an existing volume. | Restart does not apply the new schema. |
| Add a dependency and rebuild. | Dependency installation reruns, while cached downloads may be reused. |
| Use the hardened overlay. | App cannot write to its root filesystem; `/tmp` remains writable. |
| Scale to two app replicas with random host ports. | Both browser endpoints share the persisted visit records. |
| Restore the backup into a new database. | Restored row count matches the backed-up records. |

Restore modified configuration after each experiment so later labs use the documented baseline.

## 26. Command cheat sheet

| Goal | Command |
| --- | --- |
| Verify client and daemon | `docker version` |
| Verify Compose plugin | `docker compose version` |
| Pull an image | `docker pull node:24-bookworm-slim` |
| List images | `docker image ls` |
| Build an app image | `docker build --target production -t docker-revision:1.0 .` |
| Run an interactive temporary container | `docker run --rm -it alpine:3.22 sh` |
| List running / all containers | `docker ps` / `docker ps -a` |
| Follow logs | `docker logs -f revision-app` |
| Run a command inside a container | `docker exec revision-app node --version` |
| Stop / remove a container | `docker stop revision-app` / `docker rm revision-app` |
| Show container details | `docker inspect revision-app` |
| Show resource use | `docker stats --no-stream` |
| List networks | `docker network ls` |
| List volumes | `docker volume ls` |
| Inspect volume details | `docker volume inspect docker-revision_db_data` |
| Validate Compose | `docker compose config --quiet` |
| Build and start the stack | `docker compose up -d --build --wait` |
| Show service status | `docker compose ps` |
| Follow service logs | `docker compose logs -f app` |
| Open database shell | `docker compose exec db psql -U revision_user -d revision_db` |
| Stop stack, retain named volumes | `docker compose down` |
| Reset practice data | `docker compose down --volumes` — deletes this project's volumes |
| Inspect disk usage | `docker system df` |

## 27. Official references

- [Docker Engine installation on Ubuntu](https://docs.docker.com/engine/install/ubuntu/)
- [Linux post-installation steps](https://docs.docker.com/engine/install/linux-postinstall/)
- [Rootless Docker](https://docs.docker.com/engine/security/rootless/)
- [Dockerfile reference](https://docs.docker.com/reference/dockerfile/)
- [Running containers](https://docs.docker.com/engine/containers/run/)
- [Container restart policies](https://docs.docker.com/engine/containers/start-containers-automatically/)
- [Port publishing](https://docs.docker.com/engine/network/port-publishing/)
- [Volumes](https://docs.docker.com/engine/storage/volumes/)
- [Bind mounts](https://docs.docker.com/engine/storage/bind-mounts/)
- [Compose file reference](https://docs.docker.com/reference/compose-file/)
- [Networking in Compose](https://docs.docker.com/compose/how-tos/networking/)
- [Secrets in Compose](https://docs.docker.com/compose/how-tos/use-secrets/)
- [Compose Watch](https://docs.docker.com/compose/how-tos/file-watch/)
- [Compose merge and override rules](https://docs.docker.com/reference/compose-file/merge/)
- [pnpm with Docker](https://pnpm.io/docker)
- [Official Node.js image](https://hub.docker.com/_/node)
- [Official PostgreSQL image](https://hub.docker.com/_/postgres)
