import jwt from "jsonwebtoken";
import { TokenTypeEnum, ErrorCode, type JwtPayload } from "@resume-fit/shared";
import { env } from "../config/env.js";
import { JWT_CONFIG } from "../config/constants.js";
import { AppError } from "./errors.js";

export function signAccessToken(userId: string): string {
  return jwt.sign({ sub: userId, type: TokenTypeEnum.ACCESS }, env.ACCESS_TOKEN_SECRET, {
    algorithm: JWT_CONFIG.algorithm,
    expiresIn: JWT_CONFIG.accessTokenExpiresInSeconds,
  });
}

export function signRefreshToken(userId: string): string {
  return jwt.sign({ sub: userId, type: TokenTypeEnum.REFRESH }, env.REFRESH_TOKEN_SECRET, {
    algorithm: JWT_CONFIG.algorithm,
    expiresIn: JWT_CONFIG.refreshTokenExpiresInSeconds,
  });
}

function verifyToken(
  token: string,
  secret: string,
  expectedType: TokenTypeEnum,
  onInvalid: () => never,
): JwtPayload {
  let decoded: JwtPayload;

  try {
    decoded = jwt.verify(token, secret, { algorithms: [JWT_CONFIG.algorithm] }) as JwtPayload;
  } catch {
    onInvalid();
  }

  if (decoded.type !== expectedType) {
    onInvalid();
  }

  return decoded;
}

export function verifyAccessToken(token: string): JwtPayload {
  return verifyToken(token, env.ACCESS_TOKEN_SECRET, TokenTypeEnum.ACCESS, () => {
    throw new AppError(401, ErrorCode.UNAUTHORIZED, "Authentication required.");
  });
}

export function verifyRefreshToken(token: string): JwtPayload {
  return verifyToken(token, env.REFRESH_TOKEN_SECRET, TokenTypeEnum.REFRESH, () => {
    throw new AppError(401, ErrorCode.INVALID_REFRESH_TOKEN, "Session expired. Please log in again.");
  });
}
