import axios from "./customAxios";
import {
  RECORDS_LOADING,
  GOT_MY_RECORDS,
  ERROR_GETTING_RECORDS,
  CLEAR_RECORD_ERRORS,
  CREATED_RECORD,
  ERROR_CREATING_RECORD,
  RESET_CREATED_RECORD
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

/**
 * @description Action for posting details provided by the user to the create record endpoint
 * @param {string} token The user's token
 * @param {object} details The details provided by the user
 * @returns {function} dispatch function with the appropriate action
 */
export const createNewRecord = (token, details) => {
  const {
    comment,
    description,
    latitude,
    longitude,
    video,
    images,
    type
  } = details;
  return async dispatch => {
    dispatch({ type: RECORDS_LOADING });
    try {
      const typeEndpoint = type === "Red Flag" ? "red-flags" : "interventions";
      const createResponse = await axios.post(
        `/${typeEndpoint}`,
        { comment, description, latitude, longitude, video },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const { error, data } = createResponse.data;
      if (error) {
        return dispatch({
          type: ERROR_CREATING_RECORD,
          payload: error
        });
      }
      const { message, id } = data[0];
      let patchResponse = {};
      if (images.length) {
        const imgFormData = new FormData();
        images.forEach((file, index) =>
          imgFormData.append(`files[${index}]`, file)
        );
        imgFormData.append("enctype", "multipart/form-data");
        patchResponse = await axios.patch(
          `/${typeEndpoint}/${id}/addImages`,
          imgFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      }
      if (patchResponse.data.error) {
        return dispatch({
          type: ERROR_CREATING_RECORD,
          payload: `Record created but could not attach images to it because ${
            patchResponse.data.error
          }`
        });
      }

      return dispatch({
        type: CREATED_RECORD,
        payload: message
      });
    } catch (err) {
      return dispatch({
        type: ERROR_CREATING_RECORD,
        payload: "Could not create your report, please try again later"
      });
    }
  };
};

/**
 * @description Action for resetting created record status
 * @returns {function} dispatch function with the appropriate action
 */
export const resetCreateRecordMessage = () => ({ type: RESET_CREATED_RECORD });
