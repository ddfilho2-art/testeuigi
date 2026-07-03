import express from 'express';
import { getSupabase } from '../lib/supabase';
import { fallbackCompanies } from '../state';
import { cleanCNPJ } from '../lib/cnpj';

const router = express.Router();

router.post('/cnpj/validate', async (req, res) => {
  const { cnpj } = req.body;
  if (!cnpj) {
    return res.status(400).json({ error: 'CNPJ é obrigatório.' });
  }

  const cleanedTarget = cleanCNPJ(cnpj);
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  void todayStr;

  const supabase = getSupabase();
  if (supabase) {
    try {
      // The companies table stores CNPJ normalized to digits-only, so a single
      // exact match is enough (no need to load the whole table).
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('cnpj', cleanedTarget)
        .limit(1);

      if (error) {
        if (error.code === '42P01') {
          console.warn('Tabela "companies" do Supabase não existe ainda. Usando fallback local.');
        } else {
          throw error;
        }
      } else if (data) {
        const company = data[0];

        if (!company) {
          return res.json({ valid: false, error: 'CNPJ não cadastrado ou não habilitado.' });
        }
        if (!company.enabled) {
          return res.json({ valid: false, error: 'Este CNPJ está desabilitado pelo administrador.' });
        }

        const fromDate = new Date(company.enabled_from);
        const untilDate = new Date(company.enabled_until);
        fromDate.setHours(0, 0, 0, 0);
        untilDate.setHours(23, 59, 59, 999);

        if (now < fromDate || now > untilDate) {
          return res.json({
            valid: false,
            error: `Fora do período de resposta cadastrado (De ${new Date(company.enabled_from).toLocaleDateString('pt-BR')} até ${new Date(company.enabled_until).toLocaleDateString('pt-BR')}).`
          });
        }

        return res.json({ valid: true, companyName: company.name, cnpj: company.cnpj });
      }
    } catch (err: any) {
      console.error('Error validating CNPJ in Supabase:', err);
    }
  }

  // Fallback local validation
  const company = fallbackCompanies.find(c => cleanCNPJ(c.cnpj) === cleanedTarget);
  if (!company) {
    return res.json({ valid: false, error: 'CNPJ não cadastrado ou não habilitado.' });
  }
  if (!company.enabled) {
    return res.json({ valid: false, error: 'Este CNPJ está desabilitado pelo administrador.' });
  }

  const fromDate = new Date(company.enabled_from);
  const untilDate = new Date(company.enabled_until);
  fromDate.setHours(0, 0, 0, 0);
  untilDate.setHours(23, 59, 59, 999);

  if (now < fromDate || now > untilDate) {
    return res.json({
      valid: false,
      error: `Fora do período de resposta cadastrado (De ${new Date(company.enabled_from).toLocaleDateString('pt-BR')} até ${new Date(company.enabled_until).toLocaleDateString('pt-BR')}).`
    });
  }

  return res.json({ valid: true, companyName: company.name, cnpj: company.cnpj });
});

export default router;
