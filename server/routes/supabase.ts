import express from 'express';
import { getSupabase } from '../lib/supabase';

const router = express.Router();

router.get('/supabase-status', async (_req, res) => {
  const supabase = getSupabase();
  const configured = process.env.SUPABASE_URL !== undefined &&
                     process.env.SUPABASE_URL !== '' &&
                     process.env.SUPABASE_URL !== 'https://your-project.supabase.co';

  if (!supabase || !configured) {
    return res.json({
      connected: false,
      configured,
      tablesExist: false,
      rpcExists: false,
      errorDetails: 'Credenciais do Supabase não configuradas no painel de Secrets.'
    });
  }

  let companiesOk = false;
  let questionsOk = false;
  let responsesOk = false;
  let rpcOk = false;
  let errorDetails: string | null = null;

  try {
    const { error: compErr } = await supabase.from('companies').select('id').limit(1);
    companiesOk = !compErr || (compErr.code !== '42P01');
    if (compErr && compErr.code === '42P01') {
      errorDetails = `Tabela "companies" não encontrada.`;
    }

    const { error: questErr } = await supabase.from('questions').select('id').limit(1);
    questionsOk = !questErr || (questErr.code !== '42P01');
    if (questErr && questErr.code === '42P01' && !errorDetails) {
      errorDetails = `Tabela "questions" não encontrada.`;
    }

    const { error: respErr } = await supabase.from('responses').select('id').limit(1);
    responsesOk = !respErr || (respErr.code !== '42P01');
    if (respErr && respErr.code === '42P01' && !errorDetails) {
      errorDetails = `Tabela "responses" não encontrada.`;
    }

    const { error: rpcErr } = await supabase.rpc('calculate_assessment_score', { answers: {} });
    rpcOk = !rpcErr || (rpcErr.code !== '42883');
    if (rpcErr && rpcErr.code === '42883' && !errorDetails) {
      errorDetails = `Função RPC "calculate_assessment_score" não encontrada.`;
    }

    if (compErr && compErr.code !== '42P01' && !errorDetails) {
      errorDetails = compErr.message || JSON.stringify(compErr);
    }
  } catch (err: any) {
    errorDetails = err?.message || String(err);
  }

  res.json({
    connected: companiesOk && questionsOk && responsesOk && rpcOk,
    configured,
    tablesExist: companiesOk && questionsOk && responsesOk,
    rpcExists: rpcOk,
    companiesTable: companiesOk,
    questionsTable: questionsOk,
    responsesTable: responsesOk,
    rpcFunction: rpcOk,
    errorDetails
  });
});

export default router;
