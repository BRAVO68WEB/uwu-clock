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
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    modulePreload: { polyfill: true },
    sourcemap: true,
    minify: "esbuild",
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
        entryFileNames: "assets/js/[name]-[hash].js",
        chunkFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
        hoistTransitiveImports: false,
      },
      treeshake: true,
    },
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1500,
    emptyOutDir: true,
  },
  publicDir: "public",
}));
