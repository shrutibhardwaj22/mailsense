function formatCheck(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = regex.test(email.trim());
  return {
    valid: isValid,
    reason: isValid ? 'Format is correct' : 'Invalid email format',
  };
}

module.exports = formatCheck;