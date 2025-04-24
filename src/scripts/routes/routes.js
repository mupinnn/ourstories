import {
  checkAuthenticatedRoute,
  checkUnauthenticatedRouteOnly,
} from "../utils/auth";
import HomePage from "../pages/home/home-page";
import RegisterPage from "../pages/auth/register/register-page";
import LoginPage from "../pages/auth/login/login-page";
import NewPage from "../pages/new/new-page";
import StoyDetailPage from "../pages/story-detail/story-detail-page";
import DraftPage from "../pages/draft/draft-page";
import NotFoundPage from "../pages/not-found/not-found-page";

const routes = {
  "/": () => checkAuthenticatedRoute(new HomePage()),
  "/new": () => checkAuthenticatedRoute(new NewPage()),
  "/new/:id": () => checkAuthenticatedRoute(new NewPage()),
  "/story/:id": () => checkAuthenticatedRoute(new StoyDetailPage()),
  "/draft": () => checkAuthenticatedRoute(new DraftPage()),

  "/register": () => checkUnauthenticatedRouteOnly(new RegisterPage()),
  "/login": () => checkUnauthenticatedRouteOnly(new LoginPage()),
  "/not-found": () => new NotFoundPage(),
};

export default routes;
