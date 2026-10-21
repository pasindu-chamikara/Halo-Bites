/**
 * Authentication and Login Form Validation Utilities
 * Used for both client-side and server-side validation.
 */

// Robust RFC 5322 compliant regex for standard email addresses
export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
}

/**
 * Validates an email address.
 * Checks for non-empty value and valid email format via regex.
 */
export function validateEmail(email: string): ValidationResult {
  const trimmed = (email || '').trim();
  if (!trimmed) {
    return {
      isValid: false,
      error: 'Email address is required'
    };
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address (e.g. name@domain.com)'
    };
  }

  return { isValid: true };
}

/**
 * Validates a password input.
 * Checks for non-empty value and minimum length requirement.
 */
export function validatePassword(password: string): ValidationResult {
  if (!password || password.trim() === '') {
    return {
      isValid: false,
      error: 'Password is required'
    };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      error: 'Password must be at least 6 characters long'
    };
  }

  return { isValid: true };
}

/**
 * Comprehensive login form validation helper.
 */
export function validateLoginForm(email: string, password: string): { isValid: boolean; errors: LoginFormErrors } {
  const emailValidation = validateEmail(email);
  const passwordValidation = validatePassword(password);

  const errors: LoginFormErrors = {};
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
  }

  return {
    isValid: emailValidation.isValid && passwordValidation.isValid,
    errors
  };
}
