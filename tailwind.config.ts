import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        formilo: {
          bg: "#F7F7F3",
          card: "#FFFFFF",
          text: "#162630",
          secondary: "#65737A",
          muted: "#89959A",
          border: "#DDE2DF",
          subtle: "#E8EBE9",
          green: "#00C98B",
          cyan: "#00C7D9",
          orange: "#EBAA78",
          dark: "#102630",
          darkCard: "#0C1D26",
        },
      },
      borderRadius: {
        card: "18px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
        "card-hover": "0 8px 20px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.03)",
        modal: "0 20px 40px rgba(16,38,48,0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
