import express from 'express';
import { getSupabase } from '../lib/supabase';
import { fallbackCompanies, fallbackResponses } from '../state';
import { cleanCNPJ } from '../lib/cnpj';
import { normalizeAreas } from '../lib/company';
import { authenticateAdmin } from '../lib/auth';
import type { Company } from '../../src/types';

const router = express.Router();

router.get('/admin/companies', authenticateAdmin, async (_req, res) => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('companies').select('*').order('created_at', { ascending: false });
      if (!error) return res.json((data || []).map((company: Company) => ({ ...company, areas: normalizeAreas(company.areas) })));
    } catch (err) {
      console.error('Error listing companies from Supabase:', err);
    }
  }
  return res.json(fallbackCompanies);
});

router.post('/admin/companies', authenticateAdmin, async (req, res) => {
  const input = req.body as Partial<Company>;
  if (!input?.cnpj || !input.name || !input.enabled_from || !input.enabled_until) {
    return res.status(400).json({ error: 'CNPJ, nome e período de habilitação são obrigatórios.' });
  }

  const company: Company = {
    cnpj: cleanCNPJ(input.cnpj),
    name: String(input.name).trim(),
    enabled: input.enabled !== false,
    enabled_from: input.enabled_from,
    enabled_until: input.enabled_until,
    areas: normalizeAreas(input.areas),
  };
  if (company.cnpj.length !== 14) {
    return res.status(400).json({ error: 'CNPJ inválido. Deve conter 14 dígitos numéricos.' });
  }
  if (company.enabled_from > company.enabled_until) {
    return res.status(400).json({ error: 'A data inicial não pode ser posterior à data final.' });
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('companies').insert([company]).select();
      if (error) {
        if (error.code === '23505') return res.status(400).json({ error: 'Este CNPJ já está cadastrado.' });
        throw error;
      }
      return res.json({ ...data[0], areas: normalizeAreas(data[0].areas) });
    } catch (err: any) {
      console.warn('Erro ao salvar empresa no Supabase, usando fallback local:', err.message || err);
    }
  }

  if (fallbackCompanies.some(c => cleanCNPJ(c.cnpj) === company.cnpj)) {
    return res.status(400).json({ error: 'Este CNPJ já está cadastrado.' });
  }
  const newCompany = { ...company, id: Math.random().toString(36).slice(2, 11) };
  fallbackCompanies.push(newCompany);
  return res.json(newCompany);
});

router.put('/admin/companies/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const input = req.body as Partial<Company>;
  const update: Partial<Company> = {};
  if (input.name !== undefined) update.name = String(input.name).trim();
  if (input.enabled !== undefined) update.enabled = Boolean(input.enabled);
  if (input.enabled_from !== undefined) update.enabled_from = input.enabled_from;
  if (input.enabled_until !== undefined) update.enabled_until = input.enabled_until;
  if (input.areas !== undefined) update.areas = normalizeAreas(input.areas);
  if (update.enabled_from && update.enabled_until && update.enabled_from > update.enabled_until) {
    return res.status(400).json({ error: 'A data inicial não pode ser posterior à data final.' });
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('companies').update(update).eq('id', id).select();
      if (!error && data && data.length > 0) return res.json({ ...data[0], areas: normalizeAreas(data[0].areas) });
      if (error) throw error;
    } catch (err: any) {
      console.warn('Erro ao atualizar empresa no Supabase, usando fallback local:', err.message || err);
    }
  }

  const idx = fallbackCompanies.findIndex(c => c.id === id || c.cnpj === id);
  if (idx !== -1) {
    fallbackCompanies[idx] = { ...fallbackCompanies[idx], ...update, areas: normalizeAreas(update.areas ?? fallbackCompanies[idx].areas) };
    return res.json(fallbackCompanies[idx]);
  }
  return res.status(404).json({ error: 'Empresa não encontrada.' });
});

router.delete('/admin/companies/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data: company, error: lookupError } = await supabase
        .from('companies')
        .select('cnpj')
        .eq('id', id)
        .maybeSingle();
      if (lookupError) throw lookupError;
      if (!company) return res.status(404).json({ error: 'Empresa não encontrada.' });

      const { count, error: responsesError } = await supabase
        .from('responses')
        .select('id', { count: 'exact', head: true })
        .eq('cnpj', company.cnpj);
      if (responsesError) throw responsesError;
      if ((count || 0) > 0) {
        return res.status(409).json({
          error: 'Esta empresa possui histórico de preenchimentos e não pode ser excluída. Desabilite-a para preservar os dados.',
        });
      }

      const { error } = await supabase.from('companies').delete().eq('id', id);
      if (error) throw error;
      return res.json({ success: true });
    } catch (err: any) {
      console.error('Erro ao excluir empresa do Supabase:', err);
      return res.status(500).json({ error: err.message || 'Erro ao excluir empresa.' });
    }
  }

  const idx = fallbackCompanies.findIndex(c => c.id === id || c.cnpj === id);
  if (idx !== -1) {
    const deletedCnpj = cleanCNPJ(fallbackCompanies[idx].cnpj);
    const hasResponses = fallbackResponses.some((response) => cleanCNPJ(response.cnpj) === deletedCnpj);
    if (hasResponses) {
      return res.status(409).json({
        error: 'Esta empresa possui histórico de preenchimentos e não pode ser excluída. Desabilite-a para preservar os dados.',
      });
    }
    fallbackCompanies.splice(idx, 1);
    return res.json({ success: true });
  }
  return res.status(404).json({ error: 'Empresa não encontrada.' });
});

export default router;
