/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, Fragment } from "react";
import { connect } from "react-redux";
import {
  func,
  arrayOf,
  object,
  string,
  bool,
  objectOf,
  number
} from "prop-types";
import ReactGoogleMapLoader from "react-google-maps-loader";
import ReactGoogleMap from "react-google-map";
import dotenv from "dotenv";
import { Link } from "react-router-dom";

// Components
import AppDashboardNavbar from "../components/Layout/DashboardNavbar";
import AppDashboardSideBar from "../components/Layout/DashboardSidebar";
import IndexNavbar from "../components/Layout/IndexNavbar";
import LoadingSVG from "../components/LoadingSvg";
import Modal from "../components/Modal";

// Actions
import {
  fetchRecordAction,
  clearRecordErrors,
  resetDeletedRecordAction,
  deleteRecordAction
} from "../actions/recordActions";

import { baseURL } from "../actions/customAxios";

let state, setState;

export const getState = () => state;

dotenv.config();

const API_KEY = process.env.GOOGLE_SECRET_KEY;

export const RecordDetailsPage = ({
  isAdmin,
  match,
  loading,
  errorMessages,
  clearErrors,
  fetchRecord,
  token,
  recordFetched,
  userId,
  resetDeletedRecord,
  deleteRecord,
  recordDeleted,
  history
}) => {
  [state, setState] = useState({
    fetchedRecord: false,
    showDeleteModal: false,
    resetDeletedStatus: false
  });

  const { fetchedRecord, resetDeletedStatus } = state;
  if (!fetchedRecord) {
    const { recordInfo } = match.params;
    fetchRecord(recordInfo);
    setState({
      ...state,
      fetchedRecord: true
    });
  }

  if (!resetDeletedStatus) {
    resetDeletedRecord();
    setState({
      ...state,
      resetDeletedStatus: true
    });
  }

  const handleDeleteRecord = () => {
    const { recordInfo } = match.params;
    deleteRecord(token, recordInfo);
  };

  const toggleDeleteModal = () => {
    const { showDeleteModal } = state;
    setState({
      ...state,
      showDeleteModal: !showDeleteModal
    });
  };

  const {
    comment,
    type,
    status,
    description,
    images,
    videos,
    feedback,
    location,
    id
  } = recordFetched;
  let latitude, longitude;
  if (location) {
    latitude = Number(location.split(" , ")[0]);
    longitude = Number(location.split(" , ")[1]);
  }

  const { showDeleteModal } = state;
  return (
    <div className={`${token ? "blue-bg dashboard-body" : "blk-rd-gradient"}`}>
      {recordDeleted && !errorMessages.length && (
        <Modal
          modalHeader="Success"
          modalText="You have successfully deleted this record"
          onClose={() => history.push("/myrecords")}
        />
      )}
      {loading && <LoadingSVG />}
      {errorMessages.length && (
        <Modal
          modalHeader="Error"
          modalText={errorMessages[0].error}
          onClose={clearErrors}
        />
      )}
      {showDeleteModal && !errorMessages.length && !recordDeleted && (
        <Modal
          modalHeader="Delete Record"
          modalText=""
          onClose={toggleDeleteModal}
        >
          <div className="delete-modal-options-div">
            <p className="delete-modal-text">
              Are you sure you want to delete this record?
            </p>
            <button
              className="rect-red-button edit-record-update-button"
              type="button"
              onClick={toggleDeleteModal}
            >
              No
            </button>
            <button
              className="rect-red-button edit-record-delete-button"
              type="button"
              id="delete-btn"
              onClick={() => handleDeleteRecord()}
            >
              Yes
            </button>
          </div>
        </Modal>
      )}
      {token && !isAdmin && (
        <Fragment>
          <AppDashboardNavbar />
          <AppDashboardSideBar />
        </Fragment>
      )}
      {!token && <IndexNavbar />}
      <main className={`dashboard-main ${!token && "index-details"}`}>
        <section className="dashboard-card">
          <section className="record-details-section">
            <div>
              <h2 className="record-details-section-header" id="comment">
                {comment || ""}
              </h2>
              <span className="record-details-section-type" id="type">
                {type || ""}
              </span>
              <br />
            </div>
            <div>
              <span className="record-details-section-status-label">
                Status
              </span>
              <span className="record-details-section-status" id="status">
                {status || ""}
              </span>
            </div>

            <div className="record-details-section-item">
              <h3 className="record-details-section-item-header">
                Description
              </h3>
              <hr className="record-details-section-line" />
              <div className="record-details-section-item-data">
                <p id="description">{description || "No Description Given"}</p>
              </div>
            </div>

            <div className="record-details-section-item">
              <h3 className="record-details-section-item-header">Images</h3>
              <hr className="record-details-section-line" />
              <div
                className="record-details-section-item-data"
                id="image-preview-div"
              >
                {images && (
                  <Fragment>
                    {images.length > 0 && (
                      <Fragment>
                        {images.map(img => (
                          <img
                            src={`${baseURL}/img/${img}`}
                            alt="Sans-Stitches Record"
                            key={img}
                          />
                        ))}
                      </Fragment>
                    )}
                    {!images.length && <span>No images Provided</span>}
                  </Fragment>
                )}
              </div>
            </div>

            <div className="record-details-section-item">
              <h3 className="record-details-section-item-header">Video Url</h3>
              <hr className="record-details-section-line" />
              <div className="record-details-section-item-data">
                {videos && (
                  <Fragment>
                    {videos.length > 0 && (
                      <a id="video" href={videos[0]}>
                        {videos[0]}
                      </a>
                    )}
                    {!videos.length && "No Video Provided for this record"}
                  </Fragment>
                )}
              </div>
            </div>

            <div className="record-details-section-item">
              <h3 className="record-details-section-item-header">
                Geolocation
              </h3>
              <hr className="record-details-section-line" />
              <div className="record-details-section-item-data">
                {location && (
                  <ReactGoogleMapLoader
                    params={{
                      key: API_KEY,
                      libraries: "places,geometry"
                    }}
                    render={googleMaps =>
                      googleMaps && (
                        <div
                          id="map"
                          className="record-details-section-item-data-map"
                        >
                          <ReactGoogleMap
                            googleMaps={googleMaps}
                            center={{
                              lat: latitude,
                              lng: longitude
                            }}
                            zoom={8}
                          />
                        </div>
                      )
                    }
                  />
                )}
                {!location && <p>No Location data provided for this record </p>}
              </div>
              <p id="location" />
            </div>

            <div className="record-details-section-item">
              <h3 className="record-details-section-item-header">Feedback</h3>
              <hr className="record-details-section-line" />
              <div className="record-details-section-item-data">
                <p id="feedback">
                  {feedback || "No feedback given for this record"}
                </p>
              </div>
            </div>

            {isAdmin && (
              <form id="edit-status-form">
                <div className="dashboard-form-item">
                  <label className="dashboard-form-item-label">Status:</label>

                  <div className="dashboard-form-item-whole sev-rows">
                    <div className="one-row">
                      <input
                        name="status"
                        id="pending"
                        type="radio"
                        className="form-radio-btn"
                        value="pending review"
                        checked
                      />
                      <label htmlFor="pending">Pending Review</label>
                    </div>

                    <div className="one-row">
                      <input
                        name="status"
                        id="under-investigation"
                        type="radio"
                        className="form-radio-btn"
                        value="under investigation"
                      />
                      <label htmlFor="under-investigation">
                        Under Investigation
                      </label>
                    </div>

                    <div className="one-row">
                      <input
                        name="status"
                        id="resolved"
                        type="radio"
                        className="form-radio-btn"
                        value="resolved"
                      />
                      <label htmlFor="resolved">Resolved</label>
                    </div>

                    <div className="one-row">
                      <input
                        name="status"
                        id="rejected"
                        type="radio"
                        className="form-radio-btn"
                        value="rejected"
                      />
                      <label htmlFor="rejected">Rejected</label>
                    </div>
                  </div>
                </div>

                <div className="dashboard-form-item">
                  <label
                    htmlFor="feedback"
                    className="dashboard-form-item-label"
                  >
                    Feedback:
                  </label>

                  <div className="dashboard-form-item-whole">
                    <textarea id="feedback" className="form-text-area" />
                  </div>
                </div>

                <button className="rect-red-button" type="submit">
                  Update
                </button>
              </form>
            )}
            {userId === recordFetched.created_by &&
              status === "pending review" && (
              <div className="edit-record-button-div">
                <Link
                  className="rect-red-button edit-record-update-button"
                  type="submit"
                  to={`/edit-record/${type
                    .toLowerCase()
                    .replace("-", "")}-${id}`}
                >
                    Edit
                </Link>
                <button
                  className="rect-red-button edit-record-delete-button"
                  type="button"
                  id="delete-btn"
                  onClick={toggleDeleteModal}
                >
                    Delete
                </button>
              </div>
            )}
          </section>
        </section>
      </main>
    </div>
  );
};

