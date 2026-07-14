import express from 'express';
import { getSupabase } from '../lib/supabase';
import { fallbackResponses } from '../state';
import { getHistoricalResponses } from '../lib/historical';
import { authenticateAdmin } from '../lib/auth';
import { buildExcelBuffer } from '../lib/xlsx';
import { cleanCNPJ } from '../lib/cnpj';
import { summarizeAllResponses, summarizeCompanyResponses } from '../lib/summary';

const router = express.Router();

// Historical response list: every submission is returned, including
// repeated submissions by the same person or for the same area.
router.get('/admin/responses', authenticateAdmin, async (_req, res) => {
  try {
    return res.json(await getHistoricalResponses());
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Erro ao consultar o histórico de respostas.' });
  }
});

// Consolidated report for all companies: person, area, and company levels.
router.get('/admin/report-summary', authenticateAdmin, async (_req, res) => {
  try {
    return res.json(summarizeAllResponses(await getHistoricalResponses()));
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Erro ao gerar o resumo do relatório.' });
  }
});

// Raw historical rows for one CNPJ. This endpoint deliberately does not
// calculate or replace anything; it returns every original response row.
router.get('/admin/companies/:cnpj/responses', authenticateAdmin, async (req, res) => {
  try {
    const cleanedCnpj = cleanCNPJ(req.params.cnpj);
    const responses = (await getHistoricalResponses()).filter((response) => cleanCNPJ(response.cnpj) === cleanedCnpj);
    if (!responses.length) return res.status(404).json({ error: 'Nenhuma resposta encontrada para este CNPJ.' });
    return res.json(responses);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Erro ao consultar as respostas da empresa.' });
  }
});

// Consolidated report: person averages, then area averages, then company average.
router.get('/admin/companies/:cnpj/summary', authenticateAdmin, async (req, res) => {
  try {
    const cleanedCnpj = cleanCNPJ(req.params.cnpj);
    const responses = (await getHistoricalResponses()).filter((response) => cleanCNPJ(response.cnpj) === cleanedCnpj);
    const summary = summarizeCompanyResponses(responses);

    if (!summary) {
      return res.status(404).json({ error: 'Nenhuma resposta encontrada para este CNPJ.' });
    }

    return res.json(summary);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Erro ao gerar o resumo da empresa.' });
  }
});

// Delete exactly one respondent submission. This never deletes an area,
// company, or other historical rows; all summaries are recalculated on read.
router.delete('/admin/responses/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const supabase = getSupabase();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('responses')
        .delete()
        .eq('id', id)
        .select('id');
      if (error) throw error;
      if (!data || data.length === 0) {
        return res.status(404).json({ error: 'Preenchimento não encontrado.' });
      }
      return res.json({ success: true });
    } catch (err: any) {
      console.error('Error deleting one response from Supabase:', err);
      return res.status(500).json({ error: err.message || 'Erro ao excluir o preenchimento.' });
    }
  }

  const index = fallbackResponses.findIndex((response) => response.id === id);
  if (index === -1) return res.status(404).json({ error: 'Preenchimento não encontrado.' });
  fallbackResponses.splice(index, 1);
  return res.json({ success: true });
});

// Reset is intentionally disabled: reports must never erase the historical table.
router.post('/admin/reset', authenticateAdmin, async (_req, res) => {
  return res.status(409).json({
    error: 'O histórico de preenchimentos é protegido. Nenhum reset destrutivo está disponível.',
  });
});

// Export Database Format in Excel (xlsx)
router.get('/admin/export-excel', authenticateAdmin, async (_req, res) => {
  try {
    const excelBuffer = buildExcelBuffer(await getHistoricalResponses());
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=relatorio_riscos_psicossociais.xlsx');
    return res.send(excelBuffer);
  } catch (error: any) {
    console.error('Error generating Excel report:', error);
    return res.status(500).json({ error: 'Erro interno ao gerar planilha Excel.' });
  }
});

export default router;
