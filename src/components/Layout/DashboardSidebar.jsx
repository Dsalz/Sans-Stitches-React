import React, { useState } from "react";
import { NavLink } from "react-router-dom";

// eslint-disable-next-line import/no-mutable-exports
export let state, setState;
const DashboardSidebar = () => {
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
      <NavLink className="dashboard-sidebar-item" to="/profile">
        Profile
      </NavLink>
      <NavLink className="dashboard-sidebar-item" to="/myrecords">
        My Records
      </NavLink>
      <NavLink className="dashboard-sidebar-item" to="/new-record">
        Create New Record
      </NavLink>
    </aside>
  );
};

export default DashboardSidebar;
