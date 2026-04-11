import { characters } from "./_lib/characters";
import { BASE_URL } from "./_lib/constants";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/launch`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/characters`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/battles`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/docs`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ...characters.map((c) => ({
      url: `${BASE_URL}/c/${c.ticker}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.6,
    })),
  ];
}
