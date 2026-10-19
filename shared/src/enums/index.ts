export enum AnalysisStatusEnum {
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum TokenTypeEnum {
  ACCESS = "access",
  REFRESH = "refresh",
}

export enum MatchTypeEnum {
  EXACT = "exact",
  RELATED = "related",
}

export enum ImportanceEnum {
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
}

/** Used for experience and project relevance, which never have a "not_required" state. */
export enum QualitativeMatchEnum {
  STRONG = "strong",
  MODERATE = "moderate",
  WEAK = "weak",
  NONE = "none",
}

/** Used for education and certifications, which may legitimately be "not_required". */
export enum RequirementMatchEnum {
  STRONG = "strong",
  MODERATE = "moderate",
  WEAK = "weak",
  NONE = "none",
  NOT_REQUIRED = "not_required",
}

export enum ScoreInterpretationEnum {
  LOW_MATCH = "Low Match",
  MODERATE_MATCH = "Moderate Match",
  GOOD_MATCH = "Good Match",
  STRONG_MATCH = "Strong Match",
  EXCELLENT_MATCH = "Excellent Match",
}
