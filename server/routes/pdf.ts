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
  const { id, cnpj } = req.query;

  if (!id && !cnpj) {
    return res.status(400).json({ error: 'ID da resposta ou CNPJ é obrigatório para gerar o PDF.' });
  }

  const targetCnpj = typeof cnpj === 'string' ? cnpj : '';
  const targetId = typeof id === 'string' ? id : undefined;

  try {
    const historicalResponses = await getHistoricalResponses();
    let submission: Submission | undefined;
    let companySummary: ReturnType<typeof summarizeCompanyResponses> = null;

    if (targetId) {
      submission = historicalResponses.find((response) => response.id === targetId);
      if (submission) {
        const companyResponses = historicalResponses.filter(
          (response) => cleanCNPJ(response.cnpj) === cleanCNPJ(submission!.cnpj),
        );
        companySummary = summarizeCompanyResponses(companyResponses);
      }
    } else {
      const companyResponses = historicalResponses.filter(
        (response) => cleanCNPJ(response.cnpj) === cleanCNPJ(targetCnpj),
      );
      companySummary = summarizeCompanyResponses(companyResponses);
      submission = buildConsolidatedSubmission(companyResponses) || undefined;
    }

    if (!submission) {
      return res.status(404).json({ error: 'Nenhum questionário respondido encontrado para gerar o PDF.' });
    }

    const pdfBuffer = await generatePdfBuffer(submission, companySummary || undefined);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=relatorio_consolidado_${submission.cnpj}.pdf`);
    return res.send(pdfBuffer);
  } catch (err: any) {
    console.error('Error generating PDF:', err);
    return res.status(500).json({ error: 'Erro ao gerar PDF.' });
  }
});

export default router;
