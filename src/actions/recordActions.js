import axios from "./customAxios";
import {
  RECORDS_LOADING,
  GOT_MY_RECORDS,
  ERROR_GETTING_RECORDS,
  CLEAR_RECORD_ERRORS
} from "../actionTypes";

/**
 * @description Action for posting details provided by the user to the login endpoint
 * @param {string} token The user's token
 * @returns {function} dispatch function with the appropriate action
 */
export const getMyRecords = token => {
  return async dispatch => {
    dispatch({ type: RECORDS_LOADING });
    try {
      const redFlagResponse = await axios.get("/red-flags/mine", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const interventionResponse = await axios.get("/interventions/mine", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (
        redFlagResponse.data.status !== 200 ||
        interventionResponse.data.status !== 200
      ) {
        dispatch({ type: ERROR_GETTING_RECORDS });
        return;
      }
      dispatch({
        type: GOT_MY_RECORDS,
        payload: {
          redFlagRecords: redFlagResponse.data.data,
          interventionRecords: interventionResponse.data.data
        }
      });
    } catch (err) {
      dispatch({ type: ERROR_GETTING_RECORDS });
    }
  };
};

/**
 * @description Action for clearing record errors
 * @returns {object} action
 */
export const clearRecordErrors = () => ({ type: CLEAR_RECORD_ERRORS });
