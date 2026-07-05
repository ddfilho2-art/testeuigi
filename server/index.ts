import express from "express";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Persistent config (email_config.json) — must load before routes that read it
import { loadEmailConfig } from "./config";
loadEmailConfig();

// Trigger lazy Supabase seed once the process is up.
import "./lib/seedTrigger";

import authRoutes from "./routes/auth";
import supabaseRoutes from "./routes/supabase";
import cnpjRoutes from "./routes/cnpj";
import assessmentRoutes from "./routes/assessment";
import companiesRoutes from "./routes/companies";
import questionsRoutes from "./routes/questions";
import submissionsRoutes from "./routes/submissions";
import adminRoutes from "./routes/admin";
import pdfRoutes from "./routes/pdf";
import probeRoutes from "./routes/probe";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// CORS — must be first middleware so preflight OPTIONS is handled before any route.
// Without this, the browser's preflight returns 405 and all POST/PUT calls fail.
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.json({ limit: "10mb" }));

// All API routes are mounted under /api
app.use("/api", probeRoutes);
app.use("/api", authRoutes);
app.use("/api", supabaseRoutes);
app.use("/api", cnpjRoutes);
app.use("/api", assessmentRoutes);
app.use("/api", companiesRoutes);
app.use("/api", questionsRoutes);
app.use("/api", submissionsRoutes);
app.use("/api", adminRoutes);
app.use("/api", pdfRoutes);

// Startup beacon so Vercel function logs confirm the Express app actually
// loaded and registered routes (vs. the platform answering 404 before any
// function ran).
console.log('[server/index] Express app initialized. VERCEL=' + !!process.env.VERCEL, 'routes=/api mounted');

// ---------------------------------------------
// VITE CLIENT INITIALIZATION OR PRODUCTION FALLBACK
// ---------------------------------------------
async function startServer() {
  // On Vercel the server runs as a serverless function; static files are
  // served by the platform and the Vite dev middleware must never load.
  if (process.env.VERCEL) {
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    // Dynamic specifier so @vercel/node's esbuild cannot statically trace and
    // bundle Vite (a devDependency absent from the production install). This
    // branch is dev-only and never executes on Vercel.
    const viteModuleName = "vite";
    const { createServer: createViteServer } = await import(viteModuleName);
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

export default app;
