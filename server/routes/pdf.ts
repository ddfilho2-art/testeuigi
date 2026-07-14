import express from 'express';
import { getHistoricalResponses } from '../lib/historical';
import { cleanCNPJ } from '../lib/cnpj';
import { generatePdfBuffer } from '../lib/pdf';
import { authenticateAdmin } from '../lib/auth';
import { buildConsolidatedSubmission, summarizeCompanyResponses } from '../lib/summary';
import type { Submission } from '../../src/types';

const router = express.Router();

// Reports contain respondent data and are available only to administrators.
router.get('/generate-pdf', authenticateAdmin, async (req, res) => {
  const { id, cnpj, scope, area, respondent_name, respondent_email } = req.query;

  if (!id && !cnpj) {
    return res.status(400).json({ error: 'ID da resposta ou CNPJ é obrigatório para gerar o PDF.' });
  }

  const targetCnpj = typeof cnpj === 'string' ? cnpj : '';
  const targetId = typeof id === 'string' ? id : undefined;
  const requestedScope = typeof scope === 'string' ? scope : 'company';
  const reportScope = requestedScope === 'area' || requestedScope === 'person' ? requestedScope : 'company';
  const targetArea = typeof area === 'string' ? area.trim().toLowerCase() : '';
  const targetRespondentName = typeof respondent_name === 'string' ? respondent_name.trim().toLowerCase() : '';
  const targetRespondentEmail = typeof respondent_email === 'string' ? respondent_email.trim().toLowerCase() : '';

  try {
    const historicalResponses = await getHistoricalResponses();
    let selectedResponses: Submission[] = [];

    if (targetId) {
      const response = historicalResponses.find((candidate) => candidate.id === targetId);
      if (response) selectedResponses = [response];
    } else {
      selectedResponses = historicalResponses.filter(
        (response) => cleanCNPJ(response.cnpj) === cleanCNPJ(targetCnpj),
      );

      if (reportScope === 'area') {
        selectedResponses = selectedResponses.filter(
          (response) => (response.area || 'Geral').trim().toLowerCase() === targetArea,
        );
      } else if (reportScope === 'person') {
        selectedResponses = selectedResponses.filter((response) => {
          const sameName = response.respondent_name.trim().toLowerCase() === targetRespondentName;
          const sameEmail = targetRespondentEmail
            ? response.respondent_email.trim().toLowerCase() === targetRespondentEmail
            : true;
          return sameName && sameEmail;
        });
      }
    }

    const companySummary = summarizeCompanyResponses(selectedResponses);
    const consolidatedSubmission = buildConsolidatedSubmission(selectedResponses);

    if (!consolidatedSubmission || !companySummary) {
      return res.status(404).json({ error: 'Nenhum questionário respondido encontrado para gerar o PDF.' });
    }

    const firstSelectedResponse = selectedResponses[0];
    const submission: Submission = reportScope === 'person'
      ? {
          ...consolidatedSubmission,
          area: 'Todas as áreas',
          respondent_name: firstSelectedResponse.respondent_name,
          respondent_email: firstSelectedResponse.respondent_email,
        }
      : reportScope === 'area'
        ? {
            ...consolidatedSubmission,
            area: firstSelectedResponse.area || 'Geral',
            respondent_name: 'Todos os respondentes da área',
            respondent_email: '',
          }
        : consolidatedSubmission;

    const pdfBuffer = await generatePdfBuffer(submission, companySummary);
    const filenameScope = reportScope === 'person'
      ? 'pessoa'
      : reportScope === 'area'
        ? 'area'
        : 'empresa';
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=relatorio_${filenameScope}_${submission.cnpj}.pdf`);
    return res.send(pdfBuffer);
  } catch (err: any) {
    console.error('Error generating PDF:', err);
    return res.status(500).json({ error: 'Erro ao gerar PDF.' });
  }
});

export default router;
