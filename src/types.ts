/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Company {
  id?: string;
  cnpj: string;
  name: string;
  enabled: boolean;
  enabled_from: string; // ISO date string (YYYY-MM-DD)
  enabled_until: string; // ISO date string (YYYY-MM-DD)
  created_at?: string;
}

export type QuestionType = 'scale' | 'boolean';

export interface Question {
  id: string;
  section_id: number;
  section_title: string;
  text: string;
  type: QuestionType;
  is_inverted: boolean;
  created_at?: string;
}

export interface SectionScore {
  sum: number;
  max: number;
  min: number;
  percentage: number;
}

export interface CalculationResult {
  total_score: number; // 0 to 100 percentage
  classification: 'Baixo' | 'Moderado' | 'Médio' | 'Alto' | 'Crítico';
  section_scores: Record<string, SectionScore>;
  raw_score: number;
  max_possible: number;
  min_possible: number;
}

export interface Submission {
  id?: string;
  cnpj: string;
  company_name: string;
  respondent_name: string;
  respondent_email: string;
  start_time: string; // ISO string
  end_time: string; // ISO string
  answers: Record<string, string | number>;
  total_score?: number;
  classification?: string;
  section_scores?: Record<string, SectionScore>;
  created_at?: string;
}
