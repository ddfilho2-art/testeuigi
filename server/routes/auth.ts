import express from 'express';
import { getSupabaseAuth } from '../lib/supabase';
import { getAdminEmail, getAdminPassword } from '../state';
import { signAdminToken, verifyAdminToken } from '../lib/jwt';

const router = express.Router();

// Admin login
router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const adminEmail = getAdminEmail();
  const adminPassword = getAdminPassword();

  // 1. Local admin credentials
  if (email === adminEmail && password === adminPassword) {
    const token = signAdminToken(adminEmail);
    return res.json({ success: true, token });
  }

  // 2. Supabase Auth
  const supabase = getSupabaseAuth();
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (data?.session) {
        return res.json({ success: true, token: data.session.access_token });
      }
      if (error) {
        console.error('Supabase auth error:', error.message);
        return res.status(401).json({ error: `Erro no Supabase: ${error.message}` });
      }
    } catch (err: any) {
      console.error('Supabase login error:', err);
      return res.status(401).json({ error: 'Credenciais inválidas. Verifique o email e senha.' });
    }
  }

  return res.status(401).json({ error: 'Credenciais inválidas. Verifique o email e senha.' });
});

// Token verification
router.get('/auth/verify', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ valid: false });
  }
  const token = authHeader.replace('Bearer ', '');

  // 1. Local JWT admin token
  if (verifyAdminToken(token)) {
    return res.json({ valid: true });
  }

  // 2. Supabase session token
  const supabase = getSupabaseAuth();
  if (supabase) {
    try {
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) return res.json({ valid: true });
    } catch (err) {
      // ignore — fall through to invalid
    }
  }

  return res.status(401).json({ valid: false });
});

export default router;
