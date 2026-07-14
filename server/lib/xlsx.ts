import * as XLSX from 'xlsx';
import type { Submission } from '../../src/types';
import { summarizeAllResponses } from './summary';

export function buildExcelBuffer(submissions: Submission[]): Buffer {
  const exportRows = submissions.map((sub, idx) => {
    const row: Record<string, any> = {
      'Nº': idx + 1,
      'CNPJ da Empresa': sub.cnpj,
      'Área': sub.area || 'Geral',
      'Nome da Empresa': sub.company_name,
      'Nome do Respondente': sub.respondent_name,
      'E-mail do Respondente': sub.respondent_email,
      'Início do Preenchimento': new Date(sub.start_time).toLocaleString('pt-BR'),
      'Fim do Preenchimento': new Date(sub.end_time).toLocaleString('pt-BR'),
      'Pontuação Total (%)': sub.total_score,
      'Classificação do Risco': sub.classification,
    };

    if (sub.section_scores) {
      Object.keys(sub.section_scores).forEach((secId) => {
        row[`Seção ${secId} (%)`] = sub.section_scores![secId].percentage;
      });
    }

    if (sub.answers) {
      Object.keys(sub.answers).forEach((qId) => {
        row[`Questão ${qId}`] = sub.answers[qId];
      });
    }

    return row;
  });

  const detailWorksheet = XLSX.utils.json_to_sheet(exportRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, detailWorksheet, 'Preenchimentos');

  const summary = summarizeAllResponses(submissions);
  const personRows = summary.companies.flatMap((company) =>
    company.people.map((person) => ({
      'CNPJ da Empresa': company.cnpj,
      'Nome da Empresa': company.company_name,
      'Pessoa / Respondente': person.respondent_name,
      'E-mail': person.respondent_email,
      'Quantidade de Preenchimentos': person.response_count,
      'Áreas': person.areas.join(', '),
      'Média (%)': person.total_score,
      'Classificação': person.classification,
    })),
  );
  const areaRows = summary.companies.flatMap((company) =>
    company.areas.map((area) => ({
      'CNPJ da Empresa': company.cnpj,
      'Nome da Empresa': company.company_name,
      'Área': area.area,
      'Quantidade de Preenchimentos': area.response_count,
      'Quantidade de Pessoas': area.respondent_count,
      'Média (%)': area.total_score,
      'Classificação': area.classification,
    })),
  );
  const companyRows = summary.companies.map((company) => ({
    'CNPJ da Empresa': company.cnpj,
    'Nome da Empresa': company.company_name,
    'Pessoas Únicas': company.people_count,
    'Quantidade de Preenchimentos': company.response_count,
    'Média (%)': company.total_score,
    'Classificação': company.classification,
  }));

  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(personRows), 'Por Pessoa');
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(areaRows), 'Por Área');
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(companyRows), 'Por Empresa');

  return XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
}
