import React, { useState, Fragment } from "react";
import { NavLink } from "react-router-dom";
import { bool } from "prop-types";

// eslint-disable-next-line import/no-mutable-exports
export let state, setState;
const DashboardSidebar = ({ admin }) => {
  [state, setState] = useState({
    showResponsiveSidebar: false
  });

  const { showResponsiveSidebar } = state;

  const toggleSidebar = () => {
    setState({
      showResponsiveSidebar: !showResponsiveSidebar
    });
  };

  return (
    <aside
      className={`dashboard-sidebar ${showResponsiveSidebar &&
        "responsive-sidebar"}`}
      id="sidebar"
    >
      <div
        className="dashboard-sidebar-toggle"
        id="toggle-sidebar"
        onClick={toggleSidebar}
        role="presentation"
      >
        <hr />
        <hr />
        <hr />
      </div>
      {!admin && (
        <Fragment>
          <NavLink className="dashboard-sidebar-item" to="/profile">
            Profile
          </NavLink>
          <NavLink className="dashboard-sidebar-item" to="/myrecords">
            My Records
          </NavLink>
          <NavLink className="dashboard-sidebar-item" to="/new-record">
            Create New Record
          </NavLink>
        </Fragment>
      )}
      {admin && (
        <Fragment>
          <NavLink className="dashboard-sidebar-item" to="/admin-overview">
            Overview
          </NavLink>
          <NavLink className="dashboard-sidebar-item" to="/pending-records">
            Pending Records
          </NavLink>
          <NavLink className="dashboard-sidebar-item" to="/all-records">
            All Records
          </NavLink>
        </Fragment>
      )}
    </aside>
  );
};

DashboardSidebar.propTypes = {
  /**
   * Boolean field depicting whether to render the admin sidebar
   */
  admin: bool
};

DashboardSidebar.defaultProps = {
  admin: false
};

export default DashboardSidebar;
