import React, { useState } from "react";
import { connect } from "react-redux";
import { func, arrayOf, object, string, bool } from "prop-types";
import { Redirect } from "react-router-dom";

// Components
import AppDashboardNavbar from "../components/Layout/DashboardNavbar";
import AppDashboardSideBar from "../components/Layout/DashboardSidebar";
import LoadingSVG from "../components/LoadingSvg";
import Modal from "../components/Modal";

// Actions
import { getMyRecords, clearRecordErrors } from "../actions/recordActions";

let state, setState;

export const getState = () => state;

export const ProfilePage = ({
  myRedFlagRecords,
  myInterventionRecords,
  fetchMyRecords,
  token,
  loading,
  errorMessages,
  clearErrors,
  phoneNumber,
  isAdmin,
  firstname,
  lastname,
  email
}) => {
  if (isAdmin) {
    return <Redirect to="/admin-overview" />;
  }
  [state, setState] = useState({
    updatedRecords: false
  });

  const { updatedRecords } = state;
  if (!updatedRecords && token) {
    fetchMyRecords(token);
    setState({
      updatedRecords: true
    });
  }

  const totalRecordsNo = [...myRedFlagRecords, ...myInterventionRecords].length;
  const totalPendingRedFlagRecordsNo = myRedFlagRecords.filter(
    record => record.status === "pending review"
  ).length;
  const totalUIRedFlagRecordsNo = myRedFlagRecords.filter(
    record => record.status === "under investigation"
  ).length;
  const totalResolvedRedFlagRecordsNo = myRedFlagRecords.filter(
    record => record.status === "resolved"
  ).length;
  const totalRejectedRedFlagRecordsNo = myRedFlagRecords.filter(
    record => record.status === "rejected"
  ).length;

  const totalPendingInterventionRecordsNo = myInterventionRecords.filter(
    record => record.status === "pending review"
  ).length;
  const totalUIInterventionRecordsNo = myInterventionRecords.filter(
    record => record.status === "under investigation"
  ).length;
  const totalResolvedInterventionRecordsNo = myInterventionRecords.filter(
    record => record.status === "resolved"
  ).length;
  const totalRejectedInterventionRecordsNo = myInterventionRecords.filter(
    record => record.status === "rejected"
  ).length;

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
      <AppDashboardNavbar />
      <AppDashboardSideBar />
      <main className="dashboard-main">
        <section className="dashboard-card">
          <section className="dashboard-main-statistics-section">
            <h2 className="dashboard-main-header red-cl">Statistics</h2>

            <div className="dashboard-main-statistics-section-row">
              <div className="dashboard-main-statistics-section-row-item">
                <h3
                  className="dashboard-main-statistics-section-row-item-number red-cl"
                  id="total-no"
                >
                  {totalRecordsNo}
                </h3>

                <p className="dashboard-main-statistics-section-row-item-label">
                  Total Records Filed By You
                </p>
              </div>
            </div>

            <div className="dashboard-main-statistics-section-row">
              <div className="dashboard-main-statistics-section-row-item">
                <h3
                  className="dashboard-main-statistics-section-row-item-number red-cl"
                  id="red-flag-no"
                >
                  {myRedFlagRecords.length}
                </h3>

                <p className="dashboard-main-statistics-section-row-item-label">
                  Red Flag Records
                </p>
              </div>

              <div className="dashboard-main-statistics-section-row-item">
                <h3
                  className="dashboard-main-statistics-section-row-item-number red-cl"
                  id="intervention-no"
                >
                  {myInterventionRecords.length}
                </h3>

                <p className="dashboard-main-statistics-section-row-item-label">
                  Intervention Records
                </p>
              </div>
            </div>

            <div className="dashboard-main-statistics-section-row">
              <div className="dashboard-main-statistics-section-row-column">
                <div className="dashboard-main-statistics-section-row-column-item pending">
                  <h3
                    className="dashboard-main-statistics-section-row-item-number red-cl"
                    id="red-flag-pending-no"
                  >
                    {totalPendingRedFlagRecordsNo}
                  </h3>

                  <p className="dashboard-main-statistics-section-row-item-label">
                    Pending Review
                  </p>
                </div>
                <div className="dashboard-main-statistics-section-row-column-item under-investigation">
                  <h3
                    className="dashboard-main-statistics-section-row-item-number red-cl"
                    id="red-flag-under-investigation-no"
                  >
                    {totalUIRedFlagRecordsNo}
                  </h3>

                  <p className="dashboard-main-statistics-section-row-item-label">
                    Under-Investigation
                  </p>
                </div>
                <div className="dashboard-main-statistics-section-row-column-item resolved">
                  <h3
                    className="dashboard-main-statistics-section-row-item-number red-cl"
                    id="red-flag-resolved-no"
                  >
                    {totalResolvedRedFlagRecordsNo}
                  </h3>

                  <p className="dashboard-main-statistics-section-row-item-label">
                    Resolved
                  </p>
                </div>

                <div className="dashboard-main-statistics-section-row-column-item rejected">
                  <h3
                    className="dashboard-main-statistics-section-row-item-number red-cl"
                    id="red-flag-rejected-no"
                  >
                    {totalRejectedRedFlagRecordsNo}
                  </h3>

                  <p className="dashboard-main-statistics-section-row-item-label">
                    Rejected
                  </p>
                </div>
              </div>
              <hr className="dashboard-main-statistics-section-row-column-divider" />
              <div className="dashboard-main-statistics-section-row-column">
                <div className="dashboard-main-statistics-section-row-column-item pending">
                  <h3
                    className="dashboard-main-statistics-section-row-item-number red-cl"
                    id="intervention-pending-no"
                  >
                    {totalPendingInterventionRecordsNo}
                  </h3>

                  <p className="dashboard-main-statistics-section-row-item-label">
                    Pending Review
                  </p>
                </div>
                <div className="dashboard-main-statistics-section-row-column-item under-investigation">
                  <h3
                    className="dashboard-main-statistics-section-row-item-number red-cl"
                    id="intervention-under-investigation-no"
                  >
                    {totalUIInterventionRecordsNo}
                  </h3>

                  <p className="dashboard-main-statistics-section-row-item-label">
                    Under-Investigation
                  </p>
                </div>
                <div className="dashboard-main-statistics-section-row-column-item resolved">
                  <h3
                    className="dashboard-main-statistics-section-row-item-number red-cl"
                    id="intervention-resolved-no"
                  >
                    {totalResolvedInterventionRecordsNo}
                  </h3>

                  <p className="dashboard-main-statistics-section-row-item-label">
                    Resolved
                  </p>
                </div>

                <div className="dashboard-main-statistics-section-row-column-item rejected">
                  <h3
                    className="dashboard-main-statistics-section-row-item-number red-cl"
                    id="intervention-rejected-no"
                  >
                    {totalRejectedInterventionRecordsNo}
                  </h3>

                  <p className="dashboard-main-statistics-section-row-item-label">
                    Rejected
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="dashboard-main-generalinfo-section">
            <h2 className="dashboard-main-header red-cl">
              General Information
            </h2>

            <p className="dashboard-main-generalinfo-section-item">
              Name : <span id="fullName">{`${firstname} ${lastname}`}</span>
            </p>
            <p className="dashboard-main-generalinfo-section-item">
              Email : <span id="email">{email}</span>
            </p>
            <p className="dashboard-main-generalinfo-section-item">
              Phone No : <span id="phoneNumber">{phoneNumber}</span>
            </p>
          </section>
        </section>
      </main>
    </div>
  );
};

