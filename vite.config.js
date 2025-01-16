// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";
import pkg from "./package.json";

const packageName = pkg.name.replace(/-/g, "_");

export default defineConfig({
  build: {
    minify: true,
    lib: {
      name: packageName,
      entry: resolve(__dirname, "src/__init__.ts"),
      formats: ["iife"],
      fileName: "index",
    },
    rollupOptions: {
      output: {
        entryFileNames: "index.min.js",
        assetFileNames: "style.min.css",
      },
    },
  },
});
