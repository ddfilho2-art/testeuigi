import express from 'express';
import { getSupabase, getSupabaseAuth, isSupabaseReady } from '../lib/supabase';
import { getAdminEmail } from '../state';

const router = express.Router();

// Public diagnostic probe. Returns JSON describing the runtime so we can tell
// whether the Express app is actually being invoked on Vercel (vs. a 404 HTML
// page from the platform). Safe to expose — no secrets, only booleans/counts.
router.get('/_probe', (_req, res) => {
  res.json({
    ok: true,
    app: 'control-med-sst',
    runtime: {
      vercel: !!process.env.VERCEL,
      node: process.version,
      env: process.env.NODE_ENV || '(unset)',
    },
    supabase: {
      configured: !!process.env.SUPABASE_URL,
      ready: isSupabaseReady(),
      hasServiceKey: !!(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY),
      hasAnonKey: !!(process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY),
    },
    adminEmailSet: !!getAdminEmail(),
    time: new Date().toISOString(),
  });
});

router.get('/_probe/supabase', async (_req, res) => {
  // Exercises the admin client end-to-end so we can see if /api functions can
  // actually reach Supabase at runtime.
  const supabase = getSupabase();
  if (!supabase) {
    return res.json({ connected: false, reason: 'admin client not initialized (credentials missing/placeholder)' });
  }
  try {
    const start = Date.now();
    const { error } = await supabase.from('companies').select('id').limit(1);
    const latencyMs = Date.now() - start;
    if (error) {
      return res.json({ connected: false, latencyMs, error: { code: error.code, message: error.message } });
    }
    return res.json({ connected: true, latencyMs });
  } catch (err: any) {
    return res.json({ connected: false, error: err?.message || String(err) });
  }
});

void getSupabaseAuth; // re-export guard (kept for import symmetry if needed)

export default router;
