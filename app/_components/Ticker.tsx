"use client";
import Link from "next/link";
import { characters } from "../_lib/characters";
import { TICKER_ITEMS } from "../_lib/constants";

export default function Ticker() {
  // Only 2 copies needed for seamless infinite scroll (not 4)
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="border-b-[3px] border-ink bg-ink text-bone overflow-hidden whitespace-nowrap">
      <div className="inline-block py-2.5 animate-marquee">
        {items.map(([a, b, c], i) => {
          const m = a.match(/\$([A-Z]+)/);
          const tickerSym = m?.[1];
          const inner = (
            <>
              {a} {b && <i className={`not-italic ${c === "up" ? "text-acid" : c === "dn" ? "text-hot" : "text-sun"}`}>{b}</i>}
            </>
          );
          return tickerSym && characters.some((ch) => ch.ticker === tickerSym) ? (
            <Link key={i} href={`/c/${tickerSym}`} className="font-mono font-bold text-[12px] mx-5 hover:text-acid transition">
              {inner}
            </Link>
          ) : (
            <span key={i} className="font-mono font-bold text-[12px] mx-5">{inner}</span>
          );
        })}
      </div>
    </div>
  );
}
