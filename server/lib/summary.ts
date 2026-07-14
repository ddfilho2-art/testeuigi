import type { AreaResponseSummary, SectionScore, Submission } from '../../src/types';

export interface SubmissionSummaryItem {
  id?: string;
  area: string;
  total_score?: number;
  classification?: string;
  created_at?: string;
  end_time: string;
}

export interface PersonSummary {
  respondent_name: string;
  respondent_email: string;
  response_count: number;
  total_score: number;
  classification: string;
  section_scores: Record<string, SectionScore>;
  areas: string[];
  submissions: SubmissionSummaryItem[];
}

export interface AreaRespondentSummary {
  respondent_name: string;
  respondent_email: string;
  response_count: number;
  total_score: number;
  classification: string;
}

export interface AreaSummary {
  area: string;
  response_count: number;
  respondent_count: number;
  total_score: number;
  classification: string;
  section_scores: Record<string, SectionScore>;
  respondents: AreaRespondentSummary[];
  responses: AreaResponseSummary[];
}

export interface CompanySummary {
  cnpj: string;
  company_name: string;
  response_count: number;
  people_count: number;
  total_score: number;
  classification: string;
  section_scores: Record<string, SectionScore>;
  people: PersonSummary[];
  areas: AreaSummary[];
}

export interface ReportSummary {
  response_count: number;
  companies: CompanySummary[];
}

function round(value: number): number {
  return Number(value.toFixed(2));
}

export function classifyScore(score: number): string {
  if (score <= 20) return 'Baixo';
  if (score <= 40) return 'Moderado';
  if (score <= 60) return 'Médio';
  if (score <= 80) return 'Alto';
  return 'Crítico';
}

function average(values: number[]): number {
  if (!values.length) return 0;
  return round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function averageSectionScores(responses: Submission[]): Record<string, SectionScore> {
  const sectionIds = [...new Set(responses.flatMap((response) => Object.keys(response.section_scores || {})))];
  const sectionScores: Record<string, SectionScore> = {};

  for (const sectionId of sectionIds) {
    const scores = responses
      .map((response) => response.section_scores?.[sectionId])
      .filter((score): score is SectionScore => Boolean(score));
    if (!scores.length) continue;

    sectionScores[sectionId] = {
      sum: average(scores.map((score) => Number(score.sum || 0))),
      max: average(scores.map((score) => Number(score.max || 0))),
      min: average(scores.map((score) => Number(score.min || 0))),
      percentage: average(scores.map((score) => Number(score.percentage || 0))),
    };
  }

  return sectionScores;
}

function buildMetrics(responses: Submission[]) {
  const total_score = average(responses.map((response) => Number(response.total_score || 0)));
  return {
    response_count: responses.length,
    total_score,
    classification: classifyScore(total_score),
    section_scores: averageSectionScores(responses),
  };
}

function personKey(response: Submission): string {
  const email = response.respondent_email.trim().toLowerCase();
  if (email) return `email:${email}`;
  return `name:${response.respondent_name.trim().toLowerCase()}`;
}

function groupBy<T>(items: T[], keyOf: (item: T) => string): Map<string, T[]> {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const key = keyOf(item);
    const group = groups.get(key);
    if (group) group.push(item);
    else groups.set(key, [item]);
  }
  return groups;
}

function buildPersonSummary(responses: Submission[]): PersonSummary {
  const first = responses[0];
  const metrics = buildMetrics(responses);
  return {
    ...metrics,
    respondent_name: first.respondent_name,
    respondent_email: first.respondent_email,
    areas: [...new Set(responses.map((response) => response.area || 'Geral'))],
    submissions: responses.map((response) => ({
      id: response.id,
      area: response.area || 'Geral',
      total_score: response.total_score,
      classification: response.classification,
      created_at: response.created_at,
      end_time: response.end_time,
    })),
  };
}

function buildAreaSummary(area: string, responses: Submission[]): AreaSummary {
  const metrics = buildMetrics(responses);
  const respondentGroups = groupBy(responses, personKey);
  return {
    ...metrics,
    area,
    respondent_count: respondentGroups.size,
    respondents: [...respondentGroups.values()].map((group) => {
      const person = buildPersonSummary(group);
      return {
        respondent_name: person.respondent_name,
        respondent_email: person.respondent_email,
        response_count: person.response_count,
        total_score: person.total_score,
        classification: person.classification,
      };
    }),
    responses: responses.map((response): AreaResponseSummary => ({
      id: response.id,
      area: response.area || area,
      respondent_name: response.respondent_name,
      respondent_email: response.respondent_email,
      start_time: response.start_time,
      end_time: response.end_time,
      answers: response.answers,
      section_scores: response.section_scores,
      total_score: response.total_score,
      classification: response.classification,
      created_at: response.created_at,
    })),
  };
}

export function summarizeCompanyResponses(responses: Submission[]): CompanySummary | null {
  if (!responses.length) return null;

  const personGroups = groupBy(responses, personKey);
  const areaGroups = groupBy(responses, (response) => (response.area || 'Geral').trim().toLowerCase());
  const metrics = buildMetrics(responses);

  return {
    ...metrics,
    cnpj: responses[0].cnpj,
    company_name: responses[0].company_name,
    people_count: personGroups.size,
    people: [...personGroups.values()].map(buildPersonSummary),
    areas: [...areaGroups.values()].map((group) => buildAreaSummary(group[0].area || 'Geral', group)),
  };
}

export function summarizeAllResponses(responses: Submission[]): ReportSummary {
  const companyGroups = groupBy(responses, (response) => response.cnpj.replace(/\D/g, ''));
  return {
    response_count: responses.length,
    companies: [...companyGroups.values()].map((group) => summarizeCompanyResponses(group)!).filter(Boolean),
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
    respondent_name: 'Todas as pessoas respondentes',
    respondent_email: '',
    total_score: summary.total_score,
    classification: summary.classification,
    section_scores: summary.section_scores,
  };
}
