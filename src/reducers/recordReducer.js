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
  RESET_DELETED_RECORD
} from "../actionTypes";

/* eslint-disable indent */
const initialState = {
  myRedFlagRecords: [],
  myInterventionRecords: [],
  loading: false,
  errorMessages: [],
  createdRecordMessage: "",
  recordFetched: {},
  recordDeleted: false
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
        loading: false,
        errorMessages: []
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
    case GOT_RECORD:
      return {
        ...state,
        loading: false,
        recordFetched: payload,
        errorMessages: []
      };
    case ERROR_GETTING_RECORD:
      return {
        ...state,
        loading: false,
        recordFetched: {},
        errorMessages: [
          {
            error:
              payload ||
              "Error getting record, please check your connection and try again later"
          }
        ]
      };
    case ERROR_DELETING_RECORD:
      return {
        ...state,
        loading: false,
        recordDeleted: false,
        errorMessages: [
          {
            error:
              payload ||
              "Error deleting record, please check your connection and try again later"
          }
        ]
      };
    case RECORD_DELETED:
      return {
        ...state,
        loading: false,
        recordDeleted: true,
        errorMessages: []
      };
    case RESET_DELETED_RECORD:
      return {
        ...state,
        recordDeleted: false,
        errorMessages: []
      };
    default:
      return state;
  }
};

export default recordReducer;
