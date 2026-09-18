const fs = require('fs');
const csv = require('csv-parser');

const formatCheck = require('../engine/formatCheck');
const mxCheck = require('../engine/mxCheck');
const disposableCheck = require('../engine/disposableCheck');
const typoCorrect = require('../engine/typoCorrect');
const scorer = require('../engine/scorer');

async function csvProcessor(filePath) {
  const emails = [];

  // Read CSV file
  await new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Support columns named "email", "Email", "EMAIL"
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

  // Validate each unique email
  const results = [];

  for (const email of uniqueEmails) {
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
  }

  // Add duplicates to results
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

  return results;
}

module.exports = csvProcessor;