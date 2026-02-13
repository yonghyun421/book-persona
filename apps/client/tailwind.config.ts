import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#10131a",
        muted: "#5b5f6a",
        line: "#e7e1d7",
        card: "#ffffff",
        accent: "#ff5c38",
        accent2: "#2a5cff"
      },
      boxShadow: {
        soft: "0 30px 80px rgba(17, 19, 26, 0.12)",
        hero: "0 30px 70px rgba(15, 18, 26, 0.45)"
      }
    }
  },
  plugins: []
}

export default config
