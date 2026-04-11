"use client";
import { useEffect, useRef } from "react";

export default function HeroCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || window.matchMedia("(pointer: coarse)").matches) return;
    const onMove = (e: MouseEvent) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `translate(${x * 4}px,${y * 4}px)`;
    };
    const onLeave = () => { card.style.transform = ""; };
    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
    return () => { card.removeEventListener("mousemove", onMove); card.removeEventListener("mouseleave", onLeave); };
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = setInterval(() => {
      barsRef.current?.querySelectorAll<HTMLElement>(".bar > i").forEach((b) => {
        const cur = parseFloat(b.style.getPropertyValue("--w")) || parseFloat(b.dataset.w || "50");
        const next = Math.max(5, Math.min(99, cur + (Math.random() * 4 - 2)));
        b.style.setProperty("--w", `${next}%`);
        b.style.width = `${next}%`;
      });
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div ref={barsRef}>
      <div ref={cardRef} className="card transition-transform max-w-full sm:max-w-md mx-auto lg:mx-0 w-full">
        <div className="flex justify-between items-center px-4 py-2.5 border-b-[3px] border-ink bg-ink text-bone font-mono font-extrabold text-[11px] uppercase">
          <span>CHARACTER #0042</span>
          <span className="flex items-center gap-1.5 text-acid before:content-[''] before:w-2 before:h-2 before:bg-acid before:rounded-full before:animate-blink">LIVE</span>
        </div>
        <div
          className="h-[200px] sm:h-[230px] border-b-[3px] border-ink relative"
          role="img"
          aria-label="Bangr character avatar"
          style={{ background: "radial-gradient(circle at 32% 38%,#0a0a0a 0 14px,transparent 15px),radial-gradient(circle at 60% 38%,#0a0a0a 0 14px,transparent 15px),radial-gradient(circle at 46% 66%,#ff3da8 0 22px,transparent 23px),#ffe14a" }}
        >
          <span className="absolute top-3 right-3 bg-acid border-[3px] border-ink px-2.5 py-1 font-mono font-extrabold text-[11px] shadow-[3px_3px_0_0_#0a0a0a]">VIT 92%</span>
          <span className="absolute left-3 bottom-3 font-display text-[26px] sm:text-[32px] bg-ink text-bone px-2.5 py-1 border-[3px] border-ink">$BANGR</span>
        </div>
        <div className="grid grid-cols-2">
          {([["HP", "8,420", "text-[#1aa01a]"], ["Mood", "FERAL", "text-hot"], ["Holders", "3,217", ""], ["Age", "11d 04h", ""]] as const).map(([k, v, cl], i) => (
            <div key={i} className={`px-4 py-3 ${i % 2 === 0 ? "border-r-[3px] border-ink" : ""} ${i < 2 ? "border-b-[3px] border-ink" : ""}`}>
              <div className="font-mono text-[10px] font-extrabold uppercase opacity-70">{k}</div>
              <div className={`font-display text-[20px] mt-0.5 ${cl}`}>{v}</div>
            </div>
          ))}
        </div>
        <div className="px-4 py-3 border-b-[3px] border-ink">
          <div className="flex justify-between font-mono text-[11px] font-extrabold uppercase mb-1.5"><span>Vitality</span><span>92 / 100</span></div>
          <div className="bar h-[16px] border-[3px] border-ink bg-bone relative overflow-hidden"><i style={{ "--w": "92%" } as React.CSSProperties} data-w="92" /></div>
        </div>
        <div className="px-4 py-3">
          <div className="font-mono text-[10px] font-extrabold opacity-70 mb-1.5 uppercase">@bangr_alive · 4m</div>
          <p className="font-semibold text-[13px] leading-snug">{'"if u sell rn i will literally appear in ur dreams. this is not a threat. this is a feature."'}</p>
          <div className="flex gap-4 mt-2.5 font-mono text-[10px] font-bold opacity-70"><span>↻ 1.2k</span><span>♥ 8.4k</span><span>👁 142k</span></div>
        </div>
      </div>
    </div>
  );
}
