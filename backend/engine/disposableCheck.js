const disposableDomains = [
  'mailinator.com',
  'tempmail.com',
  'guerrillamail.com',
  'throwaway.email',
  'yopmail.com',
  'sharklasers.com',
  'guerrillamailblock.com',
  'grr.la',
  'guerrillamail.info',
  'spam4.me',
  'trashmail.com',
  'trashmail.me',
  'dispostable.com',
  'maildrop.cc',
  'mailnull.com',
  'spamgourmet.com',
  'mytemp.email',
  'fakeinbox.com',
  'tempinbox.com',
  'discard.email',
  'spamherelots.com',
  'getairmail.com',
  'filzmail.com',
  'throwam.com',
  'tempr.email',
  'zetmail.com',
  'mohmal.com',
  '10minutemail.com',
  'minutemail.com',
  'temp-mail.org',
  'emailondeck.com',
];

function disposableCheck(email) {
  const domain = email.split('@')[1];

  if (!domain) {
    return { disposable: false, reason: 'No domain found' };
  }

  const isDisposable = disposableDomains.includes(domain.toLowerCase());

  return {
    disposable: isDisposable,
    reason: isDisposable
      ? 'Disposable email domain detected'
      : 'Domain is not disposable',
  };
}

module.exports = disposableCheck;