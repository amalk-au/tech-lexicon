\set ON_ERROR_STOP on
BEGIN ISOLATION LEVEL READ COMMITTED;
WITH candidate AS (
  SELECT id
  FROM design_lab.jobs
  WHERE (state = 'ready' AND ready_at <= clock_timestamp())
     OR (state = 'leased' AND lease_until <= clock_timestamp())
  ORDER BY ready_at, id
  LIMIT 1
  FOR UPDATE SKIP LOCKED
)
UPDATE design_lab.jobs AS job
SET state = 'leased',
    attempts = job.attempts + 1,
    lease_token = job.lease_token + 1,
    lease_until = clock_timestamp() + interval '30 seconds'
FROM candidate
WHERE job.id = candidate.id
RETURNING job.id, job.payload, job.attempts, job.lease_token, job.lease_until;
COMMIT;
