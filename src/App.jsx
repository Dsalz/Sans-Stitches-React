import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";

// CSS
import "./css/appCSS.js";

// Views
import LandingPage from "./views/LandingPage";

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={LandingPage} />
      </Switch>
    </BrowserRouter>
  );
};

const appDiv = document.getElementById("app");

ReactDOM.render(<App />, appDiv);
