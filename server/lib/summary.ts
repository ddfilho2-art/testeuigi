import type { SectionScore, Submission } from '../../src/types';

export interface CompanySummary {
  cnpj: string;
  company_name: string;
  total_score: number;
  classification: string;
  section_scores: Record<string, SectionScore>;
  areas: Array<{
    area: string;
    score?: number;
    classification?: string;
    respondent_name: string;
    respondent_email: string;
    created_at?: string;
  }>;
}

export function summarizeCompanyResponses(responses: Submission[]): CompanySummary | null {
  if (!responses.length) return null;

  const scores = responses.map((response) => Number(response.total_score || 0));
  const total_score = Number((scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(2));
  const sectionIds = [...new Set(responses.flatMap((response) => Object.keys(response.section_scores || {})))];
  const section_scores: Record<string, SectionScore> = {};

  for (const sectionId of sectionIds) {
    const values = responses
      .map((response) => response.section_scores?.[sectionId]?.percentage)
      .filter((value): value is number => typeof value === 'number');
    if (!values.length) continue;
    section_scores[sectionId] = {
      sum: 0,
      max: 0,
      min: 0,
      percentage: Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2)),
    };
  }

  let classification = 'Baixo';
  if (total_score > 80) classification = 'Crítico';
  else if (total_score > 60) classification = 'Alto';
  else if (total_score > 40) classification = 'Médio';
  else if (total_score > 20) classification = 'Moderado';

  return {
    cnpj: responses[0].cnpj,
    company_name: responses[0].company_name,
    total_score,
    classification,
    section_scores,
    areas: responses.map((response) => ({
      area: response.area || 'Geral',
      score: response.total_score,
      classification: response.classification,
      respondent_name: response.respondent_name,
      respondent_email: response.respondent_email,
      created_at: response.created_at,
    })),
  };
}

export function buildConsolidatedSubmission(responses: Submission[]): Submission | null {
  const summary = summarizeCompanyResponses(responses);
  if (!summary) return null;

  const latest = [...responses].sort((a, b) =>
    new Date(b.created_at || b.end_time).getTime() - new Date(a.created_at || a.end_time).getTime(),
  )[0];

  return {
    ...latest,
    cnpj: summary.cnpj,
    company_name: summary.company_name,
    area: 'Consolidado',
    respondent_name: 'Todas as áreas vigentes',
    respondent_email: '',
    total_score: summary.total_score,
    classification: summary.classification,
    section_scores: summary.section_scores,
  };
}
