// Vercel serverless entrypoint.
//
// Vercel auto-detects files under /api as Serverless Functions. This REQUIRED
// catch-all (one or more segments) matches every /api/* request and delegates
// to the Express app defined in server/index.ts, where routes are mounted
// under /api. Vercel passes the original URL through, so Express sees
// /api/auth/login and matches app.use("/api", authRoutes).
//
// On Vercel, process.env.VERCEL is set, so server/index.ts's startServer()
// returns early (no app.listen) and only the route registrations + the
// `export default app` matter here.
import app from "../server/index";

export default app;
