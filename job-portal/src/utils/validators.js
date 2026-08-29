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
