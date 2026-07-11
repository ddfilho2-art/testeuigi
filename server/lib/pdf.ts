import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import type { Submission } from '../../src/types';
import { cleanCNPJ } from './cnpj';

const SECTION_NAMES: Record<string, string> = {
  '1': '1. Demanda de Trabalho',
  '2': '2. Controle e Autonomia',
  '3': '3. Apoio da Liderança',
  '4': '4. Relacionamento Interpessoal',
  '5': '5. Assédio Moral e Violência',
  '6': '6. Reconhecimento e Recompensa',
  '7': '7. Segurança no Emprego',
  '8': '8. Equilíbrio Trabalho x Vida',
  '9': '9. Comunicação Organizacional',
  '10': '10. Sintomas de Estresse'
};

export async function generatePdfBuffer(submission: Submission): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.275, 841.89]); // A4 paper size in points
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const primaryGreen = rgb(0.05, 0.31, 0.21);
  const textGray = rgb(0.2, 0.2, 0.2);
  const textLightGray = rgb(0.4, 0.4, 0.4);

  // 1. HEADER LOGO & BRANDING
  page.drawRectangle({
    x: 30,
    y: height - 100,
    width: width - 60,
    height: 80,
    color: rgb(0.96, 0.98, 0.96),
    borderColor: primaryGreen,
    borderWidth: 1.5,
  });

  page.drawText('CONTROL MED', { x: 50, y: height - 60, size: 24, font: fontBold, color: primaryGreen });
  page.drawText('SEGURANÇA DO TRABALHO | SAÚDE | MEIO AMBIENTE', { x: 50, y: height - 80, size: 10, font: font, color: textLightGray });

  // 2. REPORT TITLE
  page.drawText('RELATÓRIO CONSOLIDADO DE RISCOS PSICOSSOCIAIS', {
    x: 30,
    y: height - 140,
    size: 14,
    font: fontBold,
    color: primaryGreen,
  });

  // 3. COMPANY & RESPONDENT INFO
  let yPos = height - 170;
  page.drawRectangle({
    x: 30,
    y: yPos - 80,
    width: width - 60,
    height: 75,
    color: rgb(0.98, 0.98, 0.98),
    borderColor: rgb(0.9, 0.9, 0.9),
    borderWidth: 1,
  });

  const drawMetaText = (label: string, value: string, x: number, y: number) => {
    page.drawText(`${label}:`, { x, y, size: 9, font: fontBold, color: textGray });
    page.drawText(value, { x: x + fontBold.widthOfTextAtSize(`${label}: `, 9), y, size: 9, font: font, color: textGray });
  };

  drawMetaText('Empresa', submission.company_name, 45, yPos - 20);
  drawMetaText('CNPJ', submission.cnpj, 350, yPos - 20);
  drawMetaText('Área', submission.area || 'Geral', 45, yPos - 40);
  drawMetaText('Colaborador', submission.respondent_name, 350, yPos - 40);
  drawMetaText('E-mail', submission.respondent_email, 45, yPos - 60);
  drawMetaText('Período de Início', new Date(submission.start_time).toLocaleString('pt-BR'), 350, yPos - 60);

  // 4. SCORE BAR & CLASSIFICATION CALLOUT
  yPos = yPos - 100;
  page.drawText('RESULTADO DA CLASSIFICAÇÃO DE RISCO', {
    x: 30,
    y: yPos,
    size: 11,
    font: fontBold,
    color: primaryGreen,
  });

  let classColor = rgb(0.18, 0.54, 0.34);
  let classDesc = 'O ambiente apresenta baixíssimo nível de estressores psicossociais. Manter boas práticas.';

  if (submission.classification === 'Moderado') {
    classColor = rgb(0.8, 0.6, 0.1);
    classDesc = 'Nível moderado de estressores. Recomenda-se acompanhamento e melhoria de processos.';
  } else if (submission.classification === 'Médio') {
    classColor = rgb(0.9, 0.5, 0.1);
    classDesc = 'Estressores medianos identificados. Desenvolver plano de prevenção de riscos psicossociais.';
  } else if (submission.classification === 'Alto') {
    classColor = rgb(0.9, 0.2, 0.1);
    classDesc = 'Nível elevado de risco. Requer intervenção organizacional imediata da liderança.';
  } else if (submission.classification === 'Crítico') {
    classColor = rgb(0.7, 0.1, 0.1);
    classDesc = 'ALERTA MÁXIMO. Risco extremamente alto à integridade psicossocial dos trabalhadores.';
  }

  page.drawRectangle({
    x: 30,
    y: yPos - 60,
    width: width - 60,
    height: 50,
    color: rgb(0.99, 0.96, 0.96),
    borderColor: classColor,
    borderWidth: 2,
  });

  page.drawText(`GRAU DE RISCO OBTIDO: ${submission.total_score}% - ${(submission.classification || '').toUpperCase()}`, {
    x: 45,
    y: yPos - 25,
    size: 12,
    font: fontBold,
    color: classColor,
  });

  page.drawText(classDesc, {
    x: 45,
    y: yPos - 45,
    size: 9,
    font: font,
    color: textGray,
  });

  // 5. SECTION BREAKDOWN TABLE
  yPos = yPos - 95;
  page.drawText('DETALHAMENTO DE RISCO POR DIMENSÕES / SEÇÕES', {
    x: 30,
    y: yPos,
    size: 11,
    font: fontBold,
    color: primaryGreen,
  });

  yPos = yPos - 30;
  page.drawRectangle({ x: 30, y: yPos, width: width - 60, height: 20, color: primaryGreen });
  page.drawText('Dimensão / Seção de Avaliação', { x: 40, y: yPos + 6, size: 9, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('Risco (%)', { x: 420, y: yPos + 6, size: 9, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('Situação', { x: 490, y: yPos + 6, size: 9, font: fontBold, color: rgb(1, 1, 1) });

  if (submission.section_scores) {
    Object.keys(submission.section_scores).forEach((secKey, index) => {
      const score = submission.section_scores![secKey];
      yPos = yPos - 22;

      page.drawRectangle({
        x: 30,
        y: yPos,
        width: width - 60,
        height: 22,
        color: index % 2 === 0 ? rgb(0.97, 0.97, 0.97) : rgb(1, 1, 1),
        borderColor: rgb(0.9, 0.9, 0.9),
        borderWidth: 0.5
      });

      const name = SECTION_NAMES[secKey] || `Dimensão ${secKey}`;
      page.drawText(name, { x: 40, y: yPos + 7, size: 9, font: font, color: textGray });
      page.drawText(`${score.percentage}%`, { x: 420, y: yPos + 7, size: 9, font: fontBold, color: textGray });

      let sitText = 'Baixo';
      let sitColor = rgb(0.18, 0.54, 0.34);
      if (score.percentage > 80) {
        sitText = 'Crítico';
        sitColor = rgb(0.7, 0.1, 0.1);
      } else if (score.percentage > 60) {
        sitText = 'Alto';
        sitColor = rgb(0.9, 0.2, 0.1);
      } else if (score.percentage > 40) {
        sitText = 'Médio';
        sitColor = rgb(0.9, 0.5, 0.1);
      } else if (score.percentage > 20) {
        sitText = 'Moderado';
        sitColor = rgb(0.8, 0.6, 0.1);
      }

      page.drawText(sitText, { x: 490, y: yPos + 7, size: 9, font: fontBold, color: sitColor });
    });
  }

  // 6. FOOTER
  yPos = yPos - 50;
  page.drawText('Documento assinado digitalmente e gerado automaticamente pelo sistema de SST da Control Med.', {
    x: 30,
    y: yPos,
    size: 8,
    font: font,
    color: textLightGray,
  });
  page.drawText(`Data de emissão do relatório: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`, {
    x: 30,
    y: yPos - 12,
    size: 8,
    font: font,
    color: textLightGray,
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

export { cleanCNPJ };
