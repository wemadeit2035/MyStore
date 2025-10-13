import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: { port: 5173 },
  build: {
    target: "es2015",
    minify: "terser",
    outDir: "dist",
    sourcemap: false,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
    },
  },
  esbuild: {
    target: "es2015",
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "es2015",
    },
  },
});
