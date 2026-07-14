var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/default_questions.ts
var DEFAULT_QUESTIONS;
var init_default_questions = __esm({
  "src/default_questions.ts"() {
    DEFAULT_QUESTIONS = [
      // 1. DEMANDA DE TRABALHO
      {
        id: "q1_1",
        section_id: 1,
        section_title: "1. DEMANDA DE TRABALHO (KARASEK/HSE)",
        text: "O volume de trabalho \xE9 excessivo?",
        type: "scale",
        is_inverted: false
      },
      {
        id: "q1_2",
        section_id: 1,
        section_title: "1. DEMANDA DE TRABALHO (KARASEK/HSE)",
        text: "Existem prazos muito apertados?",
        type: "scale",
        is_inverted: false
      },
      {
        id: "q1_3",
        section_id: 1,
        section_title: "1. DEMANDA DE TRABALHO (KARASEK/HSE)",
        text: "O trabalhador precisa realizar v\xE1rias tarefas simultaneamente?",
        type: "scale",
        is_inverted: false
      },
      {
        id: "q1_4",
        section_id: 1,
        section_title: "1. DEMANDA DE TRABALHO (KARASEK/HSE)",
        text: "H\xE1 press\xE3o constante por produtividade?",
        type: "scale",
        is_inverted: false
      },
      {
        id: "q1_5",
        section_id: 1,
        section_title: "1. DEMANDA DE TRABALHO (KARASEK/HSE)",
        text: "O ritmo de trabalho \xE9 intenso?",
        type: "scale",
        is_inverted: false
      },
      {
        id: "q1_6",
        section_id: 1,
        section_title: "1. DEMANDA DE TRABALHO (KARASEK/HSE)",
        text: "O trabalhador leva trabalho para casa?",
        type: "scale",
        is_inverted: false
      },
      {
        id: "q1_7",
        section_id: 1,
        section_title: "1. DEMANDA DE TRABALHO (KARASEK/HSE)",
        text: "O trabalho exige alta concentra\xE7\xE3o por longos per\xEDodos?",
        type: "scale",
        is_inverted: false
      },
      // 2. CONTROLE E AUTONOMIA
      {
        id: "q2_1",
        section_id: 2,
        section_title: "2. CONTROLE E AUTONOMIA NO TRABALHO",
        text: "O trabalhador possui autonomia para organizar suas atividades?",
        type: "scale",
        is_inverted: true
      },
      {
        id: "q2_2",
        section_id: 2,
        section_title: "2. CONTROLE E AUTONOMIA NO TRABALHO",
        text: "Pode participar de decis\xF5es relacionadas ao seu trabalho?",
        type: "scale",
        is_inverted: true
      },
      {
        id: "q2_3",
        section_id: 2,
        section_title: "2. CONTROLE E AUTONOMIA NO TRABALHO",
        text: "Possui liberdade para resolver problemas?",
        type: "scale",
        is_inverted: true
      },
      {
        id: "q2_4",
        section_id: 2,
        section_title: "2. CONTROLE E AUTONOMIA NO TRABALHO",
        text: "Recebe treinamento adequado para executar as tarefas?",
        type: "scale",
        is_inverted: true
      },
      {
        id: "q2_5",
        section_id: 2,
        section_title: "2. CONTROLE E AUTONOMIA NO TRABALHO",
        text: "Tem acesso \xE0s informa\xE7\xF5es necess\xE1rias para trabalhar?",
        type: "scale",
        is_inverted: true
      },
      // 3. APOIO DA LIDERANÇA
      {
        id: "q3_1",
        section_id: 3,
        section_title: "3. APOIO DA LIDERAN\xC7A",
        text: "O gestor fornece orienta\xE7\xE3o adequada?",
        type: "scale",
        is_inverted: true
      },
      {
        id: "q3_2",
        section_id: 3,
        section_title: "3. APOIO DA LIDERAN\xC7A",
        text: "O trabalhador sente-se apoiado pela lideran\xE7a?",
        type: "scale",
        is_inverted: true
      },
      {
        id: "q3_3",
        section_id: 3,
        section_title: "3. APOIO DA LIDERAN\xC7A",
        text: "Existe abertura para di\xE1logo?",
        type: "scale",
        is_inverted: true
      },
      {
        id: "q3_4",
        section_id: 3,
        section_title: "3. APOIO DA LIDERAN\xC7A",
        text: "O gestor trata os trabalhadores com respeito?",
        type: "scale",
        is_inverted: true
      },
      {
        id: "q3_5",
        section_id: 3,
        section_title: "3. APOIO DA LIDERAN\xC7A",
        text: "H\xE1 reconhecimento pelo trabalho realizado?",
        type: "scale",
        is_inverted: true
      },
      // 4. RELACIONAMENTO INTERPESSOAL
      {
        id: "q4_1",
        section_id: 4,
        section_title: "4. RELACIONAMENTO INTERPESSOAL",
        text: "O ambiente de trabalho \xE9 harmonioso?",
        type: "scale",
        is_inverted: true
      },
      {
        id: "q4_2",
        section_id: 4,
        section_title: "4. RELACIONAMENTO INTERPESSOAL",
        text: "Existe coopera\xE7\xE3o entre colegas?",
        type: "scale",
        is_inverted: true
      },
      {
        id: "q4_3",
        section_id: 4,
        section_title: "4. RELACIONAMENTO INTERPESSOAL",
        text: "H\xE1 conflitos frequentes na equipe?",
        type: "scale",
        is_inverted: false
      },
      {
        id: "q4_4",
        section_id: 4,
        section_title: "4. RELACIONAMENTO INTERPESSOAL",
        text: "O trabalhador sente-se integrado ao grupo?",
        type: "scale",
        is_inverted: true
      },
      {
        id: "q4_5",
        section_id: 4,
        section_title: "4. RELACIONAMENTO INTERPESSOAL",
        text: "Existem epis\xF3dios de discrimina\xE7\xE3o?",
        type: "scale",
        is_inverted: false
      },
      // 5. ASSÉDIO MORAL E VIOLÊNCIA NO TRABALHO
      {
        id: "q5_1",
        section_id: 5,
        section_title: "5. ASS\xC9DIO MORAL E VIOL\xCANCIA NO TRABALHO",
        text: "O trabalhador j\xE1 sofreu humilha\xE7\xF5es?",
        type: "scale",
        is_inverted: false
      },
      {
        id: "q5_2",
        section_id: 5,
        section_title: "5. ASS\xC9DIO MORAL E VIOL\xCANCIA NO TRABALHO",
        text: "Recebe cr\xEDticas excessivas em p\xFAblico?",
        type: "scale",
        is_inverted: false
      },
      {
        id: "q5_3",
        section_id: 5,
        section_title: "5. ASS\xC9DIO MORAL E VIOL\xCANCIA NO TRABALHO",
        text: "Sofre persegui\xE7\xF5es por superiores?",
        type: "scale",
        is_inverted: false
      },
      {
        id: "q5_4",
        section_id: 5,
        section_title: "5. ASS\xC9DIO MORAL E VIOL\xCANCIA NO TRABALHO",
        text: "H\xE1 amea\xE7as relacionadas ao emprego?",
        type: "scale",
        is_inverted: false
      },
      {
        id: "q5_5",
        section_id: 5,
        section_title: "5. ASS\xC9DIO MORAL E VIOL\xCANCIA NO TRABALHO",
        text: "Ocorrem situa\xE7\xF5es de intimida\xE7\xE3o?",
        type: "scale",
        is_inverted: false
      },
      {
        id: "q5_6",
        section_id: 5,
        section_title: "5. ASS\xC9DIO MORAL E VIOL\xCANCIA NO TRABALHO",
        text: "H\xE1 casos de ass\xE9dio sexual?",
        type: "scale",
        is_inverted: false
      },
      // 6. RECONHECIMENTO E RECOMPENSA (SIEGRIST)
      {
        id: "q6_1",
        section_id: 6,
        section_title: "6. RECONHECIMENTO E RECOMPENSA (SIEGRIST)",
        text: "O trabalhador sente-se valorizado?",
        type: "scale",
        is_inverted: true
      },
      {
        id: "q6_2",
        section_id: 6,
        section_title: "6. RECONHECIMENTO E RECOMPENSA (SIEGRIST)",
        text: "Recebe feedback positivo?",
        type: "scale",
        is_inverted: true
      },
      {
        id: "q6_3",
        section_id: 6,
        section_title: "6. RECONHECIMENTO E RECOMPENSA (SIEGRIST)",
        text: "Existe perspectiva de crescimento?",
        type: "scale",
        is_inverted: true
      },
      {
        id: "q6_4",
        section_id: 6,
        section_title: "6. RECONHECIMENTO E RECOMPENSA (SIEGRIST)",
        text: "A remunera\xE7\xE3o \xE9 percebida como justa?",
        type: "scale",
        is_inverted: true
      },
      {
        id: "q6_5",
        section_id: 6,
        section_title: "6. RECONHECIMENTO E RECOMPENSA (SIEGRIST)",
        text: "H\xE1 reconhecimento pelos resultados alcan\xE7ados?",
        type: "scale",
        is_inverted: true
      },
      // 7. SEGURANÇA NO EMPREGO
      {
        id: "q7_1",
        section_id: 7,
        section_title: "7. SEGURAN\xC7A NO EMPREGO",
        text: "Existe medo de demiss\xE3o?",
        type: "scale",
        is_inverted: false
      },
      {
        id: "q7_2",
        section_id: 7,
        section_title: "7. SEGURAN\xC7A NO EMPREGO",
        text: "O trabalhador percebe estabilidade?",
        type: "scale",
        is_inverted: true
      },
      {
        id: "q7_3",
        section_id: 7,
        section_title: "7. SEGURAN\xC7A NO EMPREGO",
        text: "Existem mudan\xE7as organizacionais frequentes?",
        type: "scale",
        is_inverted: false
      },
      {
        id: "q7_4",
        section_id: 7,
        section_title: "7. SEGURAN\xC7A NO EMPREGO",
        text: "H\xE1 inseguran\xE7a sobre o futuro profissional?",
        type: "scale",
        is_inverted: false
      },
      // 8. EQUILÍBRIO TRABALHO X VIDA PESSOAL
      {
        id: "q8_1",
        section_id: 8,
        section_title: "8. EQUIL\xCDBRIO TRABALHO X VIDA PESSOAL",
        text: "O trabalho interfere na vida familiar?",
        type: "scale",
        is_inverted: false
      },
      {
        id: "q8_2",
        section_id: 8,
        section_title: "8. EQUIL\xCDBRIO TRABALHO X VIDA PESSOAL",
        text: "O trabalhador consegue descansar adequadamente?",
        type: "scale",
        is_inverted: true
      },
      {
        id: "q8_3",
        section_id: 8,
        section_title: "8. EQUIL\xCDBRIO TRABALHO X VIDA PESSOAL",
        text: "Existem jornadas excessivas?",
        type: "scale",
        is_inverted: false
      },
      {
        id: "q8_4",
        section_id: 8,
        section_title: "8. EQUIL\xCDBRIO TRABALHO X VIDA PESSOAL",
        text: "O trabalhador consegue usufruir f\xE9rias e folgas?",
        type: "scale",
        is_inverted: true
      },
      {
        id: "q8_5",
        section_id: 8,
        section_title: "8. EQUIL\xCDBRIO TRABALHO X VIDA PESSOAL",
        text: "H\xE1 dificuldades para conciliar demandas pessoais e profissionais?",
        type: "scale",
        is_inverted: false
      },
      // 9. COMUNICAÇÃO ORGANIZACIONAL
      {
        id: "q9_1",
        section_id: 9,
        section_title: "9. COMUNICA\xC7\xC3O ORGANIZACIONAL",
        text: "As informa\xE7\xF5es s\xE3o transmitidas com clareza?",
        type: "scale",
        is_inverted: true
      },
      {
        id: "q9_2",
        section_id: 9,
        section_title: "9. COMUNICA\xC7\xC3O ORGANIZACIONAL",
        text: "Os objetivos da empresa s\xE3o conhecidos?",
        type: "scale",
        is_inverted: true
      },
      {
        id: "q9_3",
        section_id: 9,
        section_title: "9. COMUNICA\xC7\xC3O ORGANIZACIONAL",
        text: "O trabalhador recebe retorno sobre seu desempenho?",
        type: "scale",
        is_inverted: true
      },
      {
        id: "q9_4",
        section_id: 9,
        section_title: "9. COMUNICA\xC7\xC3O ORGANIZACIONAL",
        text: "Mudan\xE7as organizacionais s\xE3o comunicadas adequadamente?",
        type: "scale",
        is_inverted: true
      },
      // 10. SINTOMAS RELACIONADOS AO ESTRESSE OCUPACIONAL
      {
        id: "q10_1",
        section_id: 10,
        section_title: "10. SINTOMAS RELACIONADOS AO ESTRESSE OCUPACIONAL",
        text: "Cansa\xE7o excessivo",
        type: "boolean",
        is_inverted: false
      },
      {
        id: "q10_2",
        section_id: 10,
        section_title: "10. SINTOMAS RELACIONADOS AO ESTRESSE OCUPACIONAL",
        text: "Ins\xF4nia",
        type: "boolean",
        is_inverted: false
      },
      {
        id: "q10_3",
        section_id: 10,
        section_title: "10. SINTOMAS RELACIONADOS AO ESTRESSE OCUPACIONAL",
        text: "Irritabilidade",
        type: "boolean",
        is_inverted: false
      },
      {
        id: "q10_4",
        section_id: 10,
        section_title: "10. SINTOMAS RELACIONADOS AO ESTRESSE OCUPACIONAL",
        text: "Ansiedade",
        type: "boolean",
        is_inverted: false
      },
      {
        id: "q10_5",
        section_id: 10,
        section_title: "10. SINTOMAS RELACIONADOS AO ESTRESSE OCUPACIONAL",
        text: "Dificuldade de concentra\xE7\xE3o",
        type: "boolean",
        is_inverted: false
      },
      {
        id: "q10_6",
        section_id: 10,
        section_title: "10. SINTOMAS RELACIONADOS AO ESTRESSE OCUPACIONAL",
        text: "Desmotiva\xE7\xE3o",
        type: "boolean",
        is_inverted: false
      },
      {
        id: "q10_7",
        section_id: 10,
        section_title: "10. SINTOMAS RELACIONADOS AO ESTRESSE OCUPACIONAL",
        text: "Dores musculares frequentes",
        type: "boolean",
        is_inverted: false
      },
      {
        id: "q10_8",
        section_id: 10,
        section_title: "10. SINTOMAS RELACIONADOS AO ESTRESSE OCUPACIONAL",
        text: "Cefaleias recorrentes",
        type: "boolean",
        is_inverted: false
      },
      {
        id: "q10_9",
        section_id: 10,
        section_title: "10. SINTOMAS RELACIONADOS AO ESTRESSE OCUPACIONAL",
        text: "Sintomas depressivos",
        type: "boolean",
        is_inverted: false
      },
      {
        id: "q10_10",
        section_id: 10,
        section_title: "10. SINTOMAS RELACIONADOS AO ESTRESSE OCUPACIONAL",
        text: "Uso frequente de medicamentos para ansiedade ou sono",
        type: "boolean",
        is_inverted: false
      }
    ];
  }
});

