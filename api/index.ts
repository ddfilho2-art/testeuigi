// Vercel serverless entrypoint for ALL /api/* requests.
//
// Why a static api/index.ts (not a catch-all): @vercel/node does NOT support
// [...slug] catch-all segments for plain /api functions (it's a Next.js-only
// convention). A static api/index.ts IS detected, so vercel.json rewrites
// every /api/* request here.
//
// Why dynamic import + try/catch: a static `import app from "../server/index"`
// that throws at module load becomes an opaque Vercel FUNCTION_INVOCATION_FAILED
// (500) with no visible cause. Importing inside a try/catch surfaces the error
// as JSON so we can diagnose it via curl.
import type { IncomingMessage, ServerResponse } from "http";

// Vercel may rewrite /api/auth/login -> /api, leaving req.url = "/api" (the
// destination) and stashing the original URI in a header. Restore it so
// Express's app.use("/api", authRoutes) can match /api/auth/login.
function restoreOriginalUrl(req: IncomingMessage): void {
  const candidates = [
    req.headers["x-vercel-decoded-url"],
    req.headers["x-forwarded-uri"],
    req.headers["x-forwarded-path"],
    req.headers["x-original-uri"],
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.startsWith("/api/")) {
      req.url = c;
      return;
    }
  }
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // Diagnostic headers on every response (visible via `curl -I`).
  res.setHeader("x-diag-requrl-orig", String(req.url));
  res.setHeader("x-diag-fwduri", String(req.headers["x-forwarded-uri"] || ""));
  res.setHeader("x-diag-decoded", String(req.headers["x-vercel-decoded-url"] || ""));
  res.setHeader("x-diag-fwdpath", String(req.headers["x-forwarded-path"] || ""));
  res.setHeader("x-diag-origuri", String(req.headers["x-original-uri"] || ""));

  try {
    restoreOriginalUrl(req);
    res.setHeader("x-diag-requrl-final", String(req.url));
    // Dynamic import so a module-load/runtime crash surfaces as JSON via the
    // catch instead of an opaque Vercel FUNCTION_INVOCATION_FAILED.
    const mod = await import("../server/index");
    const app = (mod as any).default;
    return app(req, res);
  } catch (err: any) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      diagError: "handler caught",
      message: String(err && err.message ? err.message : err),
      stack: err && err.stack ? String(err.stack).split("\n").slice(0, 8) : undefined,
      reqUrl: String(req.url),
    }));
  }
}
