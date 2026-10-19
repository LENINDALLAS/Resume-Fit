import type { IApiSuccessResponse, LoginInput, RegisterInput, UserDto } from "@resume-fit/shared";
import { axiosInstance } from "./axiosInstance";

export const authApi = {
  async register(input: RegisterInput): Promise<UserDto> {
    const response = await axiosInstance.post<IApiSuccessResponse<{ user: UserDto }>>(
      "/auth/register",
      input,
    );
    return response.data.data.user;
  },

  async login(
    input: LoginInput,
  ): Promise<{ user: UserDto; accessToken: string; refreshToken: string }> {
    const response = await axiosInstance.post<
      IApiSuccessResponse<{ user: UserDto; accessToken: string; refreshToken: string }>
    >("/auth/login", input);
    return response.data.data;
  },

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    const response = await axiosInstance.post<IApiSuccessResponse<{ accessToken: string }>>(
      "/auth/refresh",
      { refreshToken },
    );
    return response.data.data;
  },

  async logout(refreshToken: string): Promise<void> {
    await axiosInstance.post("/auth/logout", { refreshToken });
  },
};
