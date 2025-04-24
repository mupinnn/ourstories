import { storyMapper } from "../../data/api-mapper";

export default class DraftPresenter {
  #view;
  #dbModel;

  constructor({ view, dbModel }) {
    this.#view = view;
    this.#dbModel = dbModel;
  }

  async showDraftList() {
    this.#view.toggleLoading();

    try {
      const response = await this.#dbModel.getAllStories();

      if (!response) {
        this.#view.populateStoriesListError(error.message);
        return;
      }

      const stories = await Promise.all(
        response.map(async (story) => {
          const photoUrl = URL.createObjectURL(story.photo);

          return {
            ...(await storyMapper(story)),
            photoUrl,
            name: "Myself",
          };
        }),
      );

      this.#view.populateStoriesList(stories);
    } catch (error) {
      this.#view.populateStoriesListError(error.message);
    } finally {
      this.#view.toggleLoading();
    }
  }
}