// server/state.ts
var state_exports = {};
__export(state_exports, {
  emailConfig: () => emailConfig,
  fallbackCompanies: () => fallbackCompanies,
  fallbackQuestions: () => fallbackQuestions,
  fallbackResponses: () => fallbackResponses,
  getAdminEmail: () => getAdminEmail,
  getAdminPassword: () => getAdminPassword
});
function getAdminPassword() {
  return emailConfig.adminPassword || process.env.ADMIN_PASSWORD || "admin_secure_password";
}
function getAdminEmail() {
  return emailConfig.adminEmail || process.env.ADMIN_EMAIL || "admin@controlseg.com.br";
}
var fallbackCompanies, fallbackQuestions, fallbackResponses, emailConfig;
var init_state = __esm({
  "server/state.ts"() {
    init_default_questions();
    fallbackCompanies = [
      {
        cnpj: "12.345.678/0001-90",
        name: "Empresa de Teste Control Med",
        enabled: true,
        enabled_from: "2026-01-01",
        enabled_until: "2027-12-31",
        areas: ["Geral"]
      }
    ];
    fallbackQuestions = [...DEFAULT_QUESTIONS];
    fallbackResponses = [];
    emailConfig = {
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
      adminAvatarUrl: ""
    };
  }
});

// server/lib/supabase.ts
var supabase_exports = {};
__export(supabase_exports, {
  ensureDbQuestionsSeeded: () => ensureDbQuestionsSeeded,
  fallbackQuestions: () => fallbackQuestions,
  getSupabase: () => getSupabase,
  getSupabaseAuth: () => getSupabaseAuth,
  isSupabaseReady: () => isSupabaseReady
});
function getSupabase() {
  if (supabaseClient) return supabaseClient;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
  if (url && key && url !== "https://your-project.supabase.co" && key !== "your-anon-or-service-role-key") {
    try {
      supabaseClient = (0, import_supabase_js.createClient)(url, key);
      isSupabaseConnected = true;
      console.log(
        "Successfully initialized Supabase admin client (service_role)."
      );
      return supabaseClient;
    } catch (err) {
      console.error("Failed to initialize Supabase admin client:", err);
    }
  } else {
    console.warn(
      "Supabase credentials are not configured or are placeholders. Falling back to local state."
    );
  }
  return null;
}
function getSupabaseAuth() {
  if (supabaseAuthClient) return supabaseAuthClient;
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;
  if (url && anonKey && url !== "https://your-project.supabase.co" && anonKey !== "your-anon-or-service-role-key") {
    try {
      supabaseAuthClient = (0, import_supabase_js.createClient)(url, anonKey);
      console.log("Successfully initialized Supabase auth client (anon).");
      return supabaseAuthClient;
    } catch (err) {
      console.error("Failed to initialize Supabase auth client:", err);
    }
  }
  return null;
}
function isSupabaseReady() {
  return isSupabaseConnected;
}
var import_supabase_js, supabaseClient, supabaseAuthClient, isSupabaseConnected;
var init_supabase = __esm({
  "server/lib/supabase.ts"() {
    import_supabase_js = require("@supabase/supabase-js");
    init_state();
    init_seed();
    supabaseClient = null;
    supabaseAuthClient = null;
    isSupabaseConnected = false;
  }
});

// server/lib/seed.ts
async function ensureDbQuestionsSeeded() {
  const { getSupabase: getSupabase2 } = await Promise.resolve().then(() => (init_supabase(), supabase_exports));
  const { fallbackQuestions: fallbackQuestions2 } = await Promise.resolve().then(() => (init_state(), state_exports));
  const supabase = getSupabase2();
  if (!supabase) return;
  try {
    const { count, error } = await supabase.from(TABLE).select("*", { count: "exact", head: true });
    if (error) {
      console.warn("Could not check questions count for seeding:", error.message);
      return;
    }
    if (count === 0 && fallbackQuestions2.length > 0) {
      const { error: seedError } = await supabase.from(TABLE).insert(fallbackQuestions2);
      if (seedError) {
        console.warn("Failed to seed questions:", seedError.message);
      } else {
        console.log(`Seeded ${fallbackQuestions2.length} default questions into Supabase.`);
      }
    }
  } catch (err) {
    console.error("Error during questions seeding:", err);
  }
}
var TABLE;
var init_seed = __esm({
  "server/lib/seed.ts"() {
    TABLE = "questions";
  }
});

// server/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
var import_express11 = __toESM(require("express"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);

// server/config.ts
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
init_state();
var EMAIL_CONFIG_FILE = process.env.VERCEL ? "/tmp/email_config.json" : import_path.default.join(process.cwd(), "email_config.json");
function loadEmailConfig() {
  try {
    if (import_fs.default.existsSync(EMAIL_CONFIG_FILE)) {
      const data = import_fs.default.readFileSync(EMAIL_CONFIG_FILE, "utf-8");
      const loaded = JSON.parse(data);
      Object.assign(emailConfig, { ...emailConfig, ...loaded });
      console.log("Loaded persistent email configuration.");
    }
  } catch (err) {
    console.error("Error loading email_config.json:", err);
  }
}
function saveEmailConfig() {
  try {
    import_fs.default.writeFileSync(EMAIL_CONFIG_FILE, JSON.stringify(emailConfig, null, 2), "utf-8");
    console.log("Saved persistent email configuration.");
  } catch (err) {
    console.error("Error saving email_config.json:", err);
  }
}

// server/lib/seedTrigger.ts
init_seed();
setTimeout(ensureDbQuestionsSeeded, 3e3);

// server/routes/auth.ts
var import_express = __toESM(require("express"), 1);
init_supabase();
init_state();

// server/lib/jwt.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var FALLBACK_SECRET = "dev-insecure-jwt-secret-please-set-JWT_SECRET";
function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    console.warn("JWT_SECRET is not set or too short (need >= 16 chars). Using insecure fallback for dev only.");
    return FALLBACK_SECRET;
  }
  return secret;
}
function signAdminToken(email) {
  const options = {
    expiresIn: process.env.JWT_EXPIRES_IN || "8h"
  };
  return import_jsonwebtoken.default.sign(
    { sub: email, type: "admin" },
    getSecret(),
    options
  );
}
function verifyAdminToken(token) {
  try {
    const payload = import_jsonwebtoken.default.verify(token, getSecret());
    if (payload.type !== "admin") return null;
    return payload;
  } catch (err) {
    return null;
  }
}

