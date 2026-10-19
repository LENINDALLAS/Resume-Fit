import type { Request, Response } from "express";
import { userService } from "../services/userService.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const userController = {
  async getCurrentUser(req: Request, res: Response): Promise<void> {
    const user = await userService.getCurrentUser(req.user!.id);
    sendSuccess(res, { user });
  },
};
