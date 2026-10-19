export const VALIDATION_LIMITS = {
  nameMin: 2,
  nameMax: 100,
  passwordMin: 8,
  jobDescriptionMin: 50,
  jobDescriptionMax: 10000,
  maxResumeFileSizeBytes: 5 * 1024 * 1024,
} as const;

export const ALLOWED_RESUME_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const ALLOWED_RESUME_EXTENSIONS = [".pdf", ".docx"] as const;

export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 20,
  maxLimit: 100,
} as const;

export const MAX_REFRESH_TOKENS_PER_USER = 5;
