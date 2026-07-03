import express from 'express';
import { getSupabase } from '../lib/supabase';
import { fallbackResponses } from '../state';
import { cleanCNPJ } from '../lib/cnpj';
import { generatePdfBuffer } from '../lib/pdf';
import { verifyAdminToken, verifyDownloadToken } from '../lib/jwt';
import type { Submission } from '../../src/types';

const router = express.Router();

/**
 * Authorization for PDF downloads. A request is granted when ANY of:
 *   1. It carries a valid admin Bearer token (admin can read any record).
 *   2. It carries a valid `download_token` query param whose cnpj matches the
 *      requested cnpj (and id, when present). Download tokens are short-lived
 *      and signed at submission time, so a respondent can fetch only their own
 *      most recent PDF — not anyone else's.
 */
function authorizePdf(req: express.Request, targetCnpj: string, targetId?: string): boolean {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '');
    if (verifyAdminToken(token)) return true;
  }
  const dlToken = req.query.download_token;
  if (typeof dlToken === 'string' && dlToken) {
    const payload = verifyDownloadToken(dlToken);
    if (payload && cleanCNPJ(payload.cnpj) === cleanCNPJ(targetCnpj)) {
      if (payload.id && targetId && payload.id !== targetId) return false;
      return true;
    }
  }
  return false;
}

// Consolidated PDF Generation (Using pdf-lib)
router.get('/generate-pdf', async (req, res) => {
  const { id, cnpj } = req.query;

  if (!id && !cnpj) {
    return res.status(400).json({ error: 'ID da resposta ou CNPJ é obrigatório para gerar o PDF.' });
  }

  const targetCnpj = typeof cnpj === 'string' ? cnpj : '';
  const targetId = typeof id === 'string' ? id : undefined;

  // Enforce authorization before doing any lookup. When only `id` is provided
  // we cannot pre-authorize by CNPJ, so require an admin token for that path.
  if (targetId && targetCnpj) {
    if (!authorizePdf(req, targetCnpj, targetId)) {
      return res.status(401).json({ error: 'Não autorizado a gerar este PDF.' });
    }
  } else if (targetCnpj) {
    if (!authorizePdf(req, targetCnpj)) {
      return res.status(401).json({ error: 'Não autorizado a gerar este PDF.' });
    }
  } else {
    // id-only path: require admin
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ') || !verifyAdminToken(authHeader.replace('Bearer ', ''))) {
      return res.status(401).json({ error: 'Não autorizado a gerar este PDF.' });
    }
  }

  try {
    const supabase = getSupabase();
    let submission: Submission | undefined;

    if (supabase) {
      try {
        if (targetId) {
          const { data, error } = await supabase.from('responses').select('*').eq('id', targetId).single();
          if (!error && data) submission = data;
        } else {
          const { data, error } = await supabase.from('responses').select('*').eq('cnpj', targetCnpj).order('created_at', { ascending: false }).limit(1);
          if (!error && data && data.length > 0) submission = data[0];
        }
      } catch (err) {
        console.error('Failed to query responses from Supabase for PDF, using local fallback:', err);
      }
    }

    if (!submission) {
      if (targetId) {
        submission = fallbackResponses.find(r => r.id === targetId);
      } else {
        const matching = fallbackResponses.filter(r => cleanCNPJ(r.cnpj) === cleanCNPJ(targetCnpj));
        if (matching.length > 0) {
          submission = matching[matching.length - 1]; // latest
        }
      }
    }

    if (!submission) {
      return res.status(404).send('<h1>Nenhum questionário respondido encontrado para gerar o PDF.</h1>');
    }

    // Defense in depth: the token may have matched the requested cnpj, but make
    // sure the resolved record actually belongs to that same cnpj.
    if (targetCnpj && cleanCNPJ(submission.cnpj) !== cleanCNPJ(targetCnpj)) {
      return res.status(403).json({ error: 'Token não autorizado para este registro.' });
    }

    const pdfBuffer = await generatePdfBuffer(submission);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=relatorio_consolidado_${submission.cnpj}.pdf`);
    return res.send(pdfBuffer);
  } catch (err: any) {
    console.error('Error generating PDF:', err);
    return res.status(500).send(`<h1>Erro ao gerar PDF: ${err.message || err}</h1>`);
  }
});

export default router;
