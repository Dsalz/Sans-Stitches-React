/* eslint-disable indent */
import React, { useState } from "react";
import { connect } from "react-redux";
import { func, arrayOf, object, string, bool } from "prop-types";
import { Redirect } from "react-router-dom";

// Components
import AppDashboardNavbar from "../components/Layout/DashboardNavbar";
import AppDashboardSideBar from "../components/Layout/DashboardSidebar";
import LoadingSVG from "../components/LoadingSvg";
import Modal from "../components/Modal";
import AppTable from "../components/Table";

// Actions
import { getMyRecords, clearRecordErrors } from "../actions/recordActions";

// eslint-disable-next-line import/no-mutable-exports
export let state, setState;

export const MyRecordsPage = ({
  myRedFlagRecords,
  myInterventionRecords,
  fetchMyRecords,
  token,
  loading,
  errorMessage,
  clearErrors,
  isAdmin
}) => {
  if (isAdmin) {
    return <Redirect to="/admin-overview" />;
  }
  [state, setState] = useState({
    updatedRecords: false,
    filterOption: "All"
  });

  const { updatedRecords } = state;
  if (!updatedRecords && token) {
    fetchMyRecords(token);
    setState({
      ...state,
      updatedRecords: true
    });
  }

  const toggleFilter = e => {
    setState({
      ...state,
      filterOption: e.target.value
    });
  };

  const totalUserRecords = [...myRedFlagRecords, ...myInterventionRecords];

  const { filterOption } = state;
  const filterRecords = () => {
    switch (filterOption) {
      case "Pending":
        return totalUserRecords.filter(r => r.status === "pending review");
      case "Under-Investigation":
        return totalUserRecords.filter(r => r.status === "under investigation");
      case "Resolved":
        return totalUserRecords.filter(r => r.status === "resolved");
      case "Rejected":
        return totalUserRecords.filter(r => r.status === "rejected");
      default:
        return totalUserRecords;
    }
  };
  const recordsToDisplay = filterRecords();

  return (
    <div className="blue-bg dashboard-body">
      {loading && <LoadingSVG />}
      {errorMessage && (
        <Modal
          modalHeader="Error"
          modalText={errorMessage}
          onClose={clearErrors}
        />
      )}
      <AppDashboardNavbar />
      <AppDashboardSideBar />
      <main className="dashboard-main">
        <section className="dashboard-card">
          <section className="dashboard-main-records-section">
            <h2 className="dashboard-main-header red-cl">Records</h2>

            <select
              defaultValue="All"
              className="dashboard-select"
              id="dashboard-table-select"
              onChange={toggleFilter}
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Under-Investigation">Under Investigation</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <AppTable
              data={recordsToDisplay.sort((a, b) => b.id - a.id)}
              allowEdit
            />
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
    errorMessage
  } = records;
  const { token } = auth;
  const { firstname, lastname, email } = user.user;
  return {
    myRedFlagRecords,
    myInterventionRecords,
    token,
    loading,
    errorMessage,
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

MyRecordsPage.propTypes = {
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
  errorMessage: string,
  /**
   * User's Admin Status
   */
  isAdmin: bool
};

MyRecordsPage.defaultProps = {
  errorMessage: "",
  isAdmin: false
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyRecordsPage);
