import React from 'react';
import { motion } from 'motion/react';
import { Shield, FileText, Lock, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { CompanyLogo } from './CompanyLogo';

interface LandingPageProps {
  onSelectRole: (role: 'client' | 'admin') => void;
}

export default function LandingPage({ onSelectRole }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between" id="landing-container">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-5 px-6 shadow-xs" id="landing-header">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <CompanyLogo size="md" />
          </div>
          <span className="text-xs bg-slate-100 text-slate-600 font-mono px-3 py-1.5 rounded-full border border-slate-200">
            v1.2.0 | NR-01 & MTE Habilitado
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 flex flex-col justify-center items-center" id="landing-main">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-blue-700 bg-blue-50 text-xs font-semibold px-4 py-1.5 rounded-full border border-blue-100 inline-block mb-4">
            Avaliação de Riscos Psicossociais
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4 font-sans max-w-2xl">
            Checklist de Saúde Mental e Psicossocial Ocupacional
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto leading-relaxed text-sm sm:text-base">
            Plataforma homologada conforme a <strong className="text-slate-800">Portaria MTE nº 1.419/2024</strong> e as diretrizes da <strong className="text-slate-800">ISO 45003</strong> e do <strong className="text-slate-800">Modelo Karasek</strong>.
          </p>
        </motion.div>

        {/* Action Options */}
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-3xl mb-12" id="landing-roles-grid">
          {/* Client Card */}
          <motion.div
            whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
            transition={{ duration: 0.2 }}
            onClick={() => onSelectRole('client')}
            className="bg-white border-2 border-slate-200 hover:border-blue-500 rounded-2xl p-8 cursor-pointer flex flex-col justify-between shadow-xs transition-colors group"
            id="role-card-client"
          >
            <div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Preencher Formulário</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Acesse o questionário de riscos psicossociais utilizando a chave de acesso (CNPJ) cadastrada e habilitada pela Control Seg.
              </p>
            </div>
            <div className="flex items-center text-blue-700 font-semibold text-sm gap-1 group-hover:translate-x-1 transition-transform">
              Iniciar preenchimento <ChevronRight className="w-4 h-4" />
            </div>
          </motion.div>

          {/* Admin Card */}
          <motion.div
            whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
            transition={{ duration: 0.2 }}
            onClick={() => onSelectRole('admin')}
            className="bg-white border-2 border-slate-200 hover:border-slate-800 rounded-2xl p-8 cursor-pointer flex flex-col justify-between shadow-xs transition-colors group"
            id="role-card-admin"
          >
            <div>
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700 mb-6 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Área do Administrador</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Faça o login corporativo para gerenciar o cadastro de CNPJs, datas limites, editar as questões do checklist e exportar relatórios Excel/PDF.
              </p>
            </div>
            <div className="flex items-center text-slate-800 font-semibold text-sm gap-1 group-hover:translate-x-1 transition-transform">
              Acessar Painel SST <ChevronRight className="w-4 h-4" />
            </div>
          </motion.div>
        </div>

        {/* Quick Highlights Info */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 w-full max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-4" id="landing-benefits">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-800">Cálculo no Banco</h4>
              <p className="text-xs text-slate-500 mt-0.5">Mecanismo SQL-RPC seguro.</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-800">Relatório Excel & PDF</h4>
              <p className="text-xs text-slate-500 mt-0.5">Exportação rápida e completa.</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-800">Gestão de Questões</h4>
              <p className="text-xs text-slate-500 mt-0.5">Exclua ou insira novas perguntas.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-6 text-center text-xs text-slate-500 font-mono" id="landing-footer">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Control Seg Medicina e Segurança do Trabalho. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <a href="#compliance" className="hover:underline">Portaria MTE 1.419</a>
            <span>•</span>
            <a href="#privacy" className="hover:underline">Segurança de Dados</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
