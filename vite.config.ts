import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/body-map-explorer.ts"),
      name: "BodyMapExplorer",
      formats: ["es", "umd"],
      fileName: (format) => `body-map-explorer.${format}.js`,
    },
    rollupOptions: {
      external: [], // Lit is bundled in (small enough at ~5KB gzipped)
    },
    assetsInlineLimit: 0, // CRITICAL per PITFALLS.md: prevent base64 inlining
    outDir: "dist",
    sourcemap: true,
  },
});
