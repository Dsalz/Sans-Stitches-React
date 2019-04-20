import "babel-polyfill";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { mount, shallow } from "enzyme";
import {
  SignUpPage,
  getState,
  mapDispatchToProps,
  mapStateToProps
} from "../../views/SignUpPage";

describe("Sign Up Page View", () => {
  it("renders the Sign Up page", () => {
    const mockFunction = jest.fn();
    const signUpPage = mount(
      <BrowserRouter>
        <SignUpPage
          signUserIn={mockFunction}
          clearErrors={mockFunction}
          isLoggedIn={false}
          errorMessages={[]}
          loading={false}
        />
      </BrowserRouter>
    );
    expect(signUpPage.find("div#signUpDiv").exists()).toBe(true);
    expect(signUpPage.find("main.index-main").exists()).toBe(true);
    expect(signUpPage.find("nav.index-navbar").exists()).toBe(true);
    expect(signUpPage.find("form.signup-index-form").exists()).toBe(true);
  });

  it("redirects users to the profile page once logged in", () => {
    const mockFunction = jest.fn();
    const signUpPage = shallow(
      <SignUpPage
        signUserIn={mockFunction}
        clearErrors={mockFunction}
        isLoggedIn
        errorMessages={[]}
        loading={false}
      />
    );
    expect(signUpPage.find("Redirect").exists()).toBe(true);
    const link = signUpPage.find("Redirect").props("to");
    expect(link.to).toEqual("/profile");
  });

  it("shows loading svg when loading prop is true", () => {
    const mockFunction = jest.fn();
    const signUpPage = mount(
      <BrowserRouter>
        <SignUpPage
          signUserIn={mockFunction}
          clearErrors={mockFunction}
          isLoggedIn={false}
          errorMessages={[]}
          loading
        />
      </BrowserRouter>
    );
    expect(signUpPage.find("div.loading-svg-div").exists()).toBe(true);
    expect(signUpPage.find("svg").exists()).toBe(true);
  });

  it("updates state when the input field is changed", () => {
    const mockFunction = jest.fn();
    const mockSignUserIn = jest.fn();
    const signUpPage = mount(
      <BrowserRouter>
        <SignUpPage
          signUserIn={mockSignUserIn}
          clearErrors={mockFunction}
          isLoggedIn={false}
          errorMessages={[]}
          loading={false}
        />
      </BrowserRouter>
    );
    signUpPage
      .find("input#name")
      .simulate("change", { target: { name: "name", value: "abcd" } });
    expect(getState().name).toEqual("abcd");
    signUpPage
      .find("input#email")
      .simulate("change", { target: { name: "email", value: "abc" } });
    expect(getState().email).toEqual("abc");
    signUpPage.find("input#phonenumber").simulate("change", {
      target: { name: "phoneNumber", value: "08011223233" }
    });
    expect(getState().phoneNumber).toEqual("08011223233");
    signUpPage
      .find("input#password")
      .simulate("change", { target: { name: "password", value: "zxcv" } });
    expect(getState().password).toEqual("zxcv");
    signUpPage.find("input#confirmpassword").simulate("change", {
      target: { name: "confirmPassword", value: "zxcv" }
    });
    expect(getState().confirmPassword).toEqual("zxcv");
  });

  it("fires the signUserIn function when the form is submitted", () => {
    const mockFunction = jest.fn();
    const mockSignUserIn = jest.fn();
    const signUpPage = mount(
      <BrowserRouter>
        <SignUpPage
          signUserIn={mockSignUserIn}
          clearErrors={mockFunction}
          isLoggedIn={false}
          errorMessages={[]}
          loading={false}
        />
      </BrowserRouter>
    );
    signUpPage.find("form").simulate("submit", { preventDefault: () => null });
    expect(mockSignUserIn.mock.calls.length).toEqual(1);
  });

  it("receives the right props", () => {
    const mockStore = {
      auth: {
        isLoggedIn: false,
        errorMessages: [],
        loading: false
      }
    };

    const mockDetails = {};

    const mockDispatch = action => `Mocked Dispatch of ${action}`;
    const signUpProps = mapStateToProps(mockStore);
    const signUpDispatchProps = mapDispatchToProps(mockDispatch);
    expect(signUpProps.loading).toEqual(false);
    expect(signUpProps.isLoggedIn).toEqual(false);
    expect(signUpProps.errorMessages).toEqual([]);
    expect(signUpDispatchProps.clearErrors()).toBeDefined();
    expect(signUpDispatchProps.clearErrors()).toContain("Mocked Dispatch of");
    expect(signUpDispatchProps.signUserIn(mockDetails)).toBeDefined();
    expect(signUpDispatchProps.signUserIn(mockDetails)).toContain(
      "Mocked Dispatch of"
    );
  });

  it("displays errors when they are present", () => {
    const mockErrorMessages = [
      { name: "Invalid Name" },
      { password: "Password and Confirm Password do not match" },
      { error: "Invalid Credentials" }
    ];

    const mockFunction = jest.fn();
    const mockSignUserIn = jest.fn();
    const signUpPage = mount(
      <BrowserRouter>
        <SignUpPage
          signUserIn={mockSignUserIn}
          clearErrors={mockFunction}
          isLoggedIn={false}
          errorMessages={mockErrorMessages}
          loading={false}
        />
      </BrowserRouter>
    );

    expect(
      signUpPage
        .find("p.form-error")
        .first()
        .exists()
    ).toBe(true);
    expect(
      signUpPage
        .find("p.form-error")
        .first()
        .text()
    ).toEqual("Invalid Name");
    expect(
      signUpPage
        .find("p.form-error")
        .last()
        .exists()
    ).toBe(true);
    expect(
      signUpPage
        .find("p.form-error")
        .last()
        .text()
    ).toEqual("Password and Confirm Password do not match");
    expect(signUpPage.find("h3.modal-header-text").text()).toEqual("Error");
    expect(signUpPage.find("p.modal-body-text").text()).toEqual(
      "Invalid Credentials"
    );
  });
  it("displays only name error when it's the only one present", () => {
    const mockErrorMessages = [{ name: "Invalid Name" }];

    const mockFunction = jest.fn();
    const mockSignUserIn = jest.fn();
    const signUpPage = mount(
      <BrowserRouter>
        <SignUpPage
          signUserIn={mockSignUserIn}
          clearErrors={mockFunction}
          isLoggedIn={false}
          errorMessages={mockErrorMessages}
          loading={false}
        />
      </BrowserRouter>
    );

    expect(signUpPage.find("p.form-error").exists()).toBe(true);
    expect(signUpPage.find("p.form-error").text()).toEqual("Invalid Name");
    expect(signUpPage.find("h3.modal-header-text").exists()).toBe(false);
  });
  it("displays only email error when it's the only one present", () => {
    const mockErrorMessages = [{ email: "Invalid Email" }];

    const mockFunction = jest.fn();
    const mocksignUserIn = jest.fn();
    const signUpPage = mount(
      <BrowserRouter>
        <SignUpPage
          signUserIn={mocksignUserIn}
          clearErrors={mockFunction}
          isLoggedIn={false}
          errorMessages={mockErrorMessages}
          loading={false}
        />
      </BrowserRouter>
    );

    expect(signUpPage.find("p.form-error").exists()).toBe(true);
    expect(signUpPage.find("p.form-error").text()).toEqual("Invalid Email");
    expect(signUpPage.find("h3.modal-header-text").exists()).toBe(false);
  });
  it("displays only phone number error when it's the only one present", () => {
    const mockErrorMessages = [{ phoneNumber: "Invalid Phone Number" }];

    const mockFunction = jest.fn();
    const mocksignUserIn = jest.fn();
    const signUpPage = mount(
      <BrowserRouter>
        <SignUpPage
          signUserIn={mocksignUserIn}
          clearErrors={mockFunction}
          isLoggedIn={false}
          errorMessages={mockErrorMessages}
          loading={false}
        />
      </BrowserRouter>
    );

    expect(signUpPage.find("p.form-error").exists()).toBe(true);
    expect(signUpPage.find("p.form-error").text()).toEqual(
      "Invalid Phone Number"
    );
    expect(signUpPage.find("h3.modal-header-text").exists()).toBe(false);
  });
  it("displays only password error when it's the only one present", () => {
    const mockErrorMessages = [{ password: "Invalid Password" }];

    const mockFunction = jest.fn();
    const mocksignUserIn = jest.fn();
    const signUpPage = mount(
      <BrowserRouter>
        <SignUpPage
          signUserIn={mocksignUserIn}
          clearErrors={mockFunction}
          isLoggedIn={false}
          errorMessages={mockErrorMessages}
          loading={false}
        />
      </BrowserRouter>
    );

    expect(signUpPage.find("p.form-error").exists()).toBe(true);
    expect(signUpPage.find("p.form-error").text()).toEqual("Invalid Password");
    expect(signUpPage.find("h3.modal-header-text").exists()).toBe(false);
  });
  it("displays only general error when it's the only one present", () => {
    const mockErrorMessages = [{ error: "Invalid Credentials" }];

    const mockFunction = jest.fn();
    const mocksignUserIn = jest.fn();
    const signUpPage = mount(
      <BrowserRouter>
        <SignUpPage
          signUserIn={mocksignUserIn}
          clearErrors={mockFunction}
          isLoggedIn={false}
          errorMessages={mockErrorMessages}
          loading={false}
        />
      </BrowserRouter>
    );

    expect(signUpPage.find("p.form-error").exists()).toBe(false);
    expect(signUpPage.find("h3.modal-header-text").exists()).toBe(true);
    expect(signUpPage.find("h3.modal-header-text").text()).toBe("Error");
    expect(signUpPage.find("p.modal-body-text").exists()).toBe(true);
    expect(signUpPage.find("p.modal-body-text").text()).toBe(
      "Invalid Credentials"
    );
  });
});
