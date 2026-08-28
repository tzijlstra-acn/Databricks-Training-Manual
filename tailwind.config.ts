import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Howden brand palette
        brand: {
          navy: "#1F2144",
          "navy-light": "#E8E9F0",
          orange: "#F47920",
          "orange-light": "#FFF3E8",
        },
        // Teaching / medallion colors — do not change
        bronze: {
          DEFAULT: "#CD7F32",
          bg: "#FDF3E7",
          border: "#E8B86D",
          text: "#92400E",
        },
        silver: {
          DEFAULT: "#9CA3AF",
          bg: "#F3F4F6",
          border: "#D1D5DB",
          text: "#374151",
        },
        gold: {
          DEFAULT: "#D97706",
          bg: "#FFFBEB",
          border: "#FCD34D",
          text: "#92400E",
        },
        // Primary → Howden navy scale
        primary: {
          DEFAULT: "#1F2144",
          50: "#E8E9F0",
          100: "#D0D2E1",
          500: "#4A4D7E",
          600: "#363966",
          700: "#2B2E55",
          800: "#1F2144",
          900: "#141530",
        },
        surface: "#F8F9FA",
        canvas: "#FFFFFF",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "dash": "dash 2s linear infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "flow": "flow 3s ease-in-out infinite",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        dash: {
          to: { strokeDashoffset: "0" },
        },
        flow: {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(8px)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
