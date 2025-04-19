export default class RegisterPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async getRegistered({ name, email, password }) {
    this.#view.toggleSubmitLoadingButton();

    try {
      const response = await this.#model.register({ name, email, password });

      if (!response.ok) {
        this.#view.registeredFailed(response.message);
        return;
      }

      this.#view.registeredSuccessfully(response.message, response.data);
    } catch (error) {
      this.#view.registeredFailed(error.message);
    } finally {
      this.#view.toggleSubmitLoadingButton();
    }
  }
}
