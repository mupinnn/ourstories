import { defineConfig } from "vite";
import { resolve } from "node:path";
import { readFileSync, writeFileSync } from "node:fs";
import tailwindcss from "@tailwindcss/vite";

/** @see https://medium.com/@daeram.chung/fcm-service-worker-vite-8deccfc23fe2 */
function swEnvPlugin() {
  const srcDir = resolve(__dirname, "src");
  const swFile = readFileSync(`${srcDir}/scripts/sw.js`, "utf8");
  const transformedSwFile = swFile.replace(
    new RegExp(`import.meta.env.(\\w+)`, "g"),
    (_, varName) => `"${process.env[varName]}"`,
  );
  const finalSwFile =
    "// IMPORTANT: This file is only exist for dev mode purpose. Do not modify this file. Any changes should be made in `src/scripts/sw.js`.\n\n" +
    transformedSwFile;
  const outputPath = resolve(__dirname, "src", "public", "./sw.js");

  writeFileSync(outputPath, finalSwFile);

  return {
    name: "rollup-plugin-sw-env",
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    base: "/ourstories",
    root: resolve(__dirname, "src"),
    publicDir: resolve(__dirname, "src", "public"),
    plugins: [tailwindcss(), ...(command === "serve" ? [swEnvPlugin()] : [])],
    build: {
      outDir: resolve(__dirname, "dist"),
      emptyOutDir: true,
      ...(command === "build"
        ? {
            rollupOptions: {
              input: {
                main: "./src/index.html",
                sw: "./src/scripts/sw.js",
              },
              output: {
                entryFileNames: (chunkInfo) => {
                  return chunkInfo.name === "sw"
                    ? "[name].js"
                    : "assets/[name]-[hash].js";
                },
              },
            },
          }
        : {}),
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
  };
});
