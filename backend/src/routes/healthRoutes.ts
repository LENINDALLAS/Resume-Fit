import { Router } from "express";
import { sendSuccess } from "../utils/apiResponse.js";

export const healthRoutes = Router();

healthRoutes.get("/", (_req, res) => {
  sendSuccess(res, { status: "ok", version: "1.0.0" });
});
