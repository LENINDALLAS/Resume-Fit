/** Thin wrapper around localStorage so no component calls it directly. */
export const storage = {
  getItem(key: string): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key: string, value: string): void {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Storage may be unavailable (private browsing, quota); fail silently.
    }
  },
  removeItem(key: string): void {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // no-op
    }
  },
};
