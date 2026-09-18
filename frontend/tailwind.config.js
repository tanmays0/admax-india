/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        admax: {
          green: "#1F7A4D",
          "green-dark": "#155c39",
          "green-light": "#EAF7EF",
          orange: "#FF6B35",
        },
        dark: "#0F1419",
        surface: "#FAFBFC",
      },
      fontFamily: {
        display: ['"Inter Tight"', "system-ui", "sans-serif"],
        sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        mono: ['"SF Mono"', "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};
