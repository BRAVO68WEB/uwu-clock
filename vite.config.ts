import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean,
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    modulePreload: { polyfill: false },
    sourcemap: false,
    minify: "esbuild",
    // Strip debug statements for smaller bundles
    esbuild: {
      drop: ["console", "debugger"],
    },
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        sw: path.resolve(__dirname, "public/sw.js"),
      },
      output: {
        dir: "dist",
        entryFileNames: "[name].js",
        // Use content hashing for better long-term caching on non-entry chunks
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name].[ext]",
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("three")) return "vendor_three";
            if (id.includes("postprocessing")) return "vendor_postprocessing";
            if (id.includes("react") || id.includes("react-dom"))
              return "vendor_react";
            if (id.includes("framer-motion")) return "vendor_motion";
            if (id.includes("@radix-ui") || id.includes("cmdk"))
              return "vendor_radix";
            if (id.includes("@tanstack")) return "vendor_tanstack";
            if (id.includes("react-router")) return "vendor_router";
            if (id.includes("recharts")) return "vendor_charts";
            return "vendor";
          }
          // Group background effects separately to keep the main app lean
          if (id.includes("/src/components/backgrounds/")) {
            return "backgrounds";
          }
        },
      },
      // Favor reliable tree-shaking behavior
      treeshake: "recommended",
    },
  },
  // Ensure service worker is served correctly
  publicDir: "public",
}));
