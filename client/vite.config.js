import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    headers: {
      "Cache-Control": "no-store", // Prevents the browser from caching assets
    },
  },
  optimizeDeps: {
    force: true, // forces Vite to re-optimize dependencies on every server start
  },
  plugins: [react()],
});
