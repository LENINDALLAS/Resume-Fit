import { z } from "zod";
import { VALIDATION_LIMITS } from "../constants/validation.js";

export const registerSchema = z.object({
  name: z.string().trim().min(VALIDATION_LIMITS.nameMin).max(VALIDATION_LIMITS.nameMax),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(VALIDATION_LIMITS.passwordMin),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
