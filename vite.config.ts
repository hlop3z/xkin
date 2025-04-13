import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import pkg from "./package.json";

// Externals
import dts from "vite-plugin-dts";

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true, // creates `dist/index.d.ts`
      rollupTypes: true, // ✅ Bundle all .d.ts into one
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: pkg.name,
      fileName: "index",
      formats: ["iife", "es"], // or ["es", "iife", "umd"]
    },
    rollupOptions: {
      external: [], // add external deps here if needed
      output: {
        inlineDynamicImports: true,
        preserveModules: false,
      },
    },
    minify: true, // optional: keep output readable
  },
});
