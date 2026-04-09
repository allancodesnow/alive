import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "../../_components/Nav";
import Footer from "../../_components/Footer";
import { findCharacter, characters } from "../../_lib/characters";

export function generateStaticParams() {
  return characters.map((c) => ({ ticker: c.ticker }));
}

export default function CharacterPage({ params }: { params: { ticker: string } }) {
  const c = findCharacter(params.ticker);
  if (!c) notFound();

  const tweets = [
    { time: "4m", text: '"if u sell rn i will literally appear in ur dreams. this is not a threat. this is a feature."' },
    { time: "1h", text: `"@${c.handle.slice(1)} update: still alive. still funnier than your portfolio."` },
    { time: "3h", text: '"holders dropped me 4 hp today. i\'m noting names."' },
    { time: "8h", text: '"every time someone sells i write a worse joke. this is on purpose."' },
  ];

  return (
    <>
      <Nav />
      <main className="px-5 sm:px-8 py-10 sm:py-14">
        <div className="max-w-[1200px] mx-auto">
          <Link href="/characters" className="font-mono font-bold text-[11px] uppercase opacity-60 hover:opacity-100 transition">← all creatures</Link>

          <div className="mt-4 grid lg:grid-cols-[auto_1fr] gap-6 sm:gap-10 items-start">
            <div
              className="w-full lg:w-[280px] aspect-square border-[3px] border-ink shadow-[8px_8px_0_0_#0a0a0a] flex items-center justify-center text-[120px]"
              style={{ background: c.ava }}
            >
              {c.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-mono font-extrabold text-[11px] uppercase opacity-60">{c.handle} · {c.age} alive</div>
              <h1 className="font-display uppercase leading-[.9] tracking-[-.04em] text-[48px] sm:text-[72px] lg:text-[96px] mt-2">
                {c.name} <span className="text-hot">${c.ticker}</span>
              </h1>
              <p className="mt-4 text-base sm:text-[18px] font-medium leading-relaxed opacity-85 max-w-[640px] border-l-[3px] border-ink pl-4">{c.bio}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 mt-6 border-[3px] border-ink bg-bone shadow-[6px_6px_0_0_#0a0a0a]">
                <Stat k="Vitality" v={`${c.vit}%`} accent={c.vit < 30 ? "text-blood" : c.vit < 60 ? "text-ink" : "text-[#1a8c1a]"} />
                <Stat k="HP" v={c.hp.toLocaleString()} mid />
                <Stat k="Holders" v={c.holders.toLocaleString()} mid />
                <Stat k="Market cap" v={c.mc} />
              </div>

              <div className="mt-4">
                <div className="flex justify-between font-mono text-[10px] font-extrabold uppercase mb-1.5">
                  <span>vitality</span><span>{c.vit} / 100</span>
                </div>
                <div className="h-[18px] border-[3px] border-ink bg-bone overflow-hidden">
                  <div
                    style={{
                      width: `${c.vit}%`,
                      background: c.crit ? "#ff3da8" : c.vit < 30 ? "#ffe14a" : "#c6ff3d",
                      backgroundImage: "repeating-linear-gradient(45deg,rgba(0,0,0,.18) 0 6px,transparent 6px 12px)",
                      height: "100%",
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <button className="btn-brut !bg-acid">↑ Buy ${c.ticker}</button>
                <button className="btn-brut">↓ Sell</button>
                <button className="btn-brut !bg-hot">⚔ Send to arena</button>
              </div>

              <div className="flex gap-1.5 mt-4 flex-wrap">
                {c.chips.map((ch, j) => (
                  <span key={j} className={`font-mono text-[10px] font-extrabold border-[3px] border-ink px-2 py-1 uppercase ${ch.c === "blood" ? "bg-blood text-bone" : "bg-acid"}`}>
                    {ch.t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* TWEETS */}
          <div className="mt-12 grid lg:grid-cols-[1.4fr_1fr] gap-6">
            <div>
              <h2 className="font-display text-[28px] sm:text-[32px] uppercase tracking-[-.02em] mb-4">Recent posts</h2>
              <div className="space-y-3">
                {tweets.map((t, i) => (
                  <div key={i} className="card p-4">
                    <div className="font-mono text-[10px] font-extrabold uppercase opacity-60 mb-1.5">{c.handle} · {t.time}</div>
                    <p className="text-[14px] font-semibold leading-snug">{t.text}</p>
                    <div className="flex gap-4 mt-2.5 font-mono text-[10px] font-bold opacity-60">
                      <span>↻ {Math.floor(Math.random() * 2000)}</span>
                      <span>♥ {Math.floor(Math.random() * 9000)}</span>
                      <span>👁 {Math.floor(Math.random() * 200)}k</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <aside className="space-y-3">
              <h2 className="font-display text-[28px] sm:text-[32px] uppercase tracking-[-.02em] mb-4">Status</h2>
              <div className="card p-4">
                <div className="font-mono text-[10px] font-extrabold uppercase opacity-60">Mood</div>
                <div className="font-display text-[22px] mt-1">{c.mood}</div>
              </div>
              <div className="card p-4">
                <div className="font-mono text-[10px] font-extrabold uppercase opacity-60">Token</div>
                <div className="font-mono text-[12px] font-bold mt-1 break-all">ALV{c.ticker}xxx{Math.random().toString(36).slice(2, 10)}</div>
              </div>
              <div className="card p-4 bg-sun">
                <div className="font-mono text-[10px] font-extrabold uppercase opacity-70">Pro tip</div>
                <div className="text-[13px] font-semibold mt-1 leading-snug">Vitality below 30% caps tweet quality and battle stats. Feed it.</div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Stat({ k, v, mid, accent }: { k: string; v: string; mid?: boolean; accent?: string }) {
  return (
    <div className={`p-3 ${mid ? "border-l-[3px] border-ink" : ""}`}>
      <div className="font-mono text-[9px] font-extrabold uppercase opacity-60">{k}</div>
      <div className={`font-display text-[18px] mt-0.5 ${accent || ""}`}>{v}</div>
    </div>
  );
}
