export default class LoginPresenter {
  #view;
  #model;
  #authModel;

  constructor({ view, model, authModel }) {
    this.#view = view;
    this.#model = model;
    this.#authModel = authModel;
  }

  async getLoggedIn({ email, password }) {
    this.#view.toggleSubmitLoadingButton();

    try {
      const response = await this.#model.login({ email, password });

      if (!response.ok) {
        this.#view.loginFailed(response.message);
        return;
      }

      this.#authModel.putAccessToken(response.loginResult.token);
      this.#view.loginSuccessfully(response.message);
    } catch (error) {
      this.#view.loginFailed(error.message);
    } finally {
      this.#view.toggleSubmitLoadingButton();
    }
  }
}
