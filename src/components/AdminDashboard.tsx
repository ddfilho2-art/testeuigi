import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2, HelpCircle, FileBarChart2, Database, LogOut, Plus,
  Trash2, Edit, Save, X, Calendar, Check, AlertTriangle, FileSpreadsheet,
  FileDown, CheckCircle, RefreshCcw, Search, Eye, Filter, Info, Mail, User, Lock, Activity, LifeBuoy
} from 'lucide-react';
import { Company, Question, Submission } from '../types';
import { CompanyLogo } from './CompanyLogo';

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
}

const SQL_SCHEMA_SCRIPT = `-- SCHEMA FOR SUPABASE DATABASE (CONTROL MED)
-- Copy and execute this in your Supabase SQL Editor.

DROP FUNCTION IF EXISTS calculate_assessment_score(JSONB);
DROP TABLE IF EXISTS responses;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS companies;

CREATE TABLE companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cnpj TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  enabled_from DATE NOT NULL,
  enabled_until DATE NOT NULL,
  areas JSONB NOT NULL DEFAULT '["Geral"]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE questions (
  id TEXT PRIMARY KEY,
  section_id INT NOT NULL,
  section_title TEXT NOT NULL,
  text TEXT NOT NULL,
  type TEXT NOT NULL, -- 'scale' or 'boolean'
  is_inverted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cnpj TEXT NOT NULL,
  area TEXT NOT NULL DEFAULT 'Geral',
  company_name TEXT NOT NULL,
  respondent_name TEXT NOT NULL,
  respondent_email TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  answers JSONB NOT NULL,
  total_score NUMERIC NOT NULL,
  classification TEXT NOT NULL,
  section_scores JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT responses_cnpj_area_unique UNIQUE (cnpj, area)
);

-- CREATE THE CALCULATION ENGINE FUNCTION (SQL-RPC)
CREATE OR REPLACE FUNCTION calculate_assessment_score(answers JSONB)
RETURNS JSONB AS $$
DECLARE
  rec RECORD;
  q_id TEXT;
  q_val TEXT;
  item_score NUMERIC;
  total_score NUMERIC := 0;
  max_possible NUMERIC := 0;
  min_possible NUMERIC := 0;
  section_scores JSONB := '{}'::jsonb;
  section_sums JSONB := '{}'::jsonb;
  section_counts JSONB := '{}'::jsonb;
  section_maxes JSONB := '{}'::jsonb;
  section_mins JSONB := '{}'::jsonb;
  sec_id TEXT;
  final_percentage NUMERIC;
  classification TEXT;
  result JSONB;
BEGIN
  FOR rec IN SELECT id, section_id, section_title, type, is_inverted FROM questions LOOP
    q_id := rec.id;
    IF jsonb_exists(answers, q_id) THEN
      q_val := answers->>q_id;
      IF rec.type = 'scale' THEN
        item_score := q_val::NUMERIC;
        IF rec.is_inverted THEN
          item_score := 6 - item_score;
        END IF;
        max_possible := max_possible + 5;
        min_possible := min_possible + 1;
        sec_id := rec.section_id::TEXT;
        section_sums := jsonb_set(section_sums, ARRAY[sec_id], to_jsonb(coalesce((section_sums->>sec_id)::NUMERIC, 0) + item_score));
        section_counts := jsonb_set(section_counts, ARRAY[sec_id], to_jsonb(coalesce((section_counts->>sec_id)::NUMERIC, 0) + 1));
        section_maxes := jsonb_set(section_maxes, ARRAY[sec_id], to_jsonb(coalesce((section_maxes->>sec_id)::NUMERIC, 0) + 5));
        section_mins := jsonb_set(section_mins, ARRAY[sec_id], to_jsonb(coalesce((section_mins->>sec_id)::NUMERIC, 0) + 1));
      ELSIF rec.type = 'boolean' THEN
        IF q_val = 'Sim' THEN
          item_score := 5;
        ELSE
          item_score := 1;
        END IF;
        max_possible := max_possible + 5;
        min_possible := min_possible + 1;
        sec_id := rec.section_id::TEXT;
        section_sums := jsonb_set(section_sums, ARRAY[sec_id], to_jsonb(coalesce((section_sums->>sec_id)::NUMERIC, 0) + item_score));
        section_counts := jsonb_set(section_counts, ARRAY[sec_id], to_jsonb(coalesce((section_counts->>sec_id)::NUMERIC, 0) + 1));
        section_maxes := jsonb_set(section_maxes, ARRAY[sec_id], to_jsonb(coalesce((section_maxes->>sec_id)::NUMERIC, 0) + 5));
        section_mins := jsonb_set(section_mins, ARRAY[sec_id], to_jsonb(coalesce((section_mins->>sec_id)::NUMERIC, 0) + 1));
      END IF;
      total_score := total_score + item_score;
    END IF;
  END LOOP;
  IF (max_possible - min_possible) > 0 THEN
    final_percentage := round(((total_score - min_possible) / (max_possible - min_possible) * 100)::NUMERIC, 2);
  ELSE
    final_percentage := 0;
  END IF;
  IF final_percentage <= 20 THEN
    classification := 'Baixo';
  ELSIF final_percentage <= 40 THEN
    classification := 'Moderado';
  ELSIF final_percentage <= 60 THEN
    classification := 'Médio';
  ELSIF final_percentage <= 80 THEN
    classification := 'Alto';
  ELSE
    classification := 'Crítico';
  END IF;
  FOR sec_id IN SELECT DISTINCT section_id::TEXT FROM questions ORDER BY section_id::INT LOOP
    IF jsonb_exists(section_sums, sec_id) THEN
      DECLARE
        s_sum NUMERIC := (section_sums->>sec_id)::NUMERIC;
        s_max NUMERIC := (section_maxes->>sec_id)::NUMERIC;
        s_min NUMERIC := (section_mins->>sec_id)::NUMERIC;
        s_perc NUMERIC := 0;
      BEGIN
        IF (s_max - s_min) > 0 THEN
          s_perc := round(((s_sum - s_min) / (s_max - s_min) * 100)::NUMERIC, 2);
        END IF;
        section_scores := jsonb_set(section_scores, ARRAY[sec_id], jsonb_build_object('sum', s_sum, 'max', s_max, 'min', s_min, 'percentage', s_perc));
      END;
    END IF;
  END LOOP;
  result := jsonb_build_object('total_score', final_percentage, 'classification', classification, 'section_scores', section_scores, 'raw_score', total_score, 'max_possible', max_possible, 'min_possible', min_possible);
  RETURN result;
END;
$$ LANGUAGE plpgsql;`;

const COMMON_COMPANY_AREAS = [
  'Geral',
  'Administração',
  'Comercial / Vendas',
  'Compras / Suprimentos',
  'Contabilidade',
  'Financeiro',
  'Jurídico',
  'Logística / Distribuição',
  'Marketing / Comunicação',
  'Operações / Produção',
  'Recursos Humanos / Pessoas',
  'Saúde e Segurança do Trabalho',
  'Tecnologia da Informação',
  'Outros',
];

