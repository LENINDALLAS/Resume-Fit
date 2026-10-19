import axios, { type InternalAxiosRequestConfig } from "axios";
import { tokenService } from "../services/tokenService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api/v1";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000,
});

let onAuthFailure: (() => void) | null = null;

/** Registered once by the store/app bootstrap so this module never imports Redux directly. */
export function setOnAuthFailure(callback: () => void): void {
  onAuthFailure = callback;
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = tokenService.getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await axios.post<{ success: true; data: { accessToken: string } }>(
      `${API_BASE_URL}/auth/refresh`,
      { refreshToken },
    );
    return response.data.data.accessToken;
  } catch {
    return null;
  }
}

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenService.getAccessToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    const isRefreshCall = originalRequest?.url?.includes("/auth/refresh");
    const isUnauthorized = error.response?.status === 401;

    if (!isUnauthorized || isRefreshCall || !originalRequest || originalRequest._retry) {
      if (isUnauthorized && (isRefreshCall || originalRequest?._retry)) {
        tokenService.clearTokens();
        onAuthFailure?.();
      }
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }

    const newAccessToken = await refreshPromise;

    if (!newAccessToken) {
      tokenService.clearTokens();
      onAuthFailure?.();
      return Promise.reject(error);
    }

    tokenService.setAccessToken(newAccessToken);
    originalRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);
    return axiosInstance(originalRequest);
  },
);
