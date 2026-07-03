import express from 'express';
import { getSupabase } from '../lib/supabase';
import { fallbackQuestions } from '../state';
import { authenticateAdmin } from '../lib/auth';
import type { Question } from '../../src/types';

const router = express.Router();

router.post('/admin/questions', authenticateAdmin, async (req, res) => {
  const question: Question = req.body;
  const supabase = getSupabase();

  if (supabase) {
    try {
      const { data, error } = await supabase.from('questions').insert([question]).select();
      if (!error && data && data.length > 0) return res.json(data[0]);
      if (error) throw error;
    } catch (err: any) {
      console.warn('Erro ao criar pergunta no Supabase, usando fallback local:', err.message || err);
    }
  }

  if (fallbackQuestions.some(q => q.id === question.id)) {
    return res.status(400).json({ error: 'O ID desta pergunta já existe.' });
  }
  fallbackQuestions.push(question);
  return res.json(question);
});

router.put('/admin/questions/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const question: Question = req.body;
  const supabase = getSupabase();

  if (supabase) {
    try {
      const { data, error } = await supabase.from('questions').update(question).eq('id', id).select();
      if (!error && data && data.length > 0) return res.json(data[0]);
      if (error) throw error;
    } catch (err: any) {
      console.warn('Erro ao atualizar pergunta no Supabase, usando fallback local:', err.message || err);
    }
  }

  const idx = fallbackQuestions.findIndex(q => q.id === id);
  if (idx !== -1) {
    fallbackQuestions[idx] = { ...fallbackQuestions[idx], ...question };
    return res.json(fallbackQuestions[idx]);
  }
  return res.status(404).json({ error: 'Pergunta não encontrada.' });
});

router.delete('/admin/questions/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const supabase = getSupabase();

  if (supabase) {
    try {
      const { error } = await supabase.from('questions').delete().eq('id', id);
      if (error) throw error;
      return res.json({ success: true });
    } catch (err: any) {
      console.warn('Erro ao deletar pergunta do Supabase, usando fallback local:', err.message || err);
    }
  }

  const idx = fallbackQuestions.findIndex(q => q.id === id);
  if (idx !== -1) {
    fallbackQuestions.splice(idx, 1);
    return res.json({ success: true });
  }
  return res.status(404).json({ error: 'Pergunta não encontrada.' });
});

export default router;
