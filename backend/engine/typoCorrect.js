const commonDomains = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'rediffmail.com',
  'icloud.com',
  'live.com',
  'ymail.com',
  'protonmail.com',
  'zoho.com',
  'aol.com',
  'msn.com',
];

function levenshteinDistance(a, b) {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

function typoCorrect(email) {
  const parts = email.split('@');
  if (parts.length !== 2) {
    return { hasTypo: false, suggestion: null };
  }

  const domain = parts[1].toLowerCase();

  // If domain is already correct
  if (commonDomains.includes(domain)) {
    return { hasTypo: false, suggestion: null };
  }

  // Find closest match
  let closestDomain = null;
  let minDistance = Infinity;

  for (const knownDomain of commonDomains) {
    const distance = levenshteinDistance(domain, knownDomain);
    if (distance < minDistance) {
      minDistance = distance;
      closestDomain = knownDomain;
    }
  }

  // Only suggest if very close (distance 1 or 2)
  if (minDistance <= 2) {
    return {
      hasTypo: true,
      suggestion: `${parts[0]}@${closestDomain}`,
      originalDomain: domain,
      suggestedDomain: closestDomain,
    };
  }

  return { hasTypo: false, suggestion: null };
}

module.exports = typoCorrect;