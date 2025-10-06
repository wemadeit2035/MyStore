import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: {
    // Ensure CSS is properly handled
    cssCodeSplit: true,
    minify: "terser",
    // Optimize for production
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
        },
      },
    },
  },
  // Clear cache
  clearScreen: true,
});
