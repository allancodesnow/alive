/**
 * DEMO WALLET PROVIDER
 * Simulated wallet for UI demonstration only.
 * No real cryptographic operations or signature verification occurs.
 * For production, replace with @solana/wallet-adapter-react.
 */
"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { parseWalletFromStorage } from "../_lib/validation";
import FocusTrap from "./FocusTrap";

type Wallet = { address: string; balance: number } | null;
type Ctx = {
  wallet: Wallet;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  openModal: () => void;
  closeModal: () => void;
  modalOpen: boolean;
};

const WalletCtx = createContext<Ctx | null>(null);

// DEMO ONLY: generates a fake wallet address for preview purposes
const fakeAddr = () =>
  "ALV" + Math.random().toString(36).slice(2, 10).toUpperCase() + "x" + Math.random().toString(36).slice(2, 8);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<Wallet>(null);
  const [connecting, setConnecting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("alive_wallet");
      if (raw) {
        const parsed = parseWalletFromStorage(raw);
        if (parsed) setWallet(parsed);
        else localStorage.removeItem("alive_wallet"); // corrupted data, clean up
      }
    } catch {}
  }, []);

  const connect = useCallback(async () => {
    setConnecting(true);
    await new Promise((r) => setTimeout(r, 900));
    const w = { address: fakeAddr(), balance: parseFloat((Math.random() * 8 + 1).toFixed(2)) };
    setWallet(w);
    try { localStorage.setItem("alive_wallet", JSON.stringify(w)); } catch {}
    setConnecting(false);
    setModalOpen(false);
  }, []);

  const disconnect = useCallback(() => {
    setWallet(null);
    try { localStorage.removeItem("alive_wallet"); } catch {}
  }, []);

  const closeModal = useCallback(() => setModalOpen(false), []);

  return (
    <WalletCtx.Provider
      value={{
        wallet,
        connecting,
        connect,
        disconnect,
        openModal: () => setModalOpen(true),
        closeModal,
        modalOpen,
      }}
    >
      {children}
      {modalOpen && <ConnectModal />}
    </WalletCtx.Provider>
  );
}

export function useWallet() {
  const c = useContext(WalletCtx);
  if (!c) throw new Error("useWallet outside WalletProvider");
  return c;
}

function ConnectModal() {
  const { connect, connecting, closeModal } = useWallet();
  const wallets = [
    { name: "Phantom", icon: "👻", popular: true },
    { name: "Backpack", icon: "🎒" },
    { name: "Solflare", icon: "🔥" },
    { name: "Ledger", icon: "🔒" },
  ];
  return (
    <div
      className="fixed inset-0 z-[100] bg-ink/70 backdrop-blur-[2px] flex items-end sm:items-center justify-center p-4"
      onClick={closeModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="connect-wallet-title"
    >
      <FocusTrap onClose={closeModal}>
        <div
          className="w-full max-w-md bg-bone border-[3px] border-ink shadow-[8px_8px_0_0_#0a0a0a]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b-[3px] border-ink bg-ink text-bone">
            <div id="connect-wallet-title" className="font-display text-[18px] uppercase tracking-tight">Connect wallet</div>
            <button onClick={closeModal} className="w-7 h-7 border-[2px] border-bone hover:bg-hot transition font-display" aria-label="Close dialog">×</button>
          </div>
          <div className="p-4">
            <p className="font-mono text-[11px] font-bold uppercase opacity-75 mb-4">
              Preview mode — wallet simulation for demo purposes. No real transactions.
            </p>
            <div className="space-y-2">
              {wallets.map((w) => (
                <button
                  key={w.name}
                  onClick={connect}
                  disabled={connecting}
                  className="w-full flex items-center gap-3 px-3 py-3 border-[3px] border-ink bg-bone hover:bg-sun shadow-[3px_3px_0_0_#0a0a0a] hover:-translate-x-0.5 hover:-translate-y-0.5 transition disabled:opacity-50"
                >
                  <span className="text-[24px]">{w.icon}</span>
                  <span className="font-display text-[16px] uppercase tracking-tight">{w.name}</span>
                  {w.popular && <span className="ml-auto font-mono text-[9px] font-extrabold uppercase bg-acid border-[2px] border-ink px-1.5 py-0.5">popular</span>}
                </button>
              ))}
            </div>
            {connecting && (
              <div className="mt-4 font-mono text-[11px] font-extrabold uppercase opacity-75 text-center" role="status">⟳ connecting…</div>
            )}
          </div>
        </div>
      </FocusTrap>
    </div>
  );
}
