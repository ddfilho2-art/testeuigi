-- ============================================================
-- SCHEMA FOR SUPABASE DATABASE (CONTROL MED)
-- Execute this script in your Supabase SQL Editor.
-- It creates the tables, indexes, the RPC scoring function, and
-- storage buckets used by the application.
-- ============================================================

-- Safe bootstrap for Supabase. This script is non-destructive:
-- it never drops tables, deletes rows, or merges historical responses.
-- Use supabase_migration_areas.sql once to remove the old unique constraint.

CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cnpj TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  enabled_from DATE NOT NULL,
  enabled_until DATE NOT NULL,
  areas JSONB NOT NULL DEFAULT '["Geral"]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------
-- Table: questions
-- The assessment questions. type is 'scale' (1-5) or 'boolean'.
-- is_inverted flips the scale direction for scoring.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  section_id INT NOT NULL,
  section_title TEXT NOT NULL,
  text TEXT NOT NULL,
  type TEXT NOT NULL, -- 'scale' or 'boolean'
  is_inverted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------
-- Historical response table: every form submission is retained, including
-- multiple submissions from the same person, area, or company.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cnpj TEXT NOT NULL,
  area TEXT NOT NULL DEFAULT 'Geral',
  company_name TEXT NOT NULL,
  respondent_name TEXT NOT NULL,
  respondent_email TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  answers JSONB NOT NULL,
  total_score NUMERIC NOT NULL,
  classification TEXT NOT NULL,
  section_scores JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add area support to databases created before the area feature.
-- Existing response rows are preserved; legacy rows receive the explicit
-- default area only because the column did not exist in the old schema.
ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS areas JSONB NOT NULL DEFAULT '["Geral"]'::jsonb;
ALTER TABLE responses
  ADD COLUMN IF NOT EXISTS area TEXT NOT NULL DEFAULT 'Geral';

-- Helpful indexes for the common query patterns used by the API.
CREATE INDEX IF NOT EXISTS idx_companies_cnpj ON companies (cnpj);
CREATE INDEX IF NOT EXISTS idx_responses_cnpj ON responses (cnpj);
CREATE INDEX IF NOT EXISTS idx_responses_created_at ON responses (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_responses_cnpj_area ON responses (cnpj, area);

-- ============================================================
-- CALCULATION ENGINE FUNCTION (SQL-RPC)
-- Computes the total score (as a 0-100 percentage), the risk
-- classification, and per-section scores from the answers JSONB.
-- Invoked server-side via supabase.rpc('calculate_assessment_score').
-- ============================================================
CREATE OR REPLACE FUNCTION calculate_assessment_score(answers JSONB)
RETURNS JSONB AS $$
DECLARE
  rec RECORD;
  q_id TEXT;
  q_val TEXT;
  item_score NUMERIC;
  total_score NUMERIC := 0;
  max_possible NUMERIC := 0;
  min_possible NUMERIC := 0;
  section_scores JSONB := '{}'::jsonb;
  section_sums JSONB := '{}'::jsonb;
  section_counts JSONB := '{}'::jsonb;
  section_maxes JSONB := '{}'::jsonb;
  section_mins JSONB := '{}'::jsonb;
  sec_id TEXT;
  final_percentage NUMERIC;
  classification TEXT;
  result JSONB;
BEGIN
  FOR rec IN SELECT id, section_id, section_title, type, is_inverted FROM questions LOOP
    q_id := rec.id;
    IF jsonb_exists(answers, q_id) THEN
      q_val := answers->>q_id;
      IF rec.type = 'scale' THEN
        item_score := q_val::NUMERIC;
        IF rec.is_inverted THEN
          item_score := 6 - item_score;
        END IF;
        max_possible := max_possible + 5;
        min_possible := min_possible + 1;
        sec_id := rec.section_id::TEXT;
        section_sums := jsonb_set(section_sums, ARRAY[sec_id], to_jsonb(coalesce((section_sums->>sec_id)::NUMERIC, 0) + item_score));
        section_counts := jsonb_set(section_counts, ARRAY[sec_id], to_jsonb(coalesce((section_counts->>sec_id)::NUMERIC, 0) + 1));
        section_maxes := jsonb_set(section_maxes, ARRAY[sec_id], to_jsonb(coalesce((section_maxes->>sec_id)::NUMERIC, 0) + 5));
        section_mins := jsonb_set(section_mins, ARRAY[sec_id], to_jsonb(coalesce((section_mins->>sec_id)::NUMERIC, 0) + 1));
      ELSIF rec.type = 'boolean' THEN
        IF q_val = 'Sim' THEN
          item_score := 5;
        ELSE
          item_score := 1;
        END IF;
        max_possible := max_possible + 5;
        min_possible := min_possible + 1;
        sec_id := rec.section_id::TEXT;
        section_sums := jsonb_set(section_sums, ARRAY[sec_id], to_jsonb(coalesce((section_sums->>sec_id)::NUMERIC, 0) + item_score));
        section_counts := jsonb_set(section_counts, ARRAY[sec_id], to_jsonb(coalesce((section_counts->>sec_id)::NUMERIC, 0) + 1));
        section_maxes := jsonb_set(section_maxes, ARRAY[sec_id], to_jsonb(coalesce((section_maxes->>sec_id)::NUMERIC, 0) + 5));
        section_mins := jsonb_set(section_mins, ARRAY[sec_id], to_jsonb(coalesce((section_mins->>sec_id)::NUMERIC, 0) + 1));
      END IF;
      total_score := total_score + item_score;
    END IF;
  END LOOP;
  IF (max_possible - min_possible) > 0 THEN
    final_percentage := round(((total_score - min_possible) / (max_possible - min_possible) * 100)::NUMERIC, 2);
  ELSE
    final_percentage := 0;
  END IF;
  IF final_percentage <= 20 THEN
    classification := 'Baixo';
  ELSIF final_percentage <= 40 THEN
    classification := 'Moderado';
  ELSIF final_percentage <= 60 THEN
    classification := 'Médio';
  ELSIF final_percentage <= 80 THEN
    classification := 'Alto';
  ELSE
    classification := 'Crítico';
  END IF;
  FOR sec_id IN SELECT DISTINCT section_id::TEXT FROM questions ORDER BY section_id::INT LOOP
    IF jsonb_exists(section_sums, sec_id) THEN
      DECLARE
        s_sum NUMERIC := (section_sums->>sec_id)::NUMERIC;
        s_max NUMERIC := (section_maxes->>sec_id)::NUMERIC;
        s_min NUMERIC := (section_mins->>sec_id)::NUMERIC;
        s_perc NUMERIC := 0;
      BEGIN
        IF (s_max - s_min) > 0 THEN
          s_perc := round(((s_sum - s_min) / (s_max - s_min) * 100)::NUMERIC, 2);
        END IF;
        section_scores := jsonb_set(section_scores, ARRAY[sec_id], jsonb_build_object('sum', s_sum, 'max', s_max, 'min', s_min, 'percentage', s_perc));
      END;
    END IF;
  END LOOP;
  result := jsonb_build_object('total_score', final_percentage, 'classification', classification, 'section_scores', section_scores, 'raw_score', total_score, 'max_possible', max_possible, 'min_possible', min_possible);
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- STORAGE BUCKET: avatars (public)
-- Used by the admin profile avatar upload endpoint.
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;
