import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";
import {
  setupSkipToContent,
  transitionHelper,
  isServiceWorkerAvailable,
} from "../utils";
import { getAccessToken, getLogout } from "../utils/auth";
import {
  isCurrentPushSubscriptionAvailable,
  subscribe,
  unsubscribe,
} from "../utils/notification";

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

  async #setupPushNotification() {
    const subscribeButton = document.getElementById("subscribe-notif-button");
    const isSubscribed = await isCurrentPushSubscriptionAvailable();

    console.log("setupPush: ", { isSubscribed });

    if (subscribeButton) {
      if (isSubscribed) {
        subscribeButton.innerHTML = `<i class="fas fa-bell-slash"></i> Unsubscribe`;
        subscribeButton.addEventListener("click", async () => {
          unsubscribe().finally(() => {
            this.#setupPushNotification();
          });
        });

        return;
      }

      subscribeButton.innerHTML = `<i class="fas fa-bell"></i> Subscribe`;
      subscribeButton.addEventListener("click", async () => {
        subscribe().finally(() => {
          this.#setupPushNotification();
        });
      });
    }
  }

  async renderPage() {
    const url = getActiveRoute();
    const route = routes[url] || routes["/not-found"];
    const page = route();

    const transition = transitionHelper({
      updateDOM: async () => {
        this.#content.innerHTML = await page.render();
      },
    });

    transition.ready
      .then(async () => {
        await page.afterRender();

        if (isServiceWorkerAvailable()) {
          this.#setupPushNotification();
        }
      })
      .catch(console.error);

    transition.updateCallbackDone.then(() => {
      scrollTo({ top: 0, behavior: "instant" });
    });
  }
}

export default App;
