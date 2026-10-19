import type { IApiSuccessResponse, UserDto } from "@resume-fit/shared";
import { axiosInstance } from "./axiosInstance";

export const userApi = {
  async getCurrentUser(): Promise<UserDto> {
    const response = await axiosInstance.get<IApiSuccessResponse<{ user: UserDto }>>("/users/me");
    return response.data.data.user;
  },
};
