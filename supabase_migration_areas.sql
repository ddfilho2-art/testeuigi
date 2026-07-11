-- Incremental migration for area-based assessment responses.
-- Run this once in Supabase SQL Editor after the original schema.

ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS areas JSONB NOT NULL DEFAULT '["Geral"]'::jsonb;

ALTER TABLE responses
  ADD COLUMN IF NOT EXISTS area TEXT NOT NULL DEFAULT 'Geral';

-- Normalize legacy blank values and CNPJs before deduplicating and creating the key.
UPDATE companies
SET areas = '["Geral"]'::jsonb
WHERE areas IS NULL OR jsonb_typeof(areas) <> 'array' OR jsonb_array_length(areas) = 0;

-- Remove duplicate company rows that would collide after CNPJ normalization,
-- keeping the most recently created row.
DELETE FROM companies older
USING companies newer
WHERE regexp_replace(older.cnpj, '[^0-9]', '', 'g') = regexp_replace(newer.cnpj, '[^0-9]', '', 'g')
  AND older.id <> newer.id
  AND (
    older.created_at < newer.created_at
    OR (older.created_at = newer.created_at AND older.id::text < newer.id::text)
  );

UPDATE companies
SET cnpj = regexp_replace(cnpj, '[^0-9]', '', 'g')
WHERE cnpj ~ '[^0-9]';

UPDATE responses
SET cnpj = regexp_replace(cnpj, '[^0-9]', '', 'g')
WHERE cnpj ~ '[^0-9]';

UPDATE responses
SET area = 'Geral'
WHERE area IS NULL OR btrim(area) = '';

CREATE INDEX IF NOT EXISTS idx_responses_cnpj_area
  ON responses (cnpj, area);

-- Keep only the latest response for each company/area going forward.
-- If duplicates already exist, retain the newest row before adding the key.
DELETE FROM responses older
USING responses newer
WHERE older.cnpj = newer.cnpj
  AND older.area = newer.area
  AND (
    older.created_at < newer.created_at
    OR (older.created_at = newer.created_at AND older.id::text < newer.id::text)
  );

CREATE UNIQUE INDEX IF NOT EXISTS uq_responses_cnpj_area
  ON responses (cnpj, area);
