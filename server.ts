// Vercel server entrypoint.
//
// Vercel auto-detects a `server.{ts,js,...}` file at the project root and turns
// it into a Serverless Function, routing incoming requests to it. We import the
// Express app from server/index.ts (which registers CORS, JSON parsing, and all
// /api routes at module load) and call app.listen() so Vercel can capture the
// HTTP server via that call.
//
// Static files are served by Vercel from outputDirectory (dist), and the SPA
// fallback for client-side routes is handled by the vercel.json rewrite. So
// this function only needs to answer /api/* (plus anything that didn't match a
// static file or the rewrite).
//
// On Vercel, process.env.VERCEL is set, so server/index.ts's startServer()
// returns early — no competing app.listen() and no Vite dev middleware.
import app from "./server/index";

// Startup beacon: confirms Vercel actually loaded THIS root entrypoint and
// captured app.listen(). If this never appears in the function logs, Vercel
// did not detect the server entrypoint (e.g. framework auto-detection overrode
// it) — which is exactly the 404-before-function scenario we're diagnosing.
console.log('[server.ts] root entrypoint loaded. VERCEL=' + !!process.env.VERCEL, 'PORT_env=' + (process.env.PORT || '(unset)'));

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  // On Vercel the port isn't public; this only prints when running locally.
  if (!process.env.VERCEL) {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  }
});

export default app;
