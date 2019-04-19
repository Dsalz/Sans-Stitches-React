import {
  RECORDS_LOADING,
  GOT_MY_RECORDS,
  ERROR_GETTING_RECORDS,
  CLEAR_RECORD_ERRORS,
  CREATED_RECORD,
  ERROR_CREATING_RECORD,
  RESET_CREATED_RECORD
} from "../actionTypes";

/* eslint-disable indent */
const initialState = {
  myRedFlagRecords: [],
  myInterventionRecords: [],
  loading: false,
  errorMessages: [],
  createdRecordMessage: ""
};

const recordReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case RECORDS_LOADING:
      return {
        ...state,
        loading: true,
        errorMessages: []
      };
    case GOT_MY_RECORDS:
      return {
        ...state,
        myRedFlagRecords: payload.redFlagRecords,
        myInterventionRecords: payload.interventionRecords,
        loading: false,
        errorMessages: []
      };
    case ERROR_GETTING_RECORDS:
      return {
        ...state,
        errorMessages: [
          {
            error:
              "Error getting records, please check your connection and try again later"
          }
        ],
        loading: false
      };
    case CREATED_RECORD:
      return {
        ...state,
        createdRecordMessage: payload,
        loading: false
      };
    case ERROR_CREATING_RECORD:
      return {
        ...state,
        errorMessages: [
          {
            error:
              "Error creating record, please check your connection and try again later"
          }
        ],
        createdRecordMessage: "",
        loading: false
      };
    case CLEAR_RECORD_ERRORS:
      return {
        ...state,
        errorMessages: [],
        createdRecordMessage: ""
      };
    case RESET_CREATED_RECORD:
      return {
        ...state,
        createdRecordMessage: "",
        errorMessages: []
      };
    default:
      return state;
  }
};

export default recordReducer;
