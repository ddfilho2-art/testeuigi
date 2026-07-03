import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, FileDown, Check, ArrowRight, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { CalculationResult } from '../types';

interface AssessmentResultProps {
  submissionData: {
    cnpj: string;
    company_name: string;
    respondent_name: string;
    respondent_email: string;
    result: CalculationResult;
    downloadToken?: string;
  };
  onBackToHome: () => void;
}

export default function AssessmentResult({ submissionData, onBackToHome }: AssessmentResultProps) {
  const { cnpj, company_name, respondent_name, result, downloadToken } = submissionData;
  const { total_score, classification, section_scores } = result;

  // Visual helper mapping based on risk level
  const getRiskVisuals = (level: string) => {
    switch (level) {
      case 'Baixo':
        return {
          color: 'text-emerald-700',
          bg: 'bg-emerald-50 border-emerald-200',
          badge: 'bg-emerald-600 text-white',
          desc: 'Nível ideal de bem-estar corporativo. As práticas organizacionais promovem um ambiente saudável com poucos estressores.',
          barColor: 'bg-emerald-500'
        };
      case 'Moderado':
        return {
          color: 'text-yellow-700',
          bg: 'bg-yellow-50 border-yellow-200',
          badge: 'bg-yellow-500 text-white',
          desc: 'Ambiente com estressores leves. É recomendado monitorar processos de trabalho e realizar pequenos ajustes ergonômicos.',
          barColor: 'bg-yellow-500'
        };
      case 'Médio':
        return {
          color: 'text-amber-700',
          bg: 'bg-amber-50 border-amber-200',
          badge: 'bg-amber-500 text-white',
          desc: 'Pontos de atenção identificados. Recomenda-se estruturar um plano de prevenção de riscos psicossociais junto ao time de SESMT.',
          barColor: 'bg-amber-500'
        };
      case 'Alto':
        return {
          color: 'text-orange-700',
          bg: 'bg-orange-50 border-orange-200',
          badge: 'bg-orange-500 text-white',
          desc: 'Nível de estresse elevado. Há risco significativo à saúde física e mental. Requer ações mitigadoras imediatas pela liderança.',
          barColor: 'bg-orange-500'
        };
      case 'Crítico':
        return {
          color: 'text-red-700',
          bg: 'bg-red-50 border-red-200',
          badge: 'bg-red-600 text-white',
          desc: 'Alerta vermelho de risco iminente. Excesso de carga de estresse físico e mental. Exige intervenção imediata para adequação à NR-01.',
          barColor: 'bg-red-500'
        };
      default:
        return {
          color: 'text-slate-700',
          bg: 'bg-slate-50 border-slate-200',
          badge: 'bg-slate-600 text-white',
          desc: 'Resultado calculado com base na média histórica.',
          barColor: 'bg-slate-500'
        };
    }
  };

  const visuals = getRiskVisuals(classification);

  const sectionNames: Record<string, string> = {
    '1': 'Demanda de Trabalho',
    '2': 'Controle e Autonomia',
    '3': 'Apoio da Liderança',
    '4': 'Relacionamento Interpessoal',
    '5': 'Assédio e Violência',
    '6': 'Reconhecimento e Recompensa',
    '7': 'Segurança no Emprego',
    '8': 'Equilíbrio Vida x Trabalho',
    '9': 'Comunicação Organizacional',
    '10': 'Sintomas de Estresse'
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-10 px-4" id="assessment-result-container">
      <div className="max-w-2xl mx-auto w-full space-y-8">
        
        {/* Success Card Header */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-xs"
          id="success-card-header"
        >
          <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-5 border border-blue-100 shadow-2xs">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <span className="text-3xs font-bold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
            Checklist Concluído com Sucesso
          </span>

          <h2 className="text-2xl font-bold text-slate-900 mt-4 font-sans">Obrigado, {respondent_name}!</h2>
          <p className="text-slate-500 text-xs mt-1.5 max-w-md mx-auto leading-relaxed">
            Suas respostas foram processadas e enviadas de forma segura. O cálculo foi processado na nuvem (Supabase DB Engine) e o relatório consolidado de SST está pronto.
          </p>

          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row justify-center gap-3 text-2xs font-mono text-slate-500">
            <span><strong>EMPRESA:</strong> {company_name}</span>
            <span className="hidden sm:inline">•</span>
            <span><strong>CNPJ:</strong> {cnpj}</span>
          </div>
        </motion.div>

        {/* Big Score Callout Bento */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`border rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center gap-6 ${visuals.bg}`}
          id="score-callout-panel"
        >
          {/* Circular Score Badge */}
          <div className="shrink-0 flex flex-col items-center justify-center w-28 h-28 bg-white border border-slate-200 rounded-full shadow-2xs relative">
            <span className="text-3xl font-extrabold text-slate-950 font-sans tracking-tight">{total_score}%</span>
            <span className="text-4xs uppercase tracking-wider text-slate-400 font-bold font-mono mt-0.5">Risco Geral</span>
          </div>

          <div className="text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <span className="text-2xs font-mono text-slate-400 uppercase tracking-wider font-bold">GRAU DE RISCO OBTIDO:</span>
              <span className={`px-2.5 py-0.5 rounded text-2xs font-bold ${visuals.badge}`}>
                {classification.toUpperCase()}
              </span>
            </div>
            <p className="text-slate-700 text-xs leading-relaxed">
              {visuals.desc}
            </p>
          </div>
        </motion.div>

        {/* Breakdown Dimensions Graphic */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs"
          id="dimensions-breakdown-panel"
        >
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            Risco de Estresse por Dimensão Avaliada
          </h3>

          <div className="space-y-4">
            {Object.keys(section_scores).map((secId) => {
              const score = section_scores[secId];
              const name = sectionNames[secId] || `Seção ${secId}`;
              const barVisuals = getRiskVisuals(
                score.percentage <= 20 ? 'Baixo' :
                score.percentage <= 40 ? 'Moderado' :
                score.percentage <= 60 ? 'Médio' :
                score.percentage <= 80 ? 'Alto' : 'Crítico'
              );

              return (
                <div key={secId} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700">{name}</span>
                    <span className="font-mono text-slate-500 font-bold">{score.percentage}%</span>
                  </div>
                  {/* Custom progress bar */}
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200/50">
                    <div 
                      className={`h-full transition-all duration-500 ${barVisuals.barColor}`}
                      style={{ width: `${score.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-3xs text-slate-400 font-sans">
            <AlertCircle className="w-4 h-4 text-slate-300" />
            <span>As escalas invertidas (como Controle e Autonomia) já foram devidamente ajustadas pelo motor de cálculos.</span>
          </div>
        </motion.div>

        {/* Buttons Action Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-2"
          id="result-buttons-bar"
        >
          {/* Download Consolidated PDF Button */}
          <a
            href={`/api/generate-pdf?cnpj=${cnpj}${downloadToken ? `&download_token=${encodeURIComponent(downloadToken)}` : ''}`}
            className="w-full sm:w-auto py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all scale-102"
            id="btn-download-result-pdf"
          >
            <FileDown className="w-4 h-4 text-blue-100" /> Baixar PDF Consolidado de SST
          </a>

          <button
            onClick={onBackToHome}
            className="w-full sm:w-auto py-3.5 px-6 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 border border-slate-200 cursor-pointer shadow-xs transition-all"
            id="btn-return-home"
          >
            Voltar ao Início <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

      </div>
    </div>
  );
}
