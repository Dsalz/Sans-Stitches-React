import {
  RECORDS_LOADING,
  GOT_MY_RECORDS,
  ERROR_GETTING_RECORDS,
  CLEAR_RECORD_ERRORS
} from "../actionTypes";

/* eslint-disable indent */
const initialState = {
  myRedFlagRecords: [],
  myInterventionRecords: [],
  loading: false,
  errorMessage: ""
};

const recordReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case RECORDS_LOADING:
      return {
        ...state,
        loading: true,
        errorMessage: ""
      };
    case GOT_MY_RECORDS:
      return {
        ...state,
        myRedFlagRecords: payload.redFlagRecords,
        myInterventionRecords: payload.interventionRecords,
        loading: false,
        errorMessage: ""
      };
    case ERROR_GETTING_RECORDS:
      return {
        ...state,
        errorMessage:
          "Error getting records, please check your connection and try again later",
        loading: false
      };
    case CLEAR_RECORD_ERRORS:
      return {
        ...state,
        errorMessage: ""
      };
    default:
      return state;
  }
};

export default recordReducer;
