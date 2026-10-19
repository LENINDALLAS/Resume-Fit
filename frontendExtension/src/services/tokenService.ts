import { STORAGE_KEYS } from "@resume-fit/shared";
import { storage } from "../utils/storage";

interface DecodedJwt {
  exp?: number;
}

/** Decodes a JWT payload without verifying its signature -- for UX expiry checks only. */
function decodeJwtPayload(token: string): DecodedJwt | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as DecodedJwt;
  } catch {
    return null;
  }
}

export const tokenService = {
  getAccessToken(): Promise<string | null> {
    return storage.getItem(STORAGE_KEYS.accessToken);
  },
  setAccessToken(token: string): Promise<void> {
    return storage.setItem(STORAGE_KEYS.accessToken, token);
  },
  removeAccessToken(): Promise<void> {
    return storage.removeItem(STORAGE_KEYS.accessToken);
  },
  getRefreshToken(): Promise<string | null> {
    return storage.getItem(STORAGE_KEYS.refreshToken);
  },
  setRefreshToken(token: string): Promise<void> {
    return storage.setItem(STORAGE_KEYS.refreshToken, token);
  },
  removeRefreshToken(): Promise<void> {
    return storage.removeItem(STORAGE_KEYS.refreshToken);
  },
  async clearTokens(): Promise<void> {
    await Promise.all([storage.removeItem(STORAGE_KEYS.accessToken), storage.removeItem(STORAGE_KEYS.refreshToken)]);
  },
  isTokenExpired(token: string): boolean {
    const decoded = decodeJwtPayload(token);
    if (!decoded?.exp) return true;
    return Date.now() >= decoded.exp * 1000;
  },
};
