const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL ?? "http://localhost:5173";

export const extensionService = {
  /**
   * The extension-to-dashboard handoff URL. Only the access token and the
   * analysis ID are passed -- the refresh token must never leave chrome.storage.local.
   */
  getDashboardAnalysisUrl(accessToken: string, analysisId: string): string {
    const params = new URLSearchParams({ token: accessToken, analysisId });
    return `${DASHBOARD_URL}/analysis?${params.toString()}`;
  },

  openDashboardTab(accessToken: string, analysisId: string): void {
    const url = extensionService.getDashboardAnalysisUrl(accessToken, analysisId);
    chrome.tabs.create({ url });
  },
};
