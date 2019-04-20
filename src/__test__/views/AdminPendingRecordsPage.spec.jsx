import "babel-polyfill";
import React from "react";
import { shallow } from "enzyme";
import {
  AdminPendingRecordsPage,
  getState,
  mapStateToProps,
  mapDispatchToProps
} from "../../views/AdminPendingRecordsPage";

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
  const adminPendingRecordsPage = shallow(
    <AdminPendingRecordsPage
      fetchAllRecords={mockFetchAllRecords}
      clearErrors={mockClearErrors}
      {...mockProps}
    />
  );
  it("renders the page", () => {
    expect(adminPendingRecordsPage.find("div.dashboard-body").exists()).toBe(
      true
    );
    expect(adminPendingRecordsPage.find("main.dashboard-main").exists()).toBe(
      true
    );
    expect(
      adminPendingRecordsPage.find("section.dashboard-card").exists()
    ).toBe(true);
    expect(
      adminPendingRecordsPage
        .find("section.dashboard-main-records-section")
        .exists()
    ).toBe(true);
  });
  it("fires the function to update the records as soon as it is mounted and updates it's state so as not to make subsequent calls", () => {
    expect(mockFetchAllRecords.mock.calls.length).toEqual(1);
    expect(getState().updatedRecords).toEqual(true);
  });
  it("shows an error modal when a non admin tries to access the page", () => {
    const nonAdminPendingRecordsPage = shallow(
      <AdminPendingRecordsPage
        fetchAllRecords={mockFunction}
        clearErrors={mockFunction}
        {...{ ...mockProps, isAdmin: false }}
      />
    );
    expect(nonAdminPendingRecordsPage.find("Modal").exists()).toBe(true);
    expect(
      nonAdminPendingRecordsPage.find("Modal").prop("modalHeader")
    ).toEqual("Error");
    expect(nonAdminPendingRecordsPage.find("Modal").prop("modalText")).toEqual(
      "Only an Admin can view this page"
    );
  });
  it("shows the loading svg while loading", () => {
    const loadingAdminPendingRecordsPage = shallow(
      <AdminPendingRecordsPage
        fetchAllRecords={mockFunction}
        clearErrors={mockFunction}
        {...{ ...mockProps, loading: true }}
      />
    );
    expect(loadingAdminPendingRecordsPage.find("LoadingSvg").exists()).toBe(
      true
    );
  });
  it("shows the modal with the error message when there is an error", () => {
    const errorAdminPendingRecordsPage = shallow(
      <AdminPendingRecordsPage
        fetchAllRecords={mockFunction}
        clearErrors={mockFunction}
        {...{ ...mockProps, errorMessages: [{ error: "Network Error" }] }}
      />
    );
    expect(errorAdminPendingRecordsPage.find("Modal").exists()).toBe(true);
    expect(
      errorAdminPendingRecordsPage.find("Modal").prop("modalHeader")
    ).toEqual("Error");
    expect(
      errorAdminPendingRecordsPage.find("Modal").prop("modalText")
    ).toEqual("Network Error");
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
    let AdminPendingRecordsPageProps = mapStateToProps(mockStore);
    AdminPendingRecordsPageProps = {
      ...AdminPendingRecordsPageProps,
      ...mapDispatchToProps(mockDispatch)
    };
    expect(AdminPendingRecordsPageProps.isAdmin).toEqual(isAdmin);
    expect(AdminPendingRecordsPageProps.token).toEqual(token);
    expect(AdminPendingRecordsPageProps.loading).toEqual(loading);
    expect(AdminPendingRecordsPageProps.errorMessages).toEqual(errorMessages);
    expect(AdminPendingRecordsPageProps.allInterventionRecords).toEqual(
      allInterventionRecords
    );
    expect(AdminPendingRecordsPageProps.allRedFlagRecords).toEqual(
      allRedFlagRecords
    );
    expect(AdminPendingRecordsPageProps.fetchAllRecords()).toBeDefined();
    expect(AdminPendingRecordsPageProps.fetchAllRecords()).toContain(
      "Mocked Dispatch of"
    );
    expect(AdminPendingRecordsPageProps.clearErrors()).toBeDefined();
    expect(AdminPendingRecordsPageProps.clearErrors()).toContain(
      "Mocked Dispatch of"
    );
  });
});
