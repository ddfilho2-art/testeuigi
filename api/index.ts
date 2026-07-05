// Vercel serverless entrypoint for ALL /api/* requests.
//
// Findings from the diagnostic deploy (commit 466183c):
//   1. A dynamic `await import("../server/index")` defeated @vercel/node's
//      static tracing, so the server/ directory was NOT included in the
//      function bundle at /var/task/ -> ERR_MODULE_NOT_FOUND at runtime.
//      A STATIC import lets the bundler trace and include server/.
//   2. Vercel's rewrite /api/:path* -> /api keeps req.url as the ORIGINAL
//      path (/api/auth/login) and only appends ?path=... as a query param.
//      So Express's app.use("/api", authRoutes) matches unchanged — no URL
//      restoration is needed.
import app from "../server/index";
import type { IncomingMessage, ServerResponse } from "http";

export default function handler(req: IncomingMessage, res: ServerResponse) {
  return (app as any)(req, res);
}
