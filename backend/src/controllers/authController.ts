import type { Request, Response } from "express";
import type { LoginInput, RefreshTokenInput, RegisterInput } from "@resume-fit/shared";
import { authService } from "../services/authService.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const authController = {
  async register(req: Request, res: Response): Promise<void> {
    const input = req.body as RegisterInput;
    const user = await authService.register(input);
    sendSuccess(res, { user }, 201);
  },

  async login(req: Request, res: Response): Promise<void> {
    const input = req.body as LoginInput;
    const result = await authService.login(input);
    sendSuccess(res, result);
  },

  async refresh(req: Request, res: Response): Promise<void> {
    const input = req.body as RefreshTokenInput;
    const result = await authService.refresh(input.refreshToken);
    sendSuccess(res, result);
  },

  async logout(req: Request, res: Response): Promise<void> {
    const input = req.body as RefreshTokenInput;
    await authService.logout(input.refreshToken);
    sendSuccess(res, { message: "Logged out successfully." });
  },
};
