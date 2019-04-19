import "babel-polyfill";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { mount, shallow } from "enzyme";
import {
  LoginPage,
  getState,
  mapDispatchToProps,
  mapStateToProps
} from "../../views/LoginPage";

describe("Login Page View", () => {
  it("renders the login page", () => {
    const mockFunction = jest.fn();
    const loginPage = mount(
      <BrowserRouter>
        <LoginPage
          logUserIn={mockFunction}
          clearErrors={mockFunction}
          isLoggedIn={false}
          errorMessages={[]}
          loading={false}
        />
      </BrowserRouter>
    );
    expect(loginPage.find("div#loginDiv").exists()).toBe(true);
    expect(loginPage.find("main.index-main").exists()).toBe(true);
    expect(loginPage.find("nav.index-navbar").exists()).toBe(true);
    expect(loginPage.find("form.login-index-form").exists()).toBe(true);
  });

  it("redirects users to the profile page once logged in", () => {
    const mockFunction = jest.fn();
    const loginPage = shallow(
      <LoginPage
        logUserIn={mockFunction}
        clearErrors={mockFunction}
        isLoggedIn
        errorMessages={[]}
        loading={false}
      />
    );
    expect(loginPage.find("Redirect").exists()).toBe(true);
    const link = loginPage.find("Redirect").props("to");
    expect(link.to).toEqual("/profile");
  });

  it("shows loading svg when loading prop is true", () => {
    const mockFunction = jest.fn();
    const loginPage = mount(
      <BrowserRouter>
        <LoginPage
          logUserIn={mockFunction}
          clearErrors={mockFunction}
          isLoggedIn={false}
          errorMessages={[]}
          loading
        />
      </BrowserRouter>
    );
    expect(loginPage.find("div.loading-svg-div").exists()).toBe(true);
    expect(loginPage.find("svg").exists()).toBe(true);
  });

  it("updates state when the input field is changed", () => {
    const mockFunction = jest.fn();
    const mockLogUserIn = jest.fn();
    const loginPage = mount(
      <BrowserRouter>
        <LoginPage
          logUserIn={mockLogUserIn}
          clearErrors={mockFunction}
          isLoggedIn={false}
          errorMessages={[]}
          loading={false}
        />
      </BrowserRouter>
    );
    loginPage
      .find("input#email")
      .simulate("change", { target: { name: "email", value: "abc" } });
    expect(getState().email).toEqual("abc");
  });

  it("fires the logUserIn a when form is submitted", () => {
    const mockFunction = jest.fn();
    const mockLogUserIn = jest.fn();
    const loginPage = mount(
      <BrowserRouter>
        <LoginPage
          logUserIn={mockLogUserIn}
          clearErrors={mockFunction}
          isLoggedIn={false}
          errorMessages={[]}
          loading={false}
        />
      </BrowserRouter>
    );
    loginPage.find("form").simulate("submit", { preventDefault: () => null });
    expect(mockLogUserIn.mock.calls.length).toEqual(1);
  });

  it("receives the right props", () => {
    const mockStore = {
      auth: {
        isLoggedIn: false,
        errorMessages: [],
        loading: false
      }
    };

    const mockDispatch = action => `Mocked Dispatch of ${action}`;
    const loginProps = mapStateToProps(mockStore);
    const loginDispatchProps = mapDispatchToProps(mockDispatch);
    expect(loginProps.loading).toEqual(false);
    expect(loginProps.isLoggedIn).toEqual(false);
    expect(loginProps.errorMessages).toEqual([]);
    expect(loginDispatchProps.clearErrors()).toBeDefined();
    expect(loginDispatchProps.clearErrors()).toContain("Mocked Dispatch of");
    expect(loginDispatchProps.logUserIn()).toBeDefined();
    expect(loginDispatchProps.logUserIn()).toContain("Mocked Dispatch of");
  });

  it("displays all errors when they are present", () => {
    const mockErrorMessages = [
      { email: "Invalid Email" },
      { password: "Invalid Password" },
      { error: "Invalid Credentials" }
    ];

    const mockFunction = jest.fn();
    const mockLogUserIn = jest.fn();
    const loginPage = mount(
      <BrowserRouter>
        <LoginPage
          logUserIn={mockLogUserIn}
          clearErrors={mockFunction}
          isLoggedIn={false}
          errorMessages={mockErrorMessages}
          loading={false}
        />
      </BrowserRouter>
    );

    expect(
      loginPage
        .find("p.form-error")
        .first()
        .exists()
    ).toBe(true);
    expect(
      loginPage
        .find("p.form-error")
        .first()
        .text()
    ).toEqual("Invalid Email");
    expect(
      loginPage
        .find("p.form-error")
        .last()
        .exists()
    ).toBe(true);
    expect(
      loginPage
        .find("p.form-error")
        .last()
        .text()
    ).toEqual("Invalid Password");
    expect(loginPage.find("h3.modal-header-text").text()).toEqual("Error");
    expect(loginPage.find("p.modal-body-text").text()).toEqual(
      "Invalid Credentials"
    );
  });
  it("displays only email error when it's the only one present", () => {
    const mockErrorMessages = [{ email: "Invalid Email" }];

    const mockFunction = jest.fn();
    const mockLogUserIn = jest.fn();
    const loginPage = mount(
      <BrowserRouter>
        <LoginPage
          logUserIn={mockLogUserIn}
          clearErrors={mockFunction}
          isLoggedIn={false}
          errorMessages={mockErrorMessages}
          loading={false}
        />
      </BrowserRouter>
    );

    expect(loginPage.find("p.form-error").exists()).toBe(true);
    expect(loginPage.find("p.form-error").text()).toEqual("Invalid Email");
    expect(loginPage.find("h3.modal-header-text").exists()).toBe(false);
  });
  it("displays only password error when it's the only one present", () => {
    const mockErrorMessages = [{ password: "Invalid Password" }];

    const mockFunction = jest.fn();
    const mockLogUserIn = jest.fn();
    const loginPage = mount(
      <BrowserRouter>
        <LoginPage
          logUserIn={mockLogUserIn}
          clearErrors={mockFunction}
          isLoggedIn={false}
          errorMessages={mockErrorMessages}
          loading={false}
        />
      </BrowserRouter>
    );

    expect(loginPage.find("p.form-error").exists()).toBe(true);
    expect(loginPage.find("p.form-error").text()).toEqual("Invalid Password");
    expect(loginPage.find("h3.modal-header-text").exists()).toBe(false);
  });
  it("displays only general error when it's the only one present", () => {
    const mockErrorMessages = [{ error: "Invalid Credentials" }];

    const mockFunction = jest.fn();
    const mockLogUserIn = jest.fn();
    const loginPage = mount(
      <BrowserRouter>
        <LoginPage
          logUserIn={mockLogUserIn}
          clearErrors={mockFunction}
          isLoggedIn={false}
          errorMessages={mockErrorMessages}
          loading={false}
        />
      </BrowserRouter>
    );

    expect(loginPage.find("p.form-error").exists()).toBe(false);
    expect(loginPage.find("h3.modal-header-text").exists()).toBe(true);
    expect(loginPage.find("h3.modal-header-text").text()).toBe("Error");
    expect(loginPage.find("p.modal-body-text").exists()).toBe(true);
    expect(loginPage.find("p.modal-body-text").text()).toBe(
      "Invalid Credentials"
    );
  });
});
