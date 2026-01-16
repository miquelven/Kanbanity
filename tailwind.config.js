/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        retro: {
          paper: "#fff7f2",
          paperDark: "#ffe0d4",
          ink: "#1a102a",
          frame: "#3b1c5a",

          // Vibrant Retro Palette
          red: "#ff5c7a",
          orange: "#ff0000",
          yellow: "#ffe66d",
          green: "#3ee399",
          teal: "#4fd4ff",
          blue: "#4f8cff",
          purple: "#b066ff",
          pink: "#ff7edb",

          // Deep Variants for Text/Borders
          redDeep: "#d7263d",
          orangeDeep: "#ff6b35",
          yellowDeep: "#f5b700",
          greenDeep: "#00a878",
          tealDeep: "#00bcd4",
          blueDeep: "#1e40ff",
          purpleDeep: "#7c2ae8",
          pinkDeep: "#e60073",

          accent: "#ffb347", // Default accent (Cartoon orange)
          accentSoft: "#ffe66d",

          darkPaper: "#1b1035",
          darkSurface: "#2a1748",
          darkFrame: "#fcddec",
        },
      },
      fontFamily: {
        retroHeading: ['"Bangers"', "cursive"],
        retroBody: [
          '"Comic Sans MS"',
          '"Comic Sans"',
          "system-ui",
          "sans-serif",
        ],
        retroScript: ['"Brush Script MT"', "cursive"],
      },
      boxShadow: {
        retroPanel:
          "0 0 0 3px rgba(0,0,0,0.85), 0 10px 0 0 rgba(0,0,0,0.85), 0 14px 18px rgba(0,0,0,0.35)",
        retroCard:
          "0 0 0 2px rgba(0,0,0,0.6), 0 4px 0 0 rgba(0,0,0,0.8), 0 6px 10px rgba(0,0,0,0.3)",
      },
      backgroundImage: {
        retroPaper:
          "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.12) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
