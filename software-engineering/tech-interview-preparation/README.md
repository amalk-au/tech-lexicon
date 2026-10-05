# Technical interview preparation

[Back to Main Index](../../README.md)

- [Quick Interview Revision](./quick-interview-prep.md)
- [Practical system-design exercises](../software-engineering-theory/system-design/system-design-exercises.md): requirements, estimates, APIs, data models, failure cases, and review criteria.
- [Runnable labs](../tech-interview-preparation/practice/README.md): cache expiry, idempotent retries, worker leases, and optional PostgreSQL contention exercises.

Use this page as a route through reusable engineering notes and practical interview exercises. The subject guides live with the theory so they remain useful outside interview preparation; this folder holds the revision route and short interview sheet.

## Start here

| Need                               | Open                                                                                                   | What to do                                                 |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| A final 5–10 minute refresh        | [Quick interview sheet](./quick-interview-prep.md)                                                     | Recall the concepts before reading the answers             |
| Structure selection and operations | [Data structures revision](../software-engineering-theory/data-structures/data-structures-revision.md) | Choose a structure, explain its invariant, run its example |
| Coding patterns and complexity     | [Algorithms revision](../software-engineering-theory/algorithms/algorithms-revision.md)                | Explain why the pattern works and implement it from memory |
| Hands-on coding                    | [Runnable DSA practice](../practice/dsa/README.md)                                                     | Edit starters and check them against edge cases            |
| Architecture and failure handling  | [System-design exercises](../software-engineering-theory/system-design/system-design-exercises.md)     | Design an API/schema, estimate load, and test a failure    |
| Runnable design demonstrations     | [System-design labs](../practice/system-design/README.md)                                              | Observe stale caches, retries, and worker recovery         |

**Why two DSA documents?** Data structures answer “how should I store and access this data?” Algorithms answer “what steps solve this problem?” Each begins with a compact lookup table and links to the other. Keeping them separate makes targeted revision faster while preserving complete, runnable examples for learning.

## Run the practice packages on Ubuntu

Use Node.js 24 or newer and pnpm. Neither package has third-party dependencies. From the repository root:

```bash
cd software-engineering/practice/dsa
pnpm install --offline
pnpm run check
pnpm run demo all
pnpm run exercise valid-brackets
```

The last command initially fails because the exercise is a starter. Implement `solve` in `exercises/valid-brackets.js`, rerun it, then compare with `pnpm run exercise:solution valid-brackets`. `pnpm test` checks the completed references; it does not check unfinished exercise starters.

For design labs, from the repository root:

```bash
cd software-engineering/practice/system-design
pnpm install --offline
pnpm test
pnpm run lab all
```

The JavaScript design labs run without services. Optional PostgreSQL exercises need a separate local disposable database; instructions are in the [lab README](../practice/system-design/README.md).

## A revision loop that builds recall

1. **Recall:** scan a lookup table, then close it and explain the concept aloud.
2. **Implement:** attempt one editable exercise without viewing its solution.
3. **Verify:** test empty input, boundaries, duplicates, and the problem-specific failure case.
4. **Explain:** state the invariant, complexity, output size, mutation, and alternatives.
5. **Repeat:** solve the pattern again after a gap, then try a differently worded problem.

A short coding session can be 5 minutes of recall, 20 minutes of solving, and 5 minutes of review. Use a longer block for a design attempt. Track mistakes and retry dates privately; keep committed notes generic and free of personal details.

Suggested first coding order: Map counts → bracket stack → linked-list reversal → binary search → fixed window → interval merging → heap selection → BFS path → coin DP. The [exercise guide](../practice/dsa/exercises/README.md) gives exact contracts and hints.

## Use the existing subject guides

Read the deeper guide only when a recall question exposes a gap. Keep the quick sheet short and link back to these explanations rather than duplicating them.

| Area                       | Reusable guide                                                                                                                                                                                                    |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| JavaScript                 | [Concise revision](../frontend/javascript/javascript-revision-concise.md), [extended revision](../frontend/javascript/javascript-revision-extended.md), [question bank](../frontend/javascript/javascript-q&a.md) |
| TypeScript                 | [TypeScript revision](../fullstack/typescript/typescript-revision.md)                                                                                                                                             |
| React                      | [React revision](../frontend/javascript/react/react-revision.md)                                                                                                                                                  |
| Next.js                    | [Next.js revision](../frontend/javascript/react/nextjs/nextjs-revision.md)                                                                                                                                        |
| Node.js / Express          | [Node.js](../backend/nodejs/nodejs-revision.md), [Express](../backend/nodejs/nodejs-express-revision.md)                                                                                                          |
| PostgreSQL / Prisma        | [SQL revision](../backend/database/postgresql/postgres-sql-revision.md), [Prisma revision](../backend/database/prisma-orm/prisma-orm-revision.md)                                                                 |
| Testing                    | [Testing revision](../fullstack/software-testing/testing-revision.md)                                                                                                                                             |
| Docker / AWS               | [Docker revision](../devops-cloud/containerization/docker/docker-revision.md), [AWS web development](../devops-cloud/cloud-providers/aws/aws-webdev-revision.md)                                                  |
| Git                        | [Git/GitHub revision](../tools/git/git-github-revision.md)                                                                                                                                                        |
| Design and maintainability | [Engineering basics](../software-engineering-theory/software-engineering-basics.md), [clean code](../software-engineering-theory/clean-code.md), [TDD](../software-engineering-theory/test-driven-development.md) |

## Adjust to the interview format

Ask for the actual interview format and allowed language/tools. Use that information to allocate practice time rather than assuming every role tests the same things.

| Format                   | Practise                                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------------------------ |
| General coding           | Input contracts, core DSA patterns, edge cases, complexity, and communication                                |
| Frontend                 | JavaScript/TypeScript, React state/effects, accessibility, browser behaviour, testing, and UI implementation |
| Full-stack / backend     | APIs, validation, SQL, transactions, error handling, testing, caching, retries, and background work          |
| System design            | Requirements, estimates, tradeoffs, failure recovery, data models, and observability                         |
| Behavioural / experience | A private set of examples using situation, task, action, result, and reflection                              |

Before a coding interview, practise with the permitted setup. Before a take-home, practise running and explaining the project from a clean checkout. For experience questions, prepare specific decisions and outcomes privately instead of placing identifying stories in this public repository.

## Do LeetCode or NeetCode too?

Yes—use selected problems to test transfer after learning the local pattern. The notes teach and refresh; unseen problems test whether you can recognise and apply the idea independently. You do not need to finish both platforms' curricula.

Choose one route, such as [LeetCode 75](https://leetcode.com/studyplan/leetcode-75/) or [NeetCode practice](https://neetcode.io/practice). Start with a problem matching a pattern you have learned. Attempt it before reading an explanation, review one missed invariant, then re-solve it later. Avoid using a solved-problem count as the only measure of progress.

Readiness means you can derive an approach, code it, test it, explain the cost, and adapt when the constraints change. Keep practical web/API work and system design in the revision loop when the target interview includes them.
