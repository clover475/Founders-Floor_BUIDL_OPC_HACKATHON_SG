import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        floor: {
          ink: "#171717",
          muted: "#5f5f5f",
          line: "#d9d4ca",
          paper: "#fffaf0",
          panel: "#f7efe2",
          green: "#2f6f5e",
          blue: "#3b5f8a",
          coral: "#c45f4c",
          gold: "#b9872f"
        }
      },
      boxShadow: {
        soft: "0 18px 50px rgba(23, 23, 23, 0.08)"
      }
    },
  },
  plugins: [],
};

export default config;
