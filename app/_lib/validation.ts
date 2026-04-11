import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE, MAX_LABEL_LENGTH } from "./constants";

/**
 * Validate and parse wallet data from localStorage.
 * Returns null if data is invalid or corrupted.
 */
export function parseWalletFromStorage(raw: string): { address: string; balance: number } | null {
  try {
    const data = JSON.parse(raw);
    if (typeof data !== "object" || data === null) return null;
    if (typeof data.address !== "string" || data.address.length < 10) return null;
    if (typeof data.balance !== "number" || isNaN(data.balance) || data.balance < 0) return null;
    return { address: data.address, balance: data.balance };
  } catch {
    return null;
  }
}

/** Strip potentially dangerous characters from labels */
export function sanitizeLabel(label: string): string {
  return label.replace(/[<>"'&]/g, "").slice(0, MAX_LABEL_LENGTH);
}

/** Validate an image file for upload */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) return { valid: false, error: "file too big — max 4 MB" };
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return { valid: false, error: "must be png, jpg, gif, or webp" };
  return { valid: true };
}
