export type Personality = "FERAL" | "COPIUM" | "ALPHA" | "SCHIZO" | "WHOLESOME" | "MENACE";

export type Candidate = {
  name: string;
  ticker: string;
  bio: string;
  personality: Personality;
  mood: string;
  avatar: string;
  emoji: string;
  firstTweet: string;
  vibe: string;
  locked?: boolean;
};

export type Step = "brief" | "generating" | "pick" | "review" | "launching" | "done";

export type LogEntry = { id: number; kind: "buy" | "sell" | "info"; text: string };

export type Split = { wallet: string; pct: number; label: string };

export interface ReviewModalProps {
  chosen: Candidate;
  customImage: string | null;
  devBuy: number;
  devTokens: number;
  devPct: number;
  totalCost: number;
  splits: Split[];
  balance: number;
  onCancel: () => void;
  onConfirm: () => void;
}
