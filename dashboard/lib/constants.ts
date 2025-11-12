export const FILE_CONSTRAINTS = {
  MAX_SIZE_BYTES: 10 * 1024 * 1024,
  MAX_SIZE_MB: 10,
  ALLOWED_TYPES: ['application/pdf'] as const,
  ALLOWED_EXTENSIONS: ['.pdf'] as const,
} as const;

export const DATE_FORMATS = {
  STATEMENT_PERIOD: /^\d{4}-(0[1-9]|1[0-2])$/,
  STATEMENT_PERIOD_EXAMPLE: 'YYYY-MM (e.g., 2024-03)',
} as const;

export const SESSION_CONFIG = {
  WAIT_FOR_SESSION_MAX_MS: 3000,
  WAIT_FOR_SESSION_RETRY_MS: 150,
} as const;

export const ERROR_MESSAGES = {
  AUTH: {
    NOT_AUTHENTICATED: 'User not authenticated',
    INVALID_CREDENTIALS: 'Invalid email or password',
    SESSION_FAILED: 'Session could not be established. Please retry signing in.',
    GENERIC: 'An error occurred. Please try again.',
  },
  UPLOAD: {
    NO_FILE: 'Please select a file',
    INVALID_TYPE: 'Please select a PDF file',
    FILE_TOO_LARGE: 'File size must be less than 10MB',
    GENERIC: 'An error occurred during upload',
  },
  STATEMENTS: {
    FETCH_FAILED: 'Failed to load statements',
    LINK_GENERATION_FAILED: 'Failed to generate link',
  },
  DOWNLOAD_LOGS: {
    FETCH_FAILED: 'Failed to load download logs',
  },
} as const;

export const SUCCESS_MESSAGES = {
  UPLOAD: 'Statement uploaded successfully!',
  LINK_COPIED: 'Link copied to clipboard!',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;
