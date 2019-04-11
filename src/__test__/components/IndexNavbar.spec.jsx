import React from "react";
import { shallow } from "enzyme";
import IndexNavbar from "../../components/Layout/IndexNavbar.jsx";

describe("Index Navbar component", () => {
  const indexNavbar = shallow(<IndexNavbar />);
  it("renders the navbar", () => {
    expect(indexNavbar.find("nav.index-navbar").exists()).toBe(true);
  });
  it("renders the logo", () => {
    expect(indexNavbar.find("div.index-navbar-logo").exists()).toBe(true);
  });
  it("renders the login and signup links", () => {
    expect(indexNavbar.find("div.index-navbar-links").exists()).toBe(true);
  });
});
