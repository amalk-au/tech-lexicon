# Practical system-design labs

[Design exercises and review criteria](../../software-engineering-theory/system-design/system-design-exercises.md) · [Interview hub](../../tech-interview-preparation/README.md)

Run three deterministic JavaScript models, observe a failure, then change a constraint and explain the effect on the architecture. These are single-process, in-memory teaching models: they demonstrate cache expiry, retry semantics, and lease ownership. They do not simulate network concurrency or provide durable distributed transactions.

## Run on Ubuntu

Use Node.js 24 or newer and pnpm. No third-party dependencies or services are needed for the JavaScript labs. From the repository root:

```bash
cd software-engineering/practice/system-design
pnpm install --offline
pnpm test
pnpm run lab all
```

Expected lab output, after pnpm's script header:

```text
cache: {"stalePrice":10,"freshAfterTtl":12,"freshAfterInvalidation":12,"databaseReads":2}
idempotency: {"remainingAfterRetry":3,"sameResponse":true,"keyConflict":true,"naiveRemainingAfterRetry":1}
jobs: {"attempts":2,"effects":1,"staleAck":false,"finished":true}
```

| Command | Observe |
| --- | --- |
| `pnpm run lab cache` | A cached value stays stale without invalidation until its TTL expires |
| `pnpm run lab idempotency` | A retry replays a response without reserving inventory again |
| `pnpm run lab jobs` | A worker crash causes another attempt; the stable effect key suppresses a duplicate |
| `pnpm test` | Verify TTL boundaries, key conflicts, ownership, mutation isolation, and scenarios |

Each lab asserts its expected behaviour. The examples use synthetic IDs and data; no credentials are required. Time is advanced by changing a number, so there are no real-time sleeps or flaky timing checks.

## Change and explain

1. Read the corresponding [design prompt](../../software-engineering-theory/system-design/system-design-exercises.md) and sketch your design before opening the implementation.
2. Run the lab and inspect `scripts/scenarios.js` and the matching `src/` file.
3. Make one deliberate change below, predict what fails, and run the test.
4. Restore the correct behaviour, add one new case, and explain the production mechanism needed.

| Lab | Deliberate change | Why it matters |
| --- | --- | --- |
| Cache | Use `invalidateOnWrite: false`; vary TTL | A faster read can serve older data; TTL only bounds this model's staleness |
| Idempotency | Replace a retry's key with a new key | The server cannot distinguish a retry from a new intent without stable identity |
| Jobs | Use `${job.id}:${job.attempts}` as the sink key | Attempt IDs do not deduplicate the same logical effect across retries |
| Jobs | Remove the token/expiry checks from `ack()` | An old worker may complete a lease now owned by another worker |

In the models, updates execute synchronously. With `await`, multiple processes, persistent storage, or an external effect, the atomicity boundaries change. The design notes explain the transaction, invalidation-race, and provider-idempotency questions to resolve next. The job model omits backoff, dead-letter queues, lease renewal, and bounded storage; adding these is part of the exercise.

## Optional PostgreSQL contention lab

Prerequisites: a running **local** PostgreSQL server, `psql`, and permission to create a fresh disposable database. The transaction scripts explicitly use **Read Committed** isolation for the observations below. These SQL exercises are separate from `pnpm test` and require the database service.

From this directory, create the lab database and schema once:

```bash
createdb system_design_lab
psql system_design_lab -f sql/setup.sql
```

Open two terminals in this directory. In **both**, start an interactive session:

```bash
psql system_design_lab
```

In terminal A:

```sql
\i sql/reserve.sql
-- One row is returned, with available = 0. Keep the transaction open.
```

In terminal B:

```sql
\i sql/reserve.sql
-- The UPDATE waits for A's row lock.
```

Now type `COMMIT;` in A. B resumes and returns **zero rows**: after waiting, PostgreSQL rechecks the condition against the committed stock of zero. Type `COMMIT;` in B, then check:

```sql
SELECT * FROM design_lab.inventory;
-- widget | 0
```

To repeat, finish both transactions and reset only the lab row:

```sql
UPDATE design_lab.inventory SET available = 1 WHERE sku = 'widget';
```

Repeat with `ROLLBACK;` in A: B should then reserve the remaining item. Do not run `reserve.sql` with a one-shot `psql -f`: the script deliberately leaves a transaction open, and disconnecting would roll it back. This query prevents overselling one SKU; durable request deduplication is a separate requirement.

## Optional PostgreSQL worker lab

With the same fresh schema, claim a job from a shell:

```bash
psql system_design_lab -f sql/claim-job.sql
```

Record the returned `id` and `lease_token`. A second claim should take the other ready job while the first lease is active. Acknowledge using the values you actually received (replace the sample integers):

```bash
psql system_design_lab -v job_id=1 -v lease_token=1 -f sql/ack-job.sql
```

An acknowledgement returns one row only while that token owns an active lease. To model a crash without waiting, expire a leased row in this disposable database:

```sql
UPDATE design_lab.jobs
SET lease_until = clock_timestamp() - interval '1 second'
WHERE id = 1 AND state = 'leased';
```

Claim again; observe the increased attempt count and new token. An acknowledgement with the old token must return zero rows. If there is another ready job ahead of this one, claim it first or complete it before retrying the expired job. Use the token from the new claim for a valid acknowledgement.

`FOR UPDATE SKIP LOCKED` keeps competing workers from claiming a currently locked candidate; the lease keeps ownership after the short transaction commits. It does not guarantee processing order or prevent a repeated external side effect. Extend the [job exercise](../../software-engineering-theory/system-design/system-design-exercises.md#exercise-3-recoverable-background-jobs) to handle those concerns.
