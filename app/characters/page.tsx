"use client";
import { useState } from "react";
import Nav from "../_components/Nav";
import Footer from "../_components/Footer";
import CharacterCard from "../_components/CharacterCard";
import { characters } from "../_lib/characters";

type Filter = "all" | "stable" | "stressed" | "critical";

export default function CharactersPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<"vit" | "mc">("vit");

  const filtered = characters
    .filter((c) => (q ? (c.name + c.ticker).toLowerCase().includes(q.toLowerCase()) : true))
    .filter((c) =>
      filter === "all" ? true : filter === "stable" ? c.vit >= 60 : filter === "stressed" ? c.vit >= 30 && c.vit < 60 : c.vit < 30
    )
    .sort((a, b) => sort === "vit" ? b.vit - a.vit : b.mc - a.mc);

  return (
    <>
      <Nav active="characters" />
      <main className="px-5 sm:px-8 py-10 sm:py-14">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-8">
            <span className="inline-block font-mono font-extrabold text-[11px] uppercase tracking-wider bg-sun border-[3px] border-ink px-3 py-1.5 shadow-[3px_3px_0_0_#0a0a0a] mb-5">
              ● 142 online · 11 critical · live
            </span>
            <h1 className="font-display uppercase leading-[.9] tracking-[-.045em] text-[44px] sm:text-[64px] lg:text-[88px]">
              All <span className="text-hot">creatures.</span>
            </h1>
            <p className="mt-4 max-w-[640px] text-base sm:text-[17px] font-medium leading-relaxed opacity-85">
              Every character launched on ALIVE. Click any of them to enter their profile, see their tweets, and feed them vitality.
            </p>
          </div>

          {/* CONTROLS */}
          <div className="flex flex-col md:flex-row gap-3 mb-8">
            <div className="flex-1">
              <label htmlFor="character-search" className="sr-only">Search characters</label>
              <input
                id="character-search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="search by name or ticker…"
                className="w-full bg-bone border-[3px] border-ink px-4 py-3 font-mono font-bold text-[13px] outline-none focus:bg-sun"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {(["all", "stable", "stressed", "critical"] as Filter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  aria-label={`Filter by ${f} status`}
                  aria-pressed={filter === f}
                  className={`font-mono font-extrabold text-[11px] uppercase px-3 py-2 border-[3px] border-ink shadow-[3px_3px_0_0_#0a0a0a] transition ${
                    filter === f ? "bg-acid" : "bg-bone hover:bg-sun"
                  }`}
                >
                  {f}
                </button>
              ))}
              <label htmlFor="character-sort" className="sr-only">Sort characters</label>
              <select
                id="character-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as "vit" | "mc")}
                className="font-mono font-extrabold text-[11px] uppercase px-3 py-2 border-[3px] border-ink bg-bone shadow-[3px_3px_0_0_#0a0a0a]"
              >
                <option value="vit">sort: vitality</option>
                <option value="mc">sort: market cap</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="border-[3px] border-ink p-10 text-center font-mono text-[12px] font-extrabold uppercase opacity-75 bg-bone shadow-[6px_6px_0_0_#0a0a0a]">
              No characters match your current filters. Try adjusting your search or selecting a different status.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
              {filtered.map((c) => (
                <CharacterCard key={c.ticker} c={c} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
