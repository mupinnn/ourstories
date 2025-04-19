import * as StoriesAPI from "../../../data/api";
import RegisterPresenter from "./register-presenter";
import { toggleButtonDisabledState } from "../../../utils";

export default class RegisterPage {
  #presenter = null;

  async render() {
    return `
      <section class="brutalism-border p-4 space-y-4 max-w-md mx-auto">
        <h1 class="text-2xl font-bold">Register</h1>
        <form id="register-form" class="space-y-6">
          <div class="form-control">
            <label for="name">Full name</label>
            <input id="name" name="name" placeholder="Your full name . . ." required />
          </div>

          <div class="form-control">
            <label for="email">Email</label>
            <input id="email" name="email" placeholder="Your email . . ." type="email" required />
          </div>

          <div class="form-control">
            <label for="password">Password</label>
            <input id="password" name="password" placeholder="Your password . . ." type="password" required />
          </div>

          <button type="submit" class="btn btn-primary" id="register-form-submit-button">Create an account</button>
          <p>Already have an account? <a href="#/login">login</a></p>
        </form>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new RegisterPresenter({ view: this, model: StoriesAPI });
    this.#setupForm();
  }

  #setupForm() {
    document
      .getElementById("register-form")
      .addEventListener("submit", async (event) => {
        event.preventDefault();

        const formElements = event.target.elements;
        const data = {
          name: formElements.namedItem("name").value,
          email: formElements.namedItem("email").value,
          password: formElements.namedItem("password").value,
        };

        await this.#presenter.getRegistered(data);
      });
  }

  toggleSubmitLoadingButton() {
    toggleButtonDisabledState(
      document.getElementById("register-form-submit-button"),
    );
  }

  registeredSuccessfully() {
    location.hash = "/login";
  }

  registeredFailed(message) {
    alert(message);
  }
}
