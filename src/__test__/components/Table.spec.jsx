import React from "react";
import { shallow } from "enzyme";
import { Table } from "../../components/Table";

describe("Dashboard Navbar component", () => {
  const mockHistory = [];
  const mockData = [
    {
      id: 1,
      status: "pending review",
      created_on: new Date(),
      comment: "abc",
      type: "red-flag"
    },
    {
      id: 2,
      status: "under investigation",
      created_on: new Date(),
      comment: "abc",
      type: "red-flag"
    },
    {
      id: 3,
      status: "resolved",
      created_on: new Date(),
      comment: "abc",
      type: "red-flag"
    },
    {
      id: 4,
      status: "rejected",
      created_on: new Date(),
      comment: "abc",
      type: "red-flag"
    },
    {
      id: 5,
      status: "under investigation",
      created_on: new Date(),
      comment: "abc",
      type: "red-flag"
    },
    {
      id: 6,
      status: "pending review",
      created_on: new Date(),
      comment: "abc",
      type: "red-flag"
    }
  ];
  const table = shallow(
    <Table history={mockHistory} allowEdit data={mockData} />
  );
  it("renders the table", () => {
    expect(table.find("table.dashboard-table").exists()).toBe(true);
  });
  it("renders the data passed in as table rows", () => {
    expect(table.find("tr.dashboard-table-row").length).toEqual(
      mockData.length
    );
  });
  it("only shows the edit link when the record is pending review", () => {
    expect(table.find("Link.edit-link").length).toEqual(
      mockData.filter(d => d.status === "pending review").length
    );
  });
  it("hides the edit link completely when the allowEdit prop is set to false", () => {
    const noEditTable = shallow(
      <Table history={mockHistory} allowEdit={false} data={mockData} />
    );
    expect(noEditTable.find("a.edit-link").length).toEqual(0);
  });
  it("routes the user to the user details page when a table row is clicked", () => {
    table
      .find("tr.dashboard-table-row")
      .first()
      .simulate("click");
    expect(mockHistory[0]).toEqual(`/record/redflag-${mockData[0].id}`);
  });
  it("does not propagate clicks on the edit link to the parent row ", () => {
    const mockStopPropagation = jest.fn();
    table
      .find("td.edit-link-column")
      .first()
      .simulate("click", { stopPropagation: mockStopPropagation });
    expect(mockStopPropagation.mock.calls.length).toEqual(1);
  });
});
