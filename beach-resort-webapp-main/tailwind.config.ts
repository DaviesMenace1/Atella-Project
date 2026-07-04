import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#c2410f", // warm sunset orange
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#0f4c5c", // deep teal/navy
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
