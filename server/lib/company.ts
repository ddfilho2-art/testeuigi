import { getSupabase } from "./supabase";
import { fallbackCompanies, fallbackResponses } from "../state";
import { cleanCNPJ } from "./cnpj";
import type { Company } from "../../src/types";

export interface CompanyCheckResult {
  valid: boolean;
  company?: Company;
  areas: string[];
  submittedAreas: string[];
  error?: string;
}

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
        const company = data[0] as Company | undefined;
        const access = evaluate(company, now);
        if (!access.valid || !company) return access;
        const submittedAreas = await getSubmittedAreas(supabase, cleanedTarget);
        return { ...access, areas: normalizeAreas(company.areas), submittedAreas };
      }
    } catch (err) {
      console.error("Error checking company access in Supabase:", err);
    }
  }

  const company = fallbackCompanies.find((c) => cleanCNPJ(c.cnpj) === cleanedTarget);
  const access = evaluate(company, now);
  if (!access.valid || !company) return access;
  const submittedAreas = fallbackResponsesForCompany(cleanedTarget);
  return { ...access, areas: normalizeAreas(company.areas), submittedAreas };
}

export function normalizeAreas(areas: unknown): string[] {
  if (!Array.isArray(areas)) return ["Geral"];
  const normalized = areas
    .filter((area): area is string => typeof area === "string")
    .map((area) => area.trim())
    .filter(Boolean);
  return [...new Set(normalized)].length ? [...new Set(normalized)] : ["Geral"];
}

async function getSubmittedAreas(supabase: any, cnpj: string): Promise<string[]> {
  const { data, error } = await supabase.from("responses").select("area").eq("cnpj", cnpj);
  if (error || !data) return [];
  return [...new Set((data as Array<{ area?: string }>).map((row) => row.area || "Geral"))];
}

function fallbackResponsesForCompany(cnpj: string): string[] {
  return [
    ...new Set(
      fallbackResponses
        .filter((response) => cleanCNPJ(response.cnpj) === cnpj)
        .map((response) => response.area || "Geral"),
    ),
  ];
}

function evaluate(company: Company | undefined, now: Date): CompanyCheckResult {
  if (!company) {
    return { valid: false, areas: [], submittedAreas: [], error: "CNPJ não cadastrado ou não habilitado." };
  }
  if (!company.enabled) {
    return { valid: false, areas: [], submittedAreas: [], error: "Este CNPJ está desabilitado pelo administrador." };
  }

  const fromDate = new Date(company.enabled_from);
  const untilDate = new Date(company.enabled_until);
  fromDate.setHours(0, 0, 0, 0);
  untilDate.setHours(23, 59, 59, 999);

  if (now < fromDate || now > untilDate) {
    return {
      valid: false,
      areas: [],
      submittedAreas: [],
      error: `Fora do período de resposta cadastrado (De ${new Date(company.enabled_from).toLocaleDateString("pt-BR")} até ${new Date(company.enabled_until).toLocaleDateString("pt-BR")}).`,
    };
  }

  return { valid: true, company, areas: normalizeAreas(company.areas), submittedAreas: [] };
}
