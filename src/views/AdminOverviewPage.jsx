import React, { useState } from "react";
import { connect } from "react-redux";
import { func, arrayOf, object, string, bool, objectOf } from "prop-types";

// Components
import AppDashboardNavbar from "../components/Layout/DashboardNavbar";
import AppDashboardSideBar from "../components/Layout/DashboardSidebar";
import LoadingSVG from "../components/LoadingSvg";
import Modal from "../components/Modal";

// Actions
import { getAllRecords, clearRecordErrors } from "../actions/recordActions";

let state, setState;

export const getState = () => state;

export const AdminOverviewPage = ({
  allRedFlagRecords,
  allInterventionRecords,
  fetchAllRecords,
  token,
  loading,
  errorMessages,
  clearErrors,
  isAdmin,
  history
}) => {
  [state, setState] = useState({
    updatedRecords: false
  });

  const { updatedRecords } = state;
  if (!updatedRecords && token) {
    fetchAllRecords(token);
    setState({
      updatedRecords: true
    });
  }

  const totalRecordsNo = [...allRedFlagRecords, ...allInterventionRecords]
    .length;
  const totalPendingRedFlagRecordsNo = allRedFlagRecords.filter(
    record => record.status === "pending review"
  ).length;
  const totalUIRedFlagRecordsNo = allRedFlagRecords.filter(
    record => record.status === "under investigation"
  ).length;
  const totalResolvedRedFlagRecordsNo = allRedFlagRecords.filter(
    record => record.status === "resolved"
  ).length;
  const totalRejectedRedFlagRecordsNo = allRedFlagRecords.filter(
    record => record.status === "rejected"
  ).length;

  const totalPendingInterventionRecordsNo = allInterventionRecords.filter(
    record => record.status === "pending review"
  ).length;
  const totalUIInterventionRecordsNo = allInterventionRecords.filter(
    record => record.status === "under investigation"
  ).length;
  const totalResolvedInterventionRecordsNo = allInterventionRecords.filter(
    record => record.status === "resolved"
  ).length;
  const totalRejectedInterventionRecordsNo = allInterventionRecords.filter(
    record => record.status === "rejected"
  ).length;

  return (
    <div className="blue-bg dashboard-body">
      {!isAdmin && (
        <Modal
          modalHeader="Error"
          modalText="Only an Admin can view this page"
          onClose={() => history.push("/login")}
        />
      )}
      ;{loading && <LoadingSVG />}
      {errorMessages.length && (
        <Modal
          modalHeader="Error"
          modalText={errorMessages[0].error}
          onClose={clearErrors}
        />
      )}
      <AppDashboardNavbar />
      <AppDashboardSideBar admin />
      <main className="dashboard-main">
        <section className="dashboard-card">
          <section className="dashboard-main-statistics-section">
            <h2 className="dashboard-main-header red-cl">
              Platform Statistics
            </h2>

            <div className="dashboard-main-statistics-section-row">
              <div className="dashboard-main-statistics-section-row-item">
                <h3
                  className="dashboard-main-statistics-section-row-item-number red-cl"
                  id="total-no"
                >
                  {totalRecordsNo}
                </h3>

                <p className="dashboard-main-statistics-section-row-item-label">
                  Total Records Filed
                </p>
              </div>
            </div>

            <div className="dashboard-main-statistics-section-row">
              <div className="dashboard-main-statistics-section-row-item">
                <h3
                  className="dashboard-main-statistics-section-row-item-number red-cl"
                  id="red-flag-no"
                >
                  {allRedFlagRecords.length}
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
                  {allInterventionRecords.length}
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
        </section>
      </main>
    </div>
  );
};

export const mapStateToProps = ({ auth, records, user }) => {
  const {
    allRedFlagRecords,
    allInterventionRecords,
    loading,
    errorMessages
  } = records;
  const { token, isLoggedIn } = auth;
  return {
    allRedFlagRecords,
    allInterventionRecords,
    token,
    loading,
    errorMessages,
    isLoggedIn,
    isAdmin: user.user.is_admin
  };
};

export const mapDispatchToProps = dispatch => {
  return {
    fetchAllRecords: token => dispatch(getAllRecords(token)),
    clearErrors: () => dispatch(clearRecordErrors())
  };
};

AdminOverviewPage.propTypes = {
  /**
   * All red flag records created on the platform
   */
  allRedFlagRecords: arrayOf(object).isRequired,
  /**
   * All intervention records created on the platform
   */
  allInterventionRecords: arrayOf(object).isRequired,
  /**
   * Function to get all records
   */
  fetchAllRecords: func.isRequired,
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
   * History object
   */
  history: objectOf(object)
};

AdminOverviewPage.defaultProps = {
  errorMessages: [],
  isAdmin: false,
  history: {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminOverviewPage);
