import { createClient } from "@supabase/supabase-js";
import { fallbackQuestions } from "../state";
import { ensureDbQuestionsSeeded } from "./seed";

// Re-exported for routes that import seeding helpers from the supabase module.
export { ensureDbQuestionsSeeded, fallbackQuestions };

// Lazy Supabase connection (singleton-per-process)
let supabaseClient: any = null; // service_role — DB, RPC, Storage
let supabaseAuthClient: any = null; // anon key — auth.signInWithPassword, auth.getUser
let isSupabaseConnected = false;

// Admin client (service_role) — bypasses RLS, used for DB/RPC/Storage operations
export function getSupabase() {
  if (supabaseClient) return supabaseClient;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

  if (
    url &&
    key &&
    url !== "https://your-project.supabase.co" &&
    key !== "your-anon-or-service-role-key"
  ) {
    try {
      supabaseClient = createClient(url, key);
      isSupabaseConnected = true;
      console.log(
        "Successfully initialized Supabase admin client (service_role).",
      );
      return supabaseClient;
    } catch (err) {
      console.error("Failed to initialize Supabase admin client:", err);
    }
  } else {
    console.warn(
      "Supabase credentials are not configured or are placeholders. Falling back to local state.",
    );
  }
  return null;
}

// Auth client (anon key) — used only for auth.signInWithPassword and auth.getUser
export function getSupabaseAuth() {
  if (supabaseAuthClient) return supabaseAuthClient;

  const url = process.env.SUPABASE_URL;
  // Prefer dedicated anon key; fall back to SUPABASE_KEY if only one key is configured
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

  if (
    url &&
    anonKey &&
    url !== "https://your-project.supabase.co" &&
    anonKey !== "your-anon-or-service-role-key"
  ) {
    try {
      supabaseAuthClient = createClient(url, anonKey);
      console.log("Successfully initialized Supabase auth client (anon).");
      return supabaseAuthClient;
    } catch (err) {
      console.error("Failed to initialize Supabase auth client:", err);
    }
  }
  return null;
}

export function isSupabaseReady(): boolean {
  return isSupabaseConnected;
}
