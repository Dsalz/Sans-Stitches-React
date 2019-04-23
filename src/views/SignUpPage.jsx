import React, { useState } from "react";
import { connect } from "react-redux";
import { func, bool, arrayOf, object } from "prop-types";
import { Redirect } from "react-router-dom";

// Components
import IndexNavbar from "../components/Layout/IndexNavbar";
import IndexForm from "../components/IndexForm";
import LoadingSvg from "../components/LoadingSvg";

// Actions
import { signUpUserAction, clearErrorsAction } from "../actions/authActions";

let state, setState;

export const getState = () => state;

export const SignUpPage = ({
  signUserIn,
  isLoggedIn,
  errorMessages,
  loading,
  clearErrors
}) => {
  [state, setState] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    errorCleared: false
  });

  const {
    name,
    email,
    phoneNumber,
    password,
    confirmPassword,
    errorCleared
  } = state;

  if (!errorCleared) {
    clearErrors();
    setState({
      ...state,
      errorCleared: true
    });
  }

  let otherErrorMessage = "";

  const handleChange = e => {
    clearErrors();
    setState({
      ...state,
      [e.target.name]: e.target.value
    });
  };

  const signUpFields = [
    {
      name: "name",
      placeholder: "Full Name",
      id: "name",
      onChange: handleChange,
      required: true,
      value: name
    },
    {
      name: "email",
      placeholder: "Email",
      id: "email",
      onChange: handleChange,
      required: true,
      value: email
    },
    {
      name: "phoneNumber",
      placeholder: "Phone Number",
      id: "phonenumber",
      onChange: handleChange,
      required: true,
      type: "number",
      value: phoneNumber
    },
    {
      name: "password",
      placeholder: "Password",
      id: "password",
      onChange: handleChange,
      type: "password",
      required: true,
      value: password
    },
    {
      name: "confirmPassword",
      placeholder: "Confirm Password",
      id: "confirmpassword",
      onChange: handleChange,
      type: "password",
      required: true,
      value: confirmPassword
    }
  ];

  const handleSubmit = e => {
    e.preventDefault();
    signUserIn(state);
  };

  const handleErrors = () => {
    const fullnameError = errorMessages.find(e => e.name);
    const emailError = errorMessages.find(e => e.email);
    const phonenumberError = errorMessages.find(e => e.phoneNumber);
    const passwordError = errorMessages.find(e => e.password);
    const otherError = errorMessages.find(e => e.error);
    signUpFields[0].errorMessage = fullnameError ? fullnameError.name : "";
    signUpFields[1].errorMessage = emailError ? emailError.email : "";
    signUpFields[2].errorMessage = phonenumberError
      ? phonenumberError.phoneNumber
      : "";
    signUpFields[3].errorMessage = passwordError ? passwordError.password : "";
    otherErrorMessage = otherError ? otherError.error : "";
  };

  if (errorMessages.length) {
    handleErrors();
  }

  return isLoggedIn ? (
    <Redirect to="/profile" />
  ) : (
    <div className="blk-rd-gradient" id="signUpDiv">
      {loading && <LoadingSvg light />}
      <IndexNavbar />
      <main className="index-main">
        <section className="index-form-section">
          <h4 className="index-form-section-header">
            Take a few seconds to sign up
          </h4>
          <IndexForm
            fields={signUpFields}
            submitText="Sign Up"
            onSubmit={handleSubmit}
            errorMessage={otherErrorMessage}
            clearErrorMessage={clearErrors}
            customClass="signup-index-form"
          />
        </section>
      </main>
    </div>
  );
};

export const mapStateToProps = ({ auth }) => {
  const { isLoggedIn, errorMessages, loading } = auth;
  return {
    isLoggedIn,
    errorMessages,
    loading
  };
};

export const mapDispatchToProps = dispatch => {
  return {
    signUserIn: details => dispatch(signUpUserAction(details)),
    clearErrors: () => dispatch(clearErrorsAction())
  };
};

SignUpPage.propTypes = {
  /**
   * Function to post details provided to Sign Up Api Endpoint
   */
  signUserIn: func.isRequired,
  /**
   * Boolean value depicting if user is logged in
   */
  isLoggedIn: bool.isRequired,
  /**
   * Array of error messages to be displayer to the user
   */
  errorMessages: arrayOf(object),
  /**
   * Function to clear error messages from user's screen
   */
  clearErrors: func.isRequired,
  /**
   * Boolean value depicting when the platform is sending the data to the api
   */
  loading: bool.isRequired
};

SignUpPage.defaultProps = {
  errorMessages: []
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpPage);
