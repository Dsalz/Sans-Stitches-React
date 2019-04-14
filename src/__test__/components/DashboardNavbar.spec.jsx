import React from "react";
import { shallow } from "enzyme";
import {
  DashboardNavbar,
  state,
  mapStateToProps,
  mapDispatchToProps
} from "../../components/Layout/DashboardNavbar";

describe("Dashboard Navbar component", () => {
  const mockLogoutFunction = jest.fn();
  const dashboardNavbar = shallow(
    <DashboardNavbar
      isLoggedIn
      firstname="george"
      logout={mockLogoutFunction}
    />
  );
  it("renders the navbar when user is logged in", () => {
    expect(dashboardNavbar.find("nav.dashboard-nav").exists()).toBe(true);
  });
  it("renders the logo", () => {
    expect(dashboardNavbar.find("span.dashboard-nav-logo").exists()).toBe(true);
  });
  it("renders the user's first name", () => {
    expect(dashboardNavbar.find("p.dashboard-nav-dropdown-user").exists()).toBe(
      true
    );
    expect(
      dashboardNavbar.find("p.dashboard-nav-dropdown-user").text()
    ).toEqual("george");
  });
  it("hides the dropdown by default", () => {
    expect(state.showDropdown).toEqual(false);
    expect(
      dashboardNavbar
        .find("div.dashboard-nav-dropdown-options")
        .prop("className")
    ).not.toContain("show-dropdown");
    expect(
      dashboardNavbar.find("p.dashboard-nav-dropdown-user").prop("className")
    ).toContain("triangle-down");
    expect(
      dashboardNavbar.find("p.dashboard-nav-dropdown-user").prop("className")
    ).not.toContain("triangle-up");
  });
  it("fires the logout function when the button is clicked", () => {
    expect(mockLogoutFunction.mock.calls.length).toEqual(0);
    dashboardNavbar.find("span#logout").simulate("click");
    expect(mockLogoutFunction.mock.calls.length).toEqual(1);
  });
  it("shows dropdown when dropdown button is clicked", () => {
    dashboardNavbar.find("p.dashboard-nav-dropdown-user").simulate("click");
    expect(state.showDropdown).toEqual(true);
  });
  it("should redirect to login page if user is not logged in", () => {
    const loggedOutDashboardNavbar = shallow(
      <DashboardNavbar
        isLoggedIn={false}
        firstname="george"
        logout={mockLogoutFunction}
      />
    );
    expect(loggedOutDashboardNavbar.find("Redirect").exists()).toEqual(true);
    expect(loggedOutDashboardNavbar.find("Redirect").props("to").to).toEqual(
      "/login"
    );
  });
  it("receives the right props from the store", () => {
    const mockStore = {
      auth: {
        isLoggedIn: true
      },
      user: {
        user: {
          firstname: "jimmy"
        }
      }
    };
    const mockDispatch = action => `Mocked Dispatch of ${action}`;
    let dashboardNavbarProps = mapStateToProps(mockStore);
    dashboardNavbarProps = {
      ...dashboardNavbarProps,
      ...mapDispatchToProps(mockDispatch)
    };
    expect(dashboardNavbarProps.isLoggedIn).toEqual(true);
    expect(dashboardNavbarProps.firstname).toEqual("jimmy");
    expect(dashboardNavbarProps.logout()).toBeDefined();
    expect(dashboardNavbarProps.logout()).toContain("Mocked Dispatch of");
  });
});
