import recordReducer from "../../reducers/recordReducer";
import {
  RECORDS_LOADING,
  GOT_MY_RECORDS,
  ERROR_GETTING_RECORDS,
  CLEAR_RECORD_ERRORS,
  CREATED_RECORD,
  ERROR_CREATING_RECORD,
  RESET_CREATED_RECORD,
  GOT_RECORD,
  ERROR_GETTING_RECORD,
  ERROR_DELETING_RECORD,
  RECORD_DELETED,
  RESET_DELETED_RECORD,
  ERROR_EDITING_RECORD,
  GOT_RECORD_FOR_EDIT,
  EDITED_RECORD,
  RESET_EDITED_RECORD,
  GOT_ALL_RECORDS,
  RESET_UPDATED_RECORD,
  UPDATED_RECORD,
  ERROR_UPDATING_RECORD
} from "../../actionTypes";

describe("record reducer's initial state", () => {
  it("should have the right initial state", () => {
    const reducerState = recordReducer(undefined, {
      type: "INITIAL_STATE"
    });
    expect(reducerState.myRedFlagRecords).toEqual([]);
    expect(reducerState.myInterventionRecords).toEqual([]);
    expect(reducerState.errorMessages).toEqual([]);
    expect(reducerState.loading).toEqual(false);
  });
});

