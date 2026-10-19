import type { LoginInput, RegisterInput, UserDto } from "@resume-fit/shared";
import { authApi, userApi } from "../api";
import { tokenService } from "./tokenService";

export const authService = {
  async register(input: RegisterInput): Promise<UserDto> {
    return authApi.register(input);
  },

  async login(input: LoginInput): Promise<UserDto> {
    const { user, accessToken, refreshToken } = await authApi.login(input);
    tokenService.setAccessToken(accessToken);
    tokenService.setRefreshToken(refreshToken);
    return user;
  },

  async logout(): Promise<void> {
    const refreshToken = tokenService.getRefreshToken();
    if (refreshToken) {
      try {
        await authApi.logout(refreshToken);
      } catch {
        // The user explicitly asked to log out; local state is cleared regardless.
      }
    }
    tokenService.clearTokens();
  },

  /** Restores the session on app start, refreshing the access token if needed. */
  async initializeAuth(): Promise<UserDto | null> {
    const accessToken = tokenService.getAccessToken();
    if (!accessToken) return null;

    if (tokenService.isTokenExpired(accessToken)) {
      const refreshToken = tokenService.getRefreshToken();
      if (!refreshToken) {
        tokenService.clearTokens();
        return null;
      }

      try {
        const { accessToken: newAccessToken } = await authApi.refresh(refreshToken);
        tokenService.setAccessToken(newAccessToken);
      } catch {
        tokenService.clearTokens();
        return null;
      }
    }

    try {
      return await userApi.getCurrentUser();
    } catch {
      tokenService.clearTokens();
      return null;
    }
  },

  /** Authenticates using an access token handed off from the extension. */
  async authenticateWithHandoffToken(token: string): Promise<UserDto | null> {
    if (tokenService.isTokenExpired(token)) {
      return null;
    }

    tokenService.setAccessToken(token);

    try {
      return await userApi.getCurrentUser();
    } catch {
      tokenService.removeAccessToken();
      return null;
    }
  },
};