// server/routes/auth.ts
var router = import_express.default.Router();
router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const adminEmail = getAdminEmail();
  const adminPassword = getAdminPassword();
  if (email === adminEmail && password === adminPassword) {
    const token = signAdminToken(adminEmail);
    return res.json({ success: true, token });
  }
  const supabase = getSupabaseAuth();
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (data?.session) {
        return res.json({ success: true, token: data.session.access_token });
      }
      if (error) {
        console.error("[auth/login] Supabase auth error:", error.message);
        return res.status(401).json({ error: `Erro no Supabase: ${error.message}` });
      }
    } catch (err) {
      console.error("[auth/login] Supabase login error:", err);
      return res.status(401).json({ error: "Credenciais inv\xE1lidas. Verifique o email e senha." });
    }
  }
  return res.status(401).json({ error: "Credenciais inv\xE1lidas. Verifique o email e senha." });
});
router.get("/auth/verify", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ valid: false });
  }
  const token = authHeader.replace("Bearer ", "");
  if (verifyAdminToken(token)) {
    return res.json({ valid: true });
  }
  const supabase = getSupabaseAuth();
  if (supabase) {
    try {
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) return res.json({ valid: true });
    } catch (err) {
    }
  }
  return res.status(401).json({ valid: false });
});
var auth_default = router;

// server/routes/supabase.ts
var import_express2 = __toESM(require("express"), 1);
init_supabase();
var router2 = import_express2.default.Router();
router2.get("/supabase-status", async (_req, res) => {
  const supabase = getSupabase();
  const configured = process.env.SUPABASE_URL !== void 0 && process.env.SUPABASE_URL !== "" && process.env.SUPABASE_URL !== "https://your-project.supabase.co";
  if (!supabase || !configured) {
    return res.json({
      connected: false,
      configured,
      tablesExist: false,
      rpcExists: false,
      errorDetails: "Credenciais do Supabase n\xE3o configuradas no painel de Secrets."
    });
  }
  let companiesOk = false;
  let questionsOk = false;
  let responsesOk = false;
  let rpcOk = false;
  let errorDetails = null;
  try {
    const { error: compErr } = await supabase.from("companies").select("id").limit(1);
    companiesOk = !compErr || compErr.code !== "42P01";
    if (compErr && compErr.code === "42P01") {
      errorDetails = `Tabela "companies" n\xE3o encontrada.`;
    }
    const { error: questErr } = await supabase.from("questions").select("id").limit(1);
    questionsOk = !questErr || questErr.code !== "42P01";
    if (questErr && questErr.code === "42P01" && !errorDetails) {
      errorDetails = `Tabela "questions" n\xE3o encontrada.`;
    }
    const { error: respErr } = await supabase.from("responses").select("id").limit(1);
    responsesOk = !respErr || respErr.code !== "42P01";
    if (respErr && respErr.code === "42P01" && !errorDetails) {
      errorDetails = `Tabela "responses" n\xE3o encontrada.`;
    }
    const { error: rpcErr } = await supabase.rpc("calculate_assessment_score", { answers: {} });
    rpcOk = !rpcErr || rpcErr.code !== "42883";
    if (rpcErr && rpcErr.code === "42883" && !errorDetails) {
      errorDetails = `Fun\xE7\xE3o RPC "calculate_assessment_score" n\xE3o encontrada.`;
    }
    if (compErr && compErr.code !== "42P01" && !errorDetails) {
      errorDetails = compErr.message || JSON.stringify(compErr);
    }
  } catch (err) {
    errorDetails = err?.message || String(err);
  }
  res.json({
    connected: companiesOk && questionsOk && responsesOk && rpcOk,
    configured,
    tablesExist: companiesOk && questionsOk && responsesOk,
    rpcExists: rpcOk,
    companiesTable: companiesOk,
    questionsTable: questionsOk,
    responsesTable: responsesOk,
    rpcFunction: rpcOk,
    errorDetails
  });
});
var supabase_default = router2;

// server/routes/cnpj.ts
var import_express3 = __toESM(require("express"), 1);

// server/lib/company.ts
init_supabase();
init_state();

// server/lib/cnpj.ts
function cleanCNPJ(cnpj) {
  return cnpj.replace(/\D/g, "");
}

// server/lib/company.ts
async function checkCompanyAccess(cnpj) {
  const cleanedTarget = cleanCNPJ(cnpj);
  const now = /* @__PURE__ */ new Date();
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("companies").select("*").eq("cnpj", cleanedTarget).limit(1);
      if (error) {
        if (error.code === "42P01") {
        } else {
          throw error;
        }
      } else if (data) {
        const company2 = data[0];
        const access2 = evaluate(company2, now);
        if (!access2.valid || !company2) return access2;
        return { ...access2, areas: normalizeAreas(company2.areas) };
      }
    } catch (err) {
      console.error("Error checking company access in Supabase:", err);
    }
  }
  const company = fallbackCompanies.find((c) => cleanCNPJ(c.cnpj) === cleanedTarget);
  const access = evaluate(company, now);
  if (!access.valid || !company) return access;
  return { ...access, areas: normalizeAreas(company.areas) };
}
function normalizeAreas(areas) {
  if (!Array.isArray(areas)) return ["Geral"];
  const normalized = areas.filter((area) => typeof area === "string").map((area) => area.trim()).filter(Boolean);
  return [...new Set(normalized)].length ? [...new Set(normalized)] : ["Geral"];
}
function evaluate(company, now) {
  if (!company) {
    return { valid: false, areas: [], error: "CNPJ n\xE3o cadastrado ou n\xE3o habilitado." };
  }
  if (!company.enabled) {
    return { valid: false, areas: [], error: "Este CNPJ est\xE1 desabilitado pelo administrador." };
  }
  const fromDate = new Date(company.enabled_from);
  const untilDate = new Date(company.enabled_until);
  fromDate.setHours(0, 0, 0, 0);
  untilDate.setHours(23, 59, 59, 999);
  if (now < fromDate || now > untilDate) {
    return {
      valid: false,
      areas: [],
      error: `Fora do per\xEDodo de resposta cadastrado (De ${new Date(company.enabled_from).toLocaleDateString("pt-BR")} at\xE9 ${new Date(company.enabled_until).toLocaleDateString("pt-BR")}).`
    };
  }
  return { valid: true, company, areas: normalizeAreas(company.areas) };
}

// server/routes/cnpj.ts
var router3 = import_express3.default.Router();
router3.post("/cnpj/validate", async (req, res) => {
  const { cnpj } = req.body;
  if (!cnpj) {
    return res.status(400).json({ error: "CNPJ \xE9 obrigat\xF3rio." });
  }
  const result = await checkCompanyAccess(cnpj);
  if (!result.valid) {
    return res.json({ valid: false, error: result.error });
  }
  return res.json({
    valid: true,
    companyName: result.company.name,
    cnpj: result.company.cnpj,
    areas: result.areas
  });
});
var cnpj_default = router3;

// server/routes/assessment.ts
var import_express4 = __toESM(require("express"), 1);
init_supabase();
init_state();

// server/lib/score.ts
function calculateLocalScore(answers, questions) {
  let totalScore = 0;
  let maxPossible = 0;
  let minPossible = 0;
  const sectionSums = {};
  const sectionMaxes = {};
  const sectionMins = {};
  const sectionScores = {};
  for (const q of questions) {
    const val = answers[q.id];
    if (val !== void 0 && val !== null) {
      let itemScore = 0;
      if (q.type === "scale") {
        itemScore = Number(val);
        if (q.is_inverted) {
          itemScore = 6 - itemScore;
        }
        maxPossible += 5;
        minPossible += 1;
      } else if (q.type === "boolean") {
        itemScore = val === "Sim" ? 5 : 1;
        maxPossible += 5;
        minPossible += 1;
      }
      totalScore += itemScore;
      const secId = String(q.section_id);
      sectionSums[secId] = (sectionSums[secId] || 0) + itemScore;
      sectionMaxes[secId] = (sectionMaxes[secId] || 0) + 5;
      sectionMins[secId] = (sectionMins[secId] || 0) + 1;
    }
  }
  const finalPercentage = maxPossible - minPossible > 0 ? Number(((totalScore - minPossible) / (maxPossible - minPossible) * 100).toFixed(2)) : 0;
  let classification = "Baixo";
  if (finalPercentage <= 20) classification = "Baixo";
  else if (finalPercentage <= 40) classification = "Moderado";
  else if (finalPercentage <= 60) classification = "M\xE9dio";
  else if (finalPercentage <= 80) classification = "Alto";
  else classification = "Cr\xEDtico";
  for (const secId of Object.keys(sectionSums)) {
    const sum = sectionSums[secId];
    const max = sectionMaxes[secId];
    const min = sectionMins[secId];
    const sPerc = max - min > 0 ? Number(((sum - min) / (max - min) * 100).toFixed(2)) : 0;
    sectionScores[secId] = { sum, max, min, percentage: sPerc };
  }
  return {
    total_score: finalPercentage,
    classification,
    section_scores: sectionScores,
    raw_score: totalScore,
    max_possible: maxPossible,
    min_possible: minPossible
  };
}

