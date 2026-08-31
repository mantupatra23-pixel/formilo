import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
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
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      backgroundImage: {
        "formilo-gradient": "linear-gradient(135deg, #00C98B 0%, #00C7D9 100%)",
        "formilo-gradient-hover": "linear-gradient(135deg, #00b37c 0%, #00b3c4 100%)",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
        "card-hover": "0 6px 16px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.03)",
        modal: "0 20px 40px rgba(16,38,48,0.12)",
      },
      borderRadius: {
        card: "18px",
      },
    },
  },
  plugins: [],
};
export default config;
