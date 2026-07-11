import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, User, Mail, ShieldAlert, ArrowRight, ArrowLeft, 
  CheckCircle, Loader2, Sparkles, AlertCircle, HelpCircle, Shield
} from 'lucide-react';
import { Question } from '../types';
import { CompanyLogo } from './CompanyLogo';

interface ClientPortalProps {
  onBackToHome: () => void;
  onSubmissionSuccess: (result: any) => void;
}

export default function ClientPortal({ onBackToHome, onSubmissionSuccess }: ClientPortalProps) {
  const [step, setStep] = useState<'auth' | 'checklist'>('auth');
  
  // Auth Form State
  const [cnpj, setCnpj] = useState('');
  const [respondentName, setRespondentName] = useState('');
  const [respondentEmail, setRespondentEmail] = useState('');
  const [areas, setAreas] = useState<string[]>([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [submittedAreas, setSubmittedAreas] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [lgpdAccepted, setLgpdAccepted] = useState(false);
  const [showLgpdModal, setShowLgpdModal] = useState(false);

  // Active Assessment State
  const [companyName, setCompanyName] = useState('');
  const [validatedCnpj, setValidatedCnpj] = useState('');
  const [startTime, setStartTime] = useState<string>('');
  
  // Questions list fetched from API
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  
  // Draft / Saved Progress State
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);
  const [pendingDraft, setPendingDraft] = useState<{ answers: Record<string, string | number>; currentSectionIndex: number } | null>(null);

  const handleSelectArea = (area: string) => {
    if (!area) {
      setSelectedArea('');
      return;
    }
    if (submittedAreas.some((submittedArea) => submittedArea.toLowerCase() === area.toLowerCase())) {
      const replace = window.confirm(
        'Esse formulário para essa área já foi preenchido. Deseja preencher novamente? A nova resposta substituirá a anterior.',
      );
      if (!replace) {
        setSelectedArea('');
        return;
      }
    }
    setSelectedArea(area);
    setAnswers({});
    setCurrentSectionIndex(0);
    setPendingDraft(null);

    const draftKey = `assessment_draft_${validatedCnpj}_${area}_${respondentEmail}`;
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setPendingDraft(parsed);
        setShowDraftPrompt(true);
      } catch (err) {
        console.error('Error parsing draft:', err);
      }
    }
  };

  const handleLoadDraft = () => {
    if (pendingDraft) {
      setAnswers(pendingDraft.answers);
      setCurrentSectionIndex(pendingDraft.currentSectionIndex || 0);
    }
    setShowDraftPrompt(false);
  };

  const handleDiscardDraft = () => {
    const activeCnpj = validatedCnpj || cnpj;
    if (activeCnpj && respondentEmail && selectedArea) {
      const draftKey = `assessment_draft_${activeCnpj}_${selectedArea}_${respondentEmail}`;
      localStorage.removeItem(draftKey);
    }
    setShowDraftPrompt(false);
  };
  
  // Section wizard progression
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Grouped sections metadata
  const sections = [
    { id: 1, name: 'Seção 1: Demanda de Trabalho' },
    { id: 2, name: 'Seção 2: Controle e Autonomia' },
    { id: 3, name: 'Seção 3: Apoio da Liderança' },
    { id: 4, name: 'Seção 4: Relacionamento Interpessoal' },
    { id: 5, name: 'Seção 5: Assédio Moral e Violência' },
    { id: 6, name: 'Seção 6: Reconhecimento e Recompensa' },
    { id: 7, name: 'Seção 7: Segurança no Emprego' },
    { id: 8, name: 'Seção 8: Equilíbrio Trabalho x Vida' },
    { id: 9, name: 'Seção 9: Comunicação Organizacional' },
    { id: 10, name: 'Seção 10: Sintomas de Estresse' }
  ];

  // Load questions on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoadingQuestions(true);
      try {
        const r = await fetch('/api/assessment/questions');
        if (r.ok) {
          const data = await r.json();
          setQuestions(data);
        }
      } catch (err) {
        console.error('Error fetching questions:', err);
      } finally {
        setIsLoadingQuestions(false);
      }
    };
    fetchQuestions();
  }, []);

  // Format CNPJ as typing
  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 14) value = value.slice(0, 14);
    
    // Format: 00.000.000/0001-00
    if (value.length > 12) {
      value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    } else if (value.length > 8) {
      value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})/, "$1.$2.$3/$4");
    } else if (value.length > 5) {
      value = value.replace(/^(\d{2})(\d{3})(\d{3})/, "$1.$2.$3");
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{3})/, "$1.$2");
    }
    setCnpj(value);
  };

  const handleValidateAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cnpj || !respondentName || !respondentEmail) {
      setAuthError('Preencha todas as informações para continuar.');
      return;
    }

    setIsValidating(true);
    setAuthError(null);

    try {
      const response = await fetch('/api/cnpj/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cnpj }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        setCompanyName(data.companyName);
        setValidatedCnpj(data.cnpj);
        setAreas(data.areas || ['Geral']);
        setSubmittedAreas(data.submittedAreas || []);
        setSelectedArea('');
        setStartTime(new Date().toISOString());
        setStep('checklist');

        // Check for saved draft for this CNPJ + respondentEmail + area once
        // an area is selected below.
      } else {
        setAuthError(data.error || 'Acesso negado. Verifique o CNPJ ou consulte a administração.');
      }
    } catch (err) {
      console.error('CNPJ validate error:', err);
      setAuthError('Falha ao validar chaves. Verifique sua conexão de rede.');
    } finally {
      setIsValidating(false);
    }
  };

  // Filter questions for the current wizard step
  const currentSectionId = sections[currentSectionIndex].id;
  const currentQuestions = questions.filter(q => q.section_id === currentSectionId);

  const handleSelectAnswer = (questionId: string, value: string | number) => {
    setAnswers(prev => {
      const updated = {
        ...prev,
        [questionId]: value
      };
      
      // Save draft automatically
      if (validatedCnpj && respondentEmail && selectedArea) {
        const draftKey = `assessment_draft_${validatedCnpj}_${selectedArea}_${respondentEmail}`;
        localStorage.setItem(draftKey, JSON.stringify({
          answers: updated,
          currentSectionIndex: currentSectionIndex,
          timestamp: new Date().toISOString()
        }));
      }
      return updated;
    });
  };

  // Verify if all questions in the current active section have been answered
  const isCurrentSectionComplete = () => {
    if (currentQuestions.length === 0) return true;
    return currentQuestions.every(q => answers[q.id] !== undefined);
  };

  const handleNextSection = () => {
    if (!isCurrentSectionComplete()) {
      alert('Por favor, responda a todas as perguntas desta seção antes de prosseguir.');
      return;
    }
    if (currentSectionIndex < sections.length - 1) {
      const nextIdx = currentSectionIndex + 1;
      setCurrentSectionIndex(nextIdx);
      
      // Save progress with new section index
      if (validatedCnpj && respondentEmail && selectedArea) {
        const draftKey = `assessment_draft_${validatedCnpj}_${selectedArea}_${respondentEmail}`;
        localStorage.setItem(draftKey, JSON.stringify({
          answers: answers,
          currentSectionIndex: nextIdx,
          timestamp: new Date().toISOString()
        }));
      }
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevSection = () => {
    if (currentSectionIndex > 0) {
      const prevIdx = currentSectionIndex - 1;
      setCurrentSectionIndex(prevIdx);
      
      // Save progress with new section index
      if (validatedCnpj && respondentEmail && selectedArea) {
        const draftKey = `assessment_draft_${validatedCnpj}_${selectedArea}_${respondentEmail}`;
        localStorage.setItem(draftKey, JSON.stringify({
          answers: answers,
          currentSectionIndex: prevIdx,
          timestamp: new Date().toISOString()
        }));
      }
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmitAssessment = async () => {
    if (!selectedArea) {
      alert('Selecione a área que está respondendo o formulário.');
      return;
    }
    if (!isCurrentSectionComplete()) {
      alert('Por favor, responda a todas as perguntas da última seção antes de enviar.');
      return;
    }

    setIsSubmitting(true);

    const submissionPayload = {
      cnpj: validatedCnpj,
      area: selectedArea,
      company_name: companyName,
      respondent_name: respondentName,
      respondent_email: respondentEmail,
      start_time: startTime,
      end_time: new Date().toISOString(),
      answers: answers
    };

    try {
      const r = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionPayload)
      });

      const data = await r.json();

      if (r.ok && data.success) {
        const draftKey = `assessment_draft_${validatedCnpj}_${selectedArea}_${respondentEmail}`;
        localStorage.removeItem(draftKey);
        onSubmissionSuccess({
          ...data,
          respondent_name: respondentName,
          company_name: companyName,
          area: selectedArea,
        });
      } else {
        alert(data.error || 'Erro ao enviar questionário. Tente novamente.');
      }
    } catch (err) {
      console.error('Error submitting answers:', err);
      alert('Não foi possível enviar as respostas. Verifique seu servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between" id="client-portal-wrapper">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 shadow-2xs">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <CompanyLogo size="sm" />
            {step === 'checklist' && (
              <div className="border-l border-slate-200 pl-4">
                <p className="text-3xs text-blue-700 font-mono tracking-wide uppercase font-semibold">AVALIAÇÃO: {companyName}</p>
              </div>
            )}
          </div>

          <button
            onClick={onBackToHome}
            className="text-2xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Cancelar
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {/* STEP 1: AUTHENTICATION ENTRANCE */}
          {step === 'auth' && (
            <motion.div
              key="auth-step"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs"
            >
              <div className="text-center mb-8">
                <span className="text-3xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full border border-slate-200 tracking-wider font-mono">
                  CHAVE DE ACESSO EXIGIDA
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-3 font-sans">Validação do Colaborador</h2>
                <p className="text-slate-500 text-xs mt-1">Insira o CNPJ habilitado da sua empresa e suas informações de contato para liberar o checklist.</p>
              </div>

              {authError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700" id="auth-error-alert">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Não foi possível liberar acesso</p>
                    <p className="mt-0.5">{authError}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleValidateAccess} className="space-y-4" id="cnpj-validate-form">
                <div>
                  <label className="block text-2xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">CNPJ da Empresa</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="00.000.000/0001-00"
                      value={cnpj}
                      onChange={handleCnpjChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-slate-800 focus:bg-white font-mono"
                      id="input-client-cnpj"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Seu Nome Completo</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Digite seu nome completo para a entrevista"
                      value={respondentName}
                      onChange={(e) => setRespondentName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-slate-800 focus:bg-white"
                      id="input-client-name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">E-mail de Trabalho</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="exemplo@empresa.com.br"
                      value={respondentEmail}
                      onChange={(e) => setRespondentEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-slate-800 focus:bg-white"
                      id="input-client-email"
                    />
                  </div>
                </div>

                {/* LGPD Consent Checkbox */}
                <div className="pt-2 flex items-start gap-2.5" id="lgpd-consent-container">
                  <input
                    type="checkbox"
                    id="lgpd-consent-checkbox"
                    required
                    checked={lgpdAccepted}
                    onChange={(e) => setLgpdAccepted(e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="lgpd-consent-checkbox" className="text-3xs text-slate-500 leading-relaxed cursor-pointer select-none">
                    Estou ciente e dou meu consentimento para o processamento de meus dados pessoais (nome, e-mail e respostas) sob a <strong className="text-slate-700">LGPD (Lei Geral de Proteção de Dados - Lei nº 13.709/18)</strong>, com a finalidade exclusiva de Gestão de Saúde e Segurança do Trabalho (SST) da empresa, conforme estabelecido nos{' '}
                    <button
                      type="button"
                      onClick={() => setShowLgpdModal(true)}
                      className="text-blue-700 font-bold hover:underline inline cursor-pointer"
                    >
                      Termos de Consentimento e Privacidade
                    </button>.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isValidating || !lgpdAccepted}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-xs mt-4 transition-all"
                  id="btn-validate-submit"
                >
                  {isValidating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Verificando CNPJ...
                    </>
                  ) : (
                    <>
                      Validar e Acessar Formulário <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 2: CHECKLIST INTERACTIVE EXAM WIZARD */}
          {step === 'checklist' && (
            <motion.div
              key="checklist-step"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="space-y-6"
            >
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
                <label className="block text-2xs font-bold text-slate-600 mb-2 uppercase tracking-wide">
                  Área que está respondendo
                </label>
                <select
                  required
                  value={selectedArea}
                  onChange={(e) => handleSelectArea(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-slate-800"
                  id="input-client-area"
                >
                  <option value="">Selecione uma área</option>
                  {areas.map((area) => (
                    <option key={area} value={area}>
                      {area}{submittedAreas.some((submittedArea) => submittedArea.toLowerCase() === area.toLowerCase()) ? ' (já preenchida)' : ''}
                    </option>
                  ))}
                </select>
                {submittedAreas.length > 0 && (
                  <p className="mt-2 text-3xs text-amber-700">
                    Áreas marcadas como já preenchidas pedirão confirmação antes de substituir a resposta anterior.
                  </p>
                )}
              </div>

              {/* Progress Tracker */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
                <div className="flex justify-between items-center text-2xs font-bold text-slate-400 mb-3 font-mono">
                  <span>PROGRESSO DA AVALIAÇÃO</span>
                  <span className="text-blue-700 font-semibold">SEÇÃO {currentSectionIndex + 1} DE {sections.length}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full transition-all duration-300"
                    style={{ width: `${((currentSectionIndex + 1) / sections.length) * 100}%` }}
                  />
                </div>
                <h3 className="text-sm font-bold text-slate-800 mt-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                  {sections[currentSectionIndex].name}
                </h3>
              </div>

              {/* Questionnaire Form Items */}
              <div className="space-y-4" id="questions-list-wrapper">
                {isLoadingQuestions ? (
                  <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
                    <p className="text-xs">Carregando questionário de riscos psicossociais...</p>
                  </div>
                ) : currentQuestions.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-400 text-xs">
                    Nenhuma pergunta ativa cadastrada para esta seção. Clique em próxima para prosseguir.
                  </div>
                ) : (
                  currentQuestions.map((q) => {
                    const selectedVal = answers[q.id];

                    return (
                      <div 
                        key={q.id} 
                        className={`bg-white border rounded-2xl p-6 shadow-3xs transition-all ${selectedVal !== undefined ? 'border-blue-200 bg-blue-50/10' : 'border-slate-200'}`}
                      >
                        <p className="text-slate-800 font-medium text-xs sm:text-sm leading-relaxed mb-4 flex items-start gap-1">
                          <span>{q.text}</span>
                          <span className="text-red-500 font-bold" title="Campo obrigatório">*</span>
                        </p>

                        {/* CHOICE BOX OPTIONS */}
                        {q.type === 'scale' ? (
                          /* Scale 1-5 Choice Box */
                          <div className="grid grid-cols-5 gap-1.5 sm:gap-2.5">
                            {[
                              { label: 'Nunca', val: 1 },
                              { label: 'Raramente', val: 2 },
                              { label: 'Às vezes', val: 3 },
                              { label: 'Frequentemente', val: 4 },
                              { label: 'Sempre', val: 5 }
                            ].map((opt) => {
                              const isSelected = selectedVal === opt.val;
                              return (
                                <button
                                  key={opt.val}
                                  type="button"
                                  onClick={() => handleSelectAnswer(q.id, opt.val)}
                                  className={`py-3.5 px-0.5 rounded-xl text-center cursor-pointer border flex flex-col justify-center items-center transition-all ${isSelected ? 'bg-blue-600 text-white border-blue-600 shadow-xs scale-102 font-bold' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'}`}
                                >
                                  <span className="text-xs sm:text-sm font-bold block">{opt.val}</span>
                                  <span className={`text-[8px] sm:text-3xs uppercase tracking-tighter block mt-1.5 leading-none break-words max-w-full px-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                                    {opt.label}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          /* Yes/No (Boolean) Choice Box for section 10 */
                          <div className="grid grid-cols-2 gap-4">
                            {[
                              { label: 'Sim', val: 'Sim', color: 'hover:bg-red-50 hover:text-red-700 checked:bg-red-600' },
                              { label: 'Não', val: 'Não', color: 'hover:bg-blue-50 hover:text-blue-700 checked:bg-blue-600' }
                            ].map((opt) => {
                              const isSelected = selectedVal === opt.val;
                              return (
                                <button
                                  key={opt.val}
                                  type="button"
                                  onClick={() => handleSelectAnswer(q.id, opt.val)}
                                  className={`py-3 rounded-xl text-center cursor-pointer border font-bold text-xs flex items-center justify-center gap-2 transition-all ${isSelected ? (opt.val === 'Sim' ? 'bg-red-600 text-white border-red-600 shadow-xs' : 'bg-blue-600 text-white border-blue-600 shadow-xs') : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'}`}
                                >
                                  {opt.label}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
              
              {/* Mandatory fields alert notice */}
              {(() => {
                const unansweredCount = currentQuestions.filter(q => answers[q.id] === undefined).length;
                if (unansweredCount > 0) {
                  return (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3 text-xs text-amber-800" id="incomplete-section-alert">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        Existem <strong className="font-bold">{unansweredCount} {unansweredCount === 1 ? 'pergunta obrigatória pendente' : 'perguntas obrigatórias pendentes'}</strong> nesta seção. Por favor, responda a todas para poder avançar.
                      </span>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Wizard Control Action bar */}
              <div className="flex justify-between items-center pt-4" id="wizard-navigation-bar">
                <button
                  type="button"
                  onClick={handlePrevSection}
                  disabled={currentSectionIndex === 0}
                  className="py-2.5 px-4 bg-white hover:bg-slate-100 disabled:bg-slate-100 disabled:text-slate-300 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Seção Anterior
                </button>

                {currentSectionIndex < sections.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNextSection}
                    disabled={!isCurrentSectionComplete()}
                    className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:border-slate-200 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer shadow-xs border border-blue-600 transition-colors"
                  >
                    Próxima Seção <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitAssessment}
                    disabled={isSubmitting || !selectedArea || !isCurrentSectionComplete()}
                    className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:border-slate-200 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md border border-blue-600 transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Processando Nota...
                      </>
                    ) : (
                      <>
                        Finalizar e Enviar <CheckCircle className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 bg-white border-t border-slate-200 text-center text-3xs text-slate-400 font-mono">
        Sua participação é estritamente confidencial para fito de adequação de SST (SST Control Seg).
      </footer>

      {/* LGPD Consent Modal */}
      <AnimatePresence>
        {showLgpdModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="lgpd-modal-overlay">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLgpdModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-100 font-sans"
              id="lgpd-modal-content"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 flex items-start gap-3 bg-slate-50">
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg shrink-0 border border-emerald-100">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Termo de Consentimento e Privacidade</h3>
                  <p className="text-4xs text-slate-500 font-mono mt-0.5 tracking-wider uppercase">LGPD | LEI GERAL DE PROTEÇÃO DE DADOS (LEI 13.709/18)</p>
                </div>
              </div>

              {/* Scrollable body */}
              <div className="p-5 overflow-y-auto text-xs text-slate-600 space-y-4 leading-relaxed max-h-[50vh] scrollbar-thin">
                <p>
                  Bem-vindo à plataforma de avaliação de saúde ocupacional da <strong className="text-slate-800">Control Seg - Medicina e Segurança do Trabalho</strong>. 
                  Garantimos total confidencialidade, integridade e conformidade regulatória no tratamento de seus dados.
                </p>

                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-800 text-2xs uppercase tracking-wide">1. Finalidade do Tratamento</h4>
                  <p>
                    Seus dados pessoais (Nome e E-mail corporativo) e suas respostas ao checklist psicossocial são coletados estritamente para a realização de análises e diagnósticos de riscos ocupacionais, em conformidade com as exigências da <strong className="text-slate-800">NR-01 (Gerenciamento de Riscos Ocupacionais)</strong> e diretrizes globais da <strong className="text-slate-800">ISO 45003 (Gestão de Riscos Psicossociais no Trabalho)</strong>.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-800 text-2xs uppercase tracking-wide">2. Confidencialidade Absoluta (Anonimização de Relatórios)</h4>
                  <p>
                    Seus dados de identificação pessoal de contato <strong className="text-emerald-700">nunca serão exibidos ou repassados de forma individualizada para a empresa ou para terceiros</strong>. Os resultados, relatórios analíticos e indicadores finais apresentados à sua organização são gerados de forma <strong className="text-slate-800">estritamente consolidada e agregada</strong> (por setor ou por amostragem global). Sua identidade e respostas específicas permanecem 100% confidenciais e protegidas de qualquer tipo de exposição.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-800 text-2xs uppercase tracking-wide">3. Bases Legais aplicadas</h4>
                  <p>
                    O tratamento fundamenta-se nas seguintes permissões da LGPD:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-3xs text-slate-500">
                    <li><strong className="text-slate-700">Art. 7º, Inciso I:</strong> Mediante fornecimento de consentimento livre, informado e inequívoco pelo titular.</li>
                    <li><strong className="text-slate-700">Art. 7º, Inciso V:</strong> Cumprimento de obrigações legais e regulatórias vigentes sobre Segurança e Saúde no Trabalho (SST).</li>
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-800 text-2xs uppercase tracking-wide">4. Seus Direitos como Titular</h4>
                  <p>
                    Conforme o Artigo 18 da LGPD, você possui direito a: obter confirmação do tratamento, acessar seus dados, solicitar correção de informações incompletas ou desatualizadas, e revogar o consentimento a qualquer momento (com a consequente interrupção e descarte das respostas, caso o checklist ainda não tenha sido consolidado em relatório).
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-800 text-2xs uppercase tracking-wide">5. Segurança e Armazenamento</h4>
                  <p>
                    Todas as informações coletadas são transmitidas de maneira totalmente criptografada sob o protocolo HTTPS, sendo armazenadas em servidores de nuvem com altos níveis de segurança lógica e controle de acesso biométrico/multifatorial restrito à equipe técnica habilitada da Control Seg.
                  </p>
                </div>

                <p className="text-3xs text-slate-400 font-mono italic">
                  Dúvidas ou solicitações relacionadas à proteção de seus dados podem ser encaminhadas diretamente ao canal de DPO da Control Seg.
                </p>
              </div>

              {/* Action Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowLgpdModal(false)}
                  className="px-4 py-2 text-2xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLgpdAccepted(true);
                    setShowLgpdModal(false);
                  }}
                  className="px-4.5 py-2 text-2xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" /> Entendido e Aceitar Termos
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Draft Resume Modal */}
      <AnimatePresence>
        {showDraftPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="draft-resume-modal-overlay">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 p-6 font-sans"
              id="draft-resume-modal"
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-700 mb-4 border border-blue-200">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Preenchimento em Andamento!</h3>
                <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                  Identificamos que você já iniciou o preenchimento deste questionário anteriormente para a empresa <strong className="text-slate-700">{companyName}</strong>. Deseja retomar de onde parou?
                </p>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleDiscardDraft}
                  className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs cursor-pointer border border-slate-200 transition-colors"
                >
                  Iniciar Novo
                </button>
                <button
                  type="button"
                  onClick={handleLoadDraft}
                  className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs cursor-pointer shadow-sm transition-colors flex items-center justify-center gap-1"
                >
                  Continuar <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
