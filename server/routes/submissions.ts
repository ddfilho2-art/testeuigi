import express from 'express';
import { getSupabase } from '../lib/supabase';
import { fallbackResponses } from '../state';
import { authenticateAdmin } from '../lib/auth';
import { buildExcelBuffer } from '../lib/xlsx';
import { cleanCNPJ } from '../lib/cnpj';
import { summarizeCompanyResponses } from '../lib/summary';
import type { Submission } from '../../src/types';

const router = express.Router();

async function getCurrentResponses() {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('responses').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as Submission[];
    } catch (err) {
      console.error('Error listing responses from Supabase:', err);
    }
  }
  return fallbackResponses;
}

// Retrieve current responses: one record per CNPJ/area.
router.get('/admin/responses', authenticateAdmin, async (_req, res) => {
  return res.json(await getCurrentResponses());
});

// Consolidated company result: arithmetic mean of the current area scores.
router.get('/admin/companies/:cnpj/summary', authenticateAdmin, async (req, res) => {
  const cleanedCnpj = cleanCNPJ(req.params.cnpj);
  const responses = (await getCurrentResponses()).filter((response) => cleanCNPJ(response.cnpj) === cleanedCnpj);
  const summary = summarizeCompanyResponses(responses);

  if (!summary) {
    return res.status(404).json({ error: 'Nenhuma resposta encontrada para este CNPJ.' });
  }

  return res.json(summary);
});

// Delete one current response by its id (admin-only).
router.delete('/admin/responses/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('responses').delete().eq('id', id).select('id');
      if (error) throw error;
      if (!data || data.length === 0) {
        return res.status(404).json({ error: 'Resposta não encontrada.' });
      }
      return res.json({ success: true });
    } catch (err: any) {
      console.error('Error deleting response from Supabase:', err);
      return res.status(500).json({ error: err.message || 'Erro ao excluir resposta.' });
    }
  }

  const index = fallbackResponses.findIndex((response) => response.id === id);
  if (index === -1) return res.status(404).json({ error: 'Resposta não encontrada.' });
  fallbackResponses.splice(index, 1);
  return res.json({ success: true });
});

// Wipe all responses (Reset of the latest period)
router.post('/admin/reset', authenticateAdmin, async (_req, res) => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from('responses').delete().neq('cnpj', 'dummy_value_to_avoid_empty_where_on_some_clients');
      if (error) throw error;
      return res.json({ success: true, message: 'Todas as respostas foram excluídas com sucesso.' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Erro ao redefinir respostas no Supabase.' });
    }
  }

  fallbackResponses.length = 0;
  return res.json({ success: true, message: 'Todas as respostas locais foram redefinidas.' });
});

// Export Database Format in Excel (xlsx)
router.get('/admin/export-excel', authenticateAdmin, async (_req, res) => {
  try {
    const excelBuffer = buildExcelBuffer(await getCurrentResponses());
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=relatorio_riscos_psicossociais.xlsx');
    return res.send(excelBuffer);
  } catch (error: any) {
    console.error('Error generating Excel report:', error);
    return res.status(500).json({ error: 'Erro interno ao gerar planilha Excel.' });
  }
});

export default router;
