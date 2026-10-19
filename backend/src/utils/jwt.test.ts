import jwt from "jsonwebtoken";
import { describe, expect, it } from "vitest";
import { TokenTypeEnum } from "@resume-fit/shared";
import { env } from "../config/env.js";
import { AppError } from "./errors.js";
import { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } from "./jwt.js";

describe("jwt utils", () => {
  it("round-trips a valid access token", () => {
    const token = signAccessToken("user-1");
    const payload = verifyAccessToken(token);
    expect(payload.sub).toBe("user-1");
    expect(payload.type).toBe(TokenTypeEnum.ACCESS);
  });

  it("round-trips a valid refresh token", () => {
    const token = signRefreshToken("user-1");
    const payload = verifyRefreshToken(token);
    expect(payload.sub).toBe("user-1");
    expect(payload.type).toBe(TokenTypeEnum.REFRESH);
  });

  it("rejects a refresh token presented as an access token", () => {
    const refreshToken = signRefreshToken("user-1");
    expect(() => verifyAccessToken(refreshToken)).toThrow(AppError);
  });

  it("rejects an access token presented as a refresh token", () => {
    const accessToken = signAccessToken("user-1");
    expect(() => verifyRefreshToken(accessToken)).toThrow(AppError);
  });

  it("rejects a token signed with the wrong secret", () => {
    const forged = jwt.sign({ sub: "user-1", type: TokenTypeEnum.ACCESS }, "wrong-secret", {
      algorithm: "HS256",
      expiresIn: "2d",
    });
    expect(() => verifyAccessToken(forged)).toThrow(AppError);
  });

  it("rejects an expired access token", () => {
    const expired = jwt.sign(
      { sub: "user-1", type: TokenTypeEnum.ACCESS, exp: Math.floor(Date.now() / 1000) - 10 },
      env.ACCESS_TOKEN_SECRET,
      { algorithm: "HS256" },
    );
    expect(() => verifyAccessToken(expired)).toThrow(AppError);
  });
});
