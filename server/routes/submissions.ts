import express from 'express';
import { getSupabase } from '../lib/supabase';
import { fallbackResponses } from '../state';
import { authenticateAdmin } from '../lib/auth';
import { buildExcelBuffer } from '../lib/xlsx';

const router = express.Router();

// Retrieve Responses List
router.get('/admin/responses', authenticateAdmin, async (_req, res) => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('responses').select('*').order('created_at', { ascending: false });
      if (!error) return res.json(data);
    } catch (err) {
      console.error('Error listing responses from Supabase:', err);
    }
  }
  return res.json(fallbackResponses);
});

// Wipe all responses (Reset of the latest period)
router.post('/admin/reset', authenticateAdmin, async (req, res) => {
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

  // Fallback
  fallbackResponses.length = 0;
  return res.json({ success: true, message: 'Todas as respostas locais foram redefinidas.' });
});

// Export Database Format in Excel (xlsx)
router.get('/admin/export-excel', authenticateAdmin, async (_req, res) => {
  try {
    const supabase = getSupabase();
    let submissions = [...fallbackResponses];

    if (supabase) {
      try {
        const { data, error } = await supabase.from('responses').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          submissions = data;
        }
      } catch (err) {
        // keep fallback
      }
    }

    const excelBuffer = buildExcelBuffer(submissions);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=relatorio_riscos_psicossociais.xlsx');
    return res.send(excelBuffer);
  } catch (error: any) {
    console.error('Error generating Excel report:', error);
    return res.status(500).json({ error: 'Erro interno ao gerar planilha Excel.' });
  }
});

export default router;
