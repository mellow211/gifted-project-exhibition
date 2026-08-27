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
        navy: {
          900: "#070B16",
          DEFAULT: "#0B1020",
          800: "#12182E",
          700: "#1B2444",
          600: "#27335D",
          500: "#3B4D86",
          400: "#5D71B0",
          300: "#8B9CD2",
          200: "#C4CEEE",
          100: "#E5EAF9",
          50: "#F2F5FD",
        },
        surface: {
          DEFAULT: "#F7F8FC",
          card: "#FFFFFF",
          muted: "#F0F2F9",
          border: "#E2E6F0",
        },
        primary: {
          DEFAULT: "#6C63FF",
          hover: "#584EE8",
          light: "#EEEDFF",
          dark: "#463CB8",
        },
        secondary: {
          DEFAULT: "#27D3A2",
          hover: "#1FB88C",
          light: "#E5FAF4",
          dark: "#148B69",
        },
        accent: {
          amber: "#FFB020",
          rose: "#FF4D6D",
          cyan: "#00B4D8",
          purple: "#9D4EDD",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Pretendard"',
          '"Noto Sans KR"',
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
        serif: ['"Nanum Myeongjo"', "serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      boxShadow: {
        subtle: "0 2px 10px rgba(11, 16, 32, 0.04)",
        card: "0 4px 20px rgba(11, 16, 32, 0.06)",
        hover: "0 10px 30px rgba(11, 16, 32, 0.10)",
        glass: "0 8px 32px 0 rgba(11, 16, 32, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
