\set ON_ERROR_STOP on
-- Run once in a fresh, disposable system_design_lab database.
CREATE SCHEMA design_lab;

CREATE TABLE design_lab.inventory (
  sku text PRIMARY KEY,
  available integer NOT NULL CHECK (available >= 0)
);
INSERT INTO design_lab.inventory (sku, available) VALUES ('widget', 1);

CREATE TABLE design_lab.jobs (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  payload jsonb NOT NULL,
  state text NOT NULL DEFAULT 'ready' CHECK (state IN ('ready', 'leased', 'done')),
  attempts integer NOT NULL DEFAULT 0,
  lease_token bigint NOT NULL DEFAULT 0,
  lease_until timestamptz,
  ready_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX jobs_ready ON design_lab.jobs (ready_at, id) WHERE state = 'ready';
INSERT INTO design_lab.jobs (payload) VALUES
  ('{"kind":"export-ready"}'), ('{"kind":"export-ready"}');
