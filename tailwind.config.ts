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
        cream: "#FAFAF7",
        gold: "#C9A84C",
        "dark-gray": "#2D2D2D",
      },
      fontFamily: {
        heebo: ["var(--font-heebo)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
