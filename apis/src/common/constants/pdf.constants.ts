export const PDF_CONSTANTS = {
  MIME_TYPE: 'application/pdf',
  FILE_EXTENSION: '.pdf',
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB in bytes
  MIN_FILE_SIZE: 1024, // 1KB minimum
  ALLOWED_MIME_TYPES: ['application/pdf'] as const,
  DOWNLOAD_LINK_EXPIRY_MINUTES: 5, // Default 5 minutes expiry
  MAX_DOWNLOADS_PER_STATEMENT: 5,
} as const;

export const PDF_VALIDATION = {
  MAGIC_NUMBERS: {
    PDF: [0x25, 0x50, 0x44, 0x46], // %PDF
  },
} as const;