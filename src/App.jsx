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
import AppSignUpPage from "./views/SignUpPage";
import AppProfilePage from "./views/ProfilePage";
import AppMyRecordsPage from "./views/MyRecordsPage";
import AppCreateRecordsPage from "./views/CreateRecordPage";
import AppRecordDetailPage from "./views/RecordDetailsPage";
import AppEditRecordPage from "./views/EditRecordPage";
import AppAdminOverviewPage from "./views/AdminOverviewPage";
import AppAdminAllRecordsPage from "./views/AdminAllRecordsPage";

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/login" component={AppLoginPage} />
        <Route exact path="/signup" component={AppSignUpPage} />
        <Route exact path="/profile" component={AppProfilePage} />
        <Route exact path="/myrecords" component={AppMyRecordsPage} />
        <Route exact path="/new-record" component={AppCreateRecordsPage} />
        <Route
          exact
          path="/record/:recordInfo"
          component={AppRecordDetailPage}
        />
        <Route
          exact
          path="/edit-record/:recordInfo"
          component={AppEditRecordPage}
        />
        <Route exact path="/admin-overview" component={AppAdminOverviewPage} />
        <Route exact path="/all-records" component={AppAdminAllRecordsPage} />
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
