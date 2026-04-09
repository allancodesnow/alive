import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bone: "#f4efe6",
        ink: "#0a0a0a",
        acid: "#c6ff3d",
        hot: "#ff3da8",
        sun: "#ffe14a",
        elec: "#3d6bff",
        blood: "#ff4127",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      keyframes: {
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        blink: { "50%": { opacity: "0" } },
        pulse2: { "0%,49%": { background: "#c6ff3d" }, "50%,100%": { background: "#ff3da8" } },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        blink: "blink 1s steps(2) infinite",
        pulse2: "pulse2 1.4s steps(2) infinite",
      },
    },
  },
  plugins: [],
};
export default config;
