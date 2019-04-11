import "babel-polyfill";
import React from "react";
import { render } from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";

// Redux Store
import store from "./store";

// CSS
import "./css/appCSS.js";

// Views
import LandingPage from "./views/LandingPage";
import AppLoginPage from "./views/LoginPage";

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/login" component={AppLoginPage} />
      </Switch>
    </BrowserRouter>
  );
};

const appDiv = document.getElementById("app");

render(
  <Provider store={store}>
    <App />
  </Provider>,
  appDiv
);