describe("record reducer", () => {
  it("should update loading state when RECORDS_LOADING action is dispatched", () => {
    const reducerState = recordReducer(undefined, {
      type: RECORDS_LOADING
    });
    expect(reducerState.loading).toEqual(true);
  });
  it("should store records when GOT_MY_RECORDS is dispatched", () => {
    const mockPayload = {
      redFlagRecords: [
        { id: 1, title: "huge red flag" },
        { id: 2, title: "huge red flag" }
      ],
      interventionRecords: [
        { id: 1, title: "huge red flag" },
        { id: 2, title: "huge red flag" }
      ]
    };
    const reducerState = recordReducer(undefined, {
      type: GOT_MY_RECORDS,
      payload: mockPayload
    });
    expect(reducerState.myRedFlagRecords).toEqual(mockPayload.redFlagRecords);
    expect(reducerState.myInterventionRecords).toEqual(
      mockPayload.interventionRecords
    );
    expect(reducerState.loading).toEqual(false);
    expect(reducerState.errorMessages).toEqual([]);
  });

  it("should update error messages when ERROR_GETTING_RECORDS action is dispatched", () => {
    const reducerState = recordReducer(undefined, {
      type: ERROR_GETTING_RECORDS
    });
    expect(reducerState.errorMessages).toEqual([
      {
        error:
          "Error getting records, please check your connection and try again later"
      }
    ]);
    expect(reducerState.loading).toEqual(false);
  });

  it("should clear error messages when CLEAR_RECORD_ERRORS action is dispatched", () => {
    const initialReducerState = recordReducer(undefined, {
      type: ERROR_GETTING_RECORDS
    });
    expect(initialReducerState.errorMessages).toEqual([
      {
        error:
          "Error getting records, please check your connection and try again later"
      }
    ]);
    const reducerState = recordReducer(initialReducerState, {
      type: CLEAR_RECORD_ERRORS
    });
    expect(reducerState.errorMessages).toEqual([]);
  });

  it("should update the createdRecordMessage field in it's state when CREATED_RECORD action is dispatched", () => {
    const initialReducerState = recordReducer(undefined, {
      type: CREATED_RECORD,
      payload: "Successfully created red flag record"
    });
    expect(initialReducerState.createdRecordMessage).toEqual(
      "Successfully created red flag record"
    );
    expect(initialReducerState.loading).toEqual(false);
  });

  it("should update it's state correctly when ERROR_CREATING_RECORD action is dispatched", () => {
    const reducerState = recordReducer(undefined, {
      type: ERROR_CREATING_RECORD
    });
    expect(reducerState.errorMessages).toEqual([
      {
        error:
          "Error creating record, please check your connection and try again later"
      }
    ]);
    expect(reducerState.loading).toEqual(false);
    expect(reducerState.createdRecordMessage).toEqual("");
  });
  it("should reset the created message when RESET_CREATED_RECORD action is dispatched", () => {
    const reducerState = recordReducer(undefined, {
      type: RESET_CREATED_RECORD
    });
    expect(reducerState.createdRecordMessage).toEqual("");
    expect(reducerState.errorMessages).toEqual([]);
  });
  it("should store fetched record in state when GOT_RECORD action is dispatched", () => {
    const mockPayload = {
      id: 1,
      comment: "abc"
    };
    const reducerState = recordReducer(undefined, {
      type: GOT_RECORD,
      payload: mockPayload
    });
    expect(reducerState.recordFetched).toEqual(mockPayload);
    expect(reducerState.loading).toEqual(false);
    expect(reducerState.errorMessages).toEqual([]);
  });
  it("should update error messages in the state when ERROR_GETTING_RECORD action is dispatched and error is provided", () => {
    const mockPayload = "Forbidden";
    const reducerState = recordReducer(undefined, {
      type: ERROR_GETTING_RECORD,
      payload: mockPayload
    });
    expect(reducerState.errorMessages).toEqual([{ error: mockPayload }]);
    expect(reducerState.recordFetched).toEqual({});
    expect(reducerState.loading).toEqual(false);
  });
  it("should update error messages in the state when ERROR_GETTING_RECORD action is dispatched and error is not provided", () => {
    const reducerState = recordReducer(undefined, {
      type: ERROR_GETTING_RECORD
    });
    expect(reducerState.errorMessages).toEqual([
      {
        error:
          "Error getting record, please check your connection and try again later"
      }
    ]);
    expect(reducerState.recordFetched).toEqual({});
    expect(reducerState.loading).toEqual(false);
  });
  it("should update deleted record status when RECORD_DELETED action is dispatched", () => {
    const reducerState = recordReducer(undefined, {
      type: RECORD_DELETED
    });
    expect(reducerState.recordDeleted).toEqual(true);
    expect(reducerState.loading).toEqual(false);
  });
  it("should reset deleted record status when RESET_DELETED_RECORD action is dispatched", () => {
    const initialReducerState = recordReducer(undefined, {
      type: RECORD_DELETED
    });
    expect(initialReducerState.recordDeleted).toEqual(true);
    const reducerState = recordReducer(initialReducerState, {
      type: RESET_DELETED_RECORD
    });
    expect(reducerState.recordDeleted).toEqual(false);
  });
  it("should update error messages in the state when ERROR_DELETING_RECORD action is dispatched and error is provided", () => {
    const mockPayload = "Forbidden";
    const reducerState = recordReducer(undefined, {
      type: ERROR_DELETING_RECORD,
      payload: mockPayload
    });
    expect(reducerState.errorMessages).toEqual([{ error: mockPayload }]);
    expect(reducerState.recordDeleted).toEqual(false);
    expect(reducerState.loading).toEqual(false);
  });
  it("should update error messages in the state when ERROR_DELETING_RECORD action is dispatched and error is not provided", () => {
    const reducerState = recordReducer(undefined, {
      type: ERROR_DELETING_RECORD
    });
    expect(reducerState.errorMessages).toEqual([
      {
        error:
          "Error deleting record, please check your connection and try again later"
      }
    ]);
    expect(reducerState.recordDeleted).toEqual(false);
    expect(reducerState.loading).toEqual(false);
  });
  it("should update state with record fetched for edit when GOT_RECORD_FOR_EDIT action is dispatched", () => {
    const mockRecord = { id: 4 };
    const reducerState = recordReducer(undefined, {
      type: GOT_RECORD_FOR_EDIT,
      payload: mockRecord
    });
    expect(reducerState.recordFetchedForEdit).toEqual(mockRecord);
    expect(reducerState.loading).toEqual(false);
    expect(reducerState.errorMessages).toEqual([]);
  });
  it("should update state with success message EDITED_RECORD action is dispatched", () => {
    const mockSuccessMessage = "Record well and truly updated";
    const reducerState = recordReducer(undefined, {
      type: EDITED_RECORD,
      payload: mockSuccessMessage
    });
    expect(reducerState.editRecordMessage).toEqual(mockSuccessMessage);
    expect(reducerState.loading).toEqual(false);
    expect(reducerState.errorMessages).toEqual([]);
  });
  it("should reset edit record message when RESET_EDITED_RECORD action is dispatched", () => {
    const initialReducerState = recordReducer(undefined, {
      type: EDITED_RECORD,
      payload: "Record has been updated"
    });
    expect(initialReducerState.editRecordMessage).toEqual(
      "Record has been updated"
    );
    const reducerState = recordReducer(initialReducerState, {
      type: RESET_EDITED_RECORD
    });
    expect(reducerState.editRecordMessage).toEqual("");
  });
  it("should update error messages in the state when ERROR_EDITING_RECORD action is dispatched and error is provided", () => {
    const mockPayload = "Forbidden";
    const reducerState = recordReducer(undefined, {
      type: ERROR_EDITING_RECORD,
      payload: mockPayload
    });
    expect(reducerState.errorMessages).toEqual([{ error: mockPayload }]);
    expect(reducerState.editRecordMessage).toEqual("");
    expect(reducerState.loading).toEqual(false);
  });
  it("should update error messages in the state when ERROR_EDITING_RECORD action is dispatched and error is not provided", () => {
    const reducerState = recordReducer(undefined, {
      type: ERROR_EDITING_RECORD
    });
    expect(reducerState.errorMessages).toEqual([
      {
        error:
          "Error editing record, please check your connection and try again later"
      }
    ]);
    expect(reducerState.editRecordMessage).toEqual("");
    expect(reducerState.loading).toEqual(false);
  });
  it("should store records when GOT_ALL_RECORDS is dispatched", () => {
    const mockPayload = {
      redFlagRecords: [
        { id: 1, title: "huge red flag" },
        { id: 2, title: "huge red flag" }
      ],
      interventionRecords: [
        { id: 1, title: "huge red flag" },
        { id: 2, title: "huge red flag" }
      ]
    };
    const reducerState = recordReducer(undefined, {
      type: GOT_ALL_RECORDS,
      payload: mockPayload
    });
    expect(reducerState.allRedFlagRecords).toEqual(mockPayload.redFlagRecords);
    expect(reducerState.allInterventionRecords).toEqual(
      mockPayload.interventionRecords
    );
    expect(reducerState.loading).toEqual(false);
    expect(reducerState.errorMessages).toEqual([]);
  });
  it("should update state with success message UPDATED_RECORD action is dispatched", () => {
    const mockSuccessMessage = "Record's status well and truly updated";
    const reducerState = recordReducer(undefined, {
      type: UPDATED_RECORD,
      payload: mockSuccessMessage
    });
    expect(reducerState.updateRecordMessage).toEqual(mockSuccessMessage);
    expect(reducerState.loading).toEqual(false);
    expect(reducerState.errorMessages).toEqual([]);
  });
  it("should update error messages in the state when ERROR_UPDATING_RECORD action is dispatched and error is provided", () => {
    const mockPayload = "Forbidden";
    const reducerState = recordReducer(undefined, {
      type: ERROR_UPDATING_RECORD,
      payload: mockPayload
    });
    expect(reducerState.errorMessages).toEqual([{ error: mockPayload }]);
    expect(reducerState.updateRecordMessage).toEqual("");
    expect(reducerState.loading).toEqual(false);
  });
  it("should update error messages in the state when ERROR_UPDATING_RECORD action is dispatched and error is not provided", () => {
    const reducerState = recordReducer(undefined, {
      type: ERROR_UPDATING_RECORD
    });
    expect(reducerState.errorMessages).toEqual([
      {
        error:
          "Error updating record, please check your connection and try again later"
      }
    ]);
    expect(reducerState.updateRecordMessage).toEqual("");
    expect(reducerState.loading).toEqual(false);
  });
  it("should reset update record message when RESET_UPDATED_RECORD action is dispatched", () => {
    const initialReducerState = recordReducer(undefined, {
      type: UPDATED_RECORD,
      payload: "Record has been updated"
    });
    expect(initialReducerState.updateRecordMessage).toEqual(
      "Record has been updated"
    );
    const reducerState = recordReducer(initialReducerState, {
      type: RESET_UPDATED_RECORD
    });
    expect(reducerState.updateRecordMessage).toEqual("");
  });
});
