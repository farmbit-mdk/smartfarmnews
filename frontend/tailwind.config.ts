import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sfn: {
          teal:    "#0891B2",
          cyan:    "#22D3EE",
          green:   "#4ADE80",
          amber:   "#F59E0B",
          base:    "#1A1A1A",
          surface: "#242424",
          border:  "#333333",
          text: {
            primary:   "#FFFFFF",
            secondary: "#9E9E9E",
          },
        },
      },
      fontFamily: {
        sans: ["Pretendard", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
