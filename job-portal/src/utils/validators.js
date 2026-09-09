/**
 * Validates phone numbers according to the rules:
 * - Starts with 977 (or +977): must be 13 digits
 * - Starts with 98: must be 10 digits
 * - Starts with 071: must be 9 digits or more
 * 
 * Returns null if valid, or an error message string if invalid.
 */
export function validatePhoneNumber(phone) {
  if (!phone || !String(phone).trim()) {
    return 'Phone number is required';
  }

  const raw = String(phone).trim();
  const digitsOnly = raw.replace(/^\+/, '');

  if (!/^\d+$/.test(digitsOnly)) {
    return 'Phone number must contain only digits';
  }

  if (digitsOnly.startsWith('977')) {
    if (digitsOnly.length !== 13) {
      return 'Phone number starting with 977 must be 13 digits long';
    }
  } else if (digitsOnly.startsWith('98')) {
    if (digitsOnly.length !== 10) {
      return 'Phone number starting with 98 must be 10 digits long';
    }
  } else if (digitsOnly.startsWith('071')) {
    if (digitsOnly.length < 9) {
      return 'Phone number starting with 071 must be 9 digits or more';
    }
  } else {
    return 'Phone number must start with 977 (13 digits), 98 (10 digits), or 071 (9+ digits)';
  }

  return null;
}

/**
 * Strong password criteria configuration
 */
export const PASSWORD_REQUIREMENTS = [
  {
    id: 'length',
    label: 'At least 8 characters long',
    test: (pwd) => pwd.length >= 8,
  },
  {
    id: 'uppercase',
    label: 'At least one uppercase letter (A-Z)',
    test: (pwd) => /[A-Z]/.test(pwd),
  },
  {
    id: 'lowercase',
    label: 'At least one lowercase letter (a-z)',
    test: (pwd) => /[a-z]/.test(pwd),
  },
  {
    id: 'number',
    label: 'At least one number (0-9)',
    test: (pwd) => /[0-9]/.test(pwd),
  },
  {
    id: 'special',
    label: 'At least one special character (!@#$%^&*...)',
    test: (pwd) => /[^A-Za-z0-9]/.test(pwd),
  },
];

/**
 * Evaluates password strength and returns score, visual attributes, criteria status, and validity.
 */
export function evaluatePasswordStrength(password = '') {
  const pwd = String(password || '');
  if (!pwd) {
    return {
      score: 0,
      label: 'Too short',
      color: 'text-gray-400',
      barColor: 'bg-gray-200',
      percent: 0,
      criteria: PASSWORD_REQUIREMENTS.map((req) => ({ ...req, met: false })),
      isValid: false,
    };
  }

  const criteria = PASSWORD_REQUIREMENTS.map((req) => ({
    ...req,
    met: req.test(pwd),
  }));

  const metCount = criteria.filter((c) => c.met).length;

  let label = 'Weak';
  let color = 'text-rose-600';
  let barColor = 'bg-rose-500';

  if (metCount <= 2) {
    label = 'Weak';
    color = 'text-rose-600';
    barColor = 'bg-rose-500';
  } else if (metCount === 3) {
    label = 'Fair';
    color = 'text-amber-600';
    barColor = 'bg-amber-500';
  } else if (metCount === 4) {
    label = 'Good';
    color = 'text-blue-600';
    barColor = 'bg-blue-500';
  } else if (metCount === 5) {
    label = 'Strong';
    color = 'text-emerald-600';
    barColor = 'bg-emerald-500';
  }

  return {
    score: metCount,
    label,
    color,
    barColor,
    percent: (metCount / PASSWORD_REQUIREMENTS.length) * 100,
    criteria,
    isValid: metCount === PASSWORD_REQUIREMENTS.length,
  };
}

/**
 * Validates whether the password meets all strong password requirements.
 * Returns null if valid, or an error string if invalid.
 */
export function validatePassword(password, oldPassword = '') {
  if (!password || !password.trim()) {
    return 'Password is required';
  }
  if (oldPassword && password === oldPassword) {
    return 'New password cannot be the same as your current password';
  }
  const evalResult = evaluatePasswordStrength(password);
  if (!evalResult.isValid) {
    const unmet = evalResult.criteria.filter((c) => !c.met).map((c) => c.label);
    return `Password must meet all security requirements (${unmet.length} missing)`;
  }
  return null;
}