// server/lib/email.ts
var import_nodemailer = __toESM(require("nodemailer"), 1);
init_state();
var SECTION_NAMES = {
  "1": "Demanda de Trabalho (Karasek/HSE)",
  "2": "Controle do Trabalho",
  "3": "Suporte Social",
  "4": "Rela\xE7\xF5es de Trabalho",
  "5": "Reconhecimento e Recompensa",
  "6": "Justi\xE7a Organizacional",
  "7": "Equil\xEDbrio Trabalho-Fam\xEDlia",
  "8": "Seguran\xE7a e Sa\xFAde Ocupacional",
  "9": "Comunica\xE7\xE3o Organizacional",
  "10": "Sintomas de Estresse Ocupacional"
};
var CLASSIFICATION_COLORS = {
  "Baixo": "#15803d",
  "Moderado": "#4f46e5",
  "M\xE9dio": "#b45309",
  "Alto": "#ea580c",
  "Cr\xEDtico": "#b91c1c"
};
async function sendSubmissionNotification(submission, result) {
  if (!emailConfig.enabled) return;
  if (!emailConfig.smtpHost || !emailConfig.smtpUser || !emailConfig.smtpPassword) {
    console.warn("SMTP credentials are missing. Skipping notification email.");
    return;
  }
  const scoreRowsHtml = Object.keys(result.section_scores || {}).map((secId) => {
    const secData = result.section_scores[secId];
    const name = SECTION_NAMES[secId] || `Se\xE7\xE3o ${secId}`;
    const pct = secData?.percentage ?? 0;
    let color = "#15803d";
    if (pct > 60) color = "#b91c1c";
    else if (pct > 40) color = "#b45309";
    return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #334155;">${name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: bold; text-align: right; color: ${color};">${pct}%</td>
        </tr>
      `;
  }).join("");
  const classColor = CLASSIFICATION_COLORS[result.classification] || "#1e293b";
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
      <div style="text-align: center; margin-bottom: 25px; border-bottom: 3px solid #0D4E35; padding-bottom: 15px;">
        <h1 style="color: #0D4E35; font-size: 24px; margin: 0; font-weight: 800; letter-spacing: -0.5px;">Control Med</h1>
        <p style="color: #64748b; font-size: 12px; margin: 5px 0 0 0; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Nova Avalia\xE7\xE3o Psicossocial Recebida</p>
      </div>

      <p style="font-size: 14px; line-height: 1.6; color: #334155;">
        Uma nova resposta de question\xE1rio de avalia\xE7\xE3o de riscos psicossociais (SST) foi enviada com sucesso no portal da <strong>Control Med</strong>. Segue o resumo do resultado:
      </p>

      <div style="background-color: #f8fafc; border-radius: 8px; padding: 18px; margin: 20px 0; border-left: 4px solid #0D4E35;">
        <h3 style="margin-top: 0; color: #0D4E35; font-size: 15px; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px;">Dados da Empresa & Respondente</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="padding: 4px 0; color: #64748b; width: 35%;"><strong>Empresa:</strong></td>
            <td style="padding: 4px 0; color: #1e293b; font-weight: bold;">${submission.company_name}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b;"><strong>CNPJ:</strong></td>
            <td style="padding: 4px 0; color: #1e293b; font-family: monospace;">${submission.cnpj}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b;"><strong>Respondente:</strong></td>
            <td style="padding: 4px 0; color: #1e293b;">${submission.respondent_name}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b;"><strong>E-mail:</strong></td>
            <td style="padding: 4px 0; color: #1e293b;"><a href="mailto:${submission.respondent_email}" style="color: #0d6efd; text-decoration: none;">${submission.respondent_email}</a></td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b;"><strong>Data de Envio:</strong></td>
            <td style="padding: 4px 0; color: #1e293b;">${(/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR")} \xE0s ${(/* @__PURE__ */ new Date()).toLocaleTimeString("pt-BR")}</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin: 25px 0; padding: 15px; border: 1px solid #cbd5e1; border-radius: 10px; background-color: #fdfdfd;">
        <span style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; display: block; margin-bottom: 5px;">Pontua\xE7\xE3o Global (Risco SST)</span>
        <span style="font-size: 32px; font-weight: 800; color: ${classColor}; display: block; line-height: 1.2;">${result.total_score}%</span>
        <span style="display: inline-block; margin-top: 10px; padding: 5px 15px; background-color: ${classColor}; color: #ffffff; font-weight: bold; font-size: 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">
          Risco: ${result.classification}
        </span>
      </div>

      <h3 style="color: #1e293b; font-size: 15px; margin-bottom: 10px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">An\xE1lise Detalhada por Dimens\xE3o</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
        <thead>
          <tr style="background-color: #f1f5f9;">
            <th style="padding: 10px; text-align: left; font-size: 12px; color: #475569; border-bottom: 2px solid #cbd5e1;">Dimens\xE3o / Categoria</th>
            <th style="padding: 10px; text-align: right; font-size: 12px; color: #475569; border-bottom: 2px solid #cbd5e1; width: 25%;">\xCDndice de Risco</th>
          </tr>
        </thead>
        <tbody>
          ${scoreRowsHtml}
        </tbody>
      </table>

      <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
        O relat\xF3rio PDF consolidado de SST e os gr\xE1ficos detalhados j\xE1 est\xE3o dispon\xEDveis para consulta e download no seu painel administrativo.
      </p>

      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0 15px 0;">
      <p style="font-size: 11px; text-align: center; color: #94a3b8; font-family: monospace; margin: 0;">
        E-mail autom\xE1tico emitido pela plataforma Control Med SST. Por favor, n\xE3o responda a esta mensagem.
      </p>
    </div>
  `;
  try {
    const transporter = import_nodemailer.default.createTransport({
      host: emailConfig.smtpHost,
      port: Number(emailConfig.smtpPort),
      secure: emailConfig.smtpSecure,
      auth: {
        user: emailConfig.smtpUser,
        pass: emailConfig.smtpPassword
      },
      connectionTimeout: 1e4,
      greetingTimeout: 1e4,
      socketTimeout: 15e3
    });
    const mailOptions = {
      from: `"SST Control Med" <${emailConfig.smtpUser}>`,
      to: emailConfig.recipientEmail,
      subject: `[ALERTA SST] Nova Avalia\xE7\xE3o - ${submission.company_name} (${result.classification})`,
      html
    };
    await transporter.sendMail(mailOptions);
    console.log("Successfully sent submission notification email.");
  } catch (err) {
    console.error("Error sending submission notification email:", err);
  }
}
function buildTestEmailHtml(smtpHost, smtpPort, smtpUser) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #0D4E35; border-bottom: 2px solid #0D4E35; padding-bottom: 10px; margin-top: 0;">Control Med - SST</h2>
      <p>Ol\xE1 Administrador,</p>
      <p>Este \xE9 um <strong>e-mail de teste de conex\xE3o</strong> enviado do seu painel administrativo da Control Med.</p>
      <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 15px; margin: 20px 0;">
        <p style="margin: 0 0 8px 0;"><strong>Status da Conex\xE3o:</strong> Sucesso! <span style="color: #15803d; font-weight: bold;">\u2714 Ativo</span></p>
        <p style="margin: 0 0 8px 0;"><strong>Servidor SMTP:</strong> ${smtpHost}</p>
        <p style="margin: 0 0 8px 0;"><strong>Porta:</strong> ${smtpPort}</p>
        <p style="margin: 0;"><strong>Usu\xE1rio:</strong> ${smtpUser}</p>
      </div>
      <p>A partir de agora, o envio de notifica\xE7\xF5es de novas respostas e relat\xF3rios psicossociais est\xE1 pronto para funcionar se ativado.</p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0 15px 0;">
      <p style="font-size: 11px; color: #94a3b8; font-family: monospace;">E-mail gerado automaticamente pelo portal de avalia\xE7\xF5es Control Med.</p>
    </div>
  `;
}

// server/routes/assessment.ts
var router4 = import_express4.default.Router();
router4.get("/assessment/questions", async (_req, res) => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("questions").select("*").order("section_id", { ascending: true }).order("id", { ascending: true });
      if (!error && data && data.length > 0) return res.json(data);
    } catch (err) {
      console.error("Error fetching questions from Supabase:", err);
    }
  }
  return res.json([...fallbackQuestions].sort((a, b) => a.section_id - b.section_id));
});
router4.post("/assessment/submit", async (req, res) => {
  const {
    cnpj,
    area,
    company_name,
    respondent_name,
    respondent_email,
    start_time,
    end_time,
    answers
  } = req.body;
  if (!cnpj || !area || !company_name || !respondent_name || !respondent_email || !answers) {
    return res.status(400).json({ error: "CNPJ, \xE1rea, dados do respondente e respostas s\xE3o obrigat\xF3rios." });
  }
  const cleanedCnpj = cleanCNPJ(cnpj);
  const requestedArea = String(area).trim();
  if (!requestedArea) return res.status(400).json({ error: "A \xE1rea \xE9 obrigat\xF3ria." });
  const access = await checkCompanyAccess(cleanedCnpj);
  if (!access.valid) {
    return res.status(403).json({ error: access.error || "CNPJ n\xE3o autorizado para envio." });
  }
  const allowedArea = normalizeAreas(access.areas).find((candidate) => candidate.toLowerCase() === requestedArea.toLowerCase());
  if (!allowedArea) {
    return res.status(403).json({ error: "A \xE1rea selecionada n\xE3o est\xE1 habilitada para este CNPJ." });
  }
  const canonicalArea = allowedArea;
  const supabase = getSupabase();
  let result = null;
  let currentQuestions = [...fallbackQuestions];
  if (supabase) {
    try {
      const { data: dbQ } = await supabase.from("questions").select("*");
      if (dbQ && dbQ.length > 0) currentQuestions = dbQ;
    } catch (err) {
      console.error("Error fetching questions for submission calculation:", err);
    }
  }
  if (supabase) {
    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc("calculate_assessment_score", { answers });
      if (!rpcError && rpcData) {
        result = rpcData;
      } else {
        if (rpcError && rpcError.code === "42883") {
          console.warn("Supabase RPC calculate_assessment_score function does not exist yet. Using backend local calculation.");
        } else {
          console.warn("RPC calculation error or function missing. Falling back to backend calculation:", rpcError);
        }
        result = calculateLocalScore(answers, currentQuestions);
      }
    } catch (err) {
      console.error("Failed to trigger database calculation function, running backend fallback:", err);
      result = calculateLocalScore(answers, currentQuestions);
    }
  } else {
    result = calculateLocalScore(answers, currentQuestions);
  }
  const submission = {
    cnpj: cleanedCnpj,
    area: canonicalArea,
    company_name,
    respondent_name,
    respondent_email,
    start_time,
    end_time,
    answers,
    total_score: result.total_score,
    classification: result.classification,
    section_scores: result.section_scores,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (supabase) {
    try {
      const { data, error } = await supabase.from("responses").insert([submission]).select().single();
      if (error) throw error;
      sendSubmissionNotification(data || submission, result).catch(
        (err) => console.error("Error in background email notification:", err)
      );
      return res.json({
        success: true,
        message: "Resposta registrada com sucesso. O relat\xF3rio ficar\xE1 dispon\xEDvel apenas para o administrador."
      });
    } catch (err) {
      console.error("Error inserting submission in Supabase:", err);
      if (err?.code === "23505" || String(err?.message || "").toLowerCase().includes("unique")) {
        return res.status(500).json({
          error: "O banco ainda possui a restri\xE7\xE3o antiga de uma resposta por \xE1rea. Execute a migra\xE7\xE3o hist\xF3rica sem apagar dados e tente novamente."
        });
      }
      return res.status(500).json({
        error: "N\xE3o foi poss\xEDvel registrar a resposta no banco. Nenhum dado foi substitu\xEDdo. Tente novamente."
      });
    }
  }
  const fallbackSubmission = {
    ...submission,
    id: `${cleanedCnpj}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  };
  fallbackResponses.push(fallbackSubmission);
  sendSubmissionNotification(fallbackSubmission, result).catch(
    (err) => console.error("Error in background email notification:", err)
  );
  return res.json({
    success: true,
    message: "Resposta registrada com sucesso. O relat\xF3rio ficar\xE1 dispon\xEDvel apenas para o administrador."
  });
});
var assessment_default = router4;

// server/routes/companies.ts
var import_express5 = __toESM(require("express"), 1);
init_supabase();
init_state();

// server/lib/auth.ts
init_supabase();
init_state();
async function authenticateAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "N\xE3o autorizado. Fa\xE7a login novamente." });
  }
  const token = authHeader.replace("Bearer ", "");
  const adminPayload = verifyAdminToken(token);
  if (adminPayload) {
    req.user = { id: adminPayload.sub, email: adminPayload.sub, adminLocal: true };
    return next();
  }
  const supabase = getSupabaseAuth();
  if (supabase) {
    try {
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        req.user = user;
        return next();
      }
    } catch (err) {
      console.error("Supabase auth verify error:", err);
    }
  }
  return res.status(401).json({ error: "N\xE3o autorizado. Fa\xE7a login novamente." });
}

// server/routes/companies.ts
var router5 = import_express5.default.Router();
router5.get("/admin/companies", authenticateAdmin, async (_req, res) => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("companies").select("*").order("created_at", { ascending: false });
      if (!error) return res.json((data || []).map((company) => ({ ...company, areas: normalizeAreas(company.areas) })));
    } catch (err) {
      console.error("Error listing companies from Supabase:", err);
    }
  }
  return res.json(fallbackCompanies);
});
router5.post("/admin/companies", authenticateAdmin, async (req, res) => {
  const input = req.body;
  if (!input?.cnpj || !input.name || !input.enabled_from || !input.enabled_until) {
    return res.status(400).json({ error: "CNPJ, nome e per\xEDodo de habilita\xE7\xE3o s\xE3o obrigat\xF3rios." });
  }
  const company = {
    cnpj: cleanCNPJ(input.cnpj),
    name: String(input.name).trim(),
    enabled: input.enabled !== false,
    enabled_from: input.enabled_from,
    enabled_until: input.enabled_until,
    areas: normalizeAreas(input.areas)
  };
  if (company.cnpj.length !== 14) {
    return res.status(400).json({ error: "CNPJ inv\xE1lido. Deve conter 14 d\xEDgitos num\xE9ricos." });
  }
  if (company.enabled_from > company.enabled_until) {
    return res.status(400).json({ error: "A data inicial n\xE3o pode ser posterior \xE0 data final." });
  }
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("companies").insert([company]).select();
      if (error) {
        if (error.code === "23505") return res.status(400).json({ error: "Este CNPJ j\xE1 est\xE1 cadastrado." });
        throw error;
      }
      return res.json({ ...data[0], areas: normalizeAreas(data[0].areas) });
    } catch (err) {
      console.warn("Erro ao salvar empresa no Supabase, usando fallback local:", err.message || err);
    }
  }
  if (fallbackCompanies.some((c) => cleanCNPJ(c.cnpj) === company.cnpj)) {
    return res.status(400).json({ error: "Este CNPJ j\xE1 est\xE1 cadastrado." });
  }
  const newCompany = { ...company, id: Math.random().toString(36).slice(2, 11) };
  fallbackCompanies.push(newCompany);
  return res.json(newCompany);
});
router5.put("/admin/companies/:id", authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const input = req.body;
  const update = {};
  if (input.name !== void 0) update.name = String(input.name).trim();
  if (input.enabled !== void 0) update.enabled = Boolean(input.enabled);
  if (input.enabled_from !== void 0) update.enabled_from = input.enabled_from;
  if (input.enabled_until !== void 0) update.enabled_until = input.enabled_until;
  if (input.areas !== void 0) update.areas = normalizeAreas(input.areas);
  if (update.enabled_from && update.enabled_until && update.enabled_from > update.enabled_until) {
    return res.status(400).json({ error: "A data inicial n\xE3o pode ser posterior \xE0 data final." });
  }
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("companies").update(update).eq("id", id).select();
      if (!error && data && data.length > 0) return res.json({ ...data[0], areas: normalizeAreas(data[0].areas) });
      if (error) throw error;
    } catch (err) {
      console.warn("Erro ao atualizar empresa no Supabase, usando fallback local:", err.message || err);
    }
  }
  const idx = fallbackCompanies.findIndex((c) => c.id === id || c.cnpj === id);
  if (idx !== -1) {
    fallbackCompanies[idx] = { ...fallbackCompanies[idx], ...update, areas: normalizeAreas(update.areas ?? fallbackCompanies[idx].areas) };
    return res.json(fallbackCompanies[idx]);
  }
  return res.status(404).json({ error: "Empresa n\xE3o encontrada." });
});
router5.delete("/admin/companies/:id", authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data: company, error: lookupError } = await supabase.from("companies").select("cnpj").eq("id", id).maybeSingle();
      if (lookupError) throw lookupError;
      if (!company) return res.status(404).json({ error: "Empresa n\xE3o encontrada." });
      const { count, error: responsesError } = await supabase.from("responses").select("id", { count: "exact", head: true }).eq("cnpj", company.cnpj);
      if (responsesError) throw responsesError;
      if ((count || 0) > 0) {
        return res.status(409).json({
          error: "Esta empresa possui hist\xF3rico de preenchimentos e n\xE3o pode ser exclu\xEDda. Desabilite-a para preservar os dados."
        });
      }
      const { error } = await supabase.from("companies").delete().eq("id", id);
      if (error) throw error;
      return res.json({ success: true });
    } catch (err) {
      console.error("Erro ao excluir empresa do Supabase:", err);
      return res.status(500).json({ error: err.message || "Erro ao excluir empresa." });
    }
  }
  const idx = fallbackCompanies.findIndex((c) => c.id === id || c.cnpj === id);
  if (idx !== -1) {
    const deletedCnpj = cleanCNPJ(fallbackCompanies[idx].cnpj);
    const hasResponses = fallbackResponses.some((response) => cleanCNPJ(response.cnpj) === deletedCnpj);
    if (hasResponses) {
      return res.status(409).json({
        error: "Esta empresa possui hist\xF3rico de preenchimentos e n\xE3o pode ser exclu\xEDda. Desabilite-a para preservar os dados."
      });
    }
    fallbackCompanies.splice(idx, 1);
    return res.json({ success: true });
  }
  return res.status(404).json({ error: "Empresa n\xE3o encontrada." });
});
var companies_default = router5;

// server/routes/questions.ts
var import_express6 = __toESM(require("express"), 1);
init_supabase();
init_state();
var router6 = import_express6.default.Router();
router6.post("/admin/questions", authenticateAdmin, async (req, res) => {
  const question = req.body;
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("questions").insert([question]).select();
      if (!error && data && data.length > 0) return res.json(data[0]);
      if (error) throw error;
    } catch (err) {
      console.warn("Erro ao criar pergunta no Supabase, usando fallback local:", err.message || err);
    }
  }
  if (fallbackQuestions.some((q) => q.id === question.id)) {
    return res.status(400).json({ error: "O ID desta pergunta j\xE1 existe." });
  }
  fallbackQuestions.push(question);
  return res.json(question);
});
router6.put("/admin/questions/:id", authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const question = req.body;
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("questions").update(question).eq("id", id).select();
      if (!error && data && data.length > 0) return res.json(data[0]);
      if (error) throw error;
    } catch (err) {
      console.warn("Erro ao atualizar pergunta no Supabase, usando fallback local:", err.message || err);
    }
  }
  const idx = fallbackQuestions.findIndex((q) => q.id === id);
  if (idx !== -1) {
    fallbackQuestions[idx] = { ...fallbackQuestions[idx], ...question };
    return res.json(fallbackQuestions[idx]);
  }
  return res.status(404).json({ error: "Pergunta n\xE3o encontrada." });
});
router6.delete("/admin/questions/:id", authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from("questions").delete().eq("id", id);
      if (error) throw error;
      return res.json({ success: true });
    } catch (err) {
      console.warn("Erro ao deletar pergunta do Supabase, usando fallback local:", err.message || err);
    }
  }
  const idx = fallbackQuestions.findIndex((q) => q.id === id);
  if (idx !== -1) {
    fallbackQuestions.splice(idx, 1);
    return res.json({ success: true });
  }
  return res.status(404).json({ error: "Pergunta n\xE3o encontrada." });
});
var questions_default = router6;

// server/routes/submissions.ts
var import_express7 = __toESM(require("express"), 1);
init_supabase();
init_state();

// server/lib/historical.ts
init_supabase();
init_state();
var PAGE_SIZE = 1e3;
async function getHistoricalResponses() {
  const supabase = getSupabase();
  if (!supabase) return fallbackResponses;
  const responses = [];
  let offset = 0;
  while (true) {
    const { data, error } = await supabase.from("responses").select("*").order("created_at", { ascending: false }).order("id", { ascending: false }).range(offset, offset + PAGE_SIZE - 1);
    if (error) {
      throw new Error(`Erro ao consultar o hist\xF3rico de respostas no Supabase: ${error.message}`);
    }
    const page = data || [];
    responses.push(...page);
    if (page.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }
  return responses;
}

// server/lib/xlsx.ts
var XLSX = __toESM(require("xlsx"), 1);

// server/lib/summary.ts
function round(value) {
  return Number(value.toFixed(2));
}
function classifyScore(score) {
  if (score <= 20) return "Baixo";
  if (score <= 40) return "Moderado";
  if (score <= 60) return "M\xE9dio";
  if (score <= 80) return "Alto";
  return "Cr\xEDtico";
}
function average(values) {
  if (!values.length) return 0;
  return round(values.reduce((sum, value) => sum + value, 0) / values.length);
}
function averageSectionScores(responses) {
  const sectionIds = [...new Set(responses.flatMap((response) => Object.keys(response.section_scores || {})))];
  const sectionScores = {};
  for (const sectionId of sectionIds) {
    const scores = responses.map((response) => response.section_scores?.[sectionId]).filter((score) => Boolean(score));
    if (!scores.length) continue;
    sectionScores[sectionId] = {
      sum: average(scores.map((score) => Number(score.sum || 0))),
      max: average(scores.map((score) => Number(score.max || 0))),
      min: average(scores.map((score) => Number(score.min || 0))),
      percentage: average(scores.map((score) => Number(score.percentage || 0)))
    };
  }
  return sectionScores;
}
function buildMetrics(responses) {
  const total_score = average(responses.map((response) => Number(response.total_score || 0)));
  return {
    response_count: responses.length,
    total_score,
    classification: classifyScore(total_score),
    section_scores: averageSectionScores(responses)
  };
}
function personKey(response) {
  const email = response.respondent_email.trim().toLowerCase();
  if (email) return `email:${email}`;
  return `name:${response.respondent_name.trim().toLowerCase()}`;
}
function groupBy(items, keyOf) {
  const groups = /* @__PURE__ */ new Map();
  for (const item of items) {
    const key = keyOf(item);
    const group = groups.get(key);
    if (group) group.push(item);
    else groups.set(key, [item]);
  }
  return groups;
}
function buildPersonSummary(responses) {
  const first = responses[0];
  const metrics = buildMetrics(responses);
  return {
    ...metrics,
    respondent_name: first.respondent_name,
    respondent_email: first.respondent_email,
    areas: [...new Set(responses.map((response) => response.area || "Geral"))],
    submissions: responses.map((response) => ({
      id: response.id,
      area: response.area || "Geral",
      total_score: response.total_score,
      classification: response.classification,
      created_at: response.created_at,
      end_time: response.end_time
    }))
  };
}
function buildAreaSummary(area, responses) {
  const metrics = buildMetrics(responses);
  const respondentGroups = groupBy(responses, personKey);
  return {
    ...metrics,
    area,
    respondent_count: respondentGroups.size,
    respondents: [...respondentGroups.values()].map((group) => {
      const person = buildPersonSummary(group);
      return {
        respondent_name: person.respondent_name,
        respondent_email: person.respondent_email,
        response_count: person.response_count,
        total_score: person.total_score,
        classification: person.classification
      };
    }),
    responses: responses.map((response) => ({
      id: response.id,
      area: response.area || area,
      respondent_name: response.respondent_name,
      respondent_email: response.respondent_email,
      start_time: response.start_time,
      end_time: response.end_time,
      answers: response.answers,
      section_scores: response.section_scores,
      total_score: response.total_score,
      classification: response.classification,
      created_at: response.created_at
    }))
  };
}
function summarizeCompanyResponses(responses) {
  if (!responses.length) return null;
  const personGroups = groupBy(responses, personKey);
  const areaGroups = groupBy(responses, (response) => (response.area || "Geral").trim().toLowerCase());
  const metrics = buildMetrics(responses);
  return {
    ...metrics,
    cnpj: responses[0].cnpj,
    company_name: responses[0].company_name,
    people_count: personGroups.size,
    people: [...personGroups.values()].map(buildPersonSummary),
    areas: [...areaGroups.values()].map((group) => buildAreaSummary(group[0].area || "Geral", group))
  };
}
function summarizeAllResponses(responses) {
  const companyGroups = groupBy(responses, (response) => response.cnpj.replace(/\D/g, ""));
  return {
    response_count: responses.length,
    companies: [...companyGroups.values()].map((group) => summarizeCompanyResponses(group)).filter(Boolean)
  };
}
function buildConsolidatedSubmission(responses) {
  const summary = summarizeCompanyResponses(responses);
  if (!summary) return null;
  const latest = [...responses].sort(
    (a, b) => new Date(b.created_at || b.end_time).getTime() - new Date(a.created_at || a.end_time).getTime()
  )[0];
  return {
    ...latest,
    cnpj: summary.cnpj,
    company_name: summary.company_name,
    area: "Consolidado",
    respondent_name: "Todas as pessoas respondentes",
    respondent_email: "",
    total_score: summary.total_score,
    classification: summary.classification,
    section_scores: summary.section_scores
  };
}

// server/lib/xlsx.ts
function buildExcelBuffer(submissions) {
  const exportRows = submissions.map((sub, idx) => {
    const row = {
      "N\xBA": idx + 1,
      "CNPJ da Empresa": sub.cnpj,
      "\xC1rea": sub.area || "Geral",
      "Nome da Empresa": sub.company_name,
      "Nome do Respondente": sub.respondent_name,
      "E-mail do Respondente": sub.respondent_email,
      "In\xEDcio do Preenchimento": new Date(sub.start_time).toLocaleString("pt-BR"),
      "Fim do Preenchimento": new Date(sub.end_time).toLocaleString("pt-BR"),
      "Pontua\xE7\xE3o Total (%)": sub.total_score,
      "Classifica\xE7\xE3o do Risco": sub.classification
    };
    if (sub.section_scores) {
      Object.keys(sub.section_scores).forEach((secId) => {
        row[`Se\xE7\xE3o ${secId} (%)`] = sub.section_scores[secId].percentage;
      });
    }
    if (sub.answers) {
      Object.keys(sub.answers).forEach((qId) => {
        row[`Quest\xE3o ${qId}`] = sub.answers[qId];
      });
    }
    return row;
  });
  const detailWorksheet = XLSX.utils.json_to_sheet(exportRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, detailWorksheet, "Preenchimentos");
  const summary = summarizeAllResponses(submissions);
  const personRows = summary.companies.flatMap(
    (company) => company.people.map((person) => ({
      "CNPJ da Empresa": company.cnpj,
      "Nome da Empresa": company.company_name,
      "Pessoa / Respondente": person.respondent_name,
      "E-mail": person.respondent_email,
      "Quantidade de Preenchimentos": person.response_count,
      "\xC1reas": person.areas.join(", "),
      "M\xE9dia (%)": person.total_score,
      "Classifica\xE7\xE3o": person.classification
    }))
  );
  const areaRows = summary.companies.flatMap(
    (company) => company.areas.map((area) => ({
      "CNPJ da Empresa": company.cnpj,
      "Nome da Empresa": company.company_name,
      "\xC1rea": area.area,
      "Quantidade de Preenchimentos": area.response_count,
      "Quantidade de Pessoas": area.respondent_count,
      "M\xE9dia (%)": area.total_score,
      "Classifica\xE7\xE3o": area.classification
    }))
  );
  const companyRows = summary.companies.map((company) => ({
    "CNPJ da Empresa": company.cnpj,
    "Nome da Empresa": company.company_name,
    "Pessoas \xDAnicas": company.people_count,
    "Quantidade de Preenchimentos": company.response_count,
    "M\xE9dia (%)": company.total_score,
    "Classifica\xE7\xE3o": company.classification
  }));
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(personRows), "Por Pessoa");
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(areaRows), "Por \xC1rea");
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(companyRows), "Por Empresa");
  return XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
}

// server/routes/submissions.ts
var router7 = import_express7.default.Router();
router7.get("/admin/responses", authenticateAdmin, async (_req, res) => {
  try {
    return res.json(await getHistoricalResponses());
  } catch (err) {
    return res.status(500).json({ error: err.message || "Erro ao consultar o hist\xF3rico de respostas." });
  }
});
router7.get("/admin/report-summary", authenticateAdmin, async (_req, res) => {
  try {
    return res.json(summarizeAllResponses(await getHistoricalResponses()));
  } catch (err) {
    return res.status(500).json({ error: err.message || "Erro ao gerar o resumo do relat\xF3rio." });
  }
});
router7.get("/admin/companies/:cnpj/responses", authenticateAdmin, async (req, res) => {
  try {
    const cleanedCnpj = cleanCNPJ(req.params.cnpj);
    const responses = (await getHistoricalResponses()).filter((response) => cleanCNPJ(response.cnpj) === cleanedCnpj);
    if (!responses.length) return res.status(404).json({ error: "Nenhuma resposta encontrada para este CNPJ." });
    return res.json(responses);
  } catch (err) {
    return res.status(500).json({ error: err.message || "Erro ao consultar as respostas da empresa." });
  }
});
router7.get("/admin/companies/:cnpj/summary", authenticateAdmin, async (req, res) => {
  try {
    const cleanedCnpj = cleanCNPJ(req.params.cnpj);
    const responses = (await getHistoricalResponses()).filter((response) => cleanCNPJ(response.cnpj) === cleanedCnpj);
    const summary = summarizeCompanyResponses(responses);
    if (!summary) {
      return res.status(404).json({ error: "Nenhuma resposta encontrada para este CNPJ." });
    }
    return res.json(summary);
  } catch (err) {
    return res.status(500).json({ error: err.message || "Erro ao gerar o resumo da empresa." });
  }
});
router7.delete("/admin/responses/:id", authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("responses").delete().eq("id", id).select("id");
      if (error) throw error;
      if (!data || data.length === 0) {
        return res.status(404).json({ error: "Preenchimento n\xE3o encontrado." });
      }
      return res.json({ success: true });
    } catch (err) {
      console.error("Error deleting one response from Supabase:", err);
      return res.status(500).json({ error: err.message || "Erro ao excluir o preenchimento." });
    }
  }
  const index = fallbackResponses.findIndex((response) => response.id === id);
  if (index === -1) return res.status(404).json({ error: "Preenchimento n\xE3o encontrado." });
  fallbackResponses.splice(index, 1);
  return res.json({ success: true });
});
router7.post("/admin/reset", authenticateAdmin, async (_req, res) => {
  return res.status(409).json({
    error: "O hist\xF3rico de preenchimentos \xE9 protegido. Nenhum reset destrutivo est\xE1 dispon\xEDvel."
  });
});
router7.get("/admin/export-excel", authenticateAdmin, async (_req, res) => {
  try {
    const excelBuffer = buildExcelBuffer(await getHistoricalResponses());
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=relatorio_riscos_psicossociais.xlsx");
    return res.send(excelBuffer);
  } catch (error) {
    console.error("Error generating Excel report:", error);
    return res.status(500).json({ error: "Erro interno ao gerar planilha Excel." });
  }
});
var submissions_default = router7;

// server/routes/admin.ts
var import_express8 = __toESM(require("express"), 1);
var import_nodemailer2 = __toESM(require("nodemailer"), 1);
init_supabase();
init_state();
var router8 = import_express8.default.Router();
router8.get("/admin/profile", authenticateAdmin, (_req, res) => {
  return res.json({
    name: emailConfig.adminName || "Gestor Control Seg",
    email: emailConfig.adminEmail || "admin@controlseg.com.br",
    phone: emailConfig.adminPhone || "",
    role: emailConfig.adminRole || "Coordenador de SST",
    avatarUrl: emailConfig.adminAvatarUrl || ""
  });
});
router8.put("/admin/profile", authenticateAdmin, (req, res) => {
  const { name, email, phone, role, password, avatarUrl } = req.body;
  if (email && !email.includes("@")) {
    return res.status(400).json({ error: "Formato de e-mail inv\xE1lido." });
  }
  if (name !== void 0) emailConfig.adminName = name;
  if (email !== void 0) {
    const oldEmail = emailConfig.adminEmail;
    emailConfig.adminEmail = email;
    if (emailConfig.recipientEmail === oldEmail) {
      emailConfig.recipientEmail = email;
    }
  }
  if (phone !== void 0) emailConfig.adminPhone = phone;
  if (role !== void 0) emailConfig.adminRole = role;
  if (password !== void 0 && password.trim() !== "") {
    emailConfig.adminPassword = password;
  }
  if (avatarUrl !== void 0) emailConfig.adminAvatarUrl = avatarUrl;
  saveEmailConfig();
  return res.json({
    success: true,
    profile: {
      name: emailConfig.adminName,
      email: emailConfig.adminEmail,
      phone: emailConfig.adminPhone,
      role: emailConfig.adminRole,
      avatarUrl: emailConfig.adminAvatarUrl
    }
  });
});
router8.post("/admin/profile/avatar", authenticateAdmin, async (req, res) => {
  const { fileBase64, fileName, mimeType } = req.body;
  if (!fileBase64 || !fileName || !mimeType) {
    return res.status(400).json({ error: "Dados do arquivo incompletos." });
  }
  const supabase = getSupabase();
  if (!supabase) {
    return res.status(500).json({ error: "Supabase n\xE3o est\xE1 configurado. N\xE3o \xE9 poss\xEDvel fazer upload." });
  }
  try {
    const buffer = Buffer.from(fileBase64, "base64");
    const { data, error } = await supabase.storage.from("avatars").upload(`admin/${Date.now()}_${fileName}`, buffer, {
      contentType: mimeType,
      upsert: true
    });
    if (error) {
      throw error;
    }
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(data.path);
    emailConfig.adminAvatarUrl = publicUrl;
    saveEmailConfig();
    return res.json({ success: true, avatarUrl: publicUrl });
  } catch (err) {
    console.error("Error uploading avatar:", err);
    return res.status(500).json({ error: err.message || "Erro ao enviar a imagem para o Supabase." });
  }
});
router8.get("/admin/sre/metrics", authenticateAdmin, async (_req, res) => {
  const supabase = getSupabase();
  if (!supabase) {
    return res.status(500).json({ error: "Supabase n\xE3o est\xE1 configurado." });
  }
  const startTime = Date.now();
  try {
    await supabase.from("companies").select("id").limit(1);
    const latencyMs = Date.now() - startTime;
    const { count: companiesCount } = await supabase.from("companies").select("*", { count: "exact", head: true });
    const { count: questionsCount } = await supabase.from("questions").select("*", { count: "exact", head: true });
    const { count: responsesCount } = await supabase.from("responses").select("*", { count: "exact", head: true });
    const estimatedSizeKB = (responsesCount || 0) * 2 + (companiesCount || 0) * 0.5 + (questionsCount || 0) * 0.5;
    const estimatedSizeStr = estimatedSizeKB > 1024 ? `${(estimatedSizeKB / 1024).toFixed(2)} MB` : `${Math.ceil(estimatedSizeKB)} KB`;
    return res.json({
      success: true,
      metrics: {
        latencyMs,
        companies: companiesCount || 0,
        questions: questionsCount || 0,
        responses: responsesCount || 0,
        estimatedSize: estimatedSizeStr,
        status: latencyMs < 200 ? "Saud\xE1vel" : latencyMs < 500 ? "Aten\xE7\xE3o" : "Degradado",
        lastChecked: (/* @__PURE__ */ new Date()).toISOString()
      }
    });
  } catch (err) {
    return res.status(500).json({ error: "Falha ao recuperar m\xE9tricas: " + (err.message || String(err)) });
  }
});
router8.get("/admin/email-config", authenticateAdmin, (_req, res) => {
  const masked = { ...emailConfig };
  if (masked.smtpPassword) masked.smtpPassword = "********";
  if (masked.adminPassword) masked.adminPassword = "********";
  return res.json(masked);
});
router8.post("/admin/email-config", authenticateAdmin, (req, res) => {
  const { enabled, adminEmail, recipientEmail, smtpHost, smtpPort, smtpUser, smtpPassword, smtpSecure } = req.body;
  if (adminEmail && !adminEmail.includes("@")) {
    return res.status(400).json({ error: "E-mail do administrador inv\xE1lido." });
  }
  if (recipientEmail && !recipientEmail.includes("@")) {
    return res.status(400).json({ error: "E-mail de destino inv\xE1lido." });
  }
  emailConfig.enabled = enabled ?? emailConfig.enabled;
  emailConfig.adminEmail = adminEmail || emailConfig.adminEmail;
  emailConfig.recipientEmail = recipientEmail || emailConfig.recipientEmail;
  emailConfig.smtpHost = smtpHost !== void 0 ? smtpHost : emailConfig.smtpHost;
  emailConfig.smtpPort = smtpPort !== void 0 ? Number(smtpPort) : emailConfig.smtpPort;
  emailConfig.smtpUser = smtpUser !== void 0 ? smtpUser : emailConfig.smtpUser;
  if (smtpPassword !== void 0 && smtpPassword !== "********") {
    emailConfig.smtpPassword = smtpPassword;
  }
  emailConfig.smtpSecure = smtpSecure !== void 0 ? smtpSecure : emailConfig.smtpSecure;
  saveEmailConfig();
  const safeConfig = { ...emailConfig };
  if (safeConfig.smtpPassword) safeConfig.smtpPassword = "********";
  return res.json({ success: true, config: safeConfig });
});
router8.post("/admin/email-config/test", authenticateAdmin, async (req, res) => {
  const { recipientEmail, smtpHost, smtpPort, smtpUser, smtpPassword, smtpSecure } = req.body;
  if (!recipientEmail || !smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
    return res.status(400).json({ error: "Todos os campos de teste SMTP e destinat\xE1rio s\xE3o obrigat\xF3rios." });
  }
  try {
    const transporter = import_nodemailer2.default.createTransport({
      host: smtpHost,
      port: Number(smtpPort),
      secure: smtpSecure === true || smtpSecure === "true",
      auth: {
        user: smtpUser,
        pass: smtpPassword
      },
      connectionTimeout: 1e4,
      greetingTimeout: 1e4,
      socketTimeout: 15e3
    });
    const mailOptions = {
      from: `"SST Control Med" <${smtpUser}>`,
      to: recipientEmail,
      subject: "Teste de Configura\xE7\xE3o SMTP - SST Control Med",
      html: buildTestEmailHtml(smtpHost, smtpPort, smtpUser)
    };
    await transporter.sendMail(mailOptions);
    return res.json({ success: true, message: "E-mail de teste enviado com sucesso!" });
  } catch (err) {
    console.error("Error sending test SMTP email:", err);
    return res.status(500).json({ error: `Falha no envio de teste: ${err.message || err}` });
  }
});
var admin_default = router8;

