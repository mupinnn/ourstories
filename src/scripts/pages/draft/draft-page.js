import DraftPresenter from "./draft-presenter.js";
import DB from "../../data/database.js";
import {
  generateStoryItemTemplate,
  generateMessageTemplate,
  generateStoriesListLoader,
} from "../../templates.js";

export default class DraftPage {
  #presenter;
  #draftListEl;

  async render() {
    return `
      <section class="space-y-4">
        <h1 class="text-2xl font-bold">Draft</h1>
        <div id="draft-list"></div>
        <div id="draft-list-loading-container"></div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new DraftPresenter({ view: this, dbModel: DB });
    this.#draftListEl = document.getElementById("draft-list");

    await this.#presenter.showDraftList();
  }

  populateStoriesList(stories) {
    if (stories.length <= 0) {
      this.#draftListEl.innerHTML = generateMessageTemplate({
        title: "No draft available",
        message: "Currently, there are no draft available to show.",
      });
      return;
    }

    const html = stories.reduce((accumulator, story) => {
      return accumulator.concat(
        generateStoryItemTemplate({
          ...story,
          url: `#/new/${story.id}`,
        }),
      );
    }, "");

    this.#draftListEl.innerHTML = `<div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">${html}</div>`;
  }

  populateStoriesListError(message) {
    this.#draftListEl.innerHTML = generateMessageTemplate({
      title: "An error occured when retrieving draft",
      message: message ?? "Use another network or report this error.",
    });
  }

  toggleLoading() {
    const draftListLoadingContainer = document.getElementById(
      "draft-list-loading-container",
    );

    if (draftListLoadingContainer.firstChild) {
      draftListLoadingContainer.innerHTML = "";
      return;
    }

    draftListLoadingContainer.innerHTML = `
      <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">${generateStoriesListLoader()}</div>
    `;
  }
}
