// CSS imports
import "../styles/styles.css";
import "leaflet/dist/leaflet.css";
import { registerSW } from "virtual:pwa-register";

import App from "./pages/app";
import Camera from "./utils/camera";

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    skipLinkButton: document.querySelector("#skip-link"),
  });

  await app.renderPage();

  registerSW({
    immediate: true,
    onOfflineReady() {
      console.log("Offline ready!");
    },
    onRegisteredSW(url, registration) {
      console.log("SW registered: ", { url, registration });
    },
  });

  window.addEventListener("hashchange", async () => {
    await app.renderPage();
    Camera.stopAllStreams();
  });
});
