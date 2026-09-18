const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');

router.post('/download', (req, res) => {
  const { results, stats } = req.body;

  if (!results || !stats) {
    return res.status(400).json({ error: 'No data provided' });
  }

  // Health Score
  const healthScore = Math.round(
    (stats.valid / stats.total) * 100 -
    (stats.disposable / stats.total) * 20 -
    (stats.invalid / stats.total) * 10
  );

  // Create PDF
  const doc = new PDFDocument({ margin: 50 });

  // Set response headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=mailsense-report.pdf');

  doc.pipe(res);

  // ── HEADER ──
  doc
    .fillColor('#4f46e5')
    .fontSize(28)
    .font('Helvetica-Bold')
    .text('MailSense', 50, 50);

  doc
    .fillColor('#666666')
    .fontSize(12)
    .font('Helvetica')
    .text('Email Validation Report', 50, 85);

  doc
    .fillColor('#666666')
    .fontSize(10)
    .text(`Generated on: ${new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })}`, 50, 105);

  // Divider line
  doc
    .moveTo(50, 125)
    .lineTo(545, 125)
    .strokeColor('#e5e7eb')
    .stroke();

  // ── HEALTH SCORE ──
  doc
    .fillColor('#1e1b4b')
    .fontSize(16)
    .font('Helvetica-Bold')
    .text('List Health Score', 50, 145);

  const scoreColor =
    healthScore >= 80 ? '#16a34a' :
    healthScore >= 50 ? '#d97706' : '#dc2626';

  doc
    .fillColor(scoreColor)
    .fontSize(48)
    .font('Helvetica-Bold')
    .text(`${healthScore}/100`, 50, 168);

  const healthLabel =
    healthScore >= 80 ? 'Good — your list is clean' :
    healthScore >= 50 ? 'Average — needs some cleaning' :
    'Poor — serious issues found';

  doc
    .fillColor('#666666')
    .fontSize(12)
    .font('Helvetica')
    .text(healthLabel, 50, 225);

  // Divider line
  doc
    .moveTo(50, 250)
    .lineTo(545, 250)
    .strokeColor('#e5e7eb')
    .stroke();

  // ── SUMMARY NUMBERS ──
  doc
    .fillColor('#1e1b4b')
    .fontSize(16)
    .font('Helvetica-Bold')
    .text('Summary', 50, 270);

  const summaryItems = [
    { label: 'Total Emails Uploaded', value: stats.total, color: '#333333' },
    { label: 'Valid Emails', value: stats.valid, color: '#16a34a' },
    { label: 'Invalid Emails', value: stats.invalid, color: '#dc2626' },
    { label: 'Risky Emails', value: stats.risky, color: '#d97706' },
    { label: 'Typos Detected', value: stats.typos, color: '#d97706' },
    { label: 'Disposable Emails', value: stats.disposable, color: '#dc2626' },
    { label: 'Duplicates Removed', value: stats.duplicate, color: '#6366f1' },
  ];

  let yPos = 300;
  summaryItems.forEach((item) => {
    doc
      .fillColor('#444444')
      .fontSize(11)
      .font('Helvetica')
      .text(item.label, 50, yPos);

    doc
      .fillColor(item.color)
      .fontSize(11)
      .font('Helvetica-Bold')
      .text(item.value.toString(), 400, yPos, { align: 'right' });

    doc
      .moveTo(50, yPos + 16)
      .lineTo(545, yPos + 16)
      .strokeColor('#f3f4f6')
      .stroke();

    yPos += 28;
  });

  // ── TOP ISSUES ──
  yPos += 10;

  doc
    .moveTo(50, yPos)
    .lineTo(545, yPos)
    .strokeColor('#e5e7eb')
    .stroke();

  yPos += 20;

  doc
    .fillColor('#1e1b4b')
    .fontSize(16)
    .font('Helvetica-Bold')
    .text('Top Issues Found', 50, yPos);

  yPos += 30;

  // Typo issues
  const typoEmails = results.filter(
    (r) => r.typoSuggestion && r.typoSuggestion !== 'None' && r.typoSuggestion !== '-'
  );

  if (typoEmails.length > 0) {
    doc
      .fillColor('#d97706')
      .fontSize(12)
      .font('Helvetica-Bold')
      .text(`Typo Corrections (${typoEmails.length})`, 50, yPos);

    yPos += 20;

    typoEmails.slice(0, 5).forEach((r) => {
      doc
        .fillColor('#444444')
        .fontSize(10)
        .font('Helvetica')
        .text(`• ${r.email}  ->  ${r.typoSuggestion}`, 60, yPos);
      yPos += 16;
    });

    if (typoEmails.length > 5) {
      doc
        .fillColor('#888888')
        .fontSize(10)
        .text(`  ...and ${typoEmails.length - 5} more`, 60, yPos);
      yPos += 16;
    }

    yPos += 10;
  }

  // Disposable issues
  const disposableEmails = results.filter((r) => r.disposable === 'Yes');

  if (disposableEmails.length > 0) {
    doc
      .fillColor('#dc2626')
      .fontSize(12)
      .font('Helvetica-Bold')
      .text(`Disposable Emails (${disposableEmails.length})`, 50, yPos);

    yPos += 20;

    disposableEmails.slice(0, 5).forEach((r) => {
      doc
        .fillColor('#444444')
        .fontSize(10)
        .font('Helvetica')
        .text(`• ${r.email}`, 60, yPos);
      yPos += 16;
    });

    if (disposableEmails.length > 5) {
      doc
        .fillColor('#888888')
        .fontSize(10)
        .text(`  ...and ${disposableEmails.length - 5} more`, 60, yPos);
      yPos += 16;
    }

    yPos += 10;
  }

  // Invalid domain issues
  const invalidEmails = results.filter((r) => r.mx === 'Fail');

  if (invalidEmails.length > 0) {
    doc
      .fillColor('#dc2626')
      .fontSize(12)
      .font('Helvetica-Bold')
      .text(`Invalid Domains (${invalidEmails.length})`, 50, yPos);

    yPos += 20;

    invalidEmails.slice(0, 5).forEach((r) => {
      doc
        .fillColor('#444444')
        .fontSize(10)
        .font('Helvetica')
        .text(`• ${r.email}`, 60, yPos);
      yPos += 16;
    });

    if (invalidEmails.length > 5) {
      doc
        .fillColor('#888888')
        .fontSize(10)
        .text(`  ...and ${invalidEmails.length - 5} more`, 60, yPos);
      yPos += 16;
    }
  }

  // ── FOOTER ──
  yPos += 20;

  doc
    .moveTo(50, yPos)
    .lineTo(545, yPos)
    .strokeColor('#e5e7eb')
    .stroke();

  yPos += 10;

  doc
    .fillColor('#888888')
    .fontSize(10)
    .font('Helvetica')
    .text('Generated by MailSense — Email Validation Platform for Indian Businesses', 50, yPos, {
      align: 'center',
    });

  doc.end();
});

module.exports = router;