"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

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

const fakeAddr = () =>
  "ALV" + Math.random().toString(36).slice(2, 10).toUpperCase() + "x" + Math.random().toString(36).slice(2, 8);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<Wallet>(null);
  const [connecting, setConnecting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("alive_wallet");
      if (raw) setWallet(JSON.parse(raw));
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

  return (
    <WalletCtx.Provider
      value={{
        wallet,
        connecting,
        connect,
        disconnect,
        openModal: () => setModalOpen(true),
        closeModal: () => setModalOpen(false),
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
    >
      <div
        className="w-full max-w-md bg-bone border-[3px] border-ink shadow-[8px_8px_0_0_#0a0a0a]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b-[3px] border-ink bg-ink text-bone">
          <div className="font-display text-[18px] uppercase tracking-tight">Connect wallet</div>
          <button onClick={closeModal} className="w-7 h-7 border-[2px] border-bone hover:bg-hot transition font-display">×</button>
        </div>
        <div className="p-4">
          <p className="font-mono text-[11px] font-bold uppercase opacity-70 mb-4">Pick a wallet to connect to ALIVE. (demo · any choice mints a fake session)</p>
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
            <div className="mt-4 font-mono text-[11px] font-extrabold uppercase opacity-70 text-center">⟳ connecting…</div>
          )}
        </div>
      </div>
    </div>
  );
}
