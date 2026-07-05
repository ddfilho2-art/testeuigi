// Vercel serverless entrypoint for /api/* (required catch-all).
//
// Vercel auto-detects files under /api as Serverless Functions. This catch-all
// matches every /api/* request and delegates to the Express app in
// server/index.ts. We normalize the URL so Express's app.use("/api", ...) always
// matches whether Vercel passes the full path (/api/auth/login) or strips the
// /api prefix (/auth/login) — both forms have been observed across runtimes.
import app from "../server/index";
import type { IncomingMessage, ServerResponse } from "http";

export default function handler(req: IncomingMessage, res: ServerResponse) {
  const rawUrl = req.url || "";
  console.log("[api/[...path]] raw url:", rawUrl, "method:", req.method);
  // Ensure the URL Express sees starts with /api so app.use("/api", routes) matches.
  if (!rawUrl.startsWith("/api")) {
    req.url = "/api" + (rawUrl.startsWith("/") ? rawUrl : "/" + rawUrl);
  }
  return (app as any)(req, res);
}
