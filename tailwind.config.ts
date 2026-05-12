import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./modules/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#080b12",
        surface: "#111827",
        panel: "#172033",
        muted: "#8a94a7"
      },
      boxShadow: {
        glow: "0 20px 60px rgba(0,0,0,.35)"
      }
    }
  },
  plugins: []
};

export default config;
