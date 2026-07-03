import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ClientPortal from './components/ClientPortal';
import AssessmentResult from './components/AssessmentResult';

type Role = 'home' | 'client' | 'admin-login' | 'admin-dashboard';

export default function App() {
  const [role, setRole] = useState<Role>('home');
  const [adminToken, setAdminToken] = useState<string | null>(null);
  
  // Stores submission result to render the final scoreboard
  const [submissionData, setSubmissionData] = useState<any | null>(null);

  const handleSelectRole = (selectedRole: 'client' | 'admin') => {
    if (selectedRole === 'client') {
      setSubmissionData(null);
      setRole('client');
    } else {
      if (adminToken) {
        setRole('admin-dashboard');
      } else {
        setRole('admin-login');
      }
    }
  };

  const handleAdminLoginSuccess = (token: string) => {
    setAdminToken(token);
    setRole('admin-dashboard');
  };

  const handleLogout = () => {
    setAdminToken(null);
    setRole('home');
  };

  const handleSubmissionSuccess = (data: any) => {
    setSubmissionData({
      cnpj: data.submission.cnpj,
      company_name: data.submission.company_name,
      respondent_name: data.submission.respondent_name,
      respondent_email: data.submission.respondent_email,
      result: data.result,
      downloadToken: data.downloadToken
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {role === 'home' && (
        <LandingPage onSelectRole={handleSelectRole} />
      )}

      {role === 'admin-login' && (
        <AdminLogin 
          onBack={() => setRole('home')} 
          onLoginSuccess={handleAdminLoginSuccess} 
        />
      )}

      {role === 'admin-dashboard' && adminToken && (
        <AdminDashboard 
          token={adminToken} 
          onLogout={handleLogout} 
        />
      )}

      {role === 'client' && (
        <>
          {submissionData ? (
            <AssessmentResult 
              submissionData={submissionData} 
              onBackToHome={() => setRole('home')} 
            />
          ) : (
            <ClientPortal 
              onBackToHome={() => setRole('home')} 
              onSubmissionSuccess={handleSubmissionSuccess} 
            />
          )}
        </>
      )}
    </div>
  );
}
