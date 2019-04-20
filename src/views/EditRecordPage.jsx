/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React, { useState, Fragment, useRef } from "react";
import { connect } from "react-redux";
import {
  func,
  arrayOf,
  object,
  string,
  bool,
  number,
  objectOf
} from "prop-types";
import { Redirect } from "react-router-dom";
import ReactGoogleMapLoader from "react-google-maps-loader";
import ReactGooglePlacesSuggest from "react-google-places-suggest";
import dotenv from "dotenv";
import ReactGeocode from "react-geocode";

// Components
import AppDashboardNavbar from "../components/Layout/DashboardNavbar";
import AppDashboardSideBar from "../components/Layout/DashboardSidebar";
import LoadingSVG from "../components/LoadingSvg";
import Modal from "../components/Modal";
import BottomLineInput from "../components/BottomLineInput";

// Actions
import {
  clearRecordErrors,
  resetEditRecordMessage,
  fetchRecordAction,
  editRecordAction
} from "../actions/recordActions";

import { baseURL } from "../actions/customAxios";

let state, setState;

export const getState = () => state;

dotenv.config();

const API_KEY = process.env.GOOGLE_SECRET_KEY;

ReactGeocode.setApiKey(API_KEY);

export const EditRecordPage = ({
  token,
  editRecord,
  match,
  fetchRecord,
  loading,
  errorMessages,
  clearErrors,
  isAdmin,
  resetMessage,
  history,
  editRecordMessage,
  recordFetchedForEdit,
  userId
}) => {
  if (isAdmin) {
    return <Redirect to="/admin-overview" />;
  }

  const imageInputRef = useRef(null);

  const handleSelectSuggest = suggest => {
    setState({
      ...state,
      location: "",
      latitude: String(suggest.geometry.location.lat()),
      longitude: String(suggest.geometry.location.lng()),
      value: suggest.formatted_address
    });
  };
  [state, setState] = useState({
    comment: "",
    type: "Red Flag",
    description: "",
    latitude: "",
    longitude: "",
    images: [],
    imagesSrc: [],
    video: "",
    value: "",
    resetEditedRecord: false,
    fetchedRecord: false,
    commentEditted: false,
    locationEditted: false,
    imageEditted: false
  });

  const {
    fetchedRecord,
    resetEditedRecord,
    location,
    locationEditted,
    commentEditted,
    imageEditted
  } = state;

  if (!resetEditedRecord) {
    resetMessage();
    setState({
      ...state,
      resetEditedRecord: true
    });
  }

  const { recordInfo } = match.params;
  if (!fetchedRecord) {
    fetchRecord(recordInfo);
    setState({
      ...state,
      fetchedRecord: true
    });
  }

  const handleChange = e => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
      commentEditted: true
    });
  };

  const handleLocationChange = e => {
    setState({
      ...state,
      location: e.target.value,
      value: e.target.value,
      locationEditted: true
    });
  };

  const handleImgUpload = e => {
    const { imagesSrc, images } = state;
    const imgReader = new FileReader();
    const inputField = e.target;
    imgReader.onload = evt => {
      setState({
        ...state,
        imagesSrc: [...imagesSrc, evt.target.result],
        images: [...images, inputField.files[0]],
        imageEditted: true
      });
    };
    imgReader.readAsDataURL(inputField.files[0]);
  };

  const deleteImg = i => {
    const { images, imagesSrc } = state;
    setState({
      ...state,
      images: images.filter((img, index) => index !== i),
      imagesSrc: imagesSrc.filter((img, index) => index !== i)
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const { id, type } = recordFetchedForEdit;
    state.id = id;
    state.type = type;
    editRecord(token, state);
  };
  const { imagesSrc, value, latitude, longitude } = state;
  const {
    comment,
    type,
    status,
    description,
    images,
    videos
  } = recordFetchedForEdit;

  const currLocation = recordFetchedForEdit.location;

  if (
    !location &&
    !value &&
    currLocation &&
    !locationEditted &&
    process.env.NODE_ENV !== "test"
  ) {
    const currLat = currLocation.split(" , ")[0];
    const currLng = currLocation.split(" , ")[1];
    ReactGeocode.fromLatLng(currLat, currLng).then(resp => {
      setState({
        ...state,
        value: resp.results[0].formatted_address
      });
    });
  }

  const recordEditted = locationEditted || imageEditted || commentEditted;

  return (
    <div className="blue-bg dashboard-body">
      {loading && <LoadingSVG />}
      {status && status !== "pending review" && (
        <Modal
          modalHeader="Error"
          modalText={"You can't edit a record that isn't pending review"}
          onClose={() => history.push("/myrecords")}
        />
      )}
      {recordFetchedForEdit.created_by &&
        recordFetchedForEdit.created_by !== userId && (
        <Modal
          modalHeader="Error"
          modalText={"You can't edit a record that you didn't create"}
          onClose={() => history.push("/myrecords")}
        />
      )}
      {errorMessages.length && (
        <Modal
          modalHeader="Error"
          modalText={errorMessages[0].error}
          onClose={clearErrors}
        />
      )}
      {editRecordMessage && (
        <Modal
          modalHeader="Success"
          modalText={editRecordMessage}
          onClose={() => {
            document.location.assign(`/record/${recordInfo}`);
          }}
        />
      )}
      <AppDashboardNavbar />
      <AppDashboardSideBar />
      <main className="dashboard-main">
        <section className="dashboard-card">
          <section className="new-record-section edit-record-section">
            <h2 className="dashboard-main-header red-cl">Edit Record</h2>

            <form id="edit-record-form" onSubmit={handleSubmit}>
              <div className="dashboard-form-item">
                <label htmlFor="comment" className="dashboard-form-item-label">
                  Title:
                </label>

                <div className="dashboard-form-item-whole">
                  <BottomLineInput
                    inputName="comment"
                    inputId="comment"
                    onChange={handleChange}
                    isRequired
                    inputValue={commentEditted ? state.comment : comment}
                  />
                </div>
              </div>

              <div className="dashboard-form-item">
                <label className="dashboard-form-item-label">Type:</label>

                <div className="dashboard-form-item-split">
                  <div className="dashboard-form-item-split-item">
                    <input
                      name="type"
                      id="red-flag"
                      type="radio"
                      className="form-radio-btn"
                      value="Red Flag"
                      onChange={handleChange}
                      checked={type === "red-flag"}
                      disabled
                    />
                    <label htmlFor="red-flag">Red Flag</label>
                  </div>

                  <div className="dashboard-form-item-split-item">
                    <input
                      name="type"
                      id="intervention"
                      type="radio"
                      className="form-radio-btn"
                      value="Intervention"
                      onChange={handleChange}
                      checked={type === "intervention"}
                      disabled
                    />
                    <label htmlFor="intervention">Intervention</label>
                  </div>
                </div>
              </div>

              <div className="dashboard-form-item">
                <label
                  htmlFor="description"
                  className="dashboard-form-item-label"
                >
                  Description:
                </label>

                <div className="dashboard-form-item-whole">
                  <textarea
                    id="description"
                    className="form-text-area cant-update"
                    onChange={handleChange}
                    name="description"
                    value={description || ""}
                    disabled
                  />
                </div>
              </div>

              <div className="dashboard-form-item">
                <label htmlFor="location" className="dashboard-form-item-label">
                  Location:
                </label>

                <div className="dashboard-form-item-whole" id="location-div">
                  <ReactGoogleMapLoader
                    params={{
                      key: API_KEY,
                      libraries: "places,geocode"
                    }}
                    render={googleMaps =>
                      googleMaps && (
                        <div>
                          <ReactGooglePlacesSuggest
                            autocompletionRequest={{ input: location }}
                            googleMaps={googleMaps}
                            onSelectSuggest={handleSelectSuggest}
                          >
                            <input
                              name="location"
                              id="location"
                              className="bottom-line-input"
                              type="text"
                              value={value}
                              onChange={handleLocationChange}
                            />
                          </ReactGooglePlacesSuggest>
                        </div>
                      )
                    }
                  />

                  <div className="dashboard-form-item form-extra">
                    <div className="dashboard-form-item-split">
                      <div className="dashboard-form-item-split-item">
                        <label>Latitude</label>
                        <br />
                        {latitude && (
                          <span id="location-latitude">{latitude}</span>
                        )}
                        {!latitude && currLocation && (
                          <span id="location-latitude">
                            {currLocation.split(" , ")[0]}
                          </span>
                        )}
                      </div>

                      <div className="dashboard-form-item-split-item">
                        <label>Longitude</label>
                        <br />
                        {longitude && (
                          <span id="location-latitude">{longitude}</span>
                        )}
                        {!longitude && currLocation && (
                          <span id="location-latitude">
                            {currLocation.split(" , ")[1]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dashboard-form-item horizontal-flex">
                <label htmlFor="images" className="dashboard-form-item-label">
                  Images:
                </label>

                <div className="dashboard-form-item-whole">
                  <div
                    className="dashboard-form-item-preview"
                    id="image-preview-div"
                  >
                    {images && (
                      <Fragment>
                        {images.length > 0 && (
                          <Fragment>
                            {images.map(img => (
                              <div
                                key={img}
                                className="dashboard-form-item-preview img"
                              >
                                <img
                                  src={`${baseURL}/img/${img}`}
                                  alt="Sans-Stitches Record"
                                />
                              </div>
                            ))}
                          </Fragment>
                        )}
                      </Fragment>
                    )}
                    {imagesSrc.map((img, i) => (
                      <div
                        key={img}
                        className="dashboard-form-item-preview img"
                      >
                        <span
                          className="dashboard-form-item-preview-remove"
                          role="presentation"
                          onClick={() => deleteImg(i)}
                        >
                          &times;
                        </span>
                        <img src={img} alt="uploaded record img" />
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="circle-red-button"
                    id="add-image-btn"
                    onClick={() =>
                      imageInputRef.current.dispatchEvent(
                        new MouseEvent("click")
                      )
                    }
                  >
                    +
                  </button>

                  <input
                    type="file"
                    className="form-file-input"
                    id="add-image-input"
                    onChange={handleImgUpload}
                    ref={imageInputRef}
                  />
                </div>
              </div>

              <div className="dashboard-form-item">
                <label htmlFor="video" className="dashboard-form-item-label">
                  Video Url:
                </label>

                <div className="dashboard-form-item-whole">
                  <BottomLineInput
                    inputName="video"
                    inputId="video"
                    onChange={handleChange}
                    value={videos ? videos[0] : ""}
                    customClass="cant-update"
                    isDisabled
                  />
                </div>
              </div>

              <div className="edit-record-button-div">
                <button
                  className="rect-red-button edit-record-update-button"
                  type="submit"
                  id="edit-record-update-btn"
                  disabled={!recordEditted || loading}
                >
                  Update
                </button>
              </div>
              {!recordEditted && (
                <p className="red-cl edit-record-info">
                  *Button will be enabled when once you change a field that can
                  be updated
                </p>
              )}
            </form>
          </section>
        </section>
      </main>
    </div>
  );
};

export const mapStateToProps = ({ auth, records, user }) => {
  const {
    loading,
    errorMessages,
    editRecordMessage,
    recordFetchedForEdit
  } = records;
  const { token } = auth;
  return {
    token,
    loading,
    errorMessages,
    isAdmin: user.user.is_admin,
    userId: user.user.id,
    editRecordMessage,
    recordFetchedForEdit
  };
};

export const mapDispatchToProps = dispatch => {
  return {
    editRecord: (token, details) => dispatch(editRecordAction(token, details)),
    clearErrors: () => dispatch(clearRecordErrors()),
    resetMessage: () => dispatch(resetEditRecordMessage()),
    fetchRecord: recordInfo => dispatch(fetchRecordAction(recordInfo, true))
  };
};

EditRecordPage.propTypes = {
  /**
   * Match Object
   */
  match: objectOf(object).isRequired,
  /**
   * Record to be edited
   */
  recordFetchedForEdit: objectOf(string),
  /**
   * User's Id
   */
  userId: number,
  /**
   * Function to fetch record
   */
  fetchRecord: func.isRequired,
  /**
   * Function to edit record
   */
  editRecord: func.isRequired,
  /**
   * Function to clear errors
   */
  clearErrors: func.isRequired,
  /**
   * User's token
   */
  token: string.isRequired,
  /**
   * Boolean field depicting loading state
   */
  loading: bool.isRequired,
  /**
   * Error message that may arise from fetching records
   */
  errorMessages: arrayOf(object),
  /**
   * User's Admin Status
   */
  isAdmin: bool,
  /**
   * Function for clearing message gotten when creating record
   */
  resetMessage: func.isRequired,
  /**
   * Message returned when editing record
   */
  editRecordMessage: string,
  /**
   * History object
   */
  history: objectOf(string).isRequired
};

EditRecordPage.defaultProps = {
  errorMessages: [],
  isAdmin: false,
  editRecordMessage: "",
  userId: -1,
  recordFetchedForEdit: {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditRecordPage);
