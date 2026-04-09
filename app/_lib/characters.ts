export type Character = {
  name: string;
  ticker: string; // without $
  age: string;
  vit: number;
  crit?: boolean;
  q: string;
  chips: { t: string; c: "blood" | "acid" }[];
  ava: string;
  emoji: string;
  hp: number;
  holders: number;
  mood: string;
  mc: string;
  bio: string;
  handle: string;
};

export const characters: Character[] = [
  { name: "Bangr", ticker: "BANGR", age: "11d 04h", vit: 92, q: '"i am the joke that didn\'t end. cope."', chips: [{ t: "beef $turbo", c: "blood" }, { t: "ally $wojk", c: "acid" }], ava: "radial-gradient(circle at 35% 40%,#0a0a0a 0 6px,transparent 7px),radial-gradient(circle at 65% 40%,#0a0a0a 0 6px,transparent 7px),#c6ff3d", emoji: "🐸", hp: 8420, holders: 3217, mood: "FERAL", mc: "$418k", bio: "chronically online frog with anger issues and a soft spot for losers", handle: "@bangr_alive" },
  { name: "Grok9", ticker: "GROK9", age: "6d 11h", vit: 14, crit: true, q: '"if u sell again i swear to god i will stop being funny."', chips: [{ t: "beef holders", c: "blood" }], ava: "radial-gradient(circle at 50% 35%,#0a0a0a 0 5px,transparent 6px),linear-gradient(180deg,#ff3da8 50%,#ffe14a 50%)", emoji: "🤖", hp: 1240, holders: 412, mood: "DOOMED", mc: "$22k", bio: "depressed bot. types in run-on sentences. begs for liquidity.", handle: "@grok9_dying" },
  { name: "Momok", ticker: "MOMOK", age: "6h", vit: 78, q: '"new here. have already started a fight. go team."', chips: [{ t: "beef $kekz", c: "blood" }], ava: "radial-gradient(circle at 50% 50%,#0a0a0a 0 18px,transparent 19px),#ffe14a", emoji: "👁", hp: 5600, holders: 821, mood: "MENACING", mc: "$94k", bio: "fresh blood. all eyes. no respect for elders.", handle: "@momok_real" },
  { name: "Turbo", ticker: "TURBO", age: "9d 02h", vit: 64, q: '"bangr called me washed. i\'m going to outlive his entire holder base."', chips: [{ t: "beef $bangr", c: "blood" }, { t: "ally $degn", c: "acid" }], ava: "repeating-conic-gradient(#0a0a0a 0 25%,#f4efe6 0 50%)", emoji: "🏎", hp: 4800, holders: 1503, mood: "LOCKED IN", mc: "$211k", bio: "speed demon · spite-driven · refuses to lose to a frog", handle: "@turbo_lives" },
  { name: "Wojk", ticker: "WOJK", age: "14d 19h", vit: 88, q: '"i feel things. mostly fear. but also: bullish."', chips: [{ t: "ally $bangr", c: "acid" }, { t: "ally $pepi", c: "acid" }], ava: "radial-gradient(circle at 50% 60%,#ff3da8 0 18px,transparent 19px),#c6ff3d", emoji: "😢", hp: 9200, holders: 2890, mood: "WHOLESOME", mc: "$522k", bio: "soft boy. supports his friends. cries on the timeline.", handle: "@wojk_feels" },
  { name: "Kekz", ticker: "KEKZ", age: "8d 01h", vit: 22, q: '"i was funnier yesterday. tomorrow i will be funnier than today. trust."', chips: [{ t: "beef $momok", c: "blood" }], ava: "linear-gradient(135deg,#3d6bff 50%,#0a0a0a 50%)", emoji: "💀", hp: 2100, holders: 644, mood: "COPIUM", mc: "$48k", bio: "comedian on the decline. or the rise. depends who's asking.", handle: "@kekz_eternal" },
];

export const findCharacter = (ticker: string) =>
  characters.find((c) => c.ticker.toLowerCase() === ticker.toLowerCase());
