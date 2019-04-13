import authReducer, { initialState } from "../../reducers/authReducer";
import {
  LOGIN_ERROR,
  LOGIN_USER,
  AUTH_LOADING,
  CLEAR_AUTH_ERRORS,
  LOGOUT_USER,
  SIGNUP_USER,
  SIGNUP_ERROR
} from "../../actionTypes";

describe("auth reducer's initial state", () => {
  it("should indicate that a user is not logged in when there is no app data in local storage", () => {
    const mockLocalStorage = {};
    const reducerState = authReducer(initialState(mockLocalStorage), {
      type: "INITIAL_AUTH_STATE"
    });
    expect(reducerState.isLoggedIn).toEqual(false);
    expect(reducerState.token).toEqual("");
    expect(reducerState.errorMessages).toEqual([]);
    expect(reducerState.loading).toEqual(false);
  });
  it("should indicate that a user is logged in when there is app data in local storage", () => {
    const mockLocalStorage = {
      sansStitches: JSON.stringify({
        token: "qwerty",
        user: {
          key: "value"
        }
      })
    };
    const reducerState = authReducer(initialState(mockLocalStorage), {
      type: "INITIAL_AUTH_STATE"
    });
    expect(reducerState.isLoggedIn).toEqual(true);
    expect(reducerState.token).toEqual("qwerty");
    expect(reducerState.errorMessages).toEqual([]);
    expect(reducerState.loading).toEqual(false);
  });
});

describe("auth reducer", () => {
  const mockLocalStorage = {};
  it("should log user in when action is dispatched", () => {
    const reducerState = authReducer(initialState(mockLocalStorage), {
      type: LOGIN_USER,
      payload: {
        token: "qwerty"
      }
    });
    expect(reducerState.isLoggedIn).toEqual(true);
    expect(reducerState.token).toEqual("qwerty");
    expect(reducerState.loading).toEqual(false);
    expect(reducerState.errorMessages).toEqual([]);
  });

  it("should log user out when action is dispatched", () => {
    const reducerState = authReducer(initialState(mockLocalStorage), {
      type: LOGOUT_USER
    });
    expect(reducerState.isLoggedIn).toEqual(false);
    expect(reducerState.token).toEqual("");
    expect(reducerState.loading).toEqual(false);
  });

  it("should update loading state when action is dispatched", () => {
    const reducerState = authReducer(initialState(mockLocalStorage), {
      type: AUTH_LOADING
    });
    expect(reducerState.loading).toEqual(true);
  });

  it("should update error messages when LOGIN_ERROR action is dispatched", () => {
    const reducerState = authReducer(initialState(mockLocalStorage), {
      type: LOGIN_ERROR,
      payload: [{ email: "Invalid Email" }]
    });
    expect(reducerState.errorMessages).toEqual([{ email: "Invalid Email" }]);
    expect(reducerState.loading).toEqual(false);
  });

  it("should convert string error message to array when LOGIN_ERROR action is dispatched", () => {
    const reducerState = authReducer(initialState(mockLocalStorage), {
      type: LOGIN_ERROR,
      payload: "Invalid Credentials"
    });
    expect(reducerState.errorMessages).toEqual([
      { error: "Invalid Credentials" }
    ]);
    expect(reducerState.loading).toEqual(false);
  });

  it("should clear all error messages when action is dispatched", () => {
    const initialReducerState = authReducer(initialState(mockLocalStorage), {
      type: LOGIN_ERROR,
      payload: "Invalid Email"
    });
    expect(initialReducerState.errorMessages).toEqual([
      { error: "Invalid Email" }
    ]);
    const reducerState = authReducer(initialState(mockLocalStorage), {
      type: CLEAR_AUTH_ERRORS
    });
    expect(reducerState.errorMessages).toEqual([]);
  });
  it("should log user in when sign up action is dispatched", () => {
    const reducerState = authReducer(initialState(mockLocalStorage), {
      type: SIGNUP_USER,
      payload: {
        token: "zxcvbnm"
      }
    });
    expect(reducerState.isLoggedIn).toEqual(true);
    expect(reducerState.token).toEqual("zxcvbnm");
    expect(reducerState.loading).toEqual(false);
    expect(reducerState.errorMessages).toEqual([]);
  });
  it("should update error messages when SIGNUP_ERROR action is dispatched", () => {
    const reducerState = authReducer(initialState(mockLocalStorage), {
      type: SIGNUP_ERROR,
      payload: [{ password: "Password and confirm password do not match" }]
    });
    expect(reducerState.errorMessages).toEqual([
      { password: "Password and confirm password do not match" }
    ]);
    expect(reducerState.loading).toEqual(false);
  });
  it("should convert string error message to array when SIGNUP_ERROR action is dispatched", () => {
    const reducerState = authReducer(initialState(mockLocalStorage), {
      type: SIGNUP_ERROR,
      payload: "Invalid User"
    });
    expect(reducerState.errorMessages).toEqual([{ error: "Invalid User" }]);
    expect(reducerState.loading).toEqual(false);
  });
});
