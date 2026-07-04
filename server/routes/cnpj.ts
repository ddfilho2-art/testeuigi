import express from 'express';
import { checkCompanyAccess } from '../lib/company';

const router = express.Router();

router.post('/cnpj/validate', async (req, res) => {
  const { cnpj } = req.body;
  if (!cnpj) {
    return res.status(400).json({ error: 'CNPJ é obrigatório.' });
  }

  const result = await checkCompanyAccess(cnpj);
  if (!result.valid) {
    return res.json({ valid: false, error: result.error });
  }
  return res.json({ valid: true, companyName: result.company!.name, cnpj: result.company!.cnpj });
});

export default router;
