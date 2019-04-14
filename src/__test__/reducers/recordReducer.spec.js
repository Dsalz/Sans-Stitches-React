import recordReducer from "../../reducers/recordReducer";
import {
  RECORDS_LOADING,
  GOT_MY_RECORDS,
  ERROR_GETTING_RECORDS,
  CLEAR_RECORD_ERRORS
} from "../../actionTypes";

describe("record reducer's initial state", () => {
  it("should have the right initial state", () => {
    const reducerState = recordReducer(undefined, {
      type: "INITIAL_STATE"
    });
    expect(reducerState.myRedFlagRecords).toEqual([]);
    expect(reducerState.myInterventionRecords).toEqual([]);
    expect(reducerState.errorMessage).toEqual("");
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
    expect(reducerState.errorMessage).toEqual("");
  });

  it("should update error message when ERROR_GETTING_RECORDS action is dispatched", () => {
    const reducerState = recordReducer(undefined, {
      type: ERROR_GETTING_RECORDS
    });
    expect(reducerState.errorMessage).toEqual(
      "Error getting records, please check your connection and try again later"
    );
    expect(reducerState.loading).toEqual(false);
  });

  it("should clear error message when CLEAR_RECORD_ERRORS action is dispatched", () => {
    const initialReducerState = recordReducer(undefined, {
      type: ERROR_GETTING_RECORDS
    });
    expect(initialReducerState.errorMessage).toEqual(
      "Error getting records, please check your connection and try again later"
    );
    const reducerState = recordReducer(initialReducerState, {
      type: CLEAR_RECORD_ERRORS
    });
    expect(reducerState.errorMessage).toEqual("");
  });
});
