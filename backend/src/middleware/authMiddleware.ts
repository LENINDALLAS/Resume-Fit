import type { NextFunction, Request, Response } from "express";
import { ErrorCode } from "@resume-fit/shared";
import { AppError } from "../utils/errors.js";
import { verifyAccessToken } from "../utils/jwt.js";

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new AppError(401, ErrorCode.UNAUTHORIZED, "Authentication required.");
  }

  const token = header.slice("Bearer ".length).trim();
  const payload = verifyAccessToken(token);

  req.user = { id: payload.sub };
  next();
}
