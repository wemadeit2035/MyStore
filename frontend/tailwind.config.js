/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
        prata: ["Prata", "serif"],
      },
      screens: {
        xs: "475px",
      },
    },
  },
  plugins: [],
};