export const mapStateToProps = ({ auth, records, user }) => {
  const { loading, errorMessages, recordFetched, recordDeleted } = records;
  const { token } = auth;
  return {
    token,
    loading,
    errorMessages,
    isAdmin: user.user.is_admin,
    userId: user.user.id,
    recordFetched,
    recordDeleted
  };
};

export const mapDispatchToProps = dispatch => {
  return {
    fetchRecord: recordInfo => dispatch(fetchRecordAction(recordInfo)),
    clearErrors: () => dispatch(clearRecordErrors()),
    resetDeletedRecord: () => dispatch(resetDeletedRecordAction()),
    deleteRecord: (token, recordInfo) =>
      dispatch(deleteRecordAction(token, recordInfo))
  };
};

RecordDetailsPage.propTypes = {
  /**
   * Function for resetting deleted record state in the store to false
   */
  resetDeletedRecord: func.isRequired,
  /**
   * Function for deleting record
   */
  deleteRecord: func.isRequired,
  /**
   * Booleanvalue depicting if a record has recently been deleted
   */
  recordDeleted: bool.isRequired,
  /**
   * History object
   */
  history: objectOf(object).isRequired,
  /**
   * Object containing record details
   */
  recordFetched: objectOf(string),
  /**
   * Function to get records
   */
  fetchRecord: func.isRequired,
  /**
   * Function to clear errors
   */
  clearErrors: func.isRequired,
  /**
   * Boolean field depicting loading state
   */
  loading: bool.isRequired,
  /**
   * Error messages that may arise from fetching record
   */
  errorMessages: arrayOf(object),
  /**
   * User's Admin Status
   */
  isAdmin: bool,
  /**
   * User's Token
   */
  token: string,
  /**
   * React Router dom match object
   */
  match: objectOf(object).isRequired,
  /**
   * User Id
   */
  userId: number
};

RecordDetailsPage.defaultProps = {
  errorMessages: [],
  isAdmin: false,
  token: "",
  recordFetched: {},
  userId: -1
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecordDetailsPage);