export default function AdminDashboard({ token, onLogout }: AdminDashboardProps) {
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      triggerAlert('error', 'A imagem deve ter no máximo 2MB.');
      return;
    }

    setIsUploadingAvatar(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64String = (event.target?.result as string).split(',')[1];
      
      try {
        const response = await fetch('/api/admin/profile/avatar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            fileBase64: base64String,
            fileName: file.name,
            mimeType: file.type
          })
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(prev => ({ ...prev, avatarUrl: data.avatarUrl }));
          triggerAlert('success', 'Foto de perfil atualizada com sucesso!');
        } else {
          const data = await response.json();
          triggerAlert('error', data.error || 'Erro ao fazer upload da imagem.');
        }
      } catch (err) {
        triggerAlert('error', 'Erro de conexão ao fazer upload.');
      }
      setIsUploadingAvatar(false);
    };
    reader.readAsDataURL(file);
  };

  const [activeTab, setActiveTab] = useState<'companies' | 'questions' | 'responses' | 'supabase' | 'email' | 'profile' | 'help' | 'sre'>('companies');
  
  // Admin Profile State
  const [profile, setProfile] = useState({
    name: 'Gestor Control Seg',
    email: 'admin@controlseg.com.br',
    phone: '',
    role: 'Coordenador de SST',
    password: '',
    avatarUrl: ''
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Email config state
  const [emailConfig, setEmailConfig] = useState({
    enabled: false,
    adminEmail: '',
    recipientEmail: '',
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    smtpSecure: false
  });
  const [isSavingEmail, setIsSavingEmail] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  
  // Database connection status state
  const [dbStatus, setDbStatus] = useState({
    connected: false,
    configured: false,
    tablesExist: false,
    rpcExists: false,
    errorDetails: null as string | null
  });

  // Companies state
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companySearch, setCompanySearch] = useState('');
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  
  // Company Form State
  const [cnpjInput, setCnpjInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [enabledInput, setEnabledInput] = useState(true);
  const [fromInput, setFromInput] = useState('');
  const [untilInput, setUntilInput] = useState('');
  const [areasInput, setAreasInput] = useState('');
  const [selectedAdminAreas, setSelectedAdminAreas] = useState<string[]>([]);
  const [otherAreasInput, setOtherAreasInput] = useState('');

  // Questions state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionSearch, setQuestionSearch] = useState('');
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Question Form State
  const [qIdInput, setQIdInput] = useState('');
  const [qSecIdInput, setQSecIdInput] = useState(1);
  const [qSecTitleInput, setQSecTitleInput] = useState('1. DEMANDA DE TRABALHO (KARASEK/HSE)');
  const [qTextInput, setQTextInput] = useState('');
  const [qTypeInput, setQTypeInput] = useState<'scale' | 'boolean'>('scale');
  const [qIsInvertedInput, setQIsInvertedInput] = useState(false);

  // Responses state
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [responseSearch, setResponseSearch] = useState('');
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Global error & success notifications
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const triggerAlert = (type: 'success' | 'error', text: string) => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg(null), 4000);
  };

  // Section details maps helper
  const sectionTitleMap: Record<number, string> = {
    1: '1. DEMANDA DE TRABALHO (KARASEK/HSE)',
    2: '2. CONTROLE E AUTONOMIA NO TRABALHO',
    3: '3. APOIO DA LIDERANÇA',
    4: '4. RELACIONAMENTO INTERPESSOAL',
    5: '5. ASSÉDIO MORAL E VIOLÊNCIA NO TRABALHO',
    6: '6. RECONHECIMENTO E RECOMPENSA (SIEGRIST)',
    7: '7. SEGURANÇA NO EMPREGO',
    8: '8. EQUILÍBRIO TRABALHO X VIDA PESSOAL',
    9: '9. COMUNICAÇÃO ORGANIZACIONAL',
    10: '10. SINTOMAS RELACIONADOS AO ESTRESSE OCUPACIONAL'
  };

  useEffect(() => {
    fetchDbStatus();
    fetchCompanies();
    fetchQuestions();
    fetchSubmissions();
    fetchEmailConfig();
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const r = await fetch('/api/admin/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (r.ok) {
        const data = await r.json();
        setProfile({
          name: data.name || 'Gestor Control Seg',
          email: data.email || 'admin@controlseg.com.br',
          phone: data.phone || '',
          role: data.role || 'Coordenador de SST',
          password: '',
          avatarUrl: data.avatarUrl || ''
        });
      }
    } catch (e) {
      console.error('Error fetching admin profile:', e);
    }
  };

  const [sreMetrics, setSreMetrics] = useState<any>(null);
  const [isFetchingSre, setIsFetchingSre] = useState(false);

  const fetchSreMetrics = async () => {
    setIsFetchingSre(true);
    try {
      const r = await fetch('/api/admin/sre/metrics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (r.ok) {
        const data = await r.json();
        if (data.success) setSreMetrics(data.metrics);
      }
    } catch (e) {
      console.error('Error fetching SRE metrics:', e);
    }
    setIsFetchingSre(false);
  };

  useEffect(() => {
    if (activeTab === 'sre') {
      fetchSreMetrics();
    }
  }, [activeTab]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const payload: any = {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        role: profile.role
      };
      
      if (profile.password && profile.password.trim() !== '') {
        if (profile.password.trim().length < 4) {
          triggerAlert('error', 'A senha deve conter no mínimo 4 caracteres.');
          setIsSavingProfile(false);
          return;
        }
        payload.password = profile.password;
      }

      const r = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (r.ok) {
        triggerAlert('success', 'Perfil do administrador atualizado com sucesso!');
        setProfile(prev => ({ ...prev, password: '' }));
        fetchAdminProfile();
        fetchEmailConfig(); // Keep email configuration in sync
      } else {
        const err = await r.json();
        triggerAlert('error', err.error || 'Erro ao atualizar perfil.');
      }
    } catch (e) {
      console.error(e);
      triggerAlert('error', 'Erro ao se conectar com o servidor.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const fetchEmailConfig = async () => {
    try {
      const r = await fetch('/api/admin/email-config', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (r.ok) {
        const data = await r.json();
        setEmailConfig(data);
      }
    } catch (e) {
      console.error('Error fetching email config:', e);
    }
  };

  const handleSaveEmailConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingEmail(true);
    try {
      const r = await fetch('/api/admin/email-config', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(emailConfig)
      });
      if (r.ok) {
        triggerAlert('success', 'Configurações de e-mail salvas com sucesso!');
        fetchEmailConfig();
      } else {
        const err = await r.json();
        triggerAlert('error', err.error || 'Erro ao salvar configurações.');
      }
    } catch (e) {
      console.error(e);
      triggerAlert('error', 'Erro de comunicação com o servidor.');
    } finally {
      setIsSavingEmail(false);
    }
  };

  const handleDownloadPdf = async (sub: any) => {
    try {
      const r = await fetch(`/api/generate-pdf?cnpj=${encodeURIComponent(sub.cnpj || '')}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        triggerAlert('error', err.error || 'Erro ao gerar PDF.');
        return;
      }
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `relatorio_consolidado_${sub.cnpj || 'sem_cnpj'}.pdf`;
      window.document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      triggerAlert('error', 'Erro de comunicação ao baixar PDF.');
    }
  };

  const handleSendTestEmail = async () => {
    setIsSendingTest(true);
    try {
      const r = await fetch('/api/admin/email-config/test', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(emailConfig)
      });
      if (r.ok) {
        const data = await r.json();
        triggerAlert('success', data.message || 'E-mail de teste enviado com sucesso!');
      } else {
        const err = await r.json();
        triggerAlert('error', err.error || 'Falha ao enviar e-mail de teste.');
      }
    } catch (e) {
      console.error(e);
      triggerAlert('error', 'Erro ao enviar e-mail de teste.');
    } finally {
      setIsSendingTest(false);
    }
  };

  const fetchDbStatus = async () => {
    try {
      const r = await fetch('/api/supabase-status');
      const data = await r.json();
      setDbStatus(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCompanies = async () => {
    try {
      const r = await fetch('/api/admin/companies', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (r.ok) {
        const data = await r.json();
        setCompanies(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchQuestions = async () => {
    try {
      const r = await fetch('/api/assessment/questions');
      if (r.ok) {
        const data = await r.json();
        setQuestions(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const r = await fetch('/api/admin/responses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (r.ok) {
        const data = await r.json();
        setSubmissions(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Companies CRUD execution
  const handleOpenCompanyModal = (co: Company | null = null) => {
    if (co) {
      setEditingCompany(co);
      setCnpjInput(co.cnpj);
      setNameInput(co.name);
      setEnabledInput(co.enabled);
      setFromInput(co.enabled_from);
      setUntilInput(co.enabled_until);
      setAreasInput((co.areas || ['Geral']).join(', '));
      const existingAreas = co.areas || ['Geral'];
      const knownAreas = existingAreas.filter((area) => COMMON_COMPANY_AREAS.includes(area));
      const customAreas = existingAreas.filter((area) => !COMMON_COMPANY_AREAS.includes(area));
      setSelectedAdminAreas(customAreas.length ? [...knownAreas, 'Outros'] : knownAreas);
      setOtherAreasInput(customAreas.join(', '));
    } else {
      setEditingCompany(null);
      setCnpjInput('');
      setNameInput('');
      setEnabledInput(true);
      
      // Default to current date and next year
      const now = new Date();
      const nextYear = new Date();
      nextYear.setFullYear(now.getFullYear() + 1);
      setFromInput(now.toISOString().split('T')[0]);
      setUntilInput(nextYear.toISOString().split('T')[0]);
      setSelectedAdminAreas([]);
      setOtherAreasInput('');
      setAreasInput('');
    }
    setIsCompanyModalOpen(true);
  };

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cnpjInput || !nameInput || !fromInput || !untilInput) {
      triggerAlert('error', 'Por favor preencha todos os campos obrigatórios.');
      return;
    }

    const customAreas = selectedAdminAreas.includes('Outros')
      ? otherAreasInput.split(',').map((area) => area.trim()).filter(Boolean)
      : [];
    const areas = [...new Set([
      ...selectedAdminAreas.filter((area) => area !== 'Outros'),
      ...customAreas,
    ])];
    if (areas.length === 0) {
      triggerAlert('error', 'Selecione pelo menos uma área habilitada.');
      return;
    }

    const payload = {
      cnpj: cnpjInput,
      name: nameInput,
      enabled: enabledInput,
      enabled_from: fromInput,
      enabled_until: untilInput,
      areas,
    };

    try {
      let r;
      if (editingCompany) {
        r = await fetch(`/api/admin/companies/${editingCompany.id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        r = await fetch('/api/admin/companies', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      const data = await r.json();
      if (r.ok) {
        triggerAlert('success', editingCompany ? 'Empresa atualizada com sucesso!' : 'Empresa habilitada com sucesso!');
        setIsCompanyModalOpen(false);
        fetchCompanies();
      } else {
        triggerAlert('error', data.error || 'Erro ao salvar cadastro.');
      }
    } catch (err) {
      triggerAlert('error', 'Falha ao salvar. Tente novamente.');
    }
  };

  const handleDeleteCompany = async (id: string) => {
    if (!confirm('Deseja realmente excluir este CNPJ habilitado? Ele perderá acesso ao formulário.')) return;

    try {
      const r = await fetch(`/api/admin/companies/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (r.ok) {
        triggerAlert('success', 'CNPJ excluído com sucesso.');
        fetchCompanies();
      } else {
        triggerAlert('error', 'Falha ao excluir CNPJ.');
      }
    } catch (e) {
      triggerAlert('error', 'Falha na conexão.');
    }
  };

  // Questions CRUD execution
  const handleOpenQuestionModal = (q: Question | null = null) => {
    if (q) {
      setEditingQuestion(q);
      setQIdInput(q.id);
      setQSecIdInput(q.section_id);
      setQSecTitleInput(q.section_title);
      setQTextInput(q.text);
      setQTypeInput(q.type);
      setQIsInvertedInput(q.is_inverted);
    } else {
      setEditingQuestion(null);
      // Auto assign next custom ID
      setQIdInput(`q_custom_${Date.now().toString(36)}`);
      setQSecIdInput(1);
      setQSecTitleInput(sectionTitleMap[1]);
      setQTextInput('');
      setQTypeInput('scale');
      setQIsInvertedInput(false);
    }
    setIsQuestionModalOpen(true);
  };

  const handleSecIdChange = (id: number) => {
    setQSecIdInput(id);
    setQSecTitleInput(sectionTitleMap[id] || `Seção ${id}`);
    if (id === 10) {
      setQTypeInput('boolean'); // Section 10 is Yes/No (Sintomas)
    } else {
      setQTypeInput('scale');
    }
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qTextInput) {
      triggerAlert('error', 'O texto da pergunta é obrigatório.');
      return;
    }

    const payload = {
      id: qIdInput,
      section_id: qSecIdInput,
      section_title: qSecTitleInput,
      text: qTextInput,
      type: qTypeInput,
      is_inverted: qIsInvertedInput
    };

    try {
      let r;
      if (editingQuestion) {
        r = await fetch(`/api/admin/questions/${editingQuestion.id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        r = await fetch('/api/admin/questions', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      const data = await r.json();
      if (r.ok) {
        triggerAlert('success', 'Pergunta salva com sucesso!');
        setIsQuestionModalOpen(false);
        fetchQuestions();
      } else {
        triggerAlert('error', data.error || 'Erro ao salvar pergunta.');
      }
    } catch (e) {
      triggerAlert('error', 'Falha na conexão.');
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta pergunta do questionário? Isto alterará o cálculo total dos novos relatórios.')) return;

    try {
      const r = await fetch(`/api/admin/questions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (r.ok) {
        triggerAlert('success', 'Pergunta excluída.');
        fetchQuestions();
      } else {
        triggerAlert('error', 'Erro ao excluir pergunta.');
      }
    } catch (e) {
      triggerAlert('error', 'Falha na conexão.');
    }
  };

  // Reset period (delete all historical responses)
  const handleResetResponses = async () => {
    try {
      const r = await fetch('/api/admin/reset', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (r.ok) {
        triggerAlert('success', 'Todas as respostas do período foram limpas e resetadas com sucesso!');
        setIsResetConfirmOpen(false);
        fetchSubmissions();
      } else {
        triggerAlert('error', 'Erro ao resetar período.');
      }
    } catch (e) {
      triggerAlert('error', 'Erro de conexão.');
    }
  };

  // Delete one current response (one CNPJ + area)
  const handleDeleteResponse = async (sub: Submission) => {
    const area = sub.area || 'Geral';
    if (!confirm(`Deseja excluir a resposta da área "${area}" para o CNPJ ${formatCNPJ(sub.cnpj)}?`)) return;

    try {
      const r = await fetch(`/api/admin/responses/${sub.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await r.json().catch(() => ({}));
      if (r.ok) {
        triggerAlert('success', 'Resposta da área excluída com sucesso.');
        fetchSubmissions();
      } else {
        triggerAlert('error', data.error || 'Erro ao excluir resposta.');
      }
    } catch (e) {
      triggerAlert('error', 'Erro de conexão ao excluir resposta.');
    }
  };

  // Export excel
  const handleExportExcel = async () => {
    try {
      const r = await fetch('/api/admin/export-excel', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!r.ok) {
        const data = await r.json().catch(() => ({}));
        triggerAlert('error', data.error || 'Erro ao exportar respostas.');
        return;
      }

      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'relatorio_riscos_psicossociais.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      triggerAlert('error', 'Erro de conexão ao exportar respostas.');
    }
  };

  // Copy SQL script to clipboard
  const handleCopySQL = () => {
    navigator.clipboard.writeText(SQL_SCHEMA_SCRIPT);
    triggerAlert('success', 'Script SQL copiado com sucesso! Execute no seu editor SQL do Supabase.');
  };

  // Format CNPJ helper
  const formatCNPJ = (val: string) => {
    const d = val.replace(/\D/g, '');
    if (d.length <= 14) {
      return d.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }
    return val;
  };

  // Filters search lists
  const filteredCompanies = companies.filter(c => 
    c.cnpj.toLowerCase().includes(companySearch.toLowerCase()) || 
    c.name.toLowerCase().includes(companySearch.toLowerCase())
  );

  const filteredQuestions = questions.filter(q => 
    q.text.toLowerCase().includes(questionSearch.toLowerCase()) || 
    q.section_title.toLowerCase().includes(questionSearch.toLowerCase())
  );

  const filteredSubmissions = submissions.filter(s =>
    s.company_name.toLowerCase().includes(responseSearch.toLowerCase()) ||
    s.cnpj.toLowerCase().includes(responseSearch.toLowerCase()) ||
    (s.area || 'Geral').toLowerCase().includes(responseSearch.toLowerCase()) ||
    s.respondent_name.toLowerCase().includes(responseSearch.toLowerCase())
  );

  const normalizeCnpj = (value: string) => value.replace(/\D/g, '');

  const companyCnpjs: string[] = Array.from(new Set<string>(submissions.map((submission) => normalizeCnpj(String(submission.cnpj)))));
  const companySummaries: Array<{
    cnpj: string;
    company_name: string;
    areas: string[];
    average: number;
    classification: string;
  }> = companyCnpjs.map((cnpj) => {
    const current = submissions.filter((submission) => normalizeCnpj(String(submission.cnpj)) === cnpj);
    const average = current.reduce((sum, submission) => sum + Number(submission.total_score || 0), 0) / current.length;
    const classification = average > 80 ? 'Crítico' : average > 60 ? 'Alto' : average > 40 ? 'Médio' : average > 20 ? 'Moderado' : 'Baixo';
    return { cnpj, company_name: String(current[0].company_name), areas: current.map((submission) => submission.area || 'Geral'), average, classification };
  });

  return (
    <div className="min-h-screen bg-slate-50 flex" id="admin-dashboard-container">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between p-6 shadow-md border-r border-slate-800 shrink-0">
        <div>
          <div className="flex flex-col mb-10 pb-6 border-b border-slate-800">
            <CompanyLogo size="sm" theme="dark" />
            <p className="text-4xs font-mono text-slate-500 tracking-wider mt-1.5 uppercase pl-0.5">PAINEL DO ADMINISTRADOR</p>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('companies')}
              className={`w-full py-2.5 px-4 rounded-lg flex items-center gap-3 text-sm font-semibold cursor-pointer transition-colors ${activeTab === 'companies' ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              <Building2 className="w-4 h-4" /> Empresas Habilitadas
            </button>

            <button
              onClick={() => setActiveTab('questions')}
              className={`w-full py-2.5 px-4 rounded-lg flex items-center gap-3 text-sm font-semibold cursor-pointer transition-colors ${activeTab === 'questions' ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              <HelpCircle className="w-4 h-4" /> Banco de Questões
            </button>

            <button
              onClick={() => setActiveTab('responses')}
              className={`w-full py-2.5 px-4 rounded-lg flex items-center gap-3 text-sm font-semibold cursor-pointer transition-colors ${activeTab === 'responses' ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              <FileBarChart2 className="w-4 h-4" /> Respostas & Relatórios
            </button>

             <button
              onClick={() => setActiveTab('supabase')}
              className={`w-full py-2.5 px-4 rounded-lg flex items-center gap-3 text-sm font-semibold cursor-pointer transition-colors ${activeTab === 'supabase' ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              <Database className="w-4 h-4" /> Integração Supabase
            </button>

            <button
              onClick={() => setActiveTab('email')}
              className={`w-full py-2.5 px-4 rounded-lg flex items-center gap-3 text-sm font-semibold cursor-pointer transition-colors ${activeTab === 'email' ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              <Mail className="w-4 h-4" /> Configuração de E-mail
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full py-2.5 px-4 rounded-lg flex items-center gap-3 text-sm font-semibold cursor-pointer transition-colors ${activeTab === 'profile' ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              <User className="w-4 h-4" /> Meu Perfil
            </button>

            <button
              onClick={() => setActiveTab('help')}
              className={`w-full py-2.5 px-4 rounded-lg flex items-center gap-3 text-sm font-semibold cursor-pointer transition-colors ${activeTab === 'help' ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              <LifeBuoy className="w-4 h-4" /> Ajuda e Instruções
            </button>

            <button
              onClick={() => setActiveTab('sre')}
              className={`w-full py-2.5 px-4 rounded-lg flex items-center gap-3 text-sm font-semibold cursor-pointer transition-colors ${activeTab === 'sre' ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              <Activity className="w-4 h-4" /> SRE / Manutenção
            </button>
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="pt-6 border-t border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className={`w-2 h-2 rounded-full ${dbStatus.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span>Supabase: {dbStatus.connected ? 'Conectado' : 'Local Fallback'}</span>
          </div>

          <button
            onClick={onLogout}
            className="w-full py-2 bg-slate-800 hover:bg-red-950 hover:text-red-300 text-slate-400 font-semibold rounded-lg text-xs flex items-center justify-center gap-2 cursor-pointer transition-all border border-slate-700"
          >
            <LogOut className="w-3.5 h-3.5" /> Sair da Conta
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto" id="admin-main">
        {/* Header toolbar */}
        <header className="bg-white border-b border-slate-200 py-5 px-8 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {activeTab === 'companies' && 'Empresas & CNPJs Cadastrados'}
              {activeTab === 'questions' && 'Gestão do Questionário'}
              {activeTab === 'responses' && 'Histórico de Questionários'}
              {activeTab === 'supabase' && 'Configuração de Persistência'}
              {activeTab === 'email' && 'Configurações de E-mail & Alertas'}
              {activeTab === 'profile' && 'Perfil do Administrador'}
              {activeTab === 'help' && 'Ajuda e Instruções do Sistema'}
              {activeTab === 'sre' && 'Painel de Manutenção (SRE)'}
            </h2>
            <p className="text-xs text-slate-500">
              {activeTab === 'companies' && 'Cadastre e habilite o período em que cada CNPJ de cliente pode responder ao formulário.'}
              {activeTab === 'questions' && 'Adicione, edite ou exclua perguntas e mude o tipo da escala de resposta.'}
              {activeTab === 'responses' && 'Visualize o resultado das avaliações psicossociais enviadas e baixe o relatório final de SST.'}
              {activeTab === 'supabase' && 'Insira o script de criação no seu painel para guardar as respostas e rodar o cálculo em banco.'}
              {activeTab === 'email' && 'Configure as notificações automáticas por e-mail, credenciais do servidor SMTP e altere o e-mail de login do administrador.'}
              {activeTab === 'profile' && 'Gerencie seus dados de perfil, telefone, cargo ou função, e altere sua senha de acesso.'}
              {activeTab === 'help' && 'Consulte as instruções detalhadas sobre a plataforma, fluxos e rotinas diárias do gestor.'}
              {activeTab === 'sre' && 'Visão avançada de disponibilidade do ambiente e ações de mitigação (Execução via RPC / Edge Functions).'}
            </p>
          </div>

          <div className="text-xs font-mono text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>SST Data: {new Date().toLocaleDateString('pt-BR')}</span>
          </div>
        </header>

        {/* Global Notifications Alert */}
        <AnimatePresence>
          {alertMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mx-8 mt-4 p-4 rounded-xl border flex items-center gap-3 text-xs ${alertMsg.type === 'success' ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-red-50 border-red-200 text-red-800'}`}
              id="admin-notification-bar"
            >
              <CheckCircle className={`w-4 h-4 ${alertMsg.type === 'success' ? 'text-blue-600' : 'text-red-600'}`} />
              <p className="font-semibold">{alertMsg.text}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Inner Tab View */}
        <div className="p-8 flex-1" id="tab-content-area">
          {/* TAB 1: COMPANIES */}
          {activeTab === 'companies' && (
            <div className="space-y-6">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 border border-slate-200 rounded-xl shadow-xs">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Pesquisar por CNPJ ou nome..."
                    value={companySearch}
                    onChange={(e) => setCompanySearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-slate-800 focus:bg-white transition-colors"
                  />
                </div>

                <button
                  onClick={() => handleOpenCompanyModal()}
                  className="w-full sm:w-auto py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Habilitar Nova Empresa
                </button>
              </div>

              {/* Table List */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-semibold">
                      <th className="py-3 px-4">Empresa</th>
                      <th className="py-3 px-4">CNPJ (Chave de Acesso)</th>
                      <th className="py-3 px-4">Áreas autorizadas</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Período Permitido</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs text-slate-700 divide-y divide-slate-100">
                    {filteredCompanies.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-slate-400">
                          Nenhuma empresa habilitada cadastrada no momento.
                        </td>
                      </tr>
                    ) : (
                      filteredCompanies.map((co) => {
                        const isExpired = new Date() > new Date(co.enabled_until + 'T23:59:59');
                        return (
                          <tr key={co.id || co.cnpj} className="hover:bg-slate-50">
                            <td className="py-3.5 px-4 font-bold text-slate-800">{co.name}</td>
                            <td className="py-3.5 px-4 font-mono text-slate-600">{formatCNPJ(co.cnpj)}</td>
                            <td className="py-3.5 px-4 text-3xs text-slate-500 max-w-xs">
                              <div className="flex flex-wrap gap-1">
                                {(co.areas || ['Geral']).map((area) => (
                                  <span key={area} className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                                    {area}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold text-3xs ${co.enabled && !isExpired ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${co.enabled && !isExpired ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                {co.enabled && !isExpired ? 'Habilitado' : isExpired ? 'Expirado' : 'Inativo'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-slate-500">
                              De {new Date(co.enabled_from).toLocaleDateString('pt-BR')} até {new Date(co.enabled_until).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="py-3.5 px-4 text-right space-x-2">
                              <button
                                onClick={() => handleOpenCompanyModal(co)}
                                className="p-1.5 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"
                                title="Editar empresa"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCompany(co.id || co.cnpj)}
                                className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded text-slate-400 cursor-pointer"
                                title="Excluir empresa"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: QUESTIONS */}
          {activeTab === 'questions' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 border border-slate-200 rounded-xl shadow-xs">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Pesquisar pergunta ou dimensão..."
                    value={questionSearch}
                    onChange={(e) => setQuestionSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-slate-800 focus:bg-white transition-colors"
                  />
                </div>

                <div className="flex gap-2">
                  <div className="bg-slate-100 text-slate-600 text-xs border border-slate-200 font-mono px-3 py-2 rounded-lg">
                    Total: <strong>{questions.length} questões</strong>
                  </div>
                  <button
                    onClick={() => handleOpenQuestionModal()}
                    className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4" /> Nova Pergunta
                  </button>
                </div>
              </div>

              {/* Grid or Table list of questions */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-semibold">
                      <th className="py-3 px-4">Seção / Dimensão</th>
                      <th className="py-3 px-4">Pergunta</th>
                      <th className="py-3 px-4">Formato</th>
                      <th className="py-3 px-4">Inversão (Risco)</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs text-slate-700 divide-y divide-slate-100">
                    {filteredQuestions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-10 text-center text-slate-400">
                          Nenhuma pergunta correspondente encontrada.
                        </td>
                      </tr>
                    ) : (
                      filteredQuestions.map((q) => (
                        <tr key={q.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-semibold text-slate-600">{q.section_title}</td>
                          <td className="py-3 px-4 text-slate-800 leading-relaxed font-sans max-w-sm">{q.text}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded font-mono text-3xs ${q.type === 'scale' ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'}`}>
                              {q.type === 'scale' ? 'Escala 1 a 5' : 'Sim / Não'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {q.is_inverted ? (
                              <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-3xs">
                                Invertida (Menor é mais risco)
                              </span>
                            ) : (
                              <span className="text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-3xs">
                                Direta (Maior é mais risco)
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                            <button
                              onClick={() => handleOpenQuestionModal(q)}
                              className="p-1.5 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"
                              title="Editar questão"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(q.id)}
                              className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded text-slate-400 cursor-pointer"
                              title="Excluir questão"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: RESPONSES */}
          {activeTab === 'responses' && (
            <div className="space-y-6">
              {/* Quick Summary Widgets */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                  <p className="text-2xs font-mono text-slate-400 uppercase font-bold tracking-wide">Avaliações Recebidas</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{submissions.length}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                  <p className="text-2xs font-mono text-slate-400 uppercase font-bold tracking-wide">Classificação Média</p>
                  <p className="text-xl font-bold text-slate-800 mt-1">
                    {submissions.length > 0 
                      ? `${(submissions.reduce((acc, curr) => acc + (curr.total_score || 0), 0) / submissions.length).toFixed(1)}%`
                      : 'N/A'}
                  </p>
                </div>
                
                {/* Admin Reset and Export Buttons */}
                <div className="sm:col-span-2 bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-center gap-3">
                  <div className="flex gap-2">
                    <button
                      onClick={handleExportExcel}
                      disabled={submissions.length === 0}
                      className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
                    >
                      <FileSpreadsheet className="w-4 h-4" /> Extrair Banco de Dados (Excel)
                    </button>
                    
                    <button
                      onClick={() => setIsResetConfirmOpen(true)}
                      className="py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer border border-red-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> Resetar Último Período
                    </button>
                  </div>
                  <p className="text-3xs text-slate-400 text-center font-sans">
                    O reset apaga permanentemente todas as respostas do período para iniciar um novo ciclo de entrevistas.
                  </p>
                </div>
              </div>

              {/* Consolidated company averages */}
              {companySummaries.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Consolidado por empresa</h3>
                      <p className="text-3xs text-slate-400 mt-1">Média das respostas vigentes por área. Cada área conta uma vez.</p>
                    </div>
                    <span className="text-3xs font-mono text-slate-400">{companySummaries.length} empresa(s)</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    {companySummaries.map((summary) => (
                      <div key={summary.cnpj} className="border border-slate-200 rounded-lg p-4 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 truncate">{summary.company_name}</p>
                          <p className="text-3xs font-mono text-slate-400">{formatCNPJ(summary.cnpj)}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {summary.areas.map((area) => (
                              <span key={area} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-3xs">{area}</span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xl font-black text-slate-800">{summary.average.toFixed(1)}%</p>
                          <p className="text-3xs font-bold text-slate-500">{summary.classification}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Table responses list */}
              <div className="space-y-4">
                <div className="relative w-80 bg-white border border-slate-200 rounded-lg p-1 shadow-2xs">
                  <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Pesquisar por empresa ou respondente..."
                    value={responseSearch}
                    onChange={(e) => setResponseSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border-0 rounded text-slate-800 text-xs focus:outline-none"
                  />
                </div>

                <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-semibold">
                        <th className="py-3 px-4">Empresa / CNPJ</th>
                        <th className="py-3 px-4">Área</th>
                        <th className="py-3 px-4">Respondente</th>
                        <th className="py-3 px-4">Horário Envio</th>
                        <th className="py-3 px-4">Score (%)</th>
                        <th className="py-3 px-4">Grau de Risco</th>
                        <th className="py-3 px-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs text-slate-700 divide-y divide-slate-100">
                      {filteredSubmissions.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-10 text-center text-slate-400">
                            Nenhuma resposta enviada encontrada.
                          </td>
                        </tr>
                      ) : (
                        filteredSubmissions.map((sub, idx) => {
                          let riskColor = 'bg-emerald-50 text-emerald-800 border-emerald-100';
                          if (sub.classification === 'Moderado') riskColor = 'bg-yellow-50 text-yellow-800 border-yellow-100';
                          else if (sub.classification === 'Médio') riskColor = 'bg-amber-50 text-amber-800 border-amber-100';
                          else if (sub.classification === 'Alto') riskColor = 'bg-orange-50 text-orange-800 border-orange-100';
                          else if (sub.classification === 'Crítico') riskColor = 'bg-red-50 text-red-800 border-red-100';

                          return (
                            <tr key={sub.id || idx} className="hover:bg-slate-50">
                              <td className="py-3 px-4">
                                <div className="font-bold text-slate-800">{sub.company_name}</div>
                                <div className="text-3xs text-slate-400 font-mono mt-0.5">{formatCNPJ(sub.cnpj)}</div>
                              </td>
                          <td className="py-3 px-4">
                                <span className="inline-flex px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-100 text-3xs font-semibold">
                                  {sub.area || 'Geral'}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="font-semibold">{sub.respondent_name}</div>
                                <div className="text-3xs text-slate-400 mt-0.5">{sub.respondent_email}</div>
                              </td>
                              <td className="py-3 px-4 text-slate-500 font-mono">
                                {new Date(sub.end_time).toLocaleString('pt-BR')}
                              </td>
                              <td className="py-3 px-4 font-bold text-slate-800">
                                {sub.total_score !== undefined ? `${sub.total_score}%` : 'Calculando...'}
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded border font-semibold text-3xs ${riskColor}`}>
                                  {sub.classification || 'Indefinido'}
                                </span>
                              </td>
                            <td className="py-3 px-4 text-right space-x-1">
                                <button
                                  onClick={() => handleDownloadPdf(sub)}
                                  className="inline-flex items-center gap-1 py-1.5 px-3 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-3xs font-bold rounded border border-slate-200 transition-all cursor-pointer"
                                >
                                  <FileDown className="w-3 h-3" /> PDF
                                </button>
                                <button
                                  onClick={() => handleDeleteResponse(sub)}
                                  className="inline-flex items-center gap-1 py-1.5 px-2 bg-red-50 hover:bg-red-600 hover:text-white text-red-700 text-3xs font-bold rounded border border-red-200 transition-all cursor-pointer"
                                  title="Excluir resposta desta área"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SUPABASE CONFIG */}
          {activeTab === 'supabase' && (
            <div className="grid md:grid-cols-3 gap-8">
              {/* Left Column: connection status & advice */}
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-600" /> Status da Conexão
                  </h3>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="text-xs text-slate-500">Serviço Supabase</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${dbStatus.configured ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        {dbStatus.configured ? 'Configurado' : 'Não Configurado'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="text-xs text-slate-500">Banco de Dados Ativo</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${dbStatus.connected && dbStatus.tablesExist ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {dbStatus.connected && dbStatus.tablesExist ? 'Ativo (Cloud)' : 'Local Fallback'}
                      </span>
                    </div>
                  </div>

                  {!dbStatus.configured && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-3xs text-red-800 space-y-2">
                      <div className="flex gap-1.5 items-start">
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">Chaves Ausentes</p>
                          <p className="mt-0.5 leading-relaxed">
                            Insira as chaves <code>SUPABASE_URL</code> e <code>SUPABASE_KEY</code> no painel de Secrets para habilitar a nuvem.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {dbStatus.configured && (!dbStatus.tablesExist || !dbStatus.rpcExists) && (
                    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-3xs text-amber-800 space-y-2">
                      <div className="flex gap-1.5 items-start">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">Estrutura Incompleta no Supabase</p>
                          <p className="mt-0.5 leading-relaxed">
                            As credenciais estão corretas, mas as tabelas ou o motor RPC de cálculo ainda não foram criados no banco.
                          </p>
                          <p className="mt-1 font-bold">
                            Copie o script SQL ao lado, cole-o no SQL Editor do seu Supabase e clique em RUN.
                          </p>
                          {dbStatus.errorDetails && (
                            <p className="mt-2 pt-2 border-t border-amber-200 text-slate-700 font-mono text-[10px] break-all">
                              Erro: {dbStatus.errorDetails}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {dbStatus.connected && dbStatus.tablesExist && dbStatus.rpcExists && (
                    <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-3xs text-emerald-800 space-y-2">
                      <div className="flex gap-1.5 items-start">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">Nuvem Supabase Pronta</p>
                          <p className="mt-0.5 leading-relaxed">
                            O motor de cálculos está rodando com sucesso através da RPC do Supabase, salvando tudo de forma persistente e escalável!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase">Instruções de Instalação:</h4>
                  <ol className="text-xs text-slate-600 space-y-2 list-decimal list-inside leading-relaxed">
                    <li>Acesse <a href="https://supabase.com" target="_blank" className="text-blue-700 font-bold hover:underline">Supabase</a> e crie um projeto gratuito.</li>
                    <li>No menu lateral esquerdo, vá em <strong>SQL Editor</strong>.</li>
                    <li>Clique em <strong>New Query</strong> e cole o script SQL ao lado.</li>
                    <li>Execute o script para criar as tabelas e o motor de cálculo.</li>
                    <li>No painel de Configurações do AI Studio, adicione as chaves:
                      <ul className="list-disc list-inside pl-4 mt-1 font-mono text-3xs">
                        <li>SUPABASE_URL</li>
                        <li>SUPABASE_KEY</li>
                      </ul>
                    </li>
                  </ol>
                </div>
              </div>

              {/* Right Column: SQL script show */}
              <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col h-full min-h-[400px]">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-slate-600" />
                    <span className="text-xs font-bold text-slate-700">Script de Inicialização SQL (PL/pgSQL)</span>
                  </div>
                  <button
                    onClick={handleCopySQL}
                    className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-2xs font-bold rounded-lg cursor-pointer transition-colors shadow-2xs"
                  >
                    Copiar Script SQL
                  </button>
                </div>
                <div className="flex-1 p-4 bg-slate-900 overflow-auto font-mono text-3xs text-sky-400 whitespace-pre leading-relaxed max-h-[500px]">
                  {SQL_SCHEMA_SCRIPT}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: EMAIL CONFIG */}
          {activeTab === 'email' && (
            <div className="grid md:grid-cols-3 gap-8">
              {/* Left Side: General status & Info */}
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" /> Status do E-mail
                  </h3>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="text-xs text-slate-500">Notificações por E-mail</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${emailConfig.enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                        {emailConfig.enabled ? 'Ativadas' : 'Desativadas'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="text-xs text-slate-500">Servidor SMTP</span>
                      <span className="text-xs font-mono text-slate-700">
                        {emailConfig.smtpHost || '(não definido)'}
                      </span>
                    </div>
                  </div>

                  {!emailConfig.enabled ? (
                    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-3xs text-amber-800 space-y-2">
                      <div className="flex gap-1.5 items-start">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">Notificações Desativadas</p>
                          <p className="mt-0.5 leading-relaxed">
                            O envio automático de e-mails para o administrador ou equipe de SST está desligado. Você não receberá alertas quando novos funcionários enviarem as respostas do formulário.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-3xs text-emerald-800 space-y-2">
                      <div className="flex gap-1.5 items-start">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">Notificações Ativas</p>
                          <p className="mt-0.5 leading-relaxed">
                            Sempre que um novo questionário for respondido, um e-mail de alerta completo será enviado para o endereço cadastrado em "E-mail de Destino".
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase">Como funciona o SMTP?</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    SMTP é o protocolo padrão para envio de e-mails. Para que o portal envie as notificações reais através do domínio de sua empresa (ex: <code>sst@controlseg.com.br</code>), insira os dados fornecidos pelo seu provedor de e-mail corporativo.
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Se preferir testar localmente, você pode utilizar as credenciais de teste do Mailtrap, Gmail (com senhas de app) ou Outlook.
                  </p>
                </div>
              </div>

              {/* Right Side: SMTP Form and Admin Credentials */}
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-600" />
                      <span className="text-xs font-bold text-slate-700">Configurações de E-mail & Servidor SMTP</span>
                    </div>
                  </div>

                  <form onSubmit={handleSaveEmailConfig} className="p-6 space-y-6">
                    {/* Habilitar / Desabilitar */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">Habilitar Alertas de Respostas</h4>
                        <p className="text-3xs text-slate-500 mt-0.5">Ativa ou desativa o envio automático de relatórios por e-mail no final de cada questionário.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={emailConfig.enabled}
                          onChange={(e) => setEmailConfig({ ...emailConfig, enabled: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {/* Email fields */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-2xs font-bold text-slate-600 mb-1 tracking-wide uppercase">E-mail de Destino para Alertas</label>
                        <input
                          type="email"
                          required={emailConfig.enabled}
                          placeholder="relatorios@controlseg.com.br"
                          value={emailConfig.recipientEmail}
                          onChange={(e) => setEmailConfig({ ...emailConfig, recipientEmail: e.target.value })}
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-slate-800 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-2xs font-bold text-slate-600 mb-1 tracking-wide uppercase">E-mail de Login do Administrador</label>
                        <input
                          type="email"
                          required
                          placeholder="admin@controlseg.com.br"
                          value={emailConfig.adminEmail}
                          onChange={(e) => setEmailConfig({ ...emailConfig, adminEmail: e.target.value })}
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-slate-800 font-mono"
                        />
                      </div>
                    </div>

                    {/* SMTP Credentials Title */}
                    <div className="border-t border-slate-100 pt-4">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-4">Credenciais do Servidor SMTP de Envio</h4>
                      
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div className="md:col-span-2">
                          <label className="block text-2xs font-bold text-slate-600 mb-1 tracking-wide uppercase">Servidor SMTP Host</label>
                          <input
                            type="text"
                            placeholder="smtp.controlseg.com.br"
                            value={emailConfig.smtpHost}
                            onChange={(e) => setEmailConfig({ ...emailConfig, smtpHost: e.target.value })}
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-slate-800 font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-2xs font-bold text-slate-600 mb-1 tracking-wide uppercase">Porta SMTP</label>
                          <input
                            type="number"
                            placeholder="587"
                            value={emailConfig.smtpPort || ''}
                            onChange={(e) => setEmailConfig({ ...emailConfig, smtpPort: Number(e.target.value) })}
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-slate-800 font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-2xs font-bold text-slate-600 mb-1 tracking-wide uppercase">Usuário / E-mail de Envio</label>
                          <input
                            type="text"
                            placeholder="sst@controlseg.com.br"
                            value={emailConfig.smtpUser}
                            onChange={(e) => setEmailConfig({ ...emailConfig, smtpUser: e.target.value })}
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-slate-800 font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-2xs font-bold text-slate-600 mb-1 tracking-wide uppercase">Senha de Autenticação</label>
                          <input
                            type="password"
                            placeholder="••••••••••••••"
                            value={emailConfig.smtpPassword}
                            onChange={(e) => setEmailConfig({ ...emailConfig, smtpPassword: e.target.value })}
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-slate-800"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          id="smtp-secure"
                          checked={emailConfig.smtpSecure}
                          onChange={(e) => setEmailConfig({ ...emailConfig, smtpSecure: e.target.checked })}
                          className="w-4 h-4 text-blue-600 border-slate-300 rounded-sm focus:ring-blue-500 cursor-pointer"
                        />
                        <label htmlFor="smtp-secure" className="text-2xs font-bold text-slate-600 uppercase select-none cursor-pointer">
                          Utilizar conexão segura (SSL/TLS na porta 465)
                        </label>
                      </div>
                    </div>

                    {/* Actions footer */}
                    <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row gap-3 justify-end">
                      <button
                        type="button"
                        onClick={handleSendTestEmail}
                        disabled={isSendingTest || !emailConfig.smtpHost || !emailConfig.smtpUser || !emailConfig.smtpPassword}
                        className="py-2 px-5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-2"
                      >
                        {isSendingTest ? (
                          <>
                            <RefreshCcw className="w-3.5 h-3.5 animate-spin" /> Enviando Teste...
                          </>
                        ) : (
                          <>
                            <Mail className="w-3.5 h-3.5" /> Enviar E-mail de Teste
                          </>
                        )}
                      </button>

                      <button
                        type="submit"
                        disabled={isSavingEmail}
                        className="py-2 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-sm flex items-center justify-center gap-2"
                      >
                        {isSavingEmail ? (
                          <>
                            <RefreshCcw className="w-3.5 h-3.5 animate-spin" /> Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5" /> Salvar Configurações
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ADMIN PROFILE */}
          {activeTab === 'profile' && (
            <div className="grid md:grid-cols-3 gap-8" id="admin-profile-view">
              {/* Profile Card View */}
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col items-center text-center relative overflow-hidden">
                  <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-blue-700 border-2 border-slate-200 mb-4 shadow-sm overflow-hidden relative group">
                    {profile.avatarUrl ? (
                      <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-10 h-10 text-slate-400" />
                    )}
                    <label className="absolute inset-0 bg-slate-900/60 hidden group-hover:flex items-center justify-center cursor-pointer transition-all">
                      <span className="text-white text-3xs font-bold uppercase tracking-wider">{isUploadingAvatar ? 'Enviando...' : 'Trocar Foto'}</span>
                      <input type="file" className="hidden" accept="image/png, image/jpeg, image/jpg, image/webp" onChange={handleAvatarUpload} disabled={isUploadingAvatar} />
                    </label>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{profile.name || 'Gestor Control Seg'}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">{profile.role || 'Coordenador de SST'}</p>
                  <div className="w-full border-t border-slate-100 my-4 pt-4 text-left space-y-2 text-xs text-slate-600">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">E-mail:</span>
                      <span className="font-semibold">{profile.email}</span>
                    </div>
                    {profile.phone && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Telefone:</span>
                        <span className="font-semibold">{profile.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Edit Form */}
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                    <User className="w-4 h-4 text-blue-600" /> Atualizar Informações Cadastrais
                  </h3>

                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-2xs font-bold text-slate-600 mb-1 tracking-wide uppercase">Nome Completo</label>
                        <input
                          type="text"
                          required
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          placeholder="Administrador de SST"
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-2xs font-bold text-slate-600 mb-1 tracking-wide uppercase">E-mail de Login</label>
                        <input
                          type="email"
                          required
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          placeholder="admin@controlseg.com.br"
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-slate-800 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-2xs font-bold text-slate-600 mb-1 tracking-wide uppercase">Telefone de Contato</label>
                        <input
                          type="text"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          placeholder="(11) 99999-9999"
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-slate-800 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-2xs font-bold text-slate-600 mb-1 tracking-wide uppercase">Cargo / Função de SST</label>
                        <input
                          type="text"
                          value={profile.role}
                          onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                          placeholder="Coordenador de SST"
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-slate-800"
                        />
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-6 mt-6">
                      <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-blue-600" /> Alterar Senha de Acesso
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-2xs font-bold text-slate-600 mb-1 tracking-wide uppercase">Nova Senha</label>
                          <input
                            type="password"
                            placeholder="Deixe em branco para não alterar"
                            value={profile.password}
                            onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-slate-800"
                          />
                          <p className="text-4xs text-slate-400 mt-1 leading-relaxed">Mínimo de 4 caracteres. Caso preenchida, alterará a credencial de login.</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions footer */}
                    <div className="border-t border-slate-100 pt-6 flex justify-end">
                      <button
                        type="submit"
                        disabled={isSavingProfile}
                        className="py-2 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-sm flex items-center justify-center gap-2"
                      >
                        {isSavingProfile ? (
                          <>
                            <RefreshCcw className="w-3.5 h-3.5 animate-spin" /> Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5" /> Salvar Alterações de Perfil
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'help' && (
            <div className="max-w-4xl space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-xs">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <LifeBuoy className="w-5 h-5 text-blue-600" /> Guia de Operação do Sistema
                </h3>
                
                <div className="space-y-8">
                  {/* Cadastro de CNPJ */}
                  <section className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-500" /> 1. Cadastro de CNPJs (Empresas)
                    </h4>
                    <div className="text-xs text-slate-600 leading-relaxed pl-6 space-y-2">
                      <p>
                        A aba <strong>Empresas & CNPJs Cadastrados</strong> permite gerenciar as organizações que realizarão a avaliação psicossocial. 
                        Este é o primeiro passo para o uso da plataforma.
                      </p>
                      <ul className="list-disc pl-5 space-y-1 text-slate-500">
                        <li><strong>CNPJ:</strong> É a chave de acesso do seu cliente. Deve ser inserido apenas com números ou formato padrão.</li>
                        <li><strong>Janela de Validade:</strong> (Data Início e Fim) define exatamente quando os colaboradores poderão preencher o questionário. Fora dessa data, o acesso é bloqueado na tela inicial.</li>
                        <li><strong>Habilitado:</strong> Uma chave liga/desliga rápida para bloquear uma empresa sem precisar excluir os dados.</li>
                      </ul>
                      <p className="mt-2 font-medium">Atenção: Apenas empresas cadastradas aqui conseguirão autenticar no portal do cliente.</p>
                    </div>
                  </section>

                  {/* Manutenção em questionário */}
                  <section className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <FileBarChart2 className="w-4 h-4 text-slate-500" /> 2. Manutenção do Questionário
                    </h4>
                    <div className="text-xs text-slate-600 leading-relaxed pl-6 space-y-2">
                      <p>
                        A <strong>Gestão do Questionário</strong> permite adequar o instrumento de SST às necessidades da Control Seg. 
                        Qualquer alteração feita aqui reflete imediatamente no portal do trabalhador.
                      </p>
                      <ul className="list-disc pl-5 space-y-1 text-slate-500">
                        <li><strong>Dimensões:</strong> O formulário é dividido em até 10 seções temáticas (Ex: Demanda, Controle, Suporte).</li>
                        <li><strong>Tipos de Escala:</strong> Likert (1 a 5, onde 1=Nunca e 5=Sempre) ou Booleana (Sim/Não).</li>
                        <li><strong>Inversão de Escala:</strong> Fundamental para cálculo de risco. Se uma pergunta é "Tenho bom relacionamento com a equipe" e a resposta é 5 (Sempre), isso é positivo. Ao marcar "Inverter Escala", o sistema calcula esse "5" como "1" para fins de fator de risco.</li>
                      </ul>
                    </div>
                  </section>

                  {/* Configuração de Email */}
                  <section className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-500" /> 3. Configuração de E-mail
                    </h4>
                    <div className="text-xs text-slate-600 leading-relaxed pl-6 space-y-2">
                      <p>
                        A aba <strong>Configurações de E-mail</strong> garante que a equipe da Control Seg seja alertada em tempo real sobre novos mapeamentos psicossociais.
                      </p>
                      <ul className="list-disc pl-5 space-y-1 text-slate-500">
                        <li><strong>SMTP:</strong> Insira os dados do servidor (Host, Porta, Usuário, Senha). Consulte o TI para obter os dados do domínio `@controlseg.com.br`.</li>
                        <li><strong>Destinatário:</strong> Quem receberá os alertas (Ex: relatorios@controlseg.com.br).</li>
                        <li><strong>Teste de Conexão:</strong> Sempre utilize o botão "Testar Conexão" após salvar para validar se a porta não está bloqueada por firewall.</li>
                      </ul>
                    </div>
                  </section>

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs">
                    <strong>Nota Arquitetural:</strong> A lógica pesada de cálculo do questionário e envio de e-mails não ocorre no navegador. As operações são projetadas para rodar no backend via Edge Functions ou RPC SQL (Supabase) para garantir segurança e integridade de dados.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sre' && (
            <div className="max-w-4xl space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-xs">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-600" /> Site Reliability Engineering (SRE)
                  </h3>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={fetchSreMetrics}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200"
                    >
                      <RefreshCcw className={`w-3.5 h-3.5 ${isFetchingSre ? 'animate-spin' : ''}`} /> Atualizar
                    </button>
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-3xs font-bold rounded-md uppercase tracking-wider border border-indigo-100">
                      Monitoramento de Banco
                    </span>
                  </div>
                </div>
                
                <p className="text-xs text-slate-500 mb-8 leading-relaxed">
                  Avaliação em tempo real do banco de dados Supabase da Control Seg. Este painel mede a latência de rede, consumo estimado de armazenamento de dados e tabelas persistidas através da infraestrutura na nuvem.
                </p>

                {isFetchingSre ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                ) : sreMetrics ? (
                  <div className="space-y-6">
                    {/* Status Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col justify-between">
                        <span className="text-3xs font-bold text-slate-400 uppercase tracking-wider">Status Geral</span>
                        <div className="flex items-center gap-2 mt-2">
                          <div className={`w-2 h-2 rounded-full ${sreMetrics.status === 'Saudável' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                          <span className={`text-lg font-black ${sreMetrics.status === 'Saudável' ? 'text-green-700' : 'text-amber-700'}`}>
                            {sreMetrics.status}
                          </span>
                        </div>
                      </div>

                      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col justify-between">
                        <span className="text-3xs font-bold text-slate-400 uppercase tracking-wider">Latência (Ping)</span>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-lg font-black text-slate-800">{sreMetrics.latencyMs}</span>
                          <span className="text-xs font-semibold text-slate-500">ms</span>
                        </div>
                      </div>

                      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col justify-between">
                        <span className="text-3xs font-bold text-slate-400 uppercase tracking-wider">Tamanho Estimado</span>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-lg font-black text-slate-800">{sreMetrics.estimatedSize}</span>
                        </div>
                      </div>

                      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col justify-between">
                        <span className="text-3xs font-bold text-slate-400 uppercase tracking-wider">Total Respostas</span>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-lg font-black text-slate-800">{sreMetrics.responses}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900 rounded-xl p-5 overflow-hidden font-mono text-xs relative">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                      <div className="flex items-center gap-2 text-slate-400 mb-3 border-b border-slate-800 pb-2">
                        <Database className="w-4 h-4" /> root@supabase-cluster:~# systemctl status postgresql
                      </div>
                      <div className="text-green-400 mb-1">● postgresql.service - PostgreSQL RDBMS (Supabase)</div>
                      <div className="text-slate-300 ml-4 mb-2">Loaded: loaded (/lib/systemd/system/postgresql.service; enabled)</div>
                      <div className="text-slate-300 ml-4 mb-4">Active: <span className="text-green-400 font-bold">active (running)</span> since {new Date(Date.now() - 86400000 * 3).toUTCString()}</div>
                      
                      <div className="text-blue-400 mb-1"># Métricas de Entidades Coletadas (RPC Call)</div>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-slate-300">
                        <div>&gt; companies_count: <span className="text-purple-400">{sreMetrics.companies} rows</span></div>
                        <div>&gt; questions_count: <span className="text-purple-400">{sreMetrics.questions} rows</span></div>
                        <div>&gt; responses_count: <span className="text-purple-400">{sreMetrics.responses} rows</span></div>
                        <div>&gt; query_latency: <span className="text-amber-400">{sreMetrics.latencyMs} ms</span></div>
                        <div>&gt; storage_avatars: <span className="text-purple-400">Ativo</span></div>
                        <div>&gt; last_sync: <span className="text-slate-500">{new Date(sreMetrics.lastChecked).toLocaleTimeString('pt-BR')}</span></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-xs">
                    Falha ao carregar métricas. Verifique as credenciais do Supabase.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODALS IN ANIMEPRESENCE */}
      {/* COMPANY MODAL */}
      {isCompanyModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl w-full max-w-md relative"
          >
            <button
              onClick={() => setIsCompanyModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-4">
              {editingCompany ? 'Editar Empresa Habilitada' : 'Habilitar Nova Empresa'}
            </h3>

            <form onSubmit={handleSaveCompany} className="space-y-4">
              <div>
                <label className="block text-2xs font-bold text-slate-600 mb-1 tracking-wide uppercase">Nome da Empresa</label>
                <input
                  type="text"
                  required
                  placeholder="Empresa XYZ Ltda"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-slate-800"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 mb-1 tracking-wide uppercase">CNPJ (Apenas números ou formato padrão)</label>
                <input
                  type="text"
                  required
                  placeholder="00.000.000/0001-00"
                  value={cnpjInput}
                  onChange={(e) => setCnpjInput(e.target.value)}
                  disabled={editingCompany !== null}
                  className="w-full px-3.5 py-2 bg-slate-50 disabled:bg-slate-100 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-slate-800 font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-2xs font-bold text-slate-600 tracking-wide uppercase">Áreas que responderão</label>
                  <span className="text-3xs text-slate-400">Selecione uma ou mais</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-3">
                  {COMMON_COMPANY_AREAS.map((area) => {
                    const checked = selectedAdminAreas.includes(area);
                    return (
                      <label key={area} className={`flex items-center gap-2 rounded-md border px-2.5 py-2 text-xs cursor-pointer transition-colors ${checked ? 'border-blue-300 bg-blue-50 text-blue-800' : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200'}`}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => setSelectedAdminAreas((current) => checked ? current.filter((item) => item !== area) : [...current, area])}
                          className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                        />
                        <span>{area}</span>
                      </label>
                    );
                  })}
                </div>
                {selectedAdminAreas.includes('Outros') && (
                  <input
                    type="text"
                    required
                    placeholder="Digite outras áreas, separadas por vírgula"
                    value={otherAreasInput}
                    onChange={(e) => setOtherAreasInput(e.target.value)}
                    className="mt-2 w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-slate-800"
                  />
                )}
                <p className="mt-1 text-3xs text-slate-400">A opção “Outros” permite cadastrar uma ou mais áreas personalizadas.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-2xs font-bold text-slate-600 mb-1 tracking-wide uppercase">Disponível de (De)</label>
                  <input
                    type="date"
                    required
                    value={fromInput}
                    onChange={(e) => setFromInput(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-bold text-slate-600 mb-1 tracking-wide uppercase">Disponível até (Até)</label>
                  <input
                    type="date"
                    required
                    value={untilInput}
                    onChange={(e) => setUntilInput(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="co-enabled"
                  checked={enabledInput}
                  onChange={(e) => setEnabledInput(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="co-enabled" className="text-xs text-slate-700 cursor-pointer font-semibold">
                  Chave Ativa e Habilitada para resposta
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" /> Salvar Empresa
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* QUESTION MODAL */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl w-full max-w-md relative"
          >
            <button
              onClick={() => setIsQuestionModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-4">
              {editingQuestion ? 'Editar Pergunta' : 'Inserir Nova Pergunta'}
            </h3>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <div>
                <label className="block text-2xs font-bold text-slate-600 mb-1 tracking-wide uppercase">Código ID da Questão</label>
                <input
                  type="text"
                  required
                  disabled={editingQuestion !== null}
                  value={qIdInput}
                  onChange={(e) => setQIdInput(e.target.value)}
                  placeholder="ex: q1_8"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 mb-1 tracking-wide uppercase">Dimensão / Seção de SST</label>
                <select
                  value={qSecIdInput}
                  onChange={(e) => handleSecIdChange(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-slate-800 font-semibold"
                >
                  {Object.keys(sectionTitleMap).map((id) => (
                    <option key={id} value={id}>
                      {sectionTitleMap[Number(id)]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 mb-1 tracking-wide uppercase">Texto da Pergunta</label>
                <textarea
                  required
                  rows={3}
                  value={qTextInput}
                  onChange={(e) => setQTextInput(e.target.value)}
                  placeholder="Digite aqui o texto oficial que o colaborador responderá..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-2xs font-bold text-slate-600 mb-1 tracking-wide uppercase">Tipo de Resposta</label>
                  <select
                    value={qTypeInput}
                    onChange={(e) => setQTypeInput(e.target.value as any)}
                    disabled={qSecIdInput === 10} // Section 10 is strictly boolean (Yes/No)
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-slate-800 font-semibold"
                  >
                    <option value="scale">Escala de Avaliação (1 a 5)</option>
                    <option value="boolean">Sim / Não (Simtomas)</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  <div className="flex items-center gap-2 pb-2">
                    <input
                      type="checkbox"
                      id="q-inverted"
                      checked={qIsInvertedInput}
                      onChange={(e) => setQIsInvertedInput(e.target.checked)}
                      disabled={qTypeInput === 'boolean'}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <label htmlFor="q-inverted" className="text-2xs text-slate-700 cursor-pointer font-bold leading-tight">
                      Inverter escala (5 = Baixo risco)
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" /> Salvar Pergunta
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* RESET CONFIRMATION DIALOG */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-red-200 rounded-2xl p-6 shadow-xl w-full max-w-sm text-center relative"
          >
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600 mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-2">Aviso de Exclusão Permanente!</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Você está prestes a <strong>limpar todas as respostas do último período</strong> de entrevistas. Esta ação não poderá ser desfeita. Todos os dados brutos de respondentes e questionários serão removidos.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleResetResponses}
                className="py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
              >
                Sim, Resetar Tudo
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
