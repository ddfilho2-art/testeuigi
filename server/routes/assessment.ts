import express from 'express';
import { getSupabase } from '../lib/supabase';
import { fallbackQuestions, fallbackResponses } from '../state';
import { calculateLocalScore } from '../lib/score';
import { sendSubmissionNotification } from '../lib/email';
import { signDownloadToken } from '../lib/jwt';
import { cleanCNPJ } from '../lib/cnpj';
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

      if (!error && data && data.length > 0) {
        return res.json(data);
      }
    } catch (err) {
      console.error('Error fetching questions from Supabase:', err);
    }
  }
  return res.json([...fallbackQuestions].sort((a, b) => a.section_id - b.section_id));
});

// Submit Assessment (Uses Supabase RPC if available, else fallback local computation)
router.post('/assessment/submit', async (req, res) => {
  const { cnpj, company_name, respondent_name, respondent_email, start_time, end_time, answers } = req.body;

  if (!cnpj || !company_name || !respondent_name || !respondent_email || !answers) {
    return res.status(400).json({ error: 'Dados incompletos para envio.' });
  }

  const supabase = getSupabase();
  let result: any = null;

  let currentQuestions = [...fallbackQuestions];
  if (supabase) {
    try {
      const { data: dbQ } = await supabase.from('questions').select('*');
      if (dbQ && dbQ.length > 0) currentQuestions = dbQ;
    } catch (e) {
      console.error('Error fetching questions for submission calculation:', e);
    }
  }

  if (supabase) {
    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc('calculate_assessment_score', { answers });

      if (!rpcError && rpcData) {
        result = rpcData;
        console.log('Successfully computed score inside Supabase via SQL RPC function.');
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
    cnpj,
    company_name,
    respondent_name,
    respondent_email,
    start_time,
    end_time,
    answers,
    total_score: result.total_score,
    classification: result.classification,
    section_scores: result.section_scores,
    created_at: new Date().toISOString()
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('responses').insert([submission]).select();
      if (error) throw error;

      sendSubmissionNotification(data[0] || submission, result).catch(err =>
        console.error('Error in background email notification:', err)
      );

      const downloadToken = signDownloadToken(cleanCNPJ(submission.cnpj), (data[0] as any)?.id);
      return res.json({ success: true, submission: data[0], result, downloadToken });
    } catch (err: any) {
      console.error('Error saving submission in Supabase, falling back to local memory storage:', err);
      fallbackResponses.push(submission);

      sendSubmissionNotification(submission, result).catch(errMail =>
        console.error('Error in background email notification:', errMail)
      );

      const downloadToken = signDownloadToken(cleanCNPJ(submission.cnpj), submission.id);
      return res.json({ success: true, submission, result, localFallback: true, downloadToken });
    }
  }

  fallbackResponses.push(submission);
  sendSubmissionNotification(submission, result).catch(err =>
    console.error('Error in background email notification:', err)
  );

  const downloadToken = signDownloadToken(cleanCNPJ(submission.cnpj), submission.id);
  return res.json({ success: true, submission, result, downloadToken });
});

export default router;
