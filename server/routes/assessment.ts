import express from 'express';
import { getSupabase } from '../lib/supabase';
import { fallbackQuestions, fallbackResponses } from '../state';
import { calculateLocalScore } from '../lib/score';
import { sendSubmissionNotification } from '../lib/email';
import { cleanCNPJ } from '../lib/cnpj';
import { checkCompanyAccess, normalizeAreas } from '../lib/company';
import type { Submission } from '../../src/types';

const router = express.Router();

// Get Active Questions
router.get('/assessment/questions', async (_req, res) => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('section_id', { ascending: true })
        .order('id', { ascending: true });

      if (!error && data && data.length > 0) return res.json(data);
    } catch (err) {
      console.error('Error fetching questions from Supabase:', err);
    }
  }
  return res.json([...fallbackQuestions].sort((a, b) => a.section_id - b.section_id));
});

// Submit one current response per company/area. A later submission replaces
// the previous response for the same CNPJ and area.
router.post('/assessment/submit', async (req, res) => {
  const {
    cnpj,
    area,
    company_name,
    respondent_name,
    respondent_email,
    start_time,
    end_time,
    answers,
  } = req.body;

  if (!cnpj || !area || !company_name || !respondent_name || !respondent_email || !answers) {
    return res.status(400).json({ error: 'CNPJ, área, dados do respondente e respostas são obrigatórios.' });
  }

  const cleanedCnpj = cleanCNPJ(cnpj);
  const requestedArea = String(area).trim();
  if (!requestedArea) return res.status(400).json({ error: 'A área é obrigatória.' });

  const access = await checkCompanyAccess(cleanedCnpj);
  if (!access.valid) {
    return res.status(403).json({ error: access.error || 'CNPJ não autorizado para envio.' });
  }
  const allowedArea = normalizeAreas(access.areas).find((candidate) => candidate.toLowerCase() === requestedArea.toLowerCase());
  if (!allowedArea) {
    return res.status(403).json({ error: 'A área selecionada não está habilitada para este CNPJ.' });
  }
  const canonicalArea = allowedArea;
  const supabase = getSupabase();
  let result: any = null;
  let currentQuestions = [...fallbackQuestions];

  if (supabase) {
    try {
      const { data: dbQ } = await supabase.from('questions').select('*');
      if (dbQ && dbQ.length > 0) currentQuestions = dbQ;
    } catch (err) {
      console.error('Error fetching questions for submission calculation:', err);
    }
  }

  if (supabase) {
    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc('calculate_assessment_score', { answers });
      if (!rpcError && rpcData) {
        result = rpcData;
      } else {
        if (rpcError && rpcError.code === '42883') {
          console.warn('Supabase RPC calculate_assessment_score function does not exist yet. Using backend local calculation.');
        } else {
          console.warn('RPC calculation error or function missing. Falling back to backend calculation:', rpcError);
        }
        result = calculateLocalScore(answers, currentQuestions);
      }
    } catch (err) {
      console.error('Failed to trigger database calculation function, running backend fallback:', err);
      result = calculateLocalScore(answers, currentQuestions);
    }
  } else {
    result = calculateLocalScore(answers, currentQuestions);
  }

  const submission: Submission = {
    cnpj: cleanedCnpj,
    area: canonicalArea,
    company_name,
    respondent_name,
    respondent_email,
    start_time,
    end_time,
    answers,
    total_score: result.total_score,
    classification: result.classification,
    section_scores: result.section_scores,
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('responses')
        .upsert([submission], { onConflict: 'cnpj,area' })
        .select()
        .single();
      if (error) throw error;

      sendSubmissionNotification(data || submission, result).catch((err) =>
        console.error('Error in background email notification:', err),
      );

      // Deliberately do not return score, answers, PDF token, or submission
      // data to the respondent. Reports are admin-only.
      return res.json({
        success: true,
        replaced: access.submittedAreas.some((submittedArea) => submittedArea.toLowerCase() === requestedArea.toLowerCase()),
        message: 'Resposta registrada com sucesso. O relatório ficará disponível apenas para o administrador.',
      });
    } catch (err: any) {
      console.error('Error upserting submission in Supabase, falling back to local memory storage:', err);
    }
  }

  const existingIndex = fallbackResponses.findIndex(
    (response) => cleanCNPJ(response.cnpj) === cleanedCnpj && (response.area || 'Geral').toLowerCase() === requestedArea.toLowerCase(),
  );
  const replaced = existingIndex !== -1;
  const fallbackSubmission: Submission = {
    ...submission,
    id: `${cleanedCnpj}-${canonicalArea.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
  };
  if (replaced) fallbackResponses[existingIndex] = fallbackSubmission;
  else fallbackResponses.push(fallbackSubmission);

  sendSubmissionNotification(fallbackSubmission, result).catch((err) =>
    console.error('Error in background email notification:', err),
  );

  return res.json({
    success: true,
    replaced,
    message: 'Resposta registrada com sucesso. O relatório ficará disponível apenas para o administrador.',
  });
});

export default router;
