/** Approved MVP ATS score weighting. Total must always equal 100. */
export const ATS_SCORE_WEIGHTS = {
  skills: 40,
  experience: 25,
  projects: 15,
  education: 10,
  certifications: 10,
} as const;

export const ATS_SCORE_VERSION = "v1";

export const QUALITATIVE_MATCH_RATIO = {
  strong: 1,
  moderate: 0.75,
  weak: 0.5,
  none: 0,
} as const;

export const REQUIREMENT_MATCH_RATIO = {
  strong: 1,
  moderate: 0.75,
  weak: 0.5,
  none: 0,
  not_required: 1,
} as const;
