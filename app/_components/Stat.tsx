export default function Stat({ k, v, mid, accent }: { k: string; v: string; mid?: boolean; accent?: string }) {
  return (
    <div className={`p-3 ${mid ? "border-l-[3px] border-ink" : ""}`}>
      <div className="font-mono text-[9px] font-extrabold uppercase opacity-70">{k}</div>
      <div className={`font-display text-[18px] mt-0.5 ${accent || ""}`}>{v}</div>
    </div>
  );
}
