import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { REQUEST_ID_HEADER } from "../config/constants.js";

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const requestId = randomUUID();
  req.requestId = requestId;
  res.setHeader(REQUEST_ID_HEADER, requestId);
  next();
}
