import express from 'express';
import { getSupabase } from '../lib/supabase';
import { fallbackResponses } from '../state';
import { cleanCNPJ } from '../lib/cnpj';
import { generatePdfBuffer } from '../lib/pdf';
import { authenticateAdmin } from '../lib/auth';
import { buildConsolidatedSubmission } from '../lib/summary';
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
    const supabase = getSupabase();
    let submission: Submission | undefined;

    if (supabase) {
      try {
        if (targetId) {
          const { data, error } = await supabase.from('responses').select('*').eq('id', targetId).single();
          if (!error && data) submission = data;
        } else {
          const { data, error } = await supabase
            .from('responses')
            .select('*')
            .eq('cnpj', cleanCNPJ(targetCnpj))
            .order('created_at', { ascending: false });
          if (!error && data && data.length > 0) {
            submission = buildConsolidatedSubmission(data as Submission[]) || undefined;
          }
        }
      } catch (err) {
        console.error('Failed to query responses from Supabase for PDF, using local fallback:', err);
      }
    }

    if (!submission) {
      if (targetId) {
        submission = fallbackResponses.find((response) => response.id === targetId);
      } else {
        const matching = fallbackResponses.filter((response) => cleanCNPJ(response.cnpj) === cleanCNPJ(targetCnpj));
        submission = buildConsolidatedSubmission(matching) || undefined;
      }
    }

    if (!submission) {
      return res.status(404).json({ error: 'Nenhum questionário respondido encontrado para gerar o PDF.' });
    }

    const pdfBuffer = await generatePdfBuffer(submission);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=relatorio_consolidado_${submission.cnpj}.pdf`);
    return res.send(pdfBuffer);
  } catch (err: any) {
    console.error('Error generating PDF:', err);
    return res.status(500).json({ error: 'Erro ao gerar PDF.' });
  }
});

export default router;
