import NewPresenter from "./new-presenter";
import * as StoriesAPI from "../../data/api";
import { toggleButtonDisabledState } from "../../utils";
import Map from "../../utils/map";
import Camera from "../../utils/camera";
import { generateLoader } from "../../templates";

export default class NewPage {
  #presenter = null;
  #form = null;
  #map = null;
  #camera = null;
  #takenPicture = null;
  #isCameraOpen = false;

  async render() {
    return `
      <section class="brutalism-border p-4 space-y-4">
        <h1 class="text-2xl font-bold">New story</h1>
        <form id="new-form" class="space-y-6">
          <div class="form-control">
            <label for="description">Description</label>
            <textarea id="description" name="description" placeholder="Describe your exciting story . . ." rows="5" required></textarea>
          </div>

          <div class="form-control">
            <label for="picture">Take a picture</label>
            <button class="btn btn-primary w-fit" type="button" id="open-camera-button">Open camera</button>
            <div id="camera-container" class="hidden flex-col gap-4">
              <video id="camera-video" class="w-full">Video stream not available.</video>
              <canvas id="camera-canvas" class="hidden"></canvas>
              <div class="flex flex-col gap-4">
                <select id="camera-select"></select>
                <div class="flex items-center gap-2">
                  <button class="btn btn-primary" id="camera-take-button" type="button">Take picture</button>
                  <button class="btn btn-primary" id="camera-flip-button" type="button">Flip camera</button>
                </div>
              </div>
            </div>
            <div id="camera-result"></div>
          </div>

          <div class="form-control">
            <label for="location">Location</label>
            <div id="map-container">
              <div id="map" class="h-96"></div>
              <div id="map-loading-container"></div>
            </div>
            <div class="flex items-center gap-2">
              <input type="number" name="latitude" value="-6.175389" disabled>
              <input type="number" name="longitude" value="106.827139" disabled>
            </div>
          </div>

          <div class="flex justify-end items-center gap-2">
            <a href="#/" class="btn" id="new-form-back-button">Back</a>
            <button type="submit" class="btn btn-primary" id="new-form-submit-button">Post!</button>
          </div>
        </form>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new NewPresenter({ view: this, model: StoriesAPI });

    this.#setupForm();
    await this.#presenter.showNewFormMap();
  }

  #setupForm() {
    this.#form = document.getElementById("new-form");
    this.#form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const data = {
        description: this.#form.elements.namedItem("description").value,
        photo: this.#takenPicture.blob,
        lat: this.#form.elements.namedItem("latitude").value,
        lon: this.#form.elements.namedItem("longitude").value,
      };

      await this.#presenter.postNewStory(data);
    });

    const cameraContainer = document.getElementById("camera-container");

    document
      .getElementById("open-camera-button")
      .addEventListener("click", async (event) => {
        cameraContainer.classList.toggle("flex");
        cameraContainer.classList.toggle("hidden");

        this.#isCameraOpen = cameraContainer.classList.contains("flex");

        if (this.#isCameraOpen) {
          event.currentTarget.textContent = "Close camera";
          this.#setupCamera();
          await this.#camera.launch();
          return;
        }

        event.currentTarget.textContent = "Open camera";
        this.#camera.stop();
      });
  }

  async initMap() {
    this.#map = await Map.build("#map", {
      zoom: 15,
      locate: true,
    });

    const centerCoordinate = this.#map.getCenter();

    this.#updateLatLngInput(
      centerCoordinate.latitude,
      centerCoordinate.longitude,
    );

    const draggableMarker = this.#map.addMarker(
      [centerCoordinate.latitude, centerCoordinate.longitude],
      { draggable: true },
    );

    draggableMarker.addEventListener("move", (event) => {
      const coordinate = event.target.getLatLng();
      this.#updateLatLngInput(coordinate.lat, coordinate.lng);
    });

    this.#map.addMapEventListener("click", (event) => {
      draggableMarker.setLatLng(event.latlng);
      event.sourceTarget.flyTo(event.latlng);
    });
  }

  #updateLatLngInput(latitude, longitude) {
    this.#form.elements.namedItem("latitude").value = latitude;
    this.#form.elements.namedItem("longitude").value = longitude;
  }

  #setupCamera() {
    if (!this.#camera) {
      this.#camera = new Camera({
        video: document.getElementById("camera-video"),
        cameraSelect: document.getElementById("camera-select"),
        canvas: document.getElementById("camera-canvas"),
      });
    }

    this.#camera.addCheeseButtonListener("#camera-take-button", async () => {
      const image = await this.#camera.takePicture();
      this.#addTakenPicture(image);
      this.#populateTakenPicture();
    });

    this.#camera.addFlipButtonListener("#camera-flip-button", async () => {
      await this.#camera.flip();
    });
  }

  #addTakenPicture(image) {
    let blob = image;

    if (image instanceof String) {
      blob = convertBase64ToBlob(image, "image/png");
    }

    const newPicture = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      blob: blob,
    };
    this.#takenPicture = newPicture;
  }

  #populateTakenPicture() {
    if (!this.#takenPicture) {
      document.getElementById("camera-result").innerHTML = "";
      return;
    }

    const imageUrl = URL.createObjectURL(this.#takenPicture.blob);

    document.getElementById("camera-result").innerHTML =
      `<button id="delete-picture" type="button"><img src="${imageUrl}" alt="Newly taken story image" /></button>`;

    document.getElementById("delete-picture").addEventListener("click", () => {
      this.#takenPicture = null;
      this.#populateTakenPicture();
    });
  }

  toggleSubmitLoadingButton() {
    toggleButtonDisabledState(
      document.getElementById("new-form-submit-button"),
    );
  }

  toggleMapLoading() {
    const mapLodingContainer = document.getElementById("map-loading-container");

    if (mapLodingContainer.firstChild) {
      mapLodingContainer.innerHTML = "";
      return;
    }

    mapLodingContainer.innerHTML = generateLoader();
  }

  clearForm() {
    this.#form.reset();
  }

  storeSuccessfully() {
    this.clearForm();
    location.hash = "/";
  }

  storeFailed(message) {
    alert(message);
  }
}
