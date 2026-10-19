import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt.js";

/**
 * Attaches req.user when a valid Bearer token is present, but never rejects
 * a request for having no token -- used by routes that accept both anonymous
 * and authenticated callers (e.g. creating an analysis from the extension
 * before the user has logged in). A present-but-invalid token still fails
 * loudly via verifyAccessToken, since that's a real error, not "no token".
 */
export function optionalAuthMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    next();
    return;
  }

  const token = header.slice("Bearer ".length).trim();
  const payload = verifyAccessToken(token);

  req.user = { id: payload.sub };
  next();
}
