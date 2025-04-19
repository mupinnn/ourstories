import * as StoriesAPI from "../../data/api.js";
import { parseActivePathname } from "../../routes/url-parser";
import {
  generateLoader,
  generateMessageTemplate,
  generateStoryDetailTemplate,
} from "../../templates";
import Map from "../../utils/map.js";
import StoryDetailPresenter from "./story-detail-presenter";

export default class StoyDetailPage {
  #presenter = null;
  #map = null;

  async render() {
    return `
      <section class="space-y-6 max-w-xl mx-auto">
        <div id="story-detail" class="space-y-6"></div>
        <div id="story-detail-loading-container"></div>
        <div id="map-container" class="brutalism-border">
          <div id="map" class="h-96 rounded-lg"></div>
          <div id="map-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new StoryDetailPresenter(parseActivePathname().id, {
      view: this,
      model: StoriesAPI,
    });

    await this.#presenter.showStoryDetail();
  }

  async populateStoryDetailAndInitMap(message, story) {
    document.getElementById("story-detail").innerHTML =
      generateStoryDetailTemplate({
        name: story.name,
        description: story.description,
        photoUrl: story.photoUrl,
        placeName: story.placeName,
        createdAt: story.createdAt,
      });

    // Map
    await this.#presenter.showStoryDetailMap();

    if (this.#map) {
      const storyCoordinate = [story.lat, story.lon];
      const markerOptions = { alt: story.description };
      const popupOptions = { content: story.description };

      this.#map.changeCamera(storyCoordinate);
      this.#map.addMarker(storyCoordinate, markerOptions, popupOptions);
    }
  }

  async initMap() {
    this.#map = await Map.build("#map", { zoom: 15 });
  }

  toggleMapLoading() {
    const mapLodingContainer = document.getElementById("map-loading-container");

    if (mapLodingContainer.firstChild) {
      mapLodingContainer.innerHTML = "";
      return;
    }

    mapLodingContainer.innerHTML = generateLoader();
  }

  toggleStoryDetailLoading() {
    const storyDetailLoadingContainer = document.getElementById(
      "story-detail-loading-container",
    );

    if (storyDetailLoadingContainer.firstChild) {
      storyDetailLoadingContainer.innerHTML = "";
      return;
    }

    storyDetailLoadingContainer.innerHTML = generateLoader();
  }

  populateStoryDetailError(message) {
    document.getElementById("story-detail").innerHTML = generateMessageTemplate(
      {
        title: "An error occured when retrieving story detail",
        message: message ?? "Use another network or report this error.",
      },
    );
  }
}
