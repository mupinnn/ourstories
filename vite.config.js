import { defineConfig } from "vite";
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    base: "/ourstories",
    root: resolve(__dirname, "src"),
    publicDir: resolve(__dirname, "src", "public"),
    plugins: [
      tailwindcss(),
      VitePWA({
        includeAssets: ["**/*"],
        injectRegister: false,
        strategies: "injectManifest",
        srcDir: "scripts",
        filename: "sw.js",
        devOptions: {
          enabled: true,
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,icon,png,svg,woff,woff2,ttf,otf}"],
        },
      }),
    ],
    build: {
      outDir: resolve(__dirname, "dist"),
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
  };
});
