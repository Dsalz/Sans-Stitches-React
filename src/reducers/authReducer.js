import {
  checkLocalStorage,
  getDetailsFromLocalStorage,
  addDetailsToLocalStorage,
  removeDetailsFromLocalStorage
} from "../local";

import {
  LOGIN_ERROR,
  LOGIN_USER,
  CLEAR_AUTH_ERRORS,
  AUTH_LOADING,
  LOGOUT_USER
} from "../actionTypes";

/* eslint-disable indent */
export const initialState = localStorage => ({
  isLoggedIn: checkLocalStorage(localStorage),
  token: checkLocalStorage(localStorage)
    ? getDetailsFromLocalStorage("token", localStorage)
    : "",
  errorMessages: [],
  loading: false
});

const authReducer = (state = initialState(localStorage), { type, payload }) => {
  switch (type) {
    case LOGIN_USER:
      addDetailsToLocalStorage({ token: payload.token }, localStorage);
      return {
        ...state,
        isLoggedIn: true,
        token: payload.token,
        loading: false
      };
    case LOGOUT_USER:
      removeDetailsFromLocalStorage(localStorage);
      return {
        ...state,
        isLoggedIn: false,
        token: ""
      };
    case LOGIN_ERROR:
      return {
        ...state,
        errorMessages:
          payload instanceof Array ? payload : [{ error: payload }],
        loading: false
      };
    case AUTH_LOADING:
      return {
        ...state,
        loading: true
      };
    case CLEAR_AUTH_ERRORS:
      return {
        ...state,
        errorMessages: []
      };
    default:
      return state;
  }
};

export default authReducer;
