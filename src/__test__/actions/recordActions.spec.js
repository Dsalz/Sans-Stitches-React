import "babel-polyfill";
import moxios from "moxios";
import axios from "../../actions/customAxios";
import {
  getMyRecords,
  clearRecordErrors,
  resetCreateRecordMessage,
  createNewRecord,
  fetchRecordAction,
  deleteRecordAction,
  resetDeletedRecordAction,
  editRecordAction,
  resetEditRecordMessage,
  getAllRecords,
  updateRecordAction,
  resetUpdatedRecordAction
} from "../../actions/recordActions";
import mockStore from "../../__mocks__/storeMock";
import {
  RECORDS_LOADING,
  GOT_MY_RECORDS,
  ERROR_GETTING_RECORDS,
  CLEAR_RECORD_ERRORS,
  RESET_CREATED_RECORD,
  ERROR_CREATING_RECORD,
  GOT_RECORD,
  ERROR_GETTING_RECORD,
  RECORD_DELETED,
  ERROR_DELETING_RECORD,
  RESET_DELETED_RECORD,
  RESET_EDITED_RECORD,
  EDITED_RECORD,
  GOT_RECORD_FOR_EDIT,
  ERROR_EDITING_RECORD,
  GOT_ALL_RECORDS,
  UPDATED_RECORD,
  ERROR_UPDATING_RECORD,
  RESET_UPDATED_RECORD
} from "../../actionTypes";

