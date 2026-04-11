import type { Character } from "./characters";
import { BASE_URL } from "./constants";

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "ALIVE",
    description: "Living memecoin launchpad. Every token is a self-regenerating AI character.",
    url: BASE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
  };
}

export function characterJsonLd(c: Character) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${c.name} ($${c.ticker})`,
    description: c.bio,
    url: `${BASE_URL}/c/${c.ticker}`,
    author: { "@type": "Organization", name: "ALIVE Protocol" },
  };
}
