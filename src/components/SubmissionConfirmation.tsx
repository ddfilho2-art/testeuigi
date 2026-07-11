import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { CompanyLogo } from './CompanyLogo';

interface SubmissionConfirmationProps {
  respondentName: string;
  companyName: string;
  area: string;
  replaced?: boolean;
  onBackToHome: () => void;
}

export default function SubmissionConfirmation({
  respondentName,
  companyName,
  area,
  replaced,
  onBackToHome,
}: SubmissionConfirmationProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-10 px-4">
      <main className="flex-1 flex items-center justify-center">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm w-full max-w-lg text-center">
          <CompanyLogo size="md" className="mx-auto mb-6" />
          <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Formulário enviado com sucesso</h1>
          <p className="text-sm text-slate-600 mt-3 leading-relaxed">
            Obrigado, {respondentName}. Sua resposta da área <strong>{area}</strong> para a empresa <strong>{companyName}</strong> foi registrada.
          </p>
          {replaced && (
            <p className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
              A resposta anterior desta área foi substituída por este preenchimento.
            </p>
          )}
          <p className="text-xs text-slate-500 mt-4 leading-relaxed">
            O relatório e os resultados ficam disponíveis exclusivamente para o administrador responsável.
          </p>
          <button
            onClick={onBackToHome}
            className="mt-7 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2"
          >
            Voltar ao início <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
}
