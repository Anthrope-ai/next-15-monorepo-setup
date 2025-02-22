import type { Config } from "tailwindcss";

// We want each package to be responsible for its own content.

// !Important ##############################################
// Please restart dev after making any changes to this file
// #########################################################

const config: Omit<Config, "content"> = {
  theme: {
    extend: {
      maxWidth: {
        "8xl": "90rem"
      },
      width: {
        "8xl": "90rem"
      },
      backgroundImage: {
        "glow-conic": "conic-gradient(from 180deg at 50% 50%, #2a8af6 0deg, #a853ba 180deg, #e92a67 360deg)"
      },
      colors: {
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81"
        },
        secondary: {
          50: "#fbbf8b",
          100: "#ffb87b",
          200: "#fbac69",
          300: "#ffa04f",
          400: "#fb882a",
          500: "#ff7500",
          600: "#ed6c02",
          700: "#d36002",
          800: "#bc5602",
          900: "#8f4202"
        }
      }
    }
  }
};

export default config;
