// Toy bonding curve — close enough for UX. Real launch wires to on-chain math.
// y = supply * (1 - 1 / (1 + sol/k))
const TOTAL = 1_000_000_000;
const K = 30;

export function devTokensFromSol(sol: number): number {
  if (sol <= 0) return 0;
  const frac = 1 - 1 / (1 + sol / K);
  return Math.round(TOTAL * frac);
}

export function devPctFromSol(sol: number): number {
  return (devTokensFromSol(sol) / TOTAL) * 100;
}

export const TOTAL_SUPPLY = TOTAL;
export const MAX_DEV_SOL = 5;

// crude solana address sanity (base58, 32-44 chars). also accepts @handles.
export function isValidWalletInput(s: string): boolean {
  if (!s) return false;
  if (s.startsWith("@") && s.length > 1) return true;
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(s);
}
