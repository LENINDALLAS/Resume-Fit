/** Centralized keys for token storage (localStorage in the dashboard, chrome.storage.local in the extension). */
export const STORAGE_KEYS = {
  accessToken: "resumeFit.accessToken",
  refreshToken: "resumeFit.refreshToken",
} as const;
