import axios from "./customAxios";
import {
  LOGIN_ERROR,
  LOGIN_USER,
  AUTH_LOADING,
  CLEAR_AUTH_ERRORS,
  SIGNUP_USER,
  SIGNUP_ERROR,
  LOGOUT_USER
} from "../actionTypes";

/**
 * @description Action creator for posting details provided by the user to the login endpoint
 * @param {object} details details provided by the user
 * @returns {function} dispatch function with the appropriate action
 */
export const loginUserAction = ({ email, password }) => {
  return async dispatch => {
    dispatch({ type: AUTH_LOADING });
    try {
      const response = await axios.post("/auth/login", { email, password });
      const { data } = response;
      const { status, error } = data;
      dispatch(
        status === 200
          ? { type: LOGIN_USER, payload: data.data[0] }
          : { type: LOGIN_ERROR, payload: error }
      );
    } catch (err) {
      dispatch({
        type: LOGIN_ERROR,
        payload: String(err).split("at")[0]
      });
    }
  };
};

/**
 * @description Action creator for posting details provided by the user to the sign up endpoint
 * @param {object} details details provided by the user
 * @returns {function} dispatch function with the appropriate action
 */
export const signUpUserAction = ({
  name,
  email,
  phoneNumber,
  password,
  confirmPassword
}) => {
  return async dispatch => {
    dispatch({ type: AUTH_LOADING });
    try {
      const response = await axios.post("/auth/signup", {
        name,
        email,
        phoneNumber,
        password,
        confirmPassword
      });
      const { data } = response;
      const { status, error } = data;
      dispatch(
        status === 200
          ? { type: SIGNUP_USER, payload: data.data[0] }
          : { type: SIGNUP_ERROR, payload: error }
      );
    } catch (err) {
      dispatch({
        type: SIGNUP_ERROR,
        payload: String(err).split("at")[0]
      });
    }
  };
};

/**
 * @description Action creator for clearing errors displayed to the user
 * @returns {object} action
 */
export const clearErrorsAction = () => {
  return {
    type: CLEAR_AUTH_ERRORS
  };
};

/**
 * @description Action creator for logging user's out
 * @returns {object} action
 */
export const logoutUserAction = () => {
  return {
    type: LOGOUT_USER
  };
};
