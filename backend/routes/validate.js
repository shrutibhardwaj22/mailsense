const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

const formatCheck = require('../engine/formatCheck');
const mxCheck = require('../engine/mxCheck');
const disposableCheck = require('../engine/disposableCheck');
const typoCorrect = require('../engine/typoCorrect');
const scorer = require('../engine/scorer');
const csv = require('csv-parser');

// Multer setup for CSV upload
const upload = multer({ dest: 'uploads/' });

// Single email validation
router.post('/single', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const format = formatCheck(email);
    const disposable = disposableCheck(email);
    const typo = typoCorrect(email);
    const mx = await mxCheck(email);
    const score = scorer({ format, disposable, mx, typo });

    res.json({
      email,
      format,
      mx,
      disposable,
      typo,
      score,
    });
  } catch (error) {
    res.status(500).json({ error: 'Validation failed', details: error.message });
  }
});

// Bulk CSV validation with real time progress
router.post('/bulk', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'CSV file is required' });
    }

    const filePath = req.file.path;

    // Read all emails from CSV first
    const emails = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          const email =
            row.email || row.Email || row.EMAIL || Object.values(row)[0];
          if (email) emails.push(email.trim());
        })
        .on('end', resolve)
        .on('error', reject);
    });

    // Remove duplicates
    const seen = new Set();
    const uniqueEmails = [];
    const duplicates = [];

    for (const email of emails) {
      if (seen.has(email.toLowerCase())) {
        duplicates.push(email);
      } else {
        seen.add(email.toLowerCase());
        uniqueEmails.push(email);
      }
    }

    const total = uniqueEmails.length + duplicates.length;
    const results = [];

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Send total count first
    res.write(`data: ${JSON.stringify({ type: 'total', total })}\n\n`);

    // Validate each email and send progress
    for (let i = 0; i < uniqueEmails.length; i++) {
      const email = uniqueEmails[i];

      const format = formatCheck(email);
      const disposable = disposableCheck(email);
      const typo = typoCorrect(email);
      const mx = await mxCheck(email);
      const score = scorer({ format, disposable, mx, typo });

      results.push({
        email,
        status: score.status,
        score: score.score,
        format: format.valid ? 'Pass' : 'Fail',
        mx: mx.valid ? 'Pass' : 'Fail',
        disposable: disposable.disposable ? 'Yes' : 'No',
        typoSuggestion: typo.suggestion || 'None',
        reasons: score.reasons.join(', '),
        duplicate: 'No',
      });

      // Send progress update
      res.write(`data: ${JSON.stringify({
        type: 'progress',
        current: i + 1,
        total,
        currentEmail: email,
      })}\n\n`);
    }

    // Add duplicates
    for (const email of duplicates) {
      results.push({
        email,
        status: 'Duplicate',
        score: 0,
        format: '-',
        mx: '-',
        disposable: '-',
        typoSuggestion: '-',
        reasons: 'Duplicate entry',
        duplicate: 'Yes',
      });
    }

    // Delete uploaded file
    fs.unlinkSync(filePath);

    // Send final results
    res.write(`data: ${JSON.stringify({
      type: 'done',
      total: results.length,
      results,
    })}\n\n`);

    res.end();

  } catch (error) {
    res.status(500).json({ error: 'Bulk validation failed', details: error.message });
  }
});

module.exports = router;