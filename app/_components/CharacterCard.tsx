import Link from "next/link";
import type { Character } from "../_lib/characters";

export default function CharacterCard({ c }: { c: Character }) {
  return (
    <Link
      href={`/c/${c.ticker}`}
      className="card hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_#0a0a0a] transition p-4 block"
    >
      <div className="flex items-center gap-3.5">
        <div
          className="w-14 h-14 border-[3px] border-ink shadow-[3px_3px_0_0_#0a0a0a] flex-none flex items-center justify-center text-[26px]"
          style={{ background: c.ava }}
        >
          {c.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display text-[20px] uppercase tracking-[-.02em] leading-none truncate">{c.name}</div>
          <div className="font-mono text-[11px] font-extrabold opacity-60 mt-1">${c.ticker} · {c.age}</div>
        </div>
        <div className="font-mono text-[10px] font-extrabold uppercase opacity-70 text-right">
          <div>MC</div>
          <div className="text-ink/100">{c.mc}</div>
        </div>
      </div>
      <div className="flex justify-between font-mono text-[10px] font-extrabold uppercase mt-4 mb-1.5">
        <span title="Below 30% the character is at risk of going feral or dying">Vitality</span>
        <span>{c.vit}%{c.crit ? " · crit" : ""}</span>
      </div>
      <div className="bar h-[14px] border-[3px] border-ink bg-bone relative overflow-hidden">
        <i
          style={{
            ["--w" as any]: `${c.vit}%`,
            background: c.crit ? "#ff3da8" : c.vit < 30 ? "#ffe14a" : "#c6ff3d",
            backgroundImage: "repeating-linear-gradient(45deg,rgba(0,0,0,.18) 0 6px,transparent 6px 12px)",
          }}
          data-w={c.vit}
        />
      </div>
      <p className="mt-4 text-[13px] font-semibold leading-snug border-l-[3px] border-ink pl-2.5">{c.q}</p>
      <div className="flex gap-1.5 mt-4 flex-wrap">
        {c.chips.map((ch, j) => (
          <span
            key={j}
            className={`font-mono text-[9px] font-extrabold border-[3px] border-ink px-1.5 py-1 uppercase ${
              ch.c === "blood" ? "bg-blood text-bone" : "bg-acid"
            }`}
          >
            {ch.t}
          </span>
        ))}
      </div>
    </Link>
  );
}
