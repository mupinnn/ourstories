import * as StoriesAPI from "../../../data/api.js";
import { toggleButtonDisabledState } from "../../../utils";
import * as AuthModel from "../../../utils/auth.js";
import LoginPresenter from "./login-presenter.js";

export default class LoginPage {
  #presenter = null;

  async render() {
    return `
      <section class="brutalism-border p-4 space-y-4">
        <h1 class="text-2xl font-bold">Masuk</h1>
        <form id="login-form" class="space-y-6">
          <div class="form-control">
            <label for="email">Email</label>
            <input id="email" name="email" placeholder="Masukkan alamat email Anda . . ." type="email" required />
          </div>

          <div class="form-control">
            <label for="password">Password</label>
            <input id="password" name="password" placeholder="Masukkan password Anda . . ." type="password" required />
          </div>

          <button type="submit" class="btn btn-primary" id="login-form-submit-button">Masuk</button>
          <p>Belum punya akun? <a href="#/register">daftar</a></p>
        </form>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new LoginPresenter({
      view: this,
      model: StoriesAPI,
      authModel: AuthModel,
    });
    this.#setupForm();
  }

  #setupForm() {
    document
      .getElementById("login-form")
      .addEventListener("submit", async (event) => {
        event.preventDefault();

        const formElements = event.target.elements;
        const data = {
          email: formElements.namedItem("email").value,
          password: formElements.namedItem("password").value,
        };

        await this.#presenter.getLoggedIn(data);
      });
  }

  toggleSubmitLoadingButton() {
    toggleButtonDisabledState(
      document.getElementById("login-form-submit-button"),
    );
  }

  loginSuccessfully() {
    location.hash = "/";
  }

  loginFailed(message) {
    alert(message);
  }
}
