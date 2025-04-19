import { storyMapper } from "../../data/api-mapper";

export default class StoryDetailPresenter {
  #storyId;
  #view;
  #model;

  constructor(storyId, { view, model }) {
    this.#storyId = storyId;
    this.#view = view;
    this.#model = model;
  }

  async showStoryDetailMap() {
    this.#view.toggleMapLoading();
    try {
      await this.#view.initMap();
    } catch (error) {
      console.error("showStoryDetailMap: error:", error);
    } finally {
      this.#view.toggleMapLoading();
    }
  }

  async showStoryDetail() {
    this.#view.toggleStoryDetailLoading();

    try {
      const response = await this.#model.getStoryDetail(this.#storyId);

      if (!response.ok) {
        this.#view.populateStoryDetailError(response.message);
        return;
      }

      const story = await storyMapper(response.story);

      this.#view.populateStoryDetailAndInitMap(response.message, story);
    } catch (error) {
      this.#view.populateStoryDetailError(error.message);
    } finally {
      this.#view.toggleStoryDetailLoading();
    }
  }
}
