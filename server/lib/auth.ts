import express from 'express';
import { getSupabaseAuth } from './supabase';
import { getAdminEmail, getAdminPassword } from '../state';
import { signAdminToken, verifyAdminToken } from './jwt';

export { signAdminToken, verifyAdminToken };

// Middleware to authenticate an admin request.
// Accepts either:
//   1. A signed JWT admin token (Bearer <jwt>)  — recommended, has exp.
//   2. A Supabase session access_token (Bearer <jwt>) — verified via Supabase.
export async function authenticateAdmin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Não autorizado. Faça login novamente.' });
  }
  const token = authHeader.replace('Bearer ', '');

  // 1. Try local JWT admin token first
  const adminPayload = verifyAdminToken(token);
  if (adminPayload) {
    (req as any).user = { id: adminPayload.sub, email: adminPayload.sub, adminLocal: true };
    return next();
  }

  // 2. Try Supabase session token
  const supabase = getSupabaseAuth();
  if (supabase) {
    try {
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        (req as any).user = user;
        return next();
      }
    } catch (err) {
      console.error('Supabase auth verify error:', err);
    }
  }

  return res.status(401).json({ error: 'Não autorizado. Faça login novamente.' });
}

// Backwards-compatible helpers used by other modules
export { getAdminEmail, getAdminPassword };
