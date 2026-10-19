export const JWT_CONFIG = {
  algorithm: "HS256" as const,
  accessTokenExpiresInSeconds: 30 * 60,
  refreshTokenExpiresInSeconds: 2 * 24 * 60 * 60,
  refreshTokenExpiresInMs: 2 * 24 * 60 * 60 * 1000,
};

export const GEMINI_CONFIG = {
  timeoutMs: 60000,
  // Pinned to a specific model rather than the "-latest" alias: "-latest"
  // currently resolves to Google's newest model (gemini-3.6/3.7-flash), which
  // saw frequent 503 "high demand" errors during development. This pinned,
  // one-generation-behind model was verified reachable with this API key and
  // stable under the same full request config (schema + system instruction +
  // thinkingLevel). Re-verify with a direct API call before changing this --
  // Google periodically retires older pinned models for a given key.
  model: "gemini-3.5-flash",
  promptVersion: "resume-analysis-v2",
  // Structured extraction benefits from consistency over creativity.
  temperature: 0.3,
  // The fixed JSON shape (capped list lengths via schema) never needs more than this.
  maxOutputTokens: 4096,
  // "low" is this model generation's actual field for suppressing extended
  // thinking -- the older thinkingBudget:0 form is REJECTED with a plain 400
  // INVALID_ARGUMENT on recent Gemini model generations, so don't reintroduce
  // it without re-verifying against whichever model is pinned above.
  thinkingLevel: "low" as const,
};

export const RATE_LIMITS = {
  auth: { windowMs: 15 * 60 * 1000, max: 10 },
  analysis: { windowMs: 15 * 60 * 1000, max: 20 },
};

export const REQUEST_ID_HEADER = "X-Request-Id";
