import axios from "./customAxios";
import {
  RECORDS_LOADING,
  GOT_MY_RECORDS,
  ERROR_GETTING_RECORDS,
  CLEAR_RECORD_ERRORS,
  CREATED_RECORD,
  ERROR_CREATING_RECORD,
  RESET_CREATED_RECORD,
  ERROR_GETTING_RECORD,
  GOT_RECORD,
  RECORD_DELETED,
  RESET_DELETED_RECORD,
  ERROR_DELETING_RECORD,
  GOT_RECORD_FOR_EDIT,
  RESET_EDITED_RECORD,
  EDITED_RECORD,
  ERROR_EDITING_RECORD,
  GOT_ALL_RECORDS,
  UPDATED_RECORD,
  ERROR_UPDATING_RECORD,
  RESET_UPDATED_RECORD
} from "../actionTypes";

/**
 * @description Action creator for getting user's records
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
 * @description Action creator for clearing record errors
 * @returns {object} action
 */
export const clearRecordErrors = () => ({ type: CLEAR_RECORD_ERRORS });

/**
 * @description Action creator for posting details provided by the user to the create record endpoint
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
 * @description Action creator for resetting created record status
 * @returns {object} dispatch function with the appropriate action
 */
export const resetCreateRecordMessage = () => ({ type: RESET_CREATED_RECORD });

/**
 * @description Action creator for resetting edited record status
 * @returns {object} dispatch function with the appropriate action
 */
export const resetEditRecordMessage = () => ({ type: RESET_EDITED_RECORD });

/**
 * @description Action creator for fetching record details
 * @param {string} recordInfo The id and type of the record
 * @param {object} forEdit boolean specifying if record is being fetched to be edited
 * @returns {function} dispatch function with the appropriate action
 */
export const fetchRecordAction = (recordInfo, forEdit = false) => {
  return async dispatch => {
    const type =
      recordInfo.split("-")[0] === "redflag" ? "red-flags" : "interventions";
    const id = recordInfo.split("-")[1];
    dispatch({ type: RECORDS_LOADING });
    try {
      const response = await axios.get(`/${type}/${id}`);
      const { data, error } = response.data;
      if (error) {
        return dispatch({
          type: ERROR_GETTING_RECORD,
          payload: error
        });
      }
      return dispatch({
        type: forEdit ? GOT_RECORD_FOR_EDIT : GOT_RECORD,
        payload: data[0]
      });
    } catch (err) {
      return dispatch({
        type: ERROR_GETTING_RECORD
      });
    }
  };
};

/**
 * @description Action creator for deleting record details
 * @param {object} token The user's token
 * @param {string} recordInfo The id and type of the record
 * @returns {function} dispatch function with the appropriate action
 */
export const deleteRecordAction = (token, recordInfo) => {
  return async dispatch => {
    const type =
      recordInfo.split("-")[0] === "redflag" ? "red-flags" : "interventions";
    const id = recordInfo.split("-")[1];
    dispatch({ type: RECORDS_LOADING });
    try {
      const response = await axios.delete(`/${type}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const { error } = response.data;
      if (error) {
        return dispatch({
          type: ERROR_DELETING_RECORD,
          payload: error
        });
      }
      return dispatch({
        type: RECORD_DELETED
      });
    } catch (err) {
      return dispatch({
        type: ERROR_DELETING_RECORD
      });
    }
  };
};

/**
 * @description Action creator for resetting deleted record status
 * @returns {function} dispatch function with the appropriate action
 */
export const resetDeletedRecordAction = () => ({ type: RESET_DELETED_RECORD });

/**
 * @description Action creator for posting details provided by the user to the edit record endpoints
 * @param {string} token The user's token
 * @param {object} details The details provided by the user
 * @returns {function} dispatch function with the appropriate action
 */
export const editRecordAction = (token, details) => {
  const { comment, latitude, longitude, images, type } = details;
  return async dispatch => {
    dispatch({ type: RECORDS_LOADING });
    try {
      const typeEndpoint = type === "red-flag" ? "red-flags" : "interventions";
      let commentResponse = { data: {} };
      let locationResponse = { data: {} };
      let imageResponse = { data: {} };
      if (comment) {
        commentResponse = await axios.patch(
          `/${typeEndpoint}/${details.id}/comment`,
          { comment },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      }
      if (latitude && longitude) {
        locationResponse = await axios.patch(
          `/${typeEndpoint}/${details.id}/location`,
          { latitude, longitude },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      }
      if (images.length) {
        const imgFormData = new FormData();
        images.forEach((file, index) =>
          imgFormData.append(`files[${index}]`, file)
        );
        imgFormData.append("enctype", "multipart/form-data");
        imageResponse = await axios.patch(
          `/${typeEndpoint}/${details.id}/addImages`,
          imgFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      }
      const error =
        commentResponse.data.error ||
        locationResponse.data.error ||
        imageResponse.data.error ||
        "";
      if (error) {
        return dispatch({
          type: ERROR_EDITING_RECORD,
          payload: `Unable to update part of your record because: ${error}`
        });
      }

      return dispatch({
        type: EDITED_RECORD,
        payload: "Record Successfully Updated"
      });
    } catch (err) {
      return dispatch({
        type: ERROR_EDITING_RECORD,
        payload: "Unable to update part of your record, please try again later"
      });
    }
  };
};

/**
 * @description Action creator for gettong all records on the platform
 * @param {string} token The user's token
 * @returns {function} dispatch function with the appropriate action
 */
export const getAllRecords = token => {
  return async dispatch => {
    dispatch({ type: RECORDS_LOADING });
    try {
      const redFlagResponse = await axios.get("/red-flags", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const interventionResponse = await axios.get("/interventions", {
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
        type: GOT_ALL_RECORDS,
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
 * @description Action creator for posting details provided by the admin to the update record endpoints
 * @param {string} token The user's token
 * @param {object} details The details provided by the admin
 * @returns {function} dispatch function with the appropriate action
 */
export const updateRecordAction = (token, details) => {
  const { adminStatus, adminFeedback, type, id } = details;
  const updateInfo = {};
  if (adminStatus) {
    updateInfo.status = adminStatus;
  }
  if (adminFeedback) {
    updateInfo.feedback = adminFeedback;
  }
  return async dispatch => {
    dispatch({ type: RECORDS_LOADING });
    try {
      const typeEndpoint = type === "red-flag" ? "red-flags" : "interventions";
      const response = await axios.patch(
        `/${typeEndpoint}/${id}/status`,
        { ...updateInfo },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const { error, data } = response.data;

      if (error) {
        return dispatch({
          type: ERROR_UPDATING_RECORD,
          payload: `Unable to update record because: ${error}`
        });
      }

      return dispatch({
        type: UPDATED_RECORD,
        payload: data[0].message
      });
    } catch (err) {
      return dispatch({
        type: ERROR_UPDATING_RECORD,
        payload: "Unable to update record, please try again later"
      });
    }
  };
};

/**
 * @description Action creator for resetting updated record status
 * @returns {function} dispatch function with the appropriate action
 */
export const resetUpdatedRecordAction = () => ({ type: RESET_UPDATED_RECORD });
