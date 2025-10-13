// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      spacing: {
        "4%": "4%",
      },
      screens: {
        // Remove all responsive breakpoints except xl for desktop
        // xs: "475px",
        // sm: "640px", 
        // md: "768px",
        // lg: "1024px",
        xl: "1200px", // Set desktop breakpoint to 1200px
        // "2xl": "1536px",
      },
    },
  },
  plugins: [],
};