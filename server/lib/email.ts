import type { Submission } from '../../src/types';
import nodemailer from 'nodemailer';
import { emailConfig } from '../state';

const SECTION_NAMES: Record<string, string> = {
  '1': 'Demanda de Trabalho (Karasek/HSE)',
  '2': 'Controle do Trabalho',
  '3': 'Suporte Social',
  '4': 'Relações de Trabalho',
  '5': 'Reconhecimento e Recompensa',
  '6': 'Justiça Organizacional',
  '7': 'Equilíbrio Trabalho-Família',
  '8': 'Segurança e Saúde Ocupacional',
  '9': 'Comunicação Organizacional',
  '10': 'Sintomas de Estresse Ocupacional'
};

const CLASSIFICATION_COLORS: Record<string, string> = {
  'Baixo': '#15803d',
  'Moderado': '#4f46e5',
  'Médio': '#b45309',
  'Alto': '#ea580c',
  'Crítico': '#b91c1c'
};

export async function sendSubmissionNotification(submission: Submission, result: any) {
  if (!emailConfig.enabled) return;

  if (!emailConfig.smtpHost || !emailConfig.smtpUser || !emailConfig.smtpPassword) {
    console.warn('SMTP credentials are missing. Skipping notification email.');
    return;
  }

  const scoreRowsHtml = Object.keys(result.section_scores || {})
    .map(secId => {
      const secData = result.section_scores[secId];
      const name = SECTION_NAMES[secId] || `Seção ${secId}`;
      const pct = secData?.percentage ?? 0;
      let color = '#15803d';
      if (pct > 60) color = '#b91c1c';
      else if (pct > 40) color = '#b45309';

      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #334155;">${name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: bold; text-align: right; color: ${color};">${pct}%</td>
        </tr>
      `;
    })
    .join('');

  const classColor = CLASSIFICATION_COLORS[result.classification] || '#1e293b';

  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
      <div style="text-align: center; margin-bottom: 25px; border-bottom: 3px solid #0D4E35; padding-bottom: 15px;">
        <h1 style="color: #0D4E35; font-size: 24px; margin: 0; font-weight: 800; letter-spacing: -0.5px;">Control Med</h1>
        <p style="color: #64748b; font-size: 12px; margin: 5px 0 0 0; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Nova Avaliação Psicossocial Recebida</p>
      </div>

      <p style="font-size: 14px; line-height: 1.6; color: #334155;">
        Uma nova resposta de questionário de avaliação de riscos psicossociais (SST) foi enviada com sucesso no portal da <strong>Control Med</strong>. Segue o resumo do resultado:
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
            <td style="padding: 4px 0; color: #1e293b;">${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin: 25px 0; padding: 15px; border: 1px solid #cbd5e1; border-radius: 10px; background-color: #fdfdfd;">
        <span style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; display: block; margin-bottom: 5px;">Pontuação Global (Risco SST)</span>
        <span style="font-size: 32px; font-weight: 800; color: ${classColor}; display: block; line-height: 1.2;">${result.total_score}%</span>
        <span style="display: inline-block; margin-top: 10px; padding: 5px 15px; background-color: ${classColor}; color: #ffffff; font-weight: bold; font-size: 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">
          Risco: ${result.classification}
        </span>
      </div>

      <h3 style="color: #1e293b; font-size: 15px; margin-bottom: 10px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">Análise Detalhada por Dimensão</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
        <thead>
          <tr style="background-color: #f1f5f9;">
            <th style="padding: 10px; text-align: left; font-size: 12px; color: #475569; border-bottom: 2px solid #cbd5e1;">Dimensão / Categoria</th>
            <th style="padding: 10px; text-align: right; font-size: 12px; color: #475569; border-bottom: 2px solid #cbd5e1; width: 25%;">Índice de Risco</th>
          </tr>
        </thead>
        <tbody>
          ${scoreRowsHtml}
        </tbody>
      </table>

      <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
        O relatório PDF consolidado de SST e os gráficos detalhados já estão disponíveis para consulta e download no seu painel administrativo.
      </p>

      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0 15px 0;">
      <p style="font-size: 11px; text-align: center; color: #94a3b8; font-family: monospace; margin: 0;">
        E-mail automático emitido pela plataforma Control Med SST. Por favor, não responda a esta mensagem.
      </p>
    </div>
  `;

  try {
    const transporter = nodemailer.createTransport({
      host: emailConfig.smtpHost,
      port: Number(emailConfig.smtpPort),
      secure: emailConfig.smtpSecure,
      auth: {
        user: emailConfig.smtpUser,
        pass: emailConfig.smtpPassword,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    const mailOptions = {
      from: `"SST Control Med" <${emailConfig.smtpUser}>`,
      to: emailConfig.recipientEmail,
      subject: `[ALERTA SST] Nova Avaliação - ${submission.company_name} (${result.classification})`,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log('Successfully sent submission notification email.');
  } catch (err) {
    console.error('Error sending submission notification email:', err);
  }
}

export function buildTestEmailHtml(smtpHost: string, smtpPort: string|number, smtpUser: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #0D4E35; border-bottom: 2px solid #0D4E35; padding-bottom: 10px; margin-top: 0;">Control Med - SST</h2>
      <p>Olá Administrador,</p>
      <p>Este é um <strong>e-mail de teste de conexão</strong> enviado do seu painel administrativo da Control Med.</p>
      <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 15px; margin: 20px 0;">
        <p style="margin: 0 0 8px 0;"><strong>Status da Conexão:</strong> Sucesso! <span style="color: #15803d; font-weight: bold;">✔ Ativo</span></p>
        <p style="margin: 0 0 8px 0;"><strong>Servidor SMTP:</strong> ${smtpHost}</p>
        <p style="margin: 0 0 8px 0;"><strong>Porta:</strong> ${smtpPort}</p>
        <p style="margin: 0;"><strong>Usuário:</strong> ${smtpUser}</p>
      </div>
      <p>A partir de agora, o envio de notificações de novas respostas e relatórios psicossociais está pronto para funcionar se ativado.</p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0 15px 0;">
      <p style="font-size: 11px; color: #94a3b8; font-family: monospace;">E-mail gerado automaticamente pelo portal de avaliações Control Med.</p>
    </div>
  `;
}
