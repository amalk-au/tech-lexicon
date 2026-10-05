\set ON_ERROR_STOP on
-- Load with \i sql/reserve.sql from an INTERACTIVE psql session.
-- Deliberately leave this transaction open; type COMMIT or ROLLBACK yourself.
BEGIN ISOLATION LEVEL READ COMMITTED;
UPDATE design_lab.inventory
SET available = available - 1
WHERE sku = 'widget' AND available >= 1
RETURNING sku, available;
