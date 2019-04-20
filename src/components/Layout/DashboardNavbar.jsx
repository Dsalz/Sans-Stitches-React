import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { bool, func, string } from "prop-types";

// Actions
import { logoutUserAction } from "../../actions/authActions";

// eslint-disable-next-line import/no-mutable-exports
export let state, setState;

export const DashboardNavbar = ({ logout, isLoggedIn, firstname, isAdmin }) => {
  [state, setState] = useState({
    showDropdown: false
  });

  const toggleDropDown = () => {
    const { showDropdown } = state;
    setState({
      showDropdown: !showDropdown
    });
  };

  const { showDropdown } = state;

  const logUserOut = () => {
    logout();
  };

  return !isLoggedIn ? (
    <Redirect to="/login" />
  ) : (
    <nav className="dashboard-nav">
      <span className="dashboard-nav-logo">Sans-Stitches</span>
      <div className="dashboard-nav-dropdown">
        <p
          className={`dashboard-nav-dropdown-user ${
            showDropdown ? "triangle-up" : "triangle-down"
          }`}
          onClick={toggleDropDown}
          role="presentation"
        >
          {isAdmin ? "admin" : firstname}
        </p>
        <div
          className={`dashboard-nav-dropdown-options ${showDropdown &&
            "show-dropdown"}`}
          id="dropdown-menu"
        >
          <span
            className="dashboard-nav-dropdown-options-item"
            onClick={logUserOut}
            id="logout"
            role="presentation"
          >
            Logout
          </span>
        </div>
      </div>
    </nav>
  );
};

DashboardNavbar.propTypes = {
  /**
   * Boolean field depicting if user is logged in
   */
  isLoggedIn: bool.isRequired,
  /**
   * Function for logging user out
   */
  logout: func.isRequired,
  /**
   * User's first name
   */
  firstname: string.isRequired,
  /**
   * User's admin status
   */
  isAdmin: bool
};

DashboardNavbar.defaultProps = {
  isAdmin: false
};

export const mapStateToProps = ({ auth, user }) => {
  const { isLoggedIn } = auth;
  const { firstname } = user.user;
  return {
    isLoggedIn,
    firstname,
    isAdmin: user.user.is_admin
  };
};

export const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(logoutUserAction())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardNavbar);
