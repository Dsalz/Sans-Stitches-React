import {
  checkLocalStorage,
  getDetailsFromLocalStorage,
  addDetailsToLocalStorage,
  removeDetailsFromLocalStorage
} from "../local";

import { LOGIN_USER, LOGOUT_USER } from "../actionTypes";

/* eslint-disable indent */
export const initialState = localStorage => ({
  user: checkLocalStorage(localStorage)
    ? getDetailsFromLocalStorage("user", localStorage)
    : {}
});

const userReducer = (state = initialState(localStorage), { type, payload }) => {
  switch (type) {
    case LOGIN_USER:
      addDetailsToLocalStorage({ user: payload.user }, localStorage);
      return {
        ...state,
        user: payload.user
      };
    case LOGOUT_USER:
      removeDetailsFromLocalStorage(localStorage);
      return {
        ...state,
        user: {}
      };
    default:
      return state;
  }
};

export default userReducer;
