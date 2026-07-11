import jwt, { type SignOptions } from 'jsonwebtoken';

const FALLBACK_SECRET = 'dev-insecure-jwt-secret-please-set-JWT_SECRET';

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    console.warn('JWT_SECRET is not set or too short (need >= 16 chars). Using insecure fallback for dev only.');
    return FALLBACK_SECRET;
  }
  return secret;
}

export interface AdminJwtPayload {
  sub: string;        // admin email
  type: 'admin';      // local admin token (not a Supabase session)
  iat?: number;
  exp?: number;
}

export function signAdminToken(email: string): string {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '8h') as any,
  };
  return jwt.sign(
    { sub: email, type: 'admin' } as AdminJwtPayload,
    getSecret(),
    options
  );
}

export function verifyAdminToken(token: string): AdminJwtPayload | null {
  try {
    const payload = jwt.verify(token, getSecret()) as AdminJwtPayload;
    if (payload.type !== 'admin') return null;
    return payload;
  } catch (err) {
    return null;
  }
}
