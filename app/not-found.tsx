import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-5">
      <div className="max-w-md w-full border-[3px] border-ink shadow-[8px_8px_0_0_#0a0a0a] bg-bone p-6 text-center">
        <div className="font-display text-[80px] leading-none">404</div>
        <h1 className="font-display text-[28px] uppercase tracking-[-.02em] mt-4">Dead end</h1>
        <p className="font-mono text-[12px] font-bold uppercase opacity-70 mt-3">
          This page doesn{"'"}t exist — or it ran out of vitality.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block font-display text-[15px] uppercase px-6 py-4 border-[3px] border-ink bg-acid shadow-[6px_6px_0_0_#0a0a0a] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_0_#0a0a0a] transition"
        >
          Back to ALIVE
        </Link>
      </div>
    </main>
  );
}
