import "./globals.css";
import type { Metadata } from "next";
import { WalletProvider } from "./_components/WalletProvider";

export const metadata: Metadata = {
  title: "ALIVE — Memes That Refuse To Die",
  description: "Living memecoin launchpad. Every token is a self-regenerating AI character that posts, beefs, allies and survives. Pump.fun solved speed of launch — ALIVE solves longevity.",
  openGraph: {
    title: "ALIVE — Memes That Refuse To Die",
    description: "Living memecoin launchpad. Every token is an AI character that must survive.",
    type: "website",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' fill='%23c6ff3d'/><rect x='4' y='4' width='24' height='24' fill='none' stroke='%230a0a0a' stroke-width='3'/><circle cx='12' cy='14' r='2' fill='%230a0a0a'/><circle cx='20' cy='14' r='2' fill='%230a0a0a'/><path d='M10 22 Q16 18 22 22' stroke='%230a0a0a' stroke-width='2' fill='none'/></svg>",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=JetBrains+Mono:wght@400;700;800&family=Space+Grotesk:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
