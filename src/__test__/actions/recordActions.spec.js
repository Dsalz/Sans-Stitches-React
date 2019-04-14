import "babel-polyfill";
import moxios from "moxios";
import axios from "../../actions/customAxios";
import { getMyRecords, clearRecordErrors } from "../../actions/recordActions";
import mockStore from "../../__mocks__/storeMock";
import {
  RECORDS_LOADING,
  GOT_MY_RECORDS,
  ERROR_GETTING_RECORDS,
  CLEAR_RECORD_ERRORS
} from "../../actionTypes";

describe("Get my records action creator", () => {
  jest.setTimeout(30000);
  beforeEach(() => {
    moxios.install(axios);
  });

  afterEach(() => {
    moxios.uninstall(axios);
  });

  it("dispatches GOT_MY_RECORDS type action with the expected payload when login is successful", async done => {
    const store = mockStore({
      myRedFlagRecords: [],
      myInterventionRecords: [],
      loading: false,
      errorMessage: ""
    });
    const mockToken = "zxcv";
    const mockRedFlagDetails = {
      data: [
        { id: 1, title: "Serious Red Flag Issue" },
        { id: 2, title: "Serious Red Flag Issue" }
      ]
    };

    const mockRedFlagResponse = {
      status: 200,
      response: {
        status: 200,
        data: mockRedFlagDetails
      }
    };

    const mockInterventionDetails = {
      data: [
        { id: 3, title: "Serious Intervention Issue" },
        { id: 4, title: "Serious Intervention Issue" }
      ]
    };

    const mockInterventionResponse = {
      status: 200,
      response: {
        status: 200,
        data: mockInterventionDetails
      }
    };

    moxios.wait(() => {
      const redFlagRequest = moxios.requests.at(0);
      redFlagRequest.respondWith(mockRedFlagResponse).then(() => {
        moxios.wait(() => {
          const interventionRequest = moxios.requests.at(1);
          interventionRequest.respondWith(mockInterventionResponse);
        });
      });
    });

    await store.dispatch(getMyRecords(mockToken));
    expect(store.getActions()).toEqual([
      { type: RECORDS_LOADING },
      {
        type: GOT_MY_RECORDS,
        payload: {
          redFlagRecords: mockRedFlagDetails,
          interventionRecords: mockInterventionDetails
        }
      }
    ]);
    done();
  });

  it("dispatches ERROR_GETTING_RECORDS type action when attempt to fetch records is unsuccessful due to user error", async done => {
    const store = mockStore({
      myRedFlagRecords: [],
      myInterventionRecords: [],
      loading: false,
      errorMessage: ""
    });
    const mockToken = "zxcv";

    const mockRedFlagResponse = {
      status: 200,
      response: {
        status: 400
      }
    };

    const mockInterventionResponse = {
      status: 200,
      response: {
        status: 400
      }
    };

    moxios.wait(() => {
      const redFlagRequest = moxios.requests.at(0);
      redFlagRequest.respondWith(mockRedFlagResponse).then(() => {
        moxios.wait(() => {
          const interventionRequest = moxios.requests.at(1);
          interventionRequest.respondWith(mockInterventionResponse);
        });
      });
    });

    await store.dispatch(getMyRecords(mockToken));
    expect(store.getActions()).toEqual([
      { type: RECORDS_LOADING },
      {
        type: ERROR_GETTING_RECORDS
      }
    ]);
    done();
  });

  it("dispatches ERROR_GETTING_RECORDS type action when attempt to fetch records is unsuccessful due to a non user error", async done => {
    const store = mockStore({
      myRedFlagRecords: [],
      myInterventionRecords: [],
      loading: false,
      errorMessage: ""
    });
    const mockToken = "zxcv";

    const mockRedFlagResponse = {
      status: 500,
      response: {
        status: 500
      }
    };

    const mockInterventionResponse = {
      status: 500,
      response: {
        status: 500
      }
    };

    moxios.wait(() => {
      const redFlagRequest = moxios.requests.at(0);
      redFlagRequest.respondWith(mockRedFlagResponse).then(() => {
        moxios.wait(() => {
          const interventionRequest = moxios.requests.at(1);
          interventionRequest.respondWith(mockInterventionResponse);
        });
      });
    });

    await store.dispatch(getMyRecords(mockToken));
    expect(store.getActions()).toEqual([
      { type: RECORDS_LOADING },
      {
        type: ERROR_GETTING_RECORDS
      }
    ]);
    done();
  });
});

describe("Clear record errors action creator", () => {
  it("returns the CLEAR_RECORD_ERRORS action", () => {
    expect(clearRecordErrors()).toEqual({
      type: CLEAR_RECORD_ERRORS
    });
  });
});
