// Vercel serverless entrypoint for ALL /api/* requests.
//
// Architecture (informed by live diagnostics on testeuigi.vercel.app):
//   - @vercel/node only transpiles the static import graph, so raw server/*.ts
//     pulled in via includeFiles can't be resolved at runtime. We instead
//     pre-compile server/ with esbuild (npm run build:server -> dist/server.cjs,
//     a self-contained CJS bundle) and includeFiles copies it into /var/task/.
//   - Dynamic import() inside try/catch surfaces any error as JSON (vs an
//     opaque Vercel FUNCTION_INVOCATION_FAILED), which is how we diagnosed this.
//
// CJS interop (the crux): esbuild emits `module.exports = { default: app,
// __esModule: true }`. Importing that .cjs via ESM dynamic import() wraps it
// once more, so the Express app function ends up at mod.default.default (not
// mod.default, which is an object). We unwrap however many levels are needed.
import type { IncomingMessage, ServerResponse } from "http";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    // Non-literal specifier so @vercel/node doesn't try to inline the bundle at
    // build time; includeFiles in vercel.json guarantees dist/server.cjs is in
    // /var/task/ at runtime.
    const bundleRel = "../dist/server.cjs";
    const mod: any = await import(bundleRel);
    let app: any = mod?.default ?? mod;
    if (app && typeof app === "object" && typeof app.default === "function") {
      app = app.default;
    }
    if (typeof app !== "function") {
      throw new Error(
        "server bundle did not export an Express app function " +
        "(typeof mod=" + typeof mod + ", typeof mod.default=" + typeof (mod?.default) + ")"
      );
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
