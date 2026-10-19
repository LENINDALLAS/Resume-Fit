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
  getAccessToken(): string | null {
    return storage.getItem(STORAGE_KEYS.accessToken);
  },
  setAccessToken(token: string): void {
    storage.setItem(STORAGE_KEYS.accessToken, token);
  },
  removeAccessToken(): void {
    storage.removeItem(STORAGE_KEYS.accessToken);
  },
  getRefreshToken(): string | null {
    return storage.getItem(STORAGE_KEYS.refreshToken);
  },
  setRefreshToken(token: string): void {
    storage.setItem(STORAGE_KEYS.refreshToken, token);
  },
  removeRefreshToken(): void {
    storage.removeItem(STORAGE_KEYS.refreshToken);
  },
  clearTokens(): void {
    storage.removeItem(STORAGE_KEYS.accessToken);
    storage.removeItem(STORAGE_KEYS.refreshToken);
  },
  isTokenExpired(token: string): boolean {
    const decoded = decodeJwtPayload(token);
    if (!decoded?.exp) return true;
    return Date.now() >= decoded.exp * 1000;
  },
};
