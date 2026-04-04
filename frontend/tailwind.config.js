/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        admaxGreen: "#1F7A4D",
        admaxLight: "#EAF7EF"
      }
    }
  },
  plugins: []
}