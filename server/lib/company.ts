import { getSupabase } from "./supabase";
import { fallbackCompanies } from "../state";
import { cleanCNPJ } from "./cnpj";
import type { Company } from "../../src/types";

export interface CompanyCheckResult {
  valid: boolean;
  company?: Company;
  error?: string;
}

/**
 * Verifies that a CNPJ corresponds to an enabled company whose response
 * window (enabled_from..enabled_until) covers `now`. Single source of truth
 * shared by /cnpj/validate and /assessment/submit so the server enforces the
 * same gate the client UI does — a respondent cannot submit for an arbitrary
 * or out-of-window CNPJ by calling the API directly.
 */
export async function checkCompanyAccess(cnpj: string): Promise<CompanyCheckResult> {
  const cleanedTarget = cleanCNPJ(cnpj);
  const now = new Date();

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("cnpj", cleanedTarget)
        .limit(1);

      if (error) {
        if (error.code === "42P01") {
          // Table missing — fall through to local fallback.
        } else {
          throw error;
        }
      } else if (data) {
        return evaluate(data[0] as Company, now);
      }
    } catch (err) {
      console.error("Error checking company access in Supabase:", err);
    }
  }

  const company = fallbackCompanies.find((c) => cleanCNPJ(c.cnpj) === cleanedTarget);
  return evaluate(company, now);
}

function evaluate(company: Company | undefined, now: Date): CompanyCheckResult {
  if (!company) {
    return { valid: false, error: "CNPJ não cadastrado ou não habilitado." };
  }
  if (!company.enabled) {
    return { valid: false, error: "Este CNPJ está desabilitado pelo administrador." };
  }

  const fromDate = new Date(company.enabled_from);
  const untilDate = new Date(company.enabled_until);
  fromDate.setHours(0, 0, 0, 0);
  untilDate.setHours(23, 59, 59, 999);

  if (now < fromDate || now > untilDate) {
    return {
      valid: false,
      error: `Fora do período de resposta cadastrado (De ${new Date(company.enabled_from).toLocaleDateString("pt-BR")} até ${new Date(company.enabled_until).toLocaleDateString("pt-BR")}).`,
    };
  }

  return { valid: true, company };
}
