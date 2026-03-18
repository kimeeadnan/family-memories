import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      colors: {
        midnight: {
          950: "#050a12",
          900: "#0a1528",
          850: "#0f1f38",
          800: "#152a45",
          750: "#1a3352",
        },
        mist: {
          50: "#f4f7fb",
          100: "#e8eef5",
          200: "#cbd5e1",
          300: "#94a3b8",
          400: "#64748b",
        },
        regal: {
          200: "#b8dce8",
          300: "#8ecae6",
          400: "#5a9db8",
          500: "#3d7a9e",
          600: "#2d5f7a",
        },
        champagne: {
          200: "#eee6d9",
          300: "#dccfb8",
          400: "#c4b896",
          500: "#a89870",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.55s ease-out forwards",
        "flow-slow": "flowSlow 24s ease-in-out infinite alternate",
        "flow-med": "flowMed 18s ease-in-out infinite alternate",
        "line-glow": "lineGlow 4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        flowSlow: {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "100%": { transform: "translate(5%, 4%) scale(1.06)" },
        },
        flowMed: {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "100%": { transform: "translate(-4%, 3%) scale(1.04)" },
        },
        lineGlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.85" },
        },
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255,255,255,0.06)",
        card: "0 4px 24px rgba(0, 0, 0, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
