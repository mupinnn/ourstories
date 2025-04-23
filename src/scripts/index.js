// CSS imports
import "../styles/styles.css";
import "leaflet/dist/leaflet.css";

import App from "./pages/app";
import Camera from "./utils/camera";
import { registerServiceWorker } from "./utils";

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    skipLinkButton: document.querySelector("#skip-link"),
  });

  await registerServiceWorker();
  await app.renderPage();

  window.addEventListener("hashchange", async () => {
    await app.renderPage();
    Camera.stopAllStreams();
  });
});
