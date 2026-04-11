import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#080B14", // Deep rich charcoal/slate
        foreground: "#F8FAFC", // Clean white
        primary: {
          DEFAULT: "#FACC15", // Premium Yellow/Golden
          dark: "#EAB308",
          light: "#FEF08A",
          foreground: "#000000"
        },
        secondary: {
          DEFAULT: "#0F172A", // Slate 900
          dark: "#080B14",
          foreground: "#F8FAFC"
        },
        sidebar: {
          DEFAULT: "#0F172A",
          active: "rgba(250, 204, 21, 0.1)",
          text: "#94A3B8",
          hover: "#1E293B"
        },
        accent: {
          success: "#10B981",
          error: "#EF4444",
          info: "#3B82F6"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-poppins)", "sans-serif"],
      },
      boxShadow: {
        'premium': '0 0 20px -5px rgba(0, 0, 0, 0.3)',
        'glow-primary': '0 0 15px -3px rgba(250, 204, 21, 0.4)',
        'glass': 'inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0) 100%)',
      }
    },
  },
  plugins: [],
};
export default config;
