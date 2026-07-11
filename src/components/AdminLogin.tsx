import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Lock, Mail, AlertCircle, RefreshCw } from 'lucide-react';
import { CompanyLogo } from './CompanyLogo';

interface AdminLoginProps {
  onBack: () => void;
  onLoginSuccess: (token: string) => void;
}

export default function AdminLogin({ onBack, onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onLoginSuccess(data.token);
      } else {
        setError(data.error || 'Credenciais inválidas. Verifique o e-mail e senha.');
      }
    } catch (err) {
      console.error('Error logging in:', err);
      setError('Erro de conexão com o servidor. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4" id="admin-login-container">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm w-full max-w-md relative"
      >
        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute left-6 top-6 text-slate-500 hover:text-slate-800 flex items-center gap-1.5 text-xs font-mono group"
          id="btn-back-login"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Voltar
        </button>

        <div className="text-center mt-6 mb-8 flex flex-col items-center">
          <CompanyLogo size="md" className="mb-4" />
          <h2 className="text-xl font-bold text-slate-900 font-sans">Acesso Administrativo</h2>
          <p className="text-slate-500 text-xs mt-1">Insira as credenciais para acessar o painel Control Seg.</p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs text-red-700" id="login-error-alert">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Erro no login</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" id="form-admin-login">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 tracking-wide uppercase">E-mail Corporativo</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@controlseg.com.br"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:border-slate-800 focus:bg-white transition-all font-sans"
                id="input-login-email"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 tracking-wide uppercase">Senha de Acesso</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:border-slate-800 focus:bg-white transition-all font-sans"
                id="input-login-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all mt-6 shadow-xs"
            id="btn-login-submit"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Verificando...
              </>
            ) : (
              'Entrar no Painel SST'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
