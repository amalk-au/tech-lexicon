\set ON_ERROR_STOP on
-- Supply integers with psql -v job_id=... -v lease_token=...
UPDATE design_lab.jobs
SET state = 'done'
WHERE id = :job_id
  AND lease_token = :lease_token
  AND state = 'leased'
  AND lease_until > clock_timestamp()
RETURNING id, state;
