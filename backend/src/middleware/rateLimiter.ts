import rateLimit from "express-rate-limit";
import { ErrorCode } from "@resume-fit/shared";
import { RATE_LIMITS } from "../config/constants.js";

function rateLimitResponse(_req: unknown, res: import("express").Response): void {
  res.status(429).json({
    success: false,
    error: { code: ErrorCode.RATE_LIMIT_EXCEEDED, message: "Too many requests. Please try again later." },
  });
}

export const authRateLimiter = rateLimit({
  windowMs: RATE_LIMITS.auth.windowMs,
  max: RATE_LIMITS.auth.max,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitResponse,
});

export const analysisRateLimiter = rateLimit({
  windowMs: RATE_LIMITS.analysis.windowMs,
  max: RATE_LIMITS.analysis.max,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitResponse,
});
