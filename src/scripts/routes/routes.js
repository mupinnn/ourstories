import {
  checkAuthenticatedRoute,
  checkUnauthenticatedRouteOnly,
} from "../utils/auth";
import HomePage from "../pages/home/home-page";
import RegisterPage from "../pages/auth/register/register-page";
import LoginPage from "../pages/auth/login/login-page";

const routes = {
  "/": () => checkAuthenticatedRoute(new HomePage()),

  "/register": () => checkUnauthenticatedRouteOnly(new RegisterPage()),
  "/login": () => checkUnauthenticatedRouteOnly(new LoginPage()),
};

export default routes;
