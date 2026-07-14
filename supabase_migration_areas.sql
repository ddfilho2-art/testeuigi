-- Historical response migration (non-destructive).
-- This script never deletes, merges, or rewrites rows in responses.
-- It only adds the area column if needed, removes the old uniqueness rule,
-- and creates non-unique indexes for reporting.

ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS areas JSONB NOT NULL DEFAULT '["Geral"]'::jsonb;

ALTER TABLE responses
  ADD COLUMN IF NOT EXISTS area TEXT NOT NULL DEFAULT 'Geral';

-- Removing a uniqueness constraint/index does not remove historical rows.
ALTER TABLE responses DROP CONSTRAINT IF EXISTS responses_cnpj_area_unique;
DROP INDEX IF EXISTS uq_responses_cnpj_area;

CREATE INDEX IF NOT EXISTS idx_responses_cnpj_area
  ON responses (cnpj, area);
CREATE INDEX IF NOT EXISTS idx_responses_respondent_email
  ON responses (lower(respondent_email));
