/* eslint-disable indent */
import React, { useState } from "react";
import { connect } from "react-redux";
import { func, arrayOf, object, string, bool, objectOf } from "prop-types";

// Components
import AppDashboardNavbar from "../components/Layout/DashboardNavbar";
import AppDashboardSideBar from "../components/Layout/DashboardSidebar";
import LoadingSVG from "../components/LoadingSvg";
import Modal from "../components/Modal";
import AppTable from "../components/Table";

// Actions
import { getAllRecords, clearRecordErrors } from "../actions/recordActions";

let state, setState;

export const getState = () => state;

export const AdminPendingRecordsPage = ({
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
      ...state,
      updatedRecords: true
    });
  }

  const totalUserRecords = [...allRedFlagRecords, ...allInterventionRecords];
  const recordsToDisplay = totalUserRecords.filter(
    r => r.status === "pending review"
  );

  return (
    <div className="blue-bg dashboard-body">
      {!isAdmin && (
        <Modal
          modalHeader="Error"
          modalText="Only an Admin can view this page"
          onClose={() => history.push("/login")}
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
      <AppDashboardNavbar />
      <AppDashboardSideBar admin />
      <main className="dashboard-main">
        <section className="dashboard-card">
          <section className="dashboard-main-records-section">
            <h2 className="dashboard-main-header red-cl">Pending Records</h2>
            <AppTable
              data={recordsToDisplay.sort((a, b) => b.id - a.id)}
              allowEdit={false}
            />
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
  const { token } = auth;
  return {
    allRedFlagRecords,
    allInterventionRecords,
    token,
    loading,
    errorMessages,
    isAdmin: user.user.is_admin
  };
};

export const mapDispatchToProps = dispatch => {
  return {
    fetchAllRecords: token => dispatch(getAllRecords(token)),
    clearErrors: () => dispatch(clearRecordErrors())
  };
};

AdminPendingRecordsPage.propTypes = {
  /**
   * All red flag records created by user
   */
  allRedFlagRecords: arrayOf(object).isRequired,
  /**
   * All intervention records created by user
   */
  allInterventionRecords: arrayOf(object).isRequired,
  /**
   * Function to get user's records
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
   * Error messages that may arise from fetching records
   */
  errorMessages: arrayOf(object),
  /**
   * User's Admin Status
   */
  isAdmin: bool,
  /**
   * History object
   */
  history: objectOf(object).isRequired
};

AdminPendingRecordsPage.defaultProps = {
  errorMessages: [],
  isAdmin: false
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminPendingRecordsPage);