// server/routes/pdf.ts
var import_express9 = __toESM(require("express"), 1);

// server/lib/pdf.ts
var import_pdf_lib = require("pdf-lib");
var SECTION_NAMES2 = {
  "1": "1. Demanda de Trabalho",
  "2": "2. Controle e Autonomia",
  "3": "3. Apoio da Lideran\xE7a",
  "4": "4. Relacionamento Interpessoal",
  "5": "5. Ass\xE9dio Moral e Viol\xEAncia",
  "6": "6. Reconhecimento e Recompensa",
  "7": "7. Seguran\xE7a no Emprego",
  "8": "8. Equil\xEDbrio Trabalho x Vida",
  "9": "9. Comunica\xE7\xE3o Organizacional",
  "10": "10. Sintomas de Estresse"
};
async function generatePdfBuffer(submission, companySummary) {
  const pdfDoc = await import_pdf_lib.PDFDocument.create();
  const page = pdfDoc.addPage([595.275, 841.89]);
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(import_pdf_lib.StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(import_pdf_lib.StandardFonts.HelveticaBold);
  const primaryGreen = (0, import_pdf_lib.rgb)(0.05, 0.31, 0.21);
  const textGray = (0, import_pdf_lib.rgb)(0.2, 0.2, 0.2);
  const textLightGray = (0, import_pdf_lib.rgb)(0.4, 0.4, 0.4);
  page.drawRectangle({
    x: 30,
    y: height - 100,
    width: width - 60,
    height: 80,
    color: (0, import_pdf_lib.rgb)(0.96, 0.98, 0.96),
    borderColor: primaryGreen,
    borderWidth: 1.5
  });
  page.drawText("CONTROL MED", { x: 50, y: height - 60, size: 24, font: fontBold, color: primaryGreen });
  page.drawText("SEGURAN\xC7A DO TRABALHO | SA\xDADE | MEIO AMBIENTE", { x: 50, y: height - 80, size: 10, font, color: textLightGray });
  page.drawText("RELAT\xD3RIO CONSOLIDADO DE RISCOS PSICOSSOCIAIS", {
    x: 30,
    y: height - 140,
    size: 14,
    font: fontBold,
    color: primaryGreen
  });
  let yPos = height - 170;
  page.drawRectangle({
    x: 30,
    y: yPos - 80,
    width: width - 60,
    height: 75,
    color: (0, import_pdf_lib.rgb)(0.98, 0.98, 0.98),
    borderColor: (0, import_pdf_lib.rgb)(0.9, 0.9, 0.9),
    borderWidth: 1
  });
  const drawMetaText = (label, value, x, y) => {
    page.drawText(`${label}:`, { x, y, size: 9, font: fontBold, color: textGray });
    page.drawText(value, { x: x + fontBold.widthOfTextAtSize(`${label}: `, 9), y, size: 9, font, color: textGray });
  };
  drawMetaText("Empresa", submission.company_name, 45, yPos - 20);
  drawMetaText("CNPJ", submission.cnpj, 350, yPos - 20);
  drawMetaText("\xC1rea", submission.area || "Geral", 45, yPos - 40);
  drawMetaText("Colaborador", submission.respondent_name, 350, yPos - 40);
  drawMetaText("E-mail", submission.respondent_email, 45, yPos - 60);
  drawMetaText("Per\xEDodo de In\xEDcio", new Date(submission.start_time).toLocaleString("pt-BR"), 350, yPos - 60);
  yPos = yPos - 100;
  page.drawText("RESULTADO DA CLASSIFICA\xC7\xC3O DE RISCO", {
    x: 30,
    y: yPos,
    size: 11,
    font: fontBold,
    color: primaryGreen
  });
  let classColor = (0, import_pdf_lib.rgb)(0.18, 0.54, 0.34);
  let classDesc = "O ambiente apresenta baix\xEDssimo n\xEDvel de estressores psicossociais. Manter boas pr\xE1ticas.";
  if (submission.classification === "Moderado") {
    classColor = (0, import_pdf_lib.rgb)(0.8, 0.6, 0.1);
    classDesc = "N\xEDvel moderado de estressores. Recomenda-se acompanhamento e melhoria de processos.";
  } else if (submission.classification === "M\xE9dio") {
    classColor = (0, import_pdf_lib.rgb)(0.9, 0.5, 0.1);
    classDesc = "Estressores medianos identificados. Desenvolver plano de preven\xE7\xE3o de riscos psicossociais.";
  } else if (submission.classification === "Alto") {
    classColor = (0, import_pdf_lib.rgb)(0.9, 0.2, 0.1);
    classDesc = "N\xEDvel elevado de risco. Requer interven\xE7\xE3o organizacional imediata da lideran\xE7a.";
  } else if (submission.classification === "Cr\xEDtico") {
    classColor = (0, import_pdf_lib.rgb)(0.7, 0.1, 0.1);
    classDesc = "ALERTA M\xC1XIMO. Risco extremamente alto \xE0 integridade psicossocial dos trabalhadores.";
  }
  page.drawRectangle({
    x: 30,
    y: yPos - 60,
    width: width - 60,
    height: 50,
    color: (0, import_pdf_lib.rgb)(0.99, 0.96, 0.96),
    borderColor: classColor,
    borderWidth: 2
  });
  page.drawText(`GRAU DE RISCO OBTIDO: ${submission.total_score}% - ${(submission.classification || "").toUpperCase()}`, {
    x: 45,
    y: yPos - 25,
    size: 12,
    font: fontBold,
    color: classColor
  });
  page.drawText(classDesc, {
    x: 45,
    y: yPos - 45,
    size: 9,
    font,
    color: textGray
  });
  yPos = yPos - 95;
  page.drawText("DETALHAMENTO DE RISCO POR DIMENS\xD5ES / SE\xC7\xD5ES", {
    x: 30,
    y: yPos,
    size: 11,
    font: fontBold,
    color: primaryGreen
  });
  yPos = yPos - 30;
  page.drawRectangle({ x: 30, y: yPos, width: width - 60, height: 20, color: primaryGreen });
  page.drawText("Dimens\xE3o / Se\xE7\xE3o de Avalia\xE7\xE3o", { x: 40, y: yPos + 6, size: 9, font: fontBold, color: (0, import_pdf_lib.rgb)(1, 1, 1) });
  page.drawText("Risco (%)", { x: 420, y: yPos + 6, size: 9, font: fontBold, color: (0, import_pdf_lib.rgb)(1, 1, 1) });
  page.drawText("Situa\xE7\xE3o", { x: 490, y: yPos + 6, size: 9, font: fontBold, color: (0, import_pdf_lib.rgb)(1, 1, 1) });
  if (submission.section_scores) {
    Object.keys(submission.section_scores).forEach((secKey, index) => {
      const score = submission.section_scores[secKey];
      yPos = yPos - 22;
      page.drawRectangle({
        x: 30,
        y: yPos,
        width: width - 60,
        height: 22,
        color: index % 2 === 0 ? (0, import_pdf_lib.rgb)(0.97, 0.97, 0.97) : (0, import_pdf_lib.rgb)(1, 1, 1),
        borderColor: (0, import_pdf_lib.rgb)(0.9, 0.9, 0.9),
        borderWidth: 0.5
      });
      const name = SECTION_NAMES2[secKey] || `Dimens\xE3o ${secKey}`;
      page.drawText(name, { x: 40, y: yPos + 7, size: 9, font, color: textGray });
      page.drawText(`${score.percentage}%`, { x: 420, y: yPos + 7, size: 9, font: fontBold, color: textGray });
      let sitText = "Baixo";
      let sitColor = (0, import_pdf_lib.rgb)(0.18, 0.54, 0.34);
      if (score.percentage > 80) {
        sitText = "Cr\xEDtico";
        sitColor = (0, import_pdf_lib.rgb)(0.7, 0.1, 0.1);
      } else if (score.percentage > 60) {
        sitText = "Alto";
        sitColor = (0, import_pdf_lib.rgb)(0.9, 0.2, 0.1);
      } else if (score.percentage > 40) {
        sitText = "M\xE9dio";
        sitColor = (0, import_pdf_lib.rgb)(0.9, 0.5, 0.1);
      } else if (score.percentage > 20) {
        sitText = "Moderado";
        sitColor = (0, import_pdf_lib.rgb)(0.8, 0.6, 0.1);
      }
      page.drawText(sitText, { x: 490, y: yPos + 7, size: 9, font: fontBold, color: sitColor });
    });
  }
  yPos = yPos - 50;
  page.drawText("Documento assinado digitalmente e gerado automaticamente pelo sistema de SST da Control Med.", {
    x: 30,
    y: yPos,
    size: 8,
    font,
    color: textLightGray
  });
  page.drawText(`Data de emiss\xE3o do relat\xF3rio: ${(/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR")} ${(/* @__PURE__ */ new Date()).toLocaleTimeString("pt-BR")}`, {
    x: 30,
    y: yPos - 12,
    size: 8,
    font,
    color: textLightGray
  });
  if (companySummary) {
    const drawSummaryTablePage = (title, headers, rows, columnXs) => {
      let summaryPage = pdfDoc.addPage([595.275, 841.89]);
      const drawSummaryHeader = () => {
        const summaryHeight = summaryPage.getHeight();
        summaryPage.drawText("CONTROL MED", { x: 35, y: summaryHeight - 45, size: 18, font: fontBold, color: primaryGreen });
        summaryPage.drawText(title, { x: 35, y: summaryHeight - 75, size: 13, font: fontBold, color: primaryGreen });
        summaryPage.drawText(`Empresa: ${companySummary.company_name} | CNPJ: ${companySummary.cnpj}`, {
          x: 35,
          y: summaryHeight - 95,
          size: 8,
          font,
          color: textLightGray
        });
      };
      const drawSummaryColumns = (y) => {
        headers.forEach((header, index) => {
          summaryPage.drawText(header, { x: columnXs[index], y, size: 8, font: fontBold, color: primaryGreen });
        });
      };
      drawSummaryHeader();
      let summaryY = summaryPage.getHeight() - 125;
      drawSummaryColumns(summaryY);
      summaryY -= 18;
      rows.forEach((row, index) => {
        if (summaryY < 55) {
          summaryPage = pdfDoc.addPage([595.275, 841.89]);
          drawSummaryHeader();
          summaryY = summaryPage.getHeight() - 125;
          drawSummaryColumns(summaryY);
          summaryY -= 18;
        }
        if (index % 2 === 0) {
          summaryPage.drawRectangle({
            x: 30,
            y: summaryY - 4,
            width: width - 60,
            height: 18,
            color: (0, import_pdf_lib.rgb)(0.97, 0.97, 0.97)
          });
        }
        row.forEach((value, valueIndex) => {
          summaryPage.drawText(String(value), {
            x: columnXs[valueIndex],
            y: summaryY + 2,
            size: 8,
            font,
            color: textGray
          });
        });
        summaryY -= 20;
      });
    };
    drawSummaryTablePage(
      "1. RESULTADOS POR PESSOA",
      ["Pessoa", "E-mail", "Preench.", "M\xE9dia (%)", "Classifica\xE7\xE3o"],
      companySummary.people.map((person) => [
        person.respondent_name,
        person.respondent_email,
        String(person.response_count),
        `${person.total_score}%`,
        person.classification
      ]),
      [35, 190, 405, 455, 510]
    );
    drawSummaryTablePage(
      "2. RESULTADOS POR \xC1REA",
      ["\xC1rea", "Pessoas", "Preench.", "M\xE9dia (%)", "Classifica\xE7\xE3o"],
      companySummary.areas.map((area) => [
        area.area,
        String(area.respondent_count),
        String(area.response_count),
        `${area.total_score}%`,
        area.classification
      ]),
      [35, 355, 410, 460, 510]
    );
    drawSummaryTablePage(
      "3. RESULTADO POR EMPRESA",
      ["Empresa", "Pessoas", "Preench.", "M\xE9dia (%)", "Classifica\xE7\xE3o"],
      [[
        companySummary.company_name,
        String(companySummary.people_count),
        String(companySummary.response_count),
        `${companySummary.total_score}%`,
        companySummary.classification
      ]],
      [35, 350, 405, 460, 510]
    );
    for (const area of companySummary.areas) {
      drawSummaryTablePage(
        `PREENCHIMENTOS INDIVIDUAIS \u2014 ${area.area}`,
        ["N\xBA", "Pessoa", "E-mail", "In\xEDcio", "Fim", "Score", "Classifica\xE7\xE3o"],
        area.responses.map((response, index) => [
          String(index + 1),
          response.respondent_name,
          response.respondent_email,
          new Date(response.start_time).toLocaleString("pt-BR"),
          new Date(response.end_time).toLocaleString("pt-BR"),
          `${response.total_score ?? "\u2014"}%`,
          response.classification || "Indefinido"
        ]),
        [30, 55, 165, 315, 390, 465, 510]
      );
    }
  }
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

// server/routes/pdf.ts
var router9 = import_express9.default.Router();
router9.get("/generate-pdf", authenticateAdmin, async (req, res) => {
  const { id, cnpj, scope, area, respondent_name, respondent_email } = req.query;
  if (!id && !cnpj) {
    return res.status(400).json({ error: "ID da resposta ou CNPJ \xE9 obrigat\xF3rio para gerar o PDF." });
  }
  const targetCnpj = typeof cnpj === "string" ? cnpj : "";
  const targetId = typeof id === "string" ? id : void 0;
  const requestedScope = typeof scope === "string" ? scope : "company";
  const reportScope = requestedScope === "area" || requestedScope === "person" ? requestedScope : "company";
  const targetArea = typeof area === "string" ? area.trim().toLowerCase() : "";
  const targetRespondentName = typeof respondent_name === "string" ? respondent_name.trim().toLowerCase() : "";
  const targetRespondentEmail = typeof respondent_email === "string" ? respondent_email.trim().toLowerCase() : "";
  try {
    const historicalResponses = await getHistoricalResponses();
    let selectedResponses = [];
    if (targetId) {
      const response = historicalResponses.find((candidate) => candidate.id === targetId);
      if (response) selectedResponses = [response];
    } else {
      selectedResponses = historicalResponses.filter(
        (response) => cleanCNPJ(response.cnpj) === cleanCNPJ(targetCnpj)
      );
      if (reportScope === "area") {
        selectedResponses = selectedResponses.filter(
          (response) => (response.area || "Geral").trim().toLowerCase() === targetArea
        );
      } else if (reportScope === "person") {
        selectedResponses = selectedResponses.filter((response) => {
          const sameName = response.respondent_name.trim().toLowerCase() === targetRespondentName;
          const sameEmail = targetRespondentEmail ? response.respondent_email.trim().toLowerCase() === targetRespondentEmail : true;
          return sameName && sameEmail;
        });
      }
    }
    const companySummary = summarizeCompanyResponses(selectedResponses);
    const consolidatedSubmission = buildConsolidatedSubmission(selectedResponses);
    if (!consolidatedSubmission || !companySummary) {
      return res.status(404).json({ error: "Nenhum question\xE1rio respondido encontrado para gerar o PDF." });
    }
    const firstSelectedResponse = selectedResponses[0];
    const submission = reportScope === "person" ? {
      ...consolidatedSubmission,
      area: "Todas as \xE1reas",
      respondent_name: firstSelectedResponse.respondent_name,
      respondent_email: firstSelectedResponse.respondent_email
    } : reportScope === "area" ? {
      ...consolidatedSubmission,
      area: firstSelectedResponse.area || "Geral",
      respondent_name: "Todos os respondentes da \xE1rea",
      respondent_email: ""
    } : consolidatedSubmission;
    const pdfBuffer = await generatePdfBuffer(submission, companySummary);
    const filenameScope = reportScope === "person" ? "pessoa" : reportScope === "area" ? "area" : "empresa";
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=relatorio_${filenameScope}_${submission.cnpj}.pdf`);
    return res.send(pdfBuffer);
  } catch (err) {
    console.error("Error generating PDF:", err);
    return res.status(500).json({ error: "Erro ao gerar PDF." });
  }
});
var pdf_default = router9;

// server/routes/probe.ts
var import_express10 = __toESM(require("express"), 1);
init_supabase();
init_state();
var router10 = import_express10.default.Router();
router10.get("/_probe", (_req, res) => {
  res.json({
    ok: true,
    app: "control-med-sst",
    runtime: {
      vercel: !!process.env.VERCEL,
      node: process.version,
      env: process.env.NODE_ENV || "(unset)"
    },
    supabase: {
      configured: !!process.env.SUPABASE_URL,
      ready: isSupabaseReady(),
      hasServiceKey: !!(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY),
      hasAnonKey: !!(process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY)
    },
    adminEmailSet: !!getAdminEmail(),
    time: (/* @__PURE__ */ new Date()).toISOString()
  });
});
router10.get("/_probe/supabase", async (_req, res) => {
  const supabase = getSupabase();
  if (!supabase) {
    return res.json({ connected: false, reason: "admin client not initialized (credentials missing/placeholder)" });
  }
  try {
    const start = Date.now();
    const { error } = await supabase.from("companies").select("id").limit(1);
    const latencyMs = Date.now() - start;
    if (error) {
      return res.json({ connected: false, latencyMs, error: { code: error.code, message: error.message } });
    }
    return res.json({ connected: true, latencyMs });
  } catch (err) {
    return res.json({ connected: false, error: err?.message || String(err) });
  }
});
var probe_default = router10;

// server/index.ts
import_dotenv.default.config();
loadEmailConfig();
var app = (0, import_express11.default)();
var PORT = Number(process.env.PORT) || 3e3;
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});
app.use(import_express11.default.json({ limit: "10mb" }));
app.use("/api", probe_default);
app.use("/api", auth_default);
app.use("/api", supabase_default);
app.use("/api", cnpj_default);
app.use("/api", assessment_default);
app.use("/api", companies_default);
app.use("/api", questions_default);
app.use("/api", submissions_default);
app.use("/api", admin_default);
app.use("/api", pdf_default);
console.log("[server/index] Express app initialized. VERCEL=" + !!process.env.VERCEL, "routes=/api mounted");
async function startServer() {
  if (process.env.VERCEL) {
    return;
  }
  if (process.env.NODE_ENV !== "production") {
    const viteModuleName = "vite";
    const { createServer: createViteServer } = await import(viteModuleName);
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path2.default.join(process.cwd(), "dist");
    app.use(import_express11.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path2.default.join(distPath, "index.html"));
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
var index_default = app;
//# sourceMappingURL=server.cjs.map
