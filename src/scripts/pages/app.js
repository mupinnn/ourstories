import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";
import { setupSkipToContent, transitionHelper } from "../utils";
import { getAccessToken, getLogout } from "../utils/auth";

class App {
  #content = null;
  #skipLinkButton = null;

  constructor({ content, skipLinkButton }) {
    this.#content = content;
    this.#skipLinkButton = skipLinkButton;

    this.#init();
  }

  #init() {
    const isLogin = !!getAccessToken();
    const logoutButton = document.getElementById("logout-button");

    setupSkipToContent(this.#skipLinkButton, this.#content);

    if (!isLogin) {
      logoutButton.classList.toggle("hidden");
      return;
    }

    logoutButton.addEventListener("click", (event) => {
      event.preventDefault();

      if (confirm("Are you sure want to logout?")) {
        getLogout();
        location.hash = "/login";
      }
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const route = routes[url];
    const page = route();

    const transition = transitionHelper({
      updateDOM: async () => {
        this.#content.innerHTML = await page.render();
      },
    });

    transition.ready
      .then(async () => {
        await page.afterRender();
      })
      .catch(console.error);

    transition.updateCallbackDone.then(() => {
      scrollTo({ top: 0, behavior: "instant" });
    });
  }
}

export default App;