describe("Get my records action creator", () => {
  jest.setTimeout(30000);
  beforeEach(() => {
    moxios.install(axios);
  });

  afterEach(() => {
    moxios.uninstall(axios);
  });

  it("dispatches GOT_MY_RECORDS type action with the expected payload when records are fetched successfully", async done => {
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

    moxios.wait(() => {
      const redFlagRequest = moxios.requests.at(0);
      redFlagRequest.respondWith(mockRedFlagResponse);
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

describe("Create record action creator", () => {
  jest.setTimeout(30000);
  beforeEach(() => {
    moxios.install(axios);
  });

  afterEach(() => {
    moxios.uninstall(axios);
  });

  it("dispatches RECORDS_LOADING type action before making request", async done => {
    jest.setTimeout(30000);
    const store = mockStore({
      myRedFlagRecords: [],
      myInterventionRecords: [],
      loading: false,
      errorMessages: [],
      createdRecordMessage: ""
    });
    const mockToken = "zxcv";
    const mockDetails = {
      comment: "abcd",
      type: "Red Flag",
      description: "zxcvb",
      latitude: "1.111",
      longitude: "3.33",
      video: "www.djdfjdj.com/kjkjj.mp4"
    };
    const mockSuccessMessage = "Created red flag record successfully";

    const mockCreateResponse = {
      status: 200,
      response: {
        status: 200,
        data: [{ message: mockSuccessMessage, id: 1 }]
      }
    };

    moxios.wait(() => {
      const createRecordRequest = moxios.requests.at(0);
      createRecordRequest.respondWith(mockCreateResponse);
    });

    await store.dispatch(createNewRecord(mockToken, mockDetails));
    const dispatchTypes = store.getActions().map(a => a.type);
    expect(dispatchTypes).toContain(RECORDS_LOADING);
    done();
  });

  it("dispatches ERROR_CREATING_RECORD type action when attempt to fetch records is unsuccessful due to user error when creating", async done => {
    const store = mockStore({
      myRedFlagRecords: [],
      myInterventionRecords: [],
      loading: false,
      errorMessages: [],
      createdRecordMessage: ""
    });
    const mockToken = "zxcv";
    const mockDetails = {
      comment: "abcd",
      type: "Red Flag",
      description: "zxcvb",
      latitude: "abcd",
      longitude: "abcd",
      images: ["image1.jpg", "image2.jpg"],
      video: "www.djdfjdj.com/kjkjj.mp4"
    };
    const mockErrorMessage = "Invalid Location Data";

    const mockCreateResponse = {
      status: 200,
      response: {
        status: 400,
        error: mockErrorMessage
      }
    };

    moxios.wait(() => {
      const createRecordRequest = moxios.requests.at(0);
      createRecordRequest.respondWith(mockCreateResponse);
    });

    await store.dispatch(createNewRecord(mockToken, mockDetails));
    const dispatchTypes = store.getActions().map(a => a.type);
    expect(dispatchTypes).toEqual([RECORDS_LOADING, ERROR_CREATING_RECORD]);
    done();
  });

  it("dispatches ERROR_CREATING_RECORD type action when attempt to fetch records is unsuccessful due to user error when patching", async done => {
    const store = mockStore({
      myRedFlagRecords: [],
      myInterventionRecords: [],
      loading: false,
      errorMessages: [],
      createdRecordMessage: ""
    });
    const mockToken = "zxcv";
    const mockDetails = {
      comment: "abcd",
      type: "Red Flag",
      description: "zxcvb",
      latitude: "abcd",
      longitude: "abcd",
      images: ["image1.jpg", "image2.jpg"],
      video: "www.djdfjdj.com/kjkjj.mp4"
    };
    const mockErrorMessage = "Image(s) too large";

    const mockSuccessMessage = "Created red flag record successfully";

    const mockCreateResponse = {
      status: 200,
      response: {
        status: 200,
        data: [{ message: mockSuccessMessage, id: 1 }]
      }
    };

    const mockPatchResponse = {
      status: 200,
      response: {
        status: 400,
        error: mockErrorMessage
      }
    };

    moxios.wait(() => {
      const createRecordRequest = moxios.requests.at(0);
      createRecordRequest.respondWith(mockCreateResponse).then(() => {
        moxios.wait(() => {
          const patchRecordRequest = moxios.requests.at(1);
          patchRecordRequest.respondWith(mockPatchResponse);
        });
      });
    });

    await store.dispatch(createNewRecord(mockToken, mockDetails));
    const dispatchTypes = store.getActions().map(a => a.type);
    expect(dispatchTypes).toEqual([RECORDS_LOADING, ERROR_CREATING_RECORD]);
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

describe("Reset created record message action creator", () => {
  it("returns the RESET_CREATED_RECORD action", () => {
    expect(resetCreateRecordMessage()).toEqual({
      type: RESET_CREATED_RECORD
    });
  });
});

describe("Get record action creator", () => {
  jest.setTimeout(30000);
  beforeEach(() => {
    moxios.install(axios);
  });

  afterEach(() => {
    moxios.uninstall(axios);
  });

  it("dispatches GOT_RECORD type when record was gotten successfully", async done => {
    const store = mockStore({});
    const mockRecordInfo = "redflag-11";

    const mockResponse = {
      status: 200,
      response: {
        status: 200,
        data: [{ id: 11 }]
      }
    };

    moxios.wait(() => {
      const getRecordRequest = moxios.requests.mostRecent();
      getRecordRequest.respondWith(mockResponse);
    });

    await store.dispatch(fetchRecordAction(mockRecordInfo));
    const dispatchTypes = store.getActions().map(a => a.type);
    expect(dispatchTypes).toEqual([RECORDS_LOADING, GOT_RECORD]);
    done();
  });

  it("dispatches ERROR_GETTING_RECORD type action when attempt to fetch records is unsuccessful due to user error", async done => {
    const store = mockStore({});
    const mockRecordInfo = "redflag-11";

    const mockResponse = {
      status: 200,
      response: {
        status: 403,
        error: "Forbidden"
      }
    };

    moxios.wait(() => {
      const getRecordRequest = moxios.requests.mostRecent();
      getRecordRequest.respondWith(mockResponse);
    });

    await store.dispatch(fetchRecordAction(mockRecordInfo));
    const dispatchTypes = store.getActions().map(a => a.type);
    expect(dispatchTypes).toEqual([RECORDS_LOADING, ERROR_GETTING_RECORD]);
    done();
  });

  it("dispatches ERROR_GETTING_RECORD type action when attempt to fetch records is unsuccessful due to a server error", async done => {
    const store = mockStore({});
    const mockRecordInfo = "redflag-11";

    const mockResponse = {
      status: 500,
      response: {
        status: 500
      }
    };

    moxios.wait(() => {
      const getRecordRequest = moxios.requests.mostRecent();
      getRecordRequest.respondWith(mockResponse);
    });

    await store.dispatch(fetchRecordAction(mockRecordInfo));
    const dispatchTypes = store.getActions().map(a => a.type);
    expect(dispatchTypes).toEqual([RECORDS_LOADING, ERROR_GETTING_RECORD]);
    done();
  });
});
describe("Delete record action creator", () => {
  jest.setTimeout(30000);
  beforeEach(() => {
    moxios.install(axios);
  });

  afterEach(() => {
    moxios.uninstall(axios);
  });

  it("dispatches RECORD_DELETED type action when record was deleted successfully", async done => {
    const store = mockStore({});
    const mockRecordInfo = "redflag-11";
    const mockToken = "abcd";

    const mockResponse = {
      status: 200,
      response: {
        status: 200
      }
    };

    moxios.wait(() => {
      const deleteRecordRequest = moxios.requests.mostRecent();
      deleteRecordRequest.respondWith(mockResponse);
    });

    await store.dispatch(deleteRecordAction(mockToken, mockRecordInfo));
    const dispatchTypes = store.getActions().map(a => a.type);
    expect(dispatchTypes).toEqual([RECORDS_LOADING, RECORD_DELETED]);
    done();
  });

  it("dispatches ERROR_DELETING_RECORD type action when attempt to delete records is unsuccessful due to user error", async done => {
    const store = mockStore({});
    const mockRecordInfo = "redflag-11";
    const mockToken = "abcd";

    const mockResponse = {
      status: 200,
      response: {
        status: 403,
        error: "Forbidden"
      }
    };

    moxios.wait(() => {
      const deleteRecordRequest = moxios.requests.mostRecent();
      deleteRecordRequest.respondWith(mockResponse);
    });

    await store.dispatch(deleteRecordAction(mockToken, mockRecordInfo));
    const dispatchTypes = store.getActions().map(a => a.type);
    expect(dispatchTypes).toEqual([RECORDS_LOADING, ERROR_DELETING_RECORD]);
    done();
  });

  it("dispatches ERROR_DELETING_RECORD type action when attempt to delete records is unsuccessful due to a server error", async done => {
    const store = mockStore({});
    const mockRecordInfo = "redflag-11";
    const mockToken = "abcd";

    const mockResponse = {
      status: 500,
      response: {}
    };

    moxios.wait(() => {
      const deleteRecordRequest = moxios.requests.mostRecent();
      deleteRecordRequest.respondWith(mockResponse);
    });

    await store.dispatch(deleteRecordAction(mockToken, mockRecordInfo));
    const dispatchTypes = store.getActions().map(a => a.type);
    expect(dispatchTypes).toEqual([RECORDS_LOADING, ERROR_DELETING_RECORD]);
    done();
  });
});

describe("Reset deleted record action creator", () => {
  it("returns the RESET_DELETED_RECORD action", () => {
    expect(resetDeletedRecordAction()).toEqual({
      type: RESET_DELETED_RECORD
    });
  });
});

describe("Get record for editing action creator", () => {
  jest.setTimeout(30000);
  beforeEach(() => {
    moxios.install(axios);
  });

  afterEach(() => {
    moxios.uninstall(axios);
  });

  it("dispatches GOT_RECORD_FOR_EDIT type when record was gotten successfully", async done => {
    const store = mockStore({});
    const mockRecordInfo = "redflag-11";

    const mockResponse = {
      status: 200,
      response: {
        status: 200,
        data: [{ id: 11 }]
      }
    };

    moxios.wait(() => {
      const getRecordRequest = moxios.requests.mostRecent();
      getRecordRequest.respondWith(mockResponse);
    });

    await store.dispatch(fetchRecordAction(mockRecordInfo, true));
    const dispatchTypes = store.getActions().map(a => a.type);
    expect(dispatchTypes).toEqual([RECORDS_LOADING, GOT_RECORD_FOR_EDIT]);
    done();
  });
});

describe("Edit record action creator", () => {
  jest.setTimeout(30000);
  beforeEach(() => {
    moxios.install(axios);
  });

  afterEach(() => {
    moxios.uninstall(axios);
  });

  it("dispatches the EDITED_RECORD action when comment is updated", async done => {
    const store = mockStore({});
    const mockDetails = {
      type: "intervention",
      comment: "jkb",
      images: [],
      id: 11
    };
    const mockToken = "abcd";

    const mockResponse = {
      status: 200,
      response: {
        status: 200,
        data: [{ id: 11 }]
      }
    };

    moxios.wait(() => {
      const editRecordRequest = moxios.requests.mostRecent();
      editRecordRequest.respondWith(mockResponse);
    });

    await store.dispatch(editRecordAction(mockToken, mockDetails));
    const dispatchTypes = store.getActions().map(a => a.type);
    expect(dispatchTypes).toEqual([RECORDS_LOADING, EDITED_RECORD]);
    done();
  });
  it("dispatches the EDITED_RECORD action when location is updated", async done => {
    const store = mockStore({});
    const mockDetails = {
      type: "intervention",
      latitude: "22.33",
      longitude: "-2.33",
      images: [],
      id: 11
    };
    const mockToken = "abcd";

    const mockResponse = {
      status: 200,
      response: {
        status: 200,
        data: [{ id: 11 }]
      }
    };

    moxios.wait(() => {
      const editRecordRequest = moxios.requests.mostRecent();
      editRecordRequest.respondWith(mockResponse);
    });

    await store.dispatch(editRecordAction(mockToken, mockDetails));
    const dispatchTypes = store.getActions().map(a => a.type);
    expect(dispatchTypes).toEqual([RECORDS_LOADING, EDITED_RECORD]);
    done();
  });
  it("dispatches the EDITED_RECORD action when location is updated", async done => {
    const store = mockStore({});
    const mockDetails = {
      type: "intervention",
      images: ["blabla.jpg"],
      id: 11
    };
    const mockToken = "abcd";

    const mockResponse = {
      status: 200,
      response: {
        status: 200,
        data: [{ id: 11 }]
      }
    };

    moxios.wait(() => {
      const editRecordRequest = moxios.requests.mostRecent();
      editRecordRequest.respondWith(mockResponse);
    });

    await store.dispatch(editRecordAction(mockToken, mockDetails));
    const dispatchTypes = store.getActions().map(a => a.type);
    expect(dispatchTypes).toEqual([RECORDS_LOADING, EDITED_RECORD]);
    done();
  });
  it("dispatches the ERROR_EDITING_RECORD action when there is a user error updating the record", async done => {
    const store = mockStore({});
    const mockDetails = {
      type: "intervention",
      images: ["blabla.jpg"],
      id: 11
    };
    const mockToken = "abcd";

    const mockResponse = {
      status: 200,
      response: {
        status: 403,
        error: "Forbidden"
      }
    };

    moxios.wait(() => {
      const editRecordRequest = moxios.requests.mostRecent();
      editRecordRequest.respondWith(mockResponse);
    });

    await store.dispatch(editRecordAction(mockToken, mockDetails));
    const dispatchTypes = store.getActions().map(a => a.type);
    expect(dispatchTypes).toEqual([RECORDS_LOADING, ERROR_EDITING_RECORD]);
    done();
  });

  it("dispatches the ERROR_EDITING_RECORD action when there is a server error when updating the record", async done => {
    const store = mockStore({});
    const mockDetails = {
      type: "intervention",
      images: ["blabla.jpg"],
      id: 11
    };
    const mockToken = "abcd";

    const mockResponse = {
      status: 500,
      response: {}
    };

    moxios.wait(() => {
      const editRecordRequest = moxios.requests.mostRecent();
      editRecordRequest.respondWith(mockResponse);
    });

    await store.dispatch(editRecordAction(mockToken, mockDetails));
    const dispatchTypes = store.getActions().map(a => a.type);
    expect(dispatchTypes).toEqual([RECORDS_LOADING, ERROR_EDITING_RECORD]);
    done();
  });
});

describe("Reset edited record action creator", () => {
  it("returns the RESET_EDITED_RECORD action", () => {
    expect(resetEditRecordMessage()).toEqual({
      type: RESET_EDITED_RECORD
    });
  });
});

describe("Get all records action creator", () => {
  jest.setTimeout(30000);
  beforeEach(() => {
    moxios.install(axios);
  });

  afterEach(() => {
    moxios.uninstall(axios);
  });

  it("dispatches GOT_ALL_RECORDS type action with the expected payload when records are fetched successfully", async done => {
    const store = mockStore({});
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

    await store.dispatch(getAllRecords(mockToken));
    expect(store.getActions()).toEqual([
      { type: RECORDS_LOADING },
      {
        type: GOT_ALL_RECORDS,
        payload: {
          redFlagRecords: mockRedFlagDetails,
          interventionRecords: mockInterventionDetails
        }
      }
    ]);
    done();
  });

  it("dispatches ERROR_GETTING_RECORDS type action when attempt to fetch records is unsuccessful due to user error", async done => {
    const store = mockStore({});
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

    await store.dispatch(getAllRecords(mockToken));
    expect(store.getActions()).toEqual([
      { type: RECORDS_LOADING },
      {
        type: ERROR_GETTING_RECORDS
      }
    ]);
    done();
  });

  it("dispatches ERROR_GETTING_RECORDS type action when attempt to fetch records is unsuccessful due to a non user error", async done => {
    const store = mockStore({});
    const mockToken = "zxcv";

    const mockRedFlagResponse = {
      status: 500,
      response: {
        status: 500
      }
    };

    moxios.wait(() => {
      const redFlagRequest = moxios.requests.at(0);
      redFlagRequest.respondWith(mockRedFlagResponse);
    });

    await store.dispatch(getAllRecords(mockToken));
    expect(store.getActions()).toEqual([
      { type: RECORDS_LOADING },
      {
        type: ERROR_GETTING_RECORDS
      }
    ]);
    done();
  });
});

describe("Update record action creator", () => {
  jest.setTimeout(30000);
  beforeEach(() => {
    moxios.install(axios);
  });

  afterEach(() => {
    moxios.uninstall(axios);
  });

  it("dispatches the UPDATED_RECORD action when comment was updated successfully", async done => {
    const store = mockStore({});
    const mockDetails = {
      type: "intervention",
      adminStatus: "resolved",
      adminFeedback: "Worked on It",
      id: 11
    };
    const mockToken = "abcd";

    const mockResponse = {
      status: 200,
      response: {
        status: 200,
        data: [{ message: "Updated record to resolved" }]
      }
    };

    moxios.wait(() => {
      const updatedRecordRequest = moxios.requests.mostRecent();
      updatedRecordRequest.respondWith(mockResponse);
    });

    await store.dispatch(updateRecordAction(mockToken, mockDetails));
    const dispatchTypes = store.getActions().map(a => a.type);
    expect(dispatchTypes).toEqual([RECORDS_LOADING, UPDATED_RECORD]);
    done();
  });
  it("dispatches the ERROR_UPDATED_RECORD action when there is a user error updating the record", async done => {
    const store = mockStore({});
    const mockDetails = {
      type: "intervention",
      adminStatus: "resolved",
      adminFeedback: "Worked on It",
      id: 11
    };
    const mockToken = "abcd";

    const mockResponse = {
      status: 200,
      response: {
        status: 403,
        error: "Forbidden"
      }
    };

    moxios.wait(() => {
      const updateRecordRequest = moxios.requests.mostRecent();
      updateRecordRequest.respondWith(mockResponse);
    });

    await store.dispatch(updateRecordAction(mockToken, mockDetails));
    const dispatchTypes = store.getActions().map(a => a.type);
    expect(dispatchTypes).toEqual([RECORDS_LOADING, ERROR_UPDATING_RECORD]);
    done();
  });

  it("dispatches the ERROR_UPDATING_RECORD action when there is a server error when updating the record", async done => {
    const store = mockStore({});
    const mockDetails = {
      type: "intervention",
      adminStatus: "resolved",
      adminFeedback: "Worked on It",
      id: 11
    };
    const mockToken = "abcd";

    const mockResponse = {
      status: 500,
      response: {}
    };

    moxios.wait(() => {
      const updateRecordRequest = moxios.requests.mostRecent();
      updateRecordRequest.respondWith(mockResponse);
    });

    await store.dispatch(updateRecordAction(mockToken, mockDetails));
    const dispatchTypes = store.getActions().map(a => a.type);
    expect(dispatchTypes).toEqual([RECORDS_LOADING, ERROR_UPDATING_RECORD]);
    done();
  });
});

describe("Reset updated record action creator", () => {
  it("returns the RESET_UPDATED_RECORD action", () => {
    expect(resetUpdatedRecordAction()).toEqual({
      type: RESET_UPDATED_RECORD
    });
  });
});
