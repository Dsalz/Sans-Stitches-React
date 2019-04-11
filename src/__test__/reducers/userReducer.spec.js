import userReducer, { initialState } from "../../reducers/userReducer";
import { LOGIN_USER, LOGOUT_USER } from "../../actionTypes";

describe("user reducer's initial state", () => {
  it("should indicate that there is no user data when there is no app data in local storage", () => {
    const mockLocalStorage = {};
    const reducerState = userReducer(initialState(mockLocalStorage), {
      type: "INITIAL_AUTH_STATE"
    });
    expect(reducerState.user).toEqual({});
  });
  it("should indicate that there is user data when there is app data in local storage", () => {
    const mockLocalStorage = {
      sansStitches: JSON.stringify({
        token: "qwerty",
        user: {
          key: "value"
        }
      })
    };
    const reducerState = userReducer(initialState(mockLocalStorage), {
      type: "INITIAL_AUTH_STATE"
    });
    expect(reducerState.user).toEqual({ key: "value" });
  });
});

describe("user reducer", () => {
  const mockLocalStorage = {};
  it("should log user in when action is dispatched", () => {
    const reducerState = userReducer(initialState(mockLocalStorage), {
      type: LOGIN_USER,
      payload: {
        user: {
          key: "value"
        }
      }
    });
    expect(reducerState.user).toEqual({ key: "value" });
  });

  it("should log user out when action is dispatched", () => {
    const reducerState = userReducer(initialState(mockLocalStorage), {
      type: LOGOUT_USER
    });
    expect(reducerState.user).toEqual({});
  });
});
