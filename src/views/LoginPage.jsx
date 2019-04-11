import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";

// Components
import IndexNavbar from "../components/Layout/IndexNavbar";
import IndexForm from "../components/IndexForm";
import LoadingSvg from "../components/LoadingSvg";

// Actions
import { loginUserAction, clearErrorsAction } from "../actions/authActions";

// eslint-disable-next-line import/no-mutable-exports
export let state, setState;
export const LoginPage = ({
  logUserIn,
  isLoggedIn,
  errorMessages,
  loading,
  clearErrors
}) => {
  [state, setState] = useState({
    email: "",
    password: ""
  });

  let otherErrorMessage = "";

  const handleChange = e => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    });
  };

  const loginFields = [
    {
      name: "email",
      placeholder: "Email",
      id: "email",
      onChange: handleChange,
      required: true
    },
    {
      name: "password",
      placeholder: "Password",
      id: "password",
      onChange: handleChange,
      type: "password",
      required: true
    }
  ];

  const handleSubmit = e => {
    e.preventDefault();
    logUserIn(state);
  };

  const handleErrors = () => {
    const emailError = errorMessages.find(e => e.email);
    const passwordError = errorMessages.find(e => e.password);
    const otherError = errorMessages.find(e => e.error);
    loginFields[0].errorMessage = emailError ? emailError.email : "";
    loginFields[1].errorMessage = passwordError ? passwordError.password : "";
    otherErrorMessage = otherError ? otherError.error : "";
  };

  if (errorMessages.length) {
    handleErrors();
  }

  return isLoggedIn ? (
    <Redirect to="/profile" />
  ) : (
    <div className="blk-rd-gradient" id="loginDiv">
      {loading && <LoadingSvg />}
      <IndexNavbar />
      <main className="index-main">
        <section className="index-form-section">
          <h4 className="index-form-section-header">Enter your Credentials</h4>
          <IndexForm
            fields={loginFields}
            submitText="Login"
            onSubmit={handleSubmit}
            errorMessage={otherErrorMessage}
            clearErrorMessage={clearErrors}
            customClass="login-index-form"
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
    logUserIn: details => dispatch(loginUserAction(details)),
    clearErrors: () => dispatch(clearErrorsAction())
  };
};

LoginPage.propTypes = {
  /**
   * Function to post details provided to Login Api Endpoint
   */
  logUserIn: PropTypes.func.isRequired,
  /**
   * Boolean value depicting if user is logged in
   */
  isLoggedIn: PropTypes.bool.isRequired,
  /**
   * Array of error messages to be displayer to the user
   */
  errorMessages: PropTypes.arrayOf(PropTypes.object),
  /**
   * Function to clear error messages from user's screen
   */
  clearErrors: PropTypes.func.isRequired,
  /**
   * Boolean value depicting when the platform is sending the data to the api
   */
  loading: PropTypes.bool.isRequired
};

LoginPage.defaultProps = {
  errorMessages: []
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage);
