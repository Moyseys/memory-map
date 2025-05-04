import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "src",
  build: {
    outDir: "../static",
    emptyOutDir: true,
    watch: {
      include: "src/**",
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/js/main.js"),
        style: resolve(__dirname, "src/css/style.css"),
      },
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith(".css")) {
            return "css/[name][extname]";
          }
          return "assets/[name][extname]";
        },
        entryFileNames: "js/[name].js",
        chunkFileNames: "js/[name]-[hash].js",
      },
    },
  },
});
