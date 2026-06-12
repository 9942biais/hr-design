import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#161616",
        paper: "#f4f2ed",
        lime: "#d9ff43",
        coral: "#ff6b52",
        violet: "#7667f5",
      },
      boxShadow: {
        card: "0 18px 50px rgba(22, 22, 22, 0.08)",
      },
    },
  },
  plugins: [],
} satisfies Config;
