import { Router } from "express";
import { healthRoutes } from "./healthRoutes.js";
import { authRoutes } from "./authRoutes.js";
import { userRoutes } from "./userRoutes.js";
import { analysisRoutes } from "./analysisRoutes.js";

export const apiRouter = Router();

apiRouter.use("/health", healthRoutes);
apiRouter.use("/auth", authRoutes);
apiRouter.use("/users", userRoutes);
apiRouter.use("/analyses", analysisRoutes);
