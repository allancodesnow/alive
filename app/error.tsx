"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="min-h-screen flex items-center justify-center px-5">
      <div className="max-w-md w-full border-[3px] border-ink shadow-[8px_8px_0_0_#0a0a0a] bg-bone p-6 text-center">
        <div className="font-display text-[48px] leading-none">:(</div>
        <h1 className="font-display text-[28px] uppercase tracking-[-.02em] mt-4">Something broke</h1>
        <p className="font-mono text-[12px] font-bold uppercase opacity-70 mt-3">
          {error.message || "An unexpected error occurred"}
        </p>
        <button
          onClick={reset}
          className="mt-6 font-display text-[15px] uppercase px-6 py-4 border-[3px] border-ink bg-acid shadow-[6px_6px_0_0_#0a0a0a] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_0_#0a0a0a] transition"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
