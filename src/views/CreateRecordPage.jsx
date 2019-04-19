/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React, { useState } from "react";
import { connect } from "react-redux";
import { func, arrayOf, object, string, bool } from "prop-types";
import { Redirect } from "react-router-dom";
import ReactGoogleMapLoader from "react-google-maps-loader";
import ReactGooglePlacesSuggest from "react-google-places-suggest";
import dotenv from "dotenv";

// Components
import AppDashboardNavbar from "../components/Layout/DashboardNavbar";
import AppDashboardSideBar from "../components/Layout/DashboardSidebar";
import LoadingSVG from "../components/LoadingSvg";
import Modal from "../components/Modal";
import BottomLineInput from "../components/BottomLineInput";

// Actions
import {
  createNewRecord,
  clearRecordErrors,
  resetCreateRecordMessage
} from "../actions/recordActions";

let state, setState;

export const getState = () => state;

dotenv.config();

const API_KEY = process.env.GOOGLE_SECRET_KEY;

export const CreateRecordPage = ({
  token,
  createRecord,
  loading,
  errorMessages,
  clearErrors,
  isAdmin,
  resetMessage,
  history,
  createdRecordMessage
}) => {
  if (isAdmin) {
    return <Redirect to="/admin-overview" />;
  }

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
    location: "",
    latitude: "",
    longitude: "",
    images: [],
    imagesSrc: [],
    video: "",
    value: "",
    resetCreatedRecord: false
  });

  const { resetCreatedRecord } = state;

  if (!resetCreatedRecord) {
    resetMessage();
    setState({
      ...state,
      resetCreatedRecord: true
    });
  }

  const handleChange = e => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    });
  };

  const handleLocationChange = e => {
    setState({
      ...state,
      location: e.target.value,
      value: e.target.value
    });
  };

  const deleteImg = i => {
    const { images, imagesSrc } = state;
    setState({
      ...state,
      images: images.filter((img, index) => index !== i),
      imagesSrc: imagesSrc.filter((img, index) => index !== i)
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
        images: [...images, inputField.files[0]]
      });
    };
    imgReader.readAsDataURL(inputField.files[0]);
  };

  const handleSubmit = e => {
    e.preventDefault();
    createRecord(token, state);
  };
  const { imagesSrc, location, value, latitude, longitude, type } = state;
  return (
    <div className="blue-bg dashboard-body">
      {loading && <LoadingSVG />}
      {errorMessages.length && (
        <Modal
          modalHeader="Error"
          modalText={errorMessages[0].error}
          onClose={clearErrors}
        />
      )}
      {createdRecordMessage && (
        <Modal
          modalHeader="Success"
          modalText={createdRecordMessage}
          onClose={() => history.push("/myrecords")}
        />
      )}
      <AppDashboardNavbar />
      <AppDashboardSideBar />
      <main className="dashboard-main">
        <section className="dashboard-card">
          <section className="new-record-section">
            <h2 className="dashboard-main-header red-cl">New Record</h2>

            <form id="new-record-form" onSubmit={handleSubmit}>
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
                      checked={type === "Red Flag"}
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
                      checked={type === "Intervention"}
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
                    placeholder="Enter extra information here"
                    id="description"
                    className="form-text-area"
                    onChange={handleChange}
                    name="description"
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
                        <span id="location-latitude">{latitude}</span>
                      </div>

                      <div className="dashboard-form-item-split-item">
                        <label>Longitude</label>
                        <br />
                        <span id="location-longitude">{longitude}</span>
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
                      document
                        .getElementById("add-image-input")
                        .dispatchEvent(new MouseEvent("click"))
                    }
                  >
                    +
                  </button>

                  <input
                    type="file"
                    className="form-file-input"
                    id="add-image-input"
                    onChange={handleImgUpload}
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
                  />
                </div>
              </div>

              <button
                type="submit"
                className="rect-red-button"
                disabled={loading}
              >
                Create
              </button>
            </form>
          </section>
        </section>
      </main>
    </div>
  );
};

export const mapStateToProps = ({ auth, records, user }) => {
  const { loading, errorMessages, createdRecordMessage } = records;
  const { token } = auth;
  return {
    token,
    loading,
    errorMessages,
    isAdmin: user.user.is_admin,
    createdRecordMessage
  };
};

export const mapDispatchToProps = dispatch => {
  return {
    createRecord: (token, details) => dispatch(createNewRecord(token, details)),
    clearErrors: () => dispatch(clearRecordErrors()),
    resetMessage: () => dispatch(resetCreateRecordMessage())
  };
};

CreateRecordPage.propTypes = {
  /**
   * Function to create record
   */
  createRecord: func.isRequired,
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
   * Message returned when creating record
   */
  createdRecordMessage: string,
  /**
   * Message returned when creating record
   */
  history: string.isRequired
};

CreateRecordPage.defaultProps = {
  errorMessages: [],
  isAdmin: false,
  createdRecordMessage: ""
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateRecordPage);