export const mapStateToProps = ({ auth, records, user }) => {
  const {
    myRedFlagRecords,
    myInterventionRecords,
    loading,
    errorMessages
  } = records;
  const { token } = auth;
  const { firstname, lastname, email } = user.user;
  return {
    myRedFlagRecords,
    myInterventionRecords,
    token,
    loading,
    errorMessages,
    firstname,
    lastname,
    email,
    phoneNumber: user.user.phone_number,
    isAdmin: user.user.is_admin
  };
};

export const mapDispatchToProps = dispatch => {
  return {
    fetchMyRecords: token => dispatch(getMyRecords(token)),
    clearErrors: () => dispatch(clearRecordErrors())
  };
};

ProfilePage.propTypes = {
  /**
   * All red flag records created by user
   */
  myRedFlagRecords: arrayOf(object).isRequired,
  /**
   * All intervention records created by user
   */
  myInterventionRecords: arrayOf(object).isRequired,
  /**
   * Function to get user's records
   */
  fetchMyRecords: func.isRequired,
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
   * User's phone number
   */
  phoneNumber: string,
  /**
   * User's Admin Status
   */
  isAdmin: bool,
  /**
   * User's first name
   */
  firstname: string,
  /**
   * User's last name
   */
  lastname: string,
  /**
   * User's email
   */
  email: string
};

ProfilePage.defaultProps = {
  errorMessages: [],
  phoneNumber: "",
  isAdmin: false,
  firstname: "",
  lastname: "",
  email: ""
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfilePage);
