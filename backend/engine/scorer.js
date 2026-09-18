function scorer({ format, disposable, mx, typo }) {
  let score = 100;
  let status = 'Valid';
  const reasons = [];

  if (!format.valid) {
    score -= 50;
    reasons.push('Invalid format');
  }

  if (!mx.valid) {
    score -= 30;
    reasons.push('Domain has no mail servers');
  }

  if (disposable.disposable) {
    score -= 30;
    reasons.push('Disposable email detected');
  }

  if (typo.hasTypo) {
    score -= 20;
    reasons.push(`Possible typo — did you mean ${typo.suggestion}?`);
  }

  score = Math.max(score, 0);

  if (score >= 90) {
    status = 'Valid';
  } else if (score >= 50) {
    status = 'Risky';
  } else {
    status = 'Invalid';
  }

  return { score, status, reasons };
}

module.exports = scorer;