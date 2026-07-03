import express from 'express';
import { getSupabase } from '../lib/supabase';
import { fallbackCompanies } from '../state';
import { cleanCNPJ } from '../lib/cnpj';
import { authenticateAdmin } from '../lib/auth';
import type { Company } from '../../src/types';

const router = express.Router();

router.get('/admin/companies', authenticateAdmin, async (_req, res) => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('companies').select('*').order('created_at', { ascending: false });
      if (!error) return res.json(data);
    } catch (err) {
      console.error('Error listing companies from Supabase:', err);
    }
  }
  return res.json(fallbackCompanies);
});

router.post('/admin/companies', authenticateAdmin, async (req, res) => {
  const company: Company = req.body;
  if (!company || !company.cnpj || !company.name || !company.enabled_from || !company.enabled_until) {
    return res.status(400).json({ error: 'CNPJ, nome e período de habilitação são obrigatórios.' });
  }
  // Normalize CNPJ to digits-only so validate() can match with a single eq().
  company.cnpj = cleanCNPJ(company.cnpj);
  if (company.cnpj.length !== 14) {
    return res.status(400).json({ error: 'CNPJ inválido. Deve conter 14 dígitos numéricos.' });
  }

  const supabase = getSupabase();

  if (supabase) {
    try {
      const { data, error } = await supabase.from('companies').insert([company]).select();
      if (error) {
        if (error.code === '23505') {
          return res.status(400).json({ error: 'Este CNPJ já está cadastrado.' });
        }
        throw error;
      }
      return res.json(data[0]);
    } catch (err: any) {
      console.warn('Erro ao salvar empresa no Supabase, usando fallback local:', err.message || err);
    }
  }

  if (fallbackCompanies.some(c => cleanCNPJ(c.cnpj) === cleanCNPJ(company.cnpj))) {
    return res.status(400).json({ error: 'Este CNPJ já está cadastrado.' });
  }
  const newCompany = { ...company, id: company.id || Math.random().toString(36).substr(2, 9) };
  fallbackCompanies.push(newCompany);
  return res.json(newCompany);
});

router.put('/admin/companies/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const company: Company = req.body;
  // CNPJ is the unique business key; never let an update change it.
  delete (company as any).cnpj;
  const supabase = getSupabase();

  if (supabase) {
    try {
      const { data, error } = await supabase.from('companies').update(company).eq('id', id).select();
      if (!error && data && data.length > 0) return res.json(data[0]);
      if (error) throw error;
    } catch (err: any) {
      console.warn('Erro ao atualizar empresa no Supabase, usando fallback local:', err.message || err);
    }
  }

  const idx = fallbackCompanies.findIndex(c => c.id === id || c.cnpj === id);
  if (idx !== -1) {
    fallbackCompanies[idx] = { ...fallbackCompanies[idx], ...company };
    return res.json(fallbackCompanies[idx]);
  }
  return res.status(404).json({ error: 'Empresa não encontrada.' });
});

router.delete('/admin/companies/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const supabase = getSupabase();

  if (supabase) {
    try {
      const { error } = await supabase.from('companies').delete().eq('id', id);
      if (error) throw error;
      return res.json({ success: true });
    } catch (err: any) {
      console.warn('Erro ao deletar empresa do Supabase, usando fallback local:', err.message || err);
    }
  }

  const idx = fallbackCompanies.findIndex(c => c.id === id || c.cnpj === id);
  if (idx !== -1) {
    fallbackCompanies.splice(idx, 1);
    return res.json({ success: true });
  }
  return res.status(404).json({ error: 'Empresa não encontrada.' });
});

export default router;
