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
        // Capitec Brand Colors
        capitec: {
          blue: "#00AEEF",
          "dark-blue": "#004C97",
          navy: "#002855",
          red: "#E31937",
          green: "#00A651",
        },
        // Neutral Colors
        neutral: {
          50: "#F5F5F5",
          100: "#E0E0E0",
          400: "#6B7280",
          900: "#1F2937",
        },
      },
      backgroundImage: {
        "gradient-capitec": "linear-gradient(135deg, #002855 0%, #004C97 50%, #00AEEF 100%)",
        "gradient-capitec-header": "linear-gradient(135deg, #002855 0%, #004C97 100%)",
      },
      boxShadow: {
        "capitec": "0 4px 12px rgba(0, 174, 239, 0.25)",
        "capitec-hover": "0 6px 16px rgba(0, 76, 151, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
