import "babel-polyfill";
import React from "react";
import { shallow } from "enzyme";
import {
  AdminAllRecordsPage,
  getState,
  mapStateToProps,
  mapDispatchToProps
} from "../../views/AdminAllRecordsPage";

describe("Admin all record page component", () => {
  const mockFetchAllRecords = jest.fn();
  const mockClearErrors = jest.fn();
  const mockFunction = jest.fn();
  const mockProps = {
    allRedFlagRecords: [
      { id: 1, status: "pending review" },
      { id: 2, status: "under investigation" },
      { id: 3, status: "resolved" },
      { id: 4, status: "rejected" },
      { id: 5, status: "under investigation" }
    ],
    allInterventionRecords: [
      { id: 6, status: "pending review" },
      { id: 7, status: "under investigation" },
      { id: 8, status: "resolved" },
      { id: 9, status: "rejected" },
      { id: 10, status: "pending review" }
    ],
    token: "zxcv",
    loading: false,
    errorMessages: [],
    isAdmin: true
  };
  const adminAllRecordsPage = shallow(
    <AdminAllRecordsPage
      fetchAllRecords={mockFetchAllRecords}
      clearErrors={mockClearErrors}
      {...mockProps}
    />
  );
  it("renders the page", () => {
    expect(adminAllRecordsPage.find("div.dashboard-body").exists()).toBe(true);
    expect(adminAllRecordsPage.find("main.dashboard-main").exists()).toBe(true);
    expect(adminAllRecordsPage.find("section.dashboard-card").exists()).toBe(
      true
    );
    expect(
      adminAllRecordsPage
        .find("section.dashboard-main-records-section")
        .exists()
    ).toBe(true);
  });
  it("fires the function to update the records as soon as it is mounted and updates it's state so as not to make subsequent calls", () => {
    expect(mockFetchAllRecords.mock.calls.length).toEqual(1);
    expect(getState().updatedRecords).toEqual(true);
  });
  it("shows an error modal when a non admin tries to access the page", () => {
    const nonAdminAllRecordsPage = shallow(
      <AdminAllRecordsPage
        fetchAllRecords={mockFunction}
        clearErrors={mockFunction}
        {...{ ...mockProps, isAdmin: false }}
      />
    );
    expect(nonAdminAllRecordsPage.find("Modal").exists()).toBe(true);
    expect(nonAdminAllRecordsPage.find("Modal").prop("modalHeader")).toEqual(
      "Error"
    );
    expect(nonAdminAllRecordsPage.find("Modal").prop("modalText")).toEqual(
      "Only an Admin can view this page"
    );
  });
  it("shows the loading svg while loading", () => {
    const loadingAdminAllRecordsPage = shallow(
      <AdminAllRecordsPage
        fetchAllRecords={mockFunction}
        clearErrors={mockFunction}
        {...{ ...mockProps, loading: true }}
      />
    );
    expect(loadingAdminAllRecordsPage.find("LoadingSvg").exists()).toBe(true);
  });
  it("shows the modal with the error message when there is an error", () => {
    const errorAdminAllRecordsPage = shallow(
      <AdminAllRecordsPage
        fetchAllRecords={mockFunction}
        clearErrors={mockFunction}
        {...{ ...mockProps, errorMessages: [{ error: "Network Error" }] }}
      />
    );
    expect(errorAdminAllRecordsPage.find("Modal").exists()).toBe(true);
    expect(errorAdminAllRecordsPage.find("Modal").prop("modalHeader")).toEqual(
      "Error"
    );
    expect(errorAdminAllRecordsPage.find("Modal").prop("modalText")).toEqual(
      "Network Error"
    );
  });
  it("updates the state when the admin changes the filter select tag", () => {
    adminAllRecordsPage
      .find("select#dashboard-table-select")
      .simulate("change", { target: { value: "Resolved" } });
    expect(getState().filterOption).toEqual("Resolved");
    adminAllRecordsPage
      .find("select#dashboard-table-select")
      .simulate("change", { target: { value: "Rejected" } });
    expect(getState().filterOption).toEqual("Rejected");
    adminAllRecordsPage
      .find("select#dashboard-table-select")
      .simulate("change", { target: { value: "Pending" } });
    expect(getState().filterOption).toEqual("Pending");
    adminAllRecordsPage
      .find("select#dashboard-table-select")
      .simulate("change", { target: { value: "Under-Investigation" } });
    expect(getState().filterOption).toEqual("Under-Investigation");
  });

  it("receives the right props from the store", () => {
    const {
      token,
      isAdmin,
      allInterventionRecords,
      allRedFlagRecords,
      loading,
      errorMessages
    } = mockProps;
    const mockStore = {
      auth: {
        token
      },
      user: {
        user: {
          is_admin: isAdmin
        }
      },
      records: {
        allRedFlagRecords,
        allInterventionRecords,
        loading,
        errorMessages
      }
    };
    const mockDispatch = action => `Mocked Dispatch of ${action}`;
    let adminAllRecordsPageProps = mapStateToProps(mockStore);
    adminAllRecordsPageProps = {
      ...adminAllRecordsPageProps,
      ...mapDispatchToProps(mockDispatch)
    };
    expect(adminAllRecordsPageProps.isAdmin).toEqual(isAdmin);
    expect(adminAllRecordsPageProps.token).toEqual(token);
    expect(adminAllRecordsPageProps.loading).toEqual(loading);
    expect(adminAllRecordsPageProps.errorMessages).toEqual(errorMessages);
    expect(adminAllRecordsPageProps.allInterventionRecords).toEqual(
      allInterventionRecords
    );
    expect(adminAllRecordsPageProps.allRedFlagRecords).toEqual(
      allRedFlagRecords
    );
    expect(adminAllRecordsPageProps.fetchAllRecords()).toBeDefined();
    expect(adminAllRecordsPageProps.fetchAllRecords()).toContain(
      "Mocked Dispatch of"
    );
    expect(adminAllRecordsPageProps.clearErrors()).toBeDefined();
    expect(adminAllRecordsPageProps.clearErrors()).toContain(
      "Mocked Dispatch of"
    );
  });
});
