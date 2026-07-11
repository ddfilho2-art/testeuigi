import * as XLSX from 'xlsx';
import type { Submission } from '../../src/types';

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

  const worksheet = XLSX.utils.json_to_sheet(exportRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório Geral');

  return XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
}
