import { Router } from "express";
import { userController } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const userRoutes = Router();

userRoutes.get("/me", authMiddleware, asyncHandler(userController.getCurrentUser));
