// Vercel serverless entrypoint.
//
// Vercel auto-detects files under /api as Serverless Functions. This optional
// catch-all matches every /api/* request and delegates to the Express app
// defined in server/index.ts, where routes are mounted under /api.
//
// On Vercel, process.env.VERCEL is set, so server/index.ts's startServer()
// returns early (no app.listen) and only the route registrations + the
// `export default app` matter here.
import app from "../server/index";

export default app;
