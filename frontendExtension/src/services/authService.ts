import type { LoginInput, RegisterInput, UserDto } from "@resume-fit/shared";
import { authApi, userApi } from "../api";
import { tokenService } from "./tokenService";

export const authService = {
  async login(input: LoginInput): Promise<UserDto> {
    const { user, accessToken, refreshToken } = await authApi.login(input);
    await tokenService.setAccessToken(accessToken);
    await tokenService.setRefreshToken(refreshToken);
    return user;
  },

  /**
   * Registration alone doesn't authenticate (matches the dashboard's
   * register page), but the extension's "log in to view full details"
   * prompt needs one seamless step -- so it registers, then immediately
   * logs in with the same credentials.
   */
  async registerAndLogin(input: RegisterInput): Promise<UserDto> {
    await authApi.register(input);
    return authService.login({ email: input.email, password: input.password });
  },

  async logout(): Promise<void> {
    const refreshToken = await tokenService.getRefreshToken();
    if (refreshToken) {
      try {
        await authApi.logout(refreshToken);
      } catch {
        // The user explicitly asked to log out; local state is cleared regardless.
      }
    }
    await tokenService.clearTokens();
  },

  /** Restores the session when the popup opens, refreshing the access token if needed. */
  async initializeAuth(): Promise<UserDto | null> {
    const accessToken = await tokenService.getAccessToken();
    if (!accessToken) return null;

    if (tokenService.isTokenExpired(accessToken)) {
      const refreshToken = await tokenService.getRefreshToken();
      if (!refreshToken) {
        await tokenService.clearTokens();
        return null;
      }

      try {
        const { accessToken: newAccessToken } = await authApi.refresh(refreshToken);
        await tokenService.setAccessToken(newAccessToken);
      } catch {
        await tokenService.clearTokens();
        return null;
      }
    }

    try {
      return await userApi.getCurrentUser();
    } catch {
      await tokenService.clearTokens();
      return null;
    }
  },
};
