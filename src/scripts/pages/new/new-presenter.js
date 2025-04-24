export default class NewPresenter {
  #view;
  #model;
  #dbModel;

  constructor({ view, model, dbModel }) {
    this.#view = view;
    this.#model = model;
    this.#dbModel = dbModel;
  }

  async showNewFormMap() {
    this.#view.toggleMapLoading();

    try {
      await this.#view.initMap();
    } catch (error) {
      console.error("showNewFormMap error: ", error.message);
    } finally {
      this.#view.toggleMapLoading();
    }
  }

  async postNewStory({ description, photo, lat, lon }) {
    this.#view.toggleSubmitLoadingButton();

    try {
      const response = await this.#model.postNewStory({
        description,
        photo,
        lat,
        lon,
      });

      if (!response.ok) {
        this.#view.storeFailed(response.message);
        return;
      }

      this.#view.storeSuccessfully();
    } catch (error) {
      this.#view.storeFailed(error.message);
    } finally {
      this.#view.toggleSubmitLoadingButton();
    }
  }

  async saveAsDraft({ id, description, photo, lat, lon }) {
    try {
      await this.#dbModel.putStory({ id, description, photo, lat, lon });
      this.#view.storeSuccessfully();
    } catch (error) {
      this.#view.storeFailed(error.message);
    }
  }

  async getDraftById(id) {
    return await this.#dbModel.getStoryById(id);
  }
}
