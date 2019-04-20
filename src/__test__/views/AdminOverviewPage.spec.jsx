import "babel-polyfill";
import React from "react";
import { shallow } from "enzyme";
import {
  AdminOverviewPage,
  mapStateToProps,
  mapDispatchToProps
} from "../../views/AdminOverviewPage";

describe("Admin Overview Page component", () => {
  const mockFetchAllRecords = jest.fn();
  const mockClearErrors = jest.fn();
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
    isAdmin: true,
    isLoggedIn: true
  };
  const adminOverviewPage = shallow(
    <AdminOverviewPage
      fetchAllRecords={mockFetchAllRecords}
      clearErrors={mockClearErrors}
      {...mockProps}
    />
  );
  it("renders the statistics section correctly with the passed in data", () => {
    const { allRedFlagRecords, allInterventionRecords } = mockProps;
    expect(
      adminOverviewPage
        .find("section.dashboard-main-statistics-section")
        .exists()
    ).toBe(true);
    expect(adminOverviewPage.find("h3#total-no").text()).toEqual(
      String([...allRedFlagRecords, ...allInterventionRecords].length)
    );
    expect(adminOverviewPage.find("h3#red-flag-no").text()).toEqual(
      String(allRedFlagRecords.length)
    );
    expect(adminOverviewPage.find("h3#intervention-no").text()).toEqual(
      String(allInterventionRecords.length)
    );
    expect(adminOverviewPage.find("h3#red-flag-pending-no").text()).toEqual(
      String(
        allRedFlagRecords.filter(record => record.status === "pending review")
          .length
      )
    );
    expect(
      adminOverviewPage.find("h3#red-flag-under-investigation-no").text()
    ).toEqual(
      String(
        allRedFlagRecords.filter(
          record => record.status === "under investigation"
        ).length
      )
    );
    expect(adminOverviewPage.find("h3#red-flag-resolved-no").text()).toEqual(
      String(
        allRedFlagRecords.filter(record => record.status === "resolved").length
      )
    );
    expect(adminOverviewPage.find("h3#red-flag-rejected-no").text()).toEqual(
      String(
        allRedFlagRecords.filter(record => record.status === "rejected").length
      )
    );
    expect(adminOverviewPage.find("h3#intervention-pending-no").text()).toEqual(
      String(
        allInterventionRecords.filter(
          record => record.status === "pending review"
        ).length
      )
    );
    expect(
      adminOverviewPage.find("h3#intervention-under-investigation-no").text()
    ).toEqual(
      String(
        allInterventionRecords.filter(
          record => record.status === "under investigation"
        ).length
      )
    );
    expect(
      adminOverviewPage.find("h3#intervention-resolved-no").text()
    ).toEqual(
      String(
        allInterventionRecords.filter(record => record.status === "resolved")
          .length
      )
    );
    expect(
      adminOverviewPage.find("h3#intervention-rejected-no").text()
    ).toEqual(
      String(
        allInterventionRecords.filter(record => record.status === "rejected")
          .length
      )
    );
  });
  it("renderes an error modal if user is not an admin", () => {
    const nonAdminOverviewPage = shallow(
      <AdminOverviewPage
        fetchAllRecords={mockFetchAllRecords}
        clearErrors={mockClearErrors}
        {...{ ...mockProps, isAdmin: false }}
      />
    );
    expect(nonAdminOverviewPage.find("Modal").exists()).toBe(true);
    expect(nonAdminOverviewPage.find("Modal").prop("modalHeader")).toEqual(
      "Error"
    );
    expect(nonAdminOverviewPage.find("Modal").prop("modalText")).toEqual(
      "Only an Admin can view this page"
    );
  });
  it("shows the loading svg while loading", () => {
    const loadingAdminOverviewPage = shallow(
      <AdminOverviewPage
        fetchAllRecords={mockFetchAllRecords}
        clearErrors={mockClearErrors}
        {...{ ...mockProps, loading: true }}
      />
    );
    expect(loadingAdminOverviewPage.find("LoadingSvg").exists()).toBe(true);
  });
  it("shows the modal with the error message when there is an error", () => {
    const errorAdminOverviewPage = shallow(
      <AdminOverviewPage
        fetchAllRecords={mockFetchAllRecords}
        clearErrors={mockClearErrors}
        {...{ ...mockProps, errorMessages: [{ error: "Network Error" }] }}
      />
    );
    expect(errorAdminOverviewPage.find("Modal").exists()).toBe(true);
    expect(errorAdminOverviewPage.find("Modal").prop("modalHeader")).toEqual(
      "Error"
    );
    expect(errorAdminOverviewPage.find("Modal").prop("modalText")).toEqual(
      "Network Error"
    );
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
    let adminOverviewPageProps = mapStateToProps(mockStore);
    adminOverviewPageProps = {
      ...adminOverviewPageProps,
      ...mapDispatchToProps(mockDispatch)
    };
    expect(adminOverviewPageProps.isAdmin).toEqual(isAdmin);
    expect(adminOverviewPageProps.token).toEqual(token);
    expect(adminOverviewPageProps.loading).toEqual(loading);
    expect(adminOverviewPageProps.errorMessages).toEqual(errorMessages);
    expect(adminOverviewPageProps.allInterventionRecords).toEqual(
      allInterventionRecords
    );
    expect(adminOverviewPageProps.allRedFlagRecords).toEqual(allRedFlagRecords);
    expect(adminOverviewPageProps.fetchAllRecords()).toBeDefined();
    expect(adminOverviewPageProps.fetchAllRecords()).toContain(
      "Mocked Dispatch of"
    );
    expect(adminOverviewPageProps.clearErrors()).toBeDefined();
    expect(adminOverviewPageProps.clearErrors()).toContain(
      "Mocked Dispatch of"
    );
  });
});
