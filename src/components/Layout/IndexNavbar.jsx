import React from "react";
import { NavLink } from "react-router-dom";

const IndexNavbar = () => {
  return (
    <nav className="index-navbar">
      <div className="index-navbar-logo">
        <NavLink to="/" className="index-navbar-logo-link red-cl">
          Sans-Stitches
        </NavLink>
      </div>

      <div className="index-navbar-links">
        <NavLink to="/signup" className="red-cl" id="signuplink">
          Sign Up
        </NavLink>

        <NavLink to="/login" className="red-cl" id="loginlink">
          Login
        </NavLink>
      </div>
    </nav>
  );
};

export default IndexNavbar;
