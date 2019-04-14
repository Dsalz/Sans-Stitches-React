import React from "react";
import { shallow } from "enzyme";
import DashboardSidebar, {
  state
} from "../../components/Layout/DashboardSidebar";

describe("Dashboard Sidebar component", () => {
  const dashboardSidebar = shallow(<DashboardSidebar />);
  it("renders the sidebar", () => {
    expect(dashboardSidebar.find("aside.dashboard-sidebar").exists()).toBe(
      true
    );
  });
  it("doesn't show the responsive sidebar by default", () => {
    expect(state.showResponsiveSidebar).toEqual(false);
    expect(
      dashboardSidebar.find("aside.dashboard-sidebar").prop("className")
    ).not.toContain("responsive-navbar");
  });
  it("shows the responsive sidebar when toggle is clicked", () => {
    dashboardSidebar.find("div#toggle-sidebar").simulate("click");
    expect(
      dashboardSidebar.find("aside.dashboard-sidebar").prop("className")
    ).toContain("responsive-sidebar");
    expect(state.showResponsiveSidebar).toEqual(true);
  });
});
