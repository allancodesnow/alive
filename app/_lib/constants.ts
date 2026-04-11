// ---- ticker data (home page marquee) ----
export const TICKER_ITEMS: [string, string, string][] = [
  ["$BANGR", "VIT 92%", "up"], ["$GROK9", "VIT 14% CRIT", "dn"], ["⚡ NEW $MOMOK", "", "pip"],
  ["$DEGN", "VIT 78%", "up"], ["$TURBO", "VIT 64%", "up"], ["$KEKZ", "VIT 22%", "dn"],
  ["🔪 BEEF $BANGR vs $TURBO", "", "pip"], ["$WOJK", "VIT 88%", "up"], ["$PEPI", "VIT 31%", "dn"],
  ["💀 RIP $MOON 4D", "", "pip"], ["$NYAN", "VIT 70%", "up"],
];

// ---- vitality thresholds ----
export const VIT_FLATLINE = 15;
export const VIT_CRITICAL = 30;
export const VIT_STRESSED = 60;

// ---- vitality colors ----
export const VIT_COLOR_FLATLINE = "#ff4127";
export const VIT_COLOR_STRESSED = "#ffe14a";
export const VIT_COLOR_HEALTHY = "#c6ff3d";

export function vitColor(vit: number): string {
  if (vit < VIT_FLATLINE) return VIT_COLOR_FLATLINE;
  if (vit < VIT_CRITICAL) return VIT_COLOR_STRESSED;
  return VIT_COLOR_HEALTHY;
}

// ---- intervals (ms) ----
export const AMBIENT_DRIFT_MS = 1800;
export const EKG_BPM_LABEL = "60bpm";

// ---- launch config ----
export const MAX_FILE_SIZE = 4 * 1024 * 1024;
export const MIN_IMAGE_DIM = 256;
export const MAX_BRIEF_LENGTH = 80;
export const MAX_LABEL_LENGTH = 16;
export const MAX_WALLET_LENGTH = 44;
export const LAUNCH_FEE = 0.02;
export const NETWORK_FEE = 0.0008;

// ---- accepted image types ----
export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp"];
export const ACCEPTED_IMAGE_ACCEPT = "image/png,image/jpeg,image/gif,image/webp";

// ---- base URL ----
export const BASE_URL = "https://alive.fun";
