import { defineConfig } from "vite";
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    base: "/ourstories/",
    root: resolve(__dirname, "src"),
    publicDir: resolve(__dirname, "public"),
    plugins: [
      tailwindcss(),
      VitePWA({
        strategies: "injectManifest",
        srcDir: "scripts",
        filename: "sw.js",
        registerType: "autoUpdate",
        injectRegister: false,
        injectManifest: {
          globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
        },
        manifest: {
          name: "OurStories",
          description: "Share your story today to the world!",
          theme_color: "#fe9a00",
          icons: [
            {
              src: "pwa-64x64.png",
              sizes: "64x64",
              type: "image/png",
            },
            {
              src: "pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "maskable-icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
          screenshots: [
            {
              src: "images/screenshots/ourstories-desktop-1.png",
              sizes: "1280x910",
              type: "image/png",
              form_factor: "wide",
            },
            {
              src: "images/screenshots/ourstories-desktop-2.png",
              sizes: "1280x910",
              type: "image/png",
              form_factor: "wide",
            },
            {
              src: "images/screenshots/ourstories-desktop-3.png",
              sizes: "1280x910",
              type: "image/png",
              form_factor: "wide",
            },
            {
              src: "images/screenshots/ourstories-mobile-1.png",
              sizes: "360x640",
              type: "image/png",
              form_factor: "narrow",
            },
            {
              src: "images/screenshots/ourstories-mobile-2.png",
              sizes: "360x640",
              type: "image/png",
              form_factor: "narrow",
            },
            {
              src: "images/screenshots/ourstories-mobile-3.png",
              sizes: "360x640",
              type: "image/png",
              form_factor: "narrow",
            },
          ],
          shortcuts: [
            {
              name: "New story",
              short_name: "New",
              description: "Create a new story.",
              url: "/ourstories/?source=pwa#/new",
              icons: [
                {
                  src: "images/icons/plus.svg",
                  sizes: "131x150",
                },
              ],
            },
          ],
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
