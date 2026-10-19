import axios from "axios";
import type { IApiErrorResponse } from "@resume-fit/shared";

const DEFAULT_MESSAGE = "Something went wrong. Please try again.";

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<IApiErrorResponse>(error)) {
    const apiMessage = error.response?.data?.error?.message;
    if (apiMessage) return apiMessage;
    if (error.code === "ECONNABORTED") return "The request took too long. Please try again.";
    if (!error.response) return "Unable to reach the server. Please check your connection.";
  }

  return DEFAULT_MESSAGE;
}
