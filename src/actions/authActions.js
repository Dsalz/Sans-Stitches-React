import axios from "./customAxios";
import {
  LOGIN_ERROR,
  LOGIN_USER,
  AUTH_LOADING,
  CLEAR_AUTH_ERRORS
} from "../actionTypes";

export const loginUserAction = details => {
  return async dispatch => {
    dispatch({ type: AUTH_LOADING });
    try {
      const response = await axios.post("/auth/login", { ...details });
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

export const clearErrorsAction = () => {
  return {
    type: CLEAR_AUTH_ERRORS
  };
};
