import { Company, Question, Submission } from "../src/types";
import { DEFAULT_QUESTIONS } from "../src/default_questions";

// In-memory fallbacks for development (when Supabase is not configured yet)
export const fallbackCompanies: Company[] = [
  {
    cnpj: "12.345.678/0001-90",
    name: "Empresa de Teste Control Med",
    enabled: true,
    enabled_from: "2026-01-01",
    enabled_until: "2027-12-31",
  },
];

export const fallbackQuestions: Question[] = [...DEFAULT_QUESTIONS];
export const fallbackResponses: Submission[] = [];

// Email and Admin Configuration State
export interface EmailConfig {
  enabled: boolean;
  adminEmail: string;
  recipientEmail: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  smtpSecure: boolean;
  adminName: string;
  adminPhone: string;
  adminRole: string;
  adminPassword: string;
  adminAvatarUrl: string;
}

export const emailConfig: EmailConfig = {
  enabled: false,
  adminEmail: process.env.ADMIN_EMAIL || "admin@controlseg.com.br",
  recipientEmail: process.env.ADMIN_EMAIL || "admin@controlseg.com.br",
  smtpHost: "",
  smtpPort: 587,
  smtpUser: "",
  smtpPassword: "",
  smtpSecure: false,
  adminName: "Gestor Control Seg",
  adminPhone: "(11) 99999-9999",
  adminRole: "Coordenador de SST",
  adminPassword: "",
  adminAvatarUrl: "",
};

export function getAdminPassword(): string {
  return (
    emailConfig.adminPassword ||
    process.env.ADMIN_PASSWORD ||
    "admin_secure_password"
  );
}

export function getAdminEmail(): string {
  return (
    emailConfig.adminEmail ||
    process.env.ADMIN_EMAIL ||
    "admin@controlseg.com.br"
  );
}
