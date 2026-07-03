import fs from 'fs';
import path from 'path';
import { emailConfig } from './state';

const EMAIL_CONFIG_FILE = process.env.VERCEL
  ? '/tmp/email_config.json'
  : path.join(process.cwd(), 'email_config.json');

export { EMAIL_CONFIG_FILE };

export function loadEmailConfig() {
  try {
    if (fs.existsSync(EMAIL_CONFIG_FILE)) {
      const data = fs.readFileSync(EMAIL_CONFIG_FILE, 'utf-8');
      const loaded = JSON.parse(data);
      Object.assign(emailConfig, { ...emailConfig, ...loaded });
      console.log('Loaded persistent email configuration.');
    }
  } catch (err) {
    console.error('Error loading email_config.json:', err);
  }
}

export function saveEmailConfig() {
  try {
    fs.writeFileSync(EMAIL_CONFIG_FILE, JSON.stringify(emailConfig, null, 2), 'utf-8');
    console.log('Saved persistent email configuration.');
  } catch (err) {
    console.error('Error saving email_config.json:', err);
  }
}
