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

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "10mb" }));

// All API routes are mounted under /api
app.use("/api", authRoutes);
app.use("/api", supabaseRoutes);
app.use("/api", cnpjRoutes);
app.use("/api", assessmentRoutes);
app.use("/api", companiesRoutes);
app.use("/api", questionsRoutes);
app.use("/api", submissionsRoutes);
app.use("/api", adminRoutes);
app.use("/api", pdfRoutes);

// ---------------------------------------------
// VITE CLIENT INITIALIZATION OR PRODUCTION FALLBACK
// ---------------------------------------------
async function startServer() {
  if (process.env.VERCEL) {
    // Vercel handles serving static files directly and uses server as a serverless function.
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
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
