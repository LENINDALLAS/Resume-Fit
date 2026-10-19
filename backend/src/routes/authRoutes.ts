import { Router } from "express";
import { authController } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import { authRateLimiter } from "../middleware/rateLimiter.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { loginSchema, refreshTokenSchema, registerSchema } from "../validators/authValidators.js";

export const authRoutes = Router();

authRoutes.post(
  "/register",
  authRateLimiter,
  validate(registerSchema),
  asyncHandler(authController.register),
);

authRoutes.post("/login", authRateLimiter, validate(loginSchema), asyncHandler(authController.login));

authRoutes.post(
  "/refresh",
  authRateLimiter,
  validate(refreshTokenSchema),
  asyncHandler(authController.refresh),
);

authRoutes.post(
  "/logout",
  authMiddleware,
  validate(refreshTokenSchema),
  asyncHandler(authController.logout),
);
