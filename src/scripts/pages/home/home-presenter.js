import { storyMapper } from "../../data/api-mapper";

export default class HomePresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showStoriesList() {
    this.#view.toggleLoading();

    try {
      const response = await this.#model.getAllStory();

      if (!response.ok) {
        this.#view.populateStoriesListError(error.message);
        return;
      }

      const stories = await Promise.all(
        response.listStory.map(async (story) => await storyMapper(story)),
      );

      this.#view.populateStoriesList(stories);
    } catch (error) {
      this.#view.populateStoriesListError(error.message);
    } finally {
      this.#view.toggleLoading();
    }
  }
}
