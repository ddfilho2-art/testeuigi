// Vercel serverless entrypoint for ALL /api/* requests.
//
// Strategy (informed by live diagnostics):
//   - A STATIC import bundles server/ but crashes at module load with an
//     OPAQUE Vercel FUNCTION_INVOCATION_FAILED (no visible cause).
//   - A DYNAMIC import inside try/catch SURFACES the error as JSON, but on its
//     own server/ was excluded from the bundle (ERR_MODULE_NOT_FOUND).
//   - So: dynamic import (errors visible) + vercel.json `includeFiles: server/**`
//     (forces server/ into the bundle). This way, if server/index throws at
//     load, we see the real reason in the response body instead of a blind 500.
import type { IncomingMessage, ServerResponse } from "http";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    // Non-literal specifier keeps @vercel/node from trying to inline this; the
    // includeFiles glob in vercel.json guarantees server/ is in /var/task/.
    const serverModule = "../server/index";
    const mod = await import(serverModule);
    const app = (mod as any).default;
    if (typeof app !== "function") {
      throw new Error("server/index default export is not a function (got " + typeof app + ")");
    }
    return app(req, res);
  } catch (err: any) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      diagError: "handler caught",
      message: String(err && err.message ? err.message : err),
      code: err && err.code,
      stack: err && err.stack ? String(err.stack).split("\n").slice(0, 10) : undefined,
      reqUrl: String(req.url),
    }));
  }
}
