import express from 'express';
import nodemailer from 'nodemailer';
import { getSupabase } from '../lib/supabase';
import { emailConfig } from '../state';
import { authenticateAdmin } from '../lib/auth';
import { saveEmailConfig } from '../config';
import { buildTestEmailHtml } from '../lib/email';

const router = express.Router();

// Get admin profile details
router.get('/admin/profile', authenticateAdmin, (_req, res) => {
  return res.json({
    name: emailConfig.adminName || 'Gestor Control Seg',
    email: emailConfig.adminEmail || 'admin@controlseg.com.br',
    phone: emailConfig.adminPhone || '',
    role: emailConfig.adminRole || 'Coordenador de SST',
    avatarUrl: emailConfig.adminAvatarUrl || ''
  });
});

// Update admin profile details
router.put('/admin/profile', authenticateAdmin, (req, res) => {
  const { name, email, phone, role, password, avatarUrl } = req.body;

  if (email && !email.includes('@')) {
    return res.status(400).json({ error: 'Formato de e-mail inválido.' });
  }

  if (name !== undefined) emailConfig.adminName = name;
  if (email !== undefined) {
    const oldEmail = emailConfig.adminEmail;
    emailConfig.adminEmail = email;
    if (emailConfig.recipientEmail === oldEmail) {
      emailConfig.recipientEmail = email;
    }
  }
  if (phone !== undefined) emailConfig.adminPhone = phone;
  if (role !== undefined) emailConfig.adminRole = role;
  if (password !== undefined && password.trim() !== '') {
    emailConfig.adminPassword = password;
  }
  if (avatarUrl !== undefined) emailConfig.adminAvatarUrl = avatarUrl;

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

// Upload Avatar to Supabase Storage
router.post('/admin/profile/avatar', authenticateAdmin, async (req, res) => {
  const { fileBase64, fileName, mimeType } = req.body;

  if (!fileBase64 || !fileName || !mimeType) {
    return res.status(400).json({ error: 'Dados do arquivo incompletos.' });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase não está configurado. Não é possível fazer upload.' });
  }

  try {
    const buffer = Buffer.from(fileBase64, 'base64');

    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(`admin/${Date.now()}_${fileName}`, buffer, {
        contentType: mimeType,
        upsert: true
      });

    if (error) {
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(data.path);

    emailConfig.adminAvatarUrl = publicUrl;
    saveEmailConfig();

    return res.json({ success: true, avatarUrl: publicUrl });
  } catch (err: any) {
    console.error('Error uploading avatar:', err);
    return res.status(500).json({ error: err.message || 'Erro ao enviar a imagem para o Supabase.' });
  }
});

// Get SRE Metrics from Supabase
router.get('/admin/sre/metrics', authenticateAdmin, async (_req, res) => {
  const supabase = getSupabase();
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase não está configurado.' });
  }

  const startTime = Date.now();
  try {
    await supabase.from('companies').select('id').limit(1);
    const latencyMs = Date.now() - startTime;

    const { count: companiesCount } = await supabase.from('companies').select('*', { count: 'exact', head: true });
    const { count: questionsCount } = await supabase.from('questions').select('*', { count: 'exact', head: true });
    const { count: responsesCount } = await supabase.from('responses').select('*', { count: 'exact', head: true });

    const estimatedSizeKB = ((responsesCount || 0) * 2) + ((companiesCount || 0) * 0.5) + ((questionsCount || 0) * 0.5);
    const estimatedSizeStr = estimatedSizeKB > 1024 ? `${(estimatedSizeKB / 1024).toFixed(2)} MB` : `${Math.ceil(estimatedSizeKB)} KB`;

    return res.json({
      success: true,
      metrics: {
        latencyMs,
        companies: companiesCount || 0,
        questions: questionsCount || 0,
        responses: responsesCount || 0,
        estimatedSize: estimatedSizeStr,
        status: latencyMs < 200 ? 'Saudável' : (latencyMs < 500 ? 'Atenção' : 'Degradado'),
        lastChecked: new Date().toISOString()
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Falha ao recuperar métricas: ' + (err.message || String(err)) });
  }
});

// Get email configuration
router.get('/admin/email-config', authenticateAdmin, (_req, res) => {
  // Never expose secrets over the wire — return masked placeholders instead.
  const masked = { ...emailConfig };
  if (masked.smtpPassword) masked.smtpPassword = '********';
  if (masked.adminPassword) masked.adminPassword = '********';
  return res.json(masked);
});

// Update email configuration
router.post('/admin/email-config', authenticateAdmin, (req, res) => {
  const { enabled, adminEmail, recipientEmail, smtpHost, smtpPort, smtpUser, smtpPassword, smtpSecure } = req.body;

  if (adminEmail && !adminEmail.includes('@')) {
    return res.status(400).json({ error: 'E-mail do administrador inválido.' });
  }
  if (recipientEmail && !recipientEmail.includes('@')) {
    return res.status(400).json({ error: 'E-mail de destino inválido.' });
  }

  emailConfig.enabled = enabled ?? emailConfig.enabled;
  emailConfig.adminEmail = adminEmail || emailConfig.adminEmail;
  emailConfig.recipientEmail = recipientEmail || emailConfig.recipientEmail;
  emailConfig.smtpHost = smtpHost !== undefined ? smtpHost : emailConfig.smtpHost;
  emailConfig.smtpPort = smtpPort !== undefined ? Number(smtpPort) : emailConfig.smtpPort;
  emailConfig.smtpUser = smtpUser !== undefined ? smtpUser : emailConfig.smtpUser;
  // Preserve existing secret when the client sends the masked placeholder back.
  if (smtpPassword !== undefined && smtpPassword !== '********') {
    emailConfig.smtpPassword = smtpPassword;
  }
  emailConfig.smtpSecure = smtpSecure !== undefined ? smtpSecure : emailConfig.smtpSecure;

  saveEmailConfig();
  return res.json({ success: true, config: emailConfig });
});

// Send test email
router.post('/admin/email-config/test', authenticateAdmin, async (req, res) => {
  const { recipientEmail, smtpHost, smtpPort, smtpUser, smtpPassword, smtpSecure } = req.body;

  if (!recipientEmail || !smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
    return res.status(400).json({ error: 'Todos os campos de teste SMTP e destinatário são obrigatórios.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort),
      secure: smtpSecure === true || smtpSecure === 'true',
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    const mailOptions = {
      from: `"SST Control Med" <${smtpUser}>`,
      to: recipientEmail,
      subject: 'Teste de Configuração SMTP - SST Control Med',
      html: buildTestEmailHtml(smtpHost, smtpPort, smtpUser),
    };

    await transporter.sendMail(mailOptions);
    return res.json({ success: true, message: 'E-mail de teste enviado com sucesso!' });
  } catch (err: any) {
    console.error('Error sending test SMTP email:', err);
    return res.status(500).json({ error: `Falha no envio de teste: ${err.message || err}` });
  }
});

export default router;
