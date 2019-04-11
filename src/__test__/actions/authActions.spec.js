import "babel-polyfill";
import moxios from "moxios";
import axios from "../../actions/customAxios";
import { loginUserAction, clearErrorsAction } from "../../actions/authActions";
import mockStore from "../../__mocks__/storeMock";
import {
  AUTH_LOADING,
  LOGIN_USER,
  CLEAR_AUTH_ERRORS,
  LOGIN_ERROR
} from "../../actionTypes";

describe("Login User Action", () => {
  jest.setTimeout(30000);
  beforeEach(() => {
    moxios.install(axios);
  });

  afterEach(() => {
    moxios.uninstall(axios);
  });

  it("dispatches LOGIN_USER type action with the expected payload when login is successful", async () => {
    const store = mockStore({
      isLoggedIn: false,
      token: "",
      errorMessages: [],
      loading: false
    });
    const mockDetails = {
      email: "abc@yahoo.com",
      password: "123"
    };

    const mockResponse = {
      status: 200,
      response: {
        token: "asdf",
        status: 200,
        data: [
          {
            ...mockDetails
          }
        ]
      }
    };

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith(mockResponse);
    });

    await store.dispatch(loginUserAction(mockDetails));
    expect(store.getActions()).toEqual([
      { type: AUTH_LOADING },
      { type: LOGIN_USER, payload: { ...mockDetails } }
    ]);
  });

  it("dispatches LOGIN_ERROR type action when login is unsuccesful due to user errors", async () => {
    const store = mockStore({
      isLoggedIn: false,
      token: "",
      errorMessages: [],
      loading: false
    });
    const mockDetails = {
      email: "abc@yahoo.com",
      password: "123"
    };

    const mockResponse = {
      status: 200,
      response: {
        token: "asdf",
        status: 403,
        error: [{ email: "Invalid Email" }]
      }
    };

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith(mockResponse);
    });

    await store.dispatch(loginUserAction(mockDetails));
    expect(store.getActions()).toEqual([
      { type: AUTH_LOADING },
      { type: LOGIN_ERROR, payload: [{ email: "Invalid Email" }] }
    ]);
  });
  it("dispatches LOGIN_ERROR type action when login is unsuccesful due to non user errors", async () => {
    const store = mockStore({
      isLoggedIn: false,
      token: "",
      errorMessages: [],
      loading: false
    });
    const mockDetails = {
      email: "abc@yahoo.com",
      password: "123"
    };

    const mockResponse = {
      status: 500,
      response: {}
    };

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith(mockResponse);
    });

    await store.dispatch(loginUserAction(mockDetails));
    const dispatchTypes = store.getActions().map(a => a.type);
    expect(dispatchTypes).toEqual([AUTH_LOADING, LOGIN_ERROR]);
  });
});

describe("Clear Errors Action", () => {
  it("returns the right action", () => {
    expect(clearErrorsAction()).toEqual({
      type: CLEAR_AUTH_ERRORS
    });
  });
});
