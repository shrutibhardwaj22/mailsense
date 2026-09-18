const dns = require('dns');

function mxCheck(email) {
  return new Promise((resolve) => {
    const domain = email.split('@')[1];

    if (!domain) {
      return resolve({ valid: false, reason: 'No domain found' });
    }

    dns.resolveMx(domain, (err, addresses) => {
      if (err || !addresses || addresses.length === 0) {
        resolve({ valid: false, reason: 'No MX records found for domain' });
      } else {
        resolve({ valid: true, reason: 'Domain has valid MX records' });
      }
    });
  });
}

module.exports = mxCheck;