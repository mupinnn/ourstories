import * as StoriesAPI from "../../data/api.js";
import HomePresenter from "./home-presenter";
import {
  generateStoryItemTemplate,
  generateMessageTemplate,
  generateStoriesListLoader,
} from "../../templates.js";

export default class HomePage {
  #presenter;
  #storiesListEl;

  async render() {
    return `
      <section class="space-y-6">
        <a href="#/new" class="btn btn-primary">
          <i class="fas fa-plus"></i>
          Post a story
        </a>
        <div id="stories-list"></div>
        <div id="stories-list-loading-container"></div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({ view: this, model: StoriesAPI });
    this.#storiesListEl = document.getElementById("stories-list");

    await this.#presenter.showStoriesList();
  }

  populateStoriesList(stories) {
    if (stories.length <= 0) {
      this.#storiesListEl.innerHTML = generateMessageTemplate({
        title: "No stories available",
        message: "Currently, there are no stories available to show.",
      });
      return;
    }

    const html = stories.reduce((accumulator, story) => {
      return accumulator.concat(generateStoryItemTemplate(story));
    }, "");

    this.#storiesListEl.innerHTML = `<div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">${html}</div>`;
  }

  populateStoriesListError(message) {
    this.#storiesListEl.innerHTML = generateMessageTemplate({
      title: "An error occured when retrieving stories",
      message: message ?? "Use another network or report this error.",
    });
  }

  toggleLoading() {
    const storiesListLoadingContainer = document.getElementById(
      "stories-list-loading-container",
    );

    if (storiesListLoadingContainer.firstChild) {
      storiesListLoadingContainer.innerHTML = "";
      return;
    }

    storiesListLoadingContainer.innerHTML = `
      <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">${generateStoriesListLoader()}</div>
    `;
  }
}
