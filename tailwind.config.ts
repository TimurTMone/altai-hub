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
        surface: "#0f0f0f",
        card: "#1a1a1a",
        border: "#2a2a2a",
      },
      backgroundImage: {
        "journey-ai": "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
        "journey-prompt": "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)",
        "journey-content": "linear-gradient(135deg, #db2777 0%, #ec4899 100%)",
        "journey-vibe": "linear-gradient(135deg, #ea580c 0%, #f59e0b 100%)",
        "journey-nocode": "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
        "journey-teachers": "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
