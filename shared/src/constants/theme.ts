/**
 * Single source of truth for Resume-Fit's visual identity.
 * Both frontendDashboard and frontendExtension mirror these exact values
 * into their own global stylesheet as CSS custom properties, and use the
 * same PrimeReact theme preset ("lara-light-blue") so the two apps read
 * as one consistent product.
 */
export const COLORS = {
  primary: "#2563EB",
  primaryDark: "#1D4ED8",
  primaryLight: "#DBEAFE",
  success: "#16A34A",
  warning: "#D97706",
  danger: "#DC2626",
  textPrimary: "#1F2937",
  textSecondary: "#6B7280",
  background: "#F9FAFB",
  surface: "#FFFFFF",
  border: "#E5E7EB",
} as const;

export const SCORE_BAND_COLORS = {
  low: "#DC2626",
  moderate: "#D97706",
  good: "#CA8A04",
  strong: "#16A34A",
  excellent: "#15803D",
} as const;

export const FONT_FAMILY = "'Inter', system-ui, -apple-system, sans-serif";

export const PRIME_REACT_THEME = "lara-light-blue";
