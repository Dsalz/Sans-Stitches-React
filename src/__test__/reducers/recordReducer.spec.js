import recordReducer from "../../reducers/recordReducer";
import {
  RECORDS_LOADING,
  GOT_MY_RECORDS,
  ERROR_GETTING_RECORDS,
  CLEAR_RECORD_ERRORS,
  CREATED_RECORD,
  ERROR_CREATING_RECORD,
  RESET_CREATED_RECORD
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
});
