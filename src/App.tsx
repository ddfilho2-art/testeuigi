import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ClientPortal from './components/ClientPortal';
import SubmissionConfirmation from './components/SubmissionConfirmation';

type Role = 'home' | 'client' | 'admin-login' | 'admin-dashboard';

export default function App() {
  const [role, setRole] = useState<Role>('home');
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [submissionData, setSubmissionData] = useState<any | null>(null);

  const handleSelectRole = (selectedRole: 'client' | 'admin') => {
    if (selectedRole === 'client') {
      setSubmissionData(null);
      setRole('client');
    } else {
      if (adminToken) setRole('admin-dashboard');
      else setRole('admin-login');
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
      respondent_name: data.respondent_name,
      company_name: data.company_name,
      area: data.area,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {role === 'home' && <LandingPage onSelectRole={handleSelectRole} />}
      {role === 'admin-login' && (
        <AdminLogin onBack={() => setRole('home')} onLoginSuccess={handleAdminLoginSuccess} />
      )}
      {role === 'admin-dashboard' && adminToken && (
        <AdminDashboard token={adminToken} onLogout={handleLogout} />
      )}
      {role === 'client' && (
        submissionData ? (
          <SubmissionConfirmation
            respondentName={submissionData.respondent_name}
            companyName={submissionData.company_name}
            area={submissionData.area}
            onBackToHome={() => {
              setSubmissionData(null);
              setRole('home');
            }}
          />
        ) : (
          <ClientPortal onBackToHome={() => setRole('home')} onSubmissionSuccess={handleSubmissionSuccess} />
        )
      )}
    </div>
  );
}
