// Minimal diagnostic function. If this returns JSON on Vercel, functions ARE
// being created. The commit SHA tells us exactly which deploy is live.
export default function handler(_req: any, res: any) {
  res.status(200).json({
    ok: true,
    diagnostic: 'api/hello',
    commit: (process.env.VERCEL_GIT_COMMIT_SHA || 'unknown').slice(0, 7),
    commitMsg: process.env.VERCEL_GIT_COMMIT_MESSAGE || '',
    env: process.env.VERCEL_ENV || 'unknown',
    region: process.env.VERCEL_REGION || 'unknown',
    node: process.version,
  });
}
