import "babel-polyfill";
import React from "react";
import { shallow } from "enzyme";
import {
  MyRecordsPage,
  getState,
  mapStateToProps,
  mapDispatchToProps
} from "../../views/MyRecordsPage";

describe("Profile Page component", () => {
  const mockFetchMyRecords = jest.fn();
  const mockClearErrors = jest.fn();
  const mockFunction = jest.fn();
  const mockProps = {
    myRedFlagRecords: [
      { id: 1, status: "pending review" },
      { id: 2, status: "under investigation" },
      { id: 3, status: "resolved" },
      { id: 4, status: "rejected" },
      { id: 5, status: "under investigation" }
    ],
    myInterventionRecords: [
      { id: 6, status: "pending review" },
      { id: 7, status: "under investigation" },
      { id: 8, status: "resolved" },
      { id: 9, status: "rejected" },
      { id: 10, status: "pending review" }
    ],
    token: "zxcv",
    loading: false,
    errorMessages: [],
    isAdmin: false
  };
  const myRecordsPage = shallow(
    <MyRecordsPage
      fetchMyRecords={mockFetchMyRecords}
      clearErrors={mockClearErrors}
      {...mockProps}
    />
  );
  it("renders the page", () => {
    expect(myRecordsPage.find("div.dashboard-body").exists()).toBe(true);
    expect(myRecordsPage.find("main.dashboard-main").exists()).toBe(true);
    expect(myRecordsPage.find("section.dashboard-card").exists()).toBe(true);
    expect(
      myRecordsPage.find("section.dashboard-main-records-section").exists()
    ).toBe(true);
  });
  it("fires the function to update the records as soon as it is mounted and updates it's state so as not to make subsequent calls", () => {
    expect(mockFetchMyRecords.mock.calls.length).toEqual(1);
    expect(getState().updatedRecords).toEqual(true);
  });
  it("redirects to the admin dashboard if user is an admin", () => {
    const adminMyRecordsPage = shallow(
      <MyRecordsPage
        fetchMyRecords={mockFunction}
        clearErrors={mockFunction}
        {...{ ...mockProps, isAdmin: true }}
      />
    );
    expect(adminMyRecordsPage.find("Redirect").exists()).toBe(true);
    expect(adminMyRecordsPage.find("Redirect").prop("to")).toBe(
      "/admin-overview"
    );
  });
  it("shows the loading svg while loading", () => {
    const loadingMyRecordsPage = shallow(
      <MyRecordsPage
        fetchMyRecords={mockFunction}
        clearErrors={mockFunction}
        {...{ ...mockProps, loading: true }}
      />
    );
    expect(loadingMyRecordsPage.find("LoadingSvg").exists()).toBe(true);
  });
  it("shows the modal with the error message when there is an error", () => {
    const errorMyRecordsPage = shallow(
      <MyRecordsPage
        fetchMyRecords={mockFunction}
        clearErrors={mockFunction}
        {...{ ...mockProps, errorMessages: [{ error: "Network Error" }] }}
      />
    );
    expect(errorMyRecordsPage.find("Modal").exists()).toBe(true);
    expect(errorMyRecordsPage.find("Modal").prop("modalHeader")).toEqual(
      "Error"
    );
    expect(errorMyRecordsPage.find("Modal").prop("modalText")).toEqual(
      "Network Error"
    );
  });
  it("updates the state when the user changes the filter select tag", () => {
    myRecordsPage
      .find("select#dashboard-table-select")
      .simulate("change", { target: { value: "Resolved" } });
    expect(getState().filterOption).toEqual("Resolved");
    myRecordsPage
      .find("select#dashboard-table-select")
      .simulate("change", { target: { value: "Rejected" } });
    expect(getState().filterOption).toEqual("Rejected");
    myRecordsPage
      .find("select#dashboard-table-select")
      .simulate("change", { target: { value: "Pending" } });
    expect(getState().filterOption).toEqual("Pending");
    myRecordsPage
      .find("select#dashboard-table-select")
      .simulate("change", { target: { value: "Under-Investigation" } });
    expect(getState().filterOption).toEqual("Under-Investigation");
  });

  it("receives the right props from the store", () => {
    const {
      token,
      isAdmin,
      myInterventionRecords,
      myRedFlagRecords,
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
        myRedFlagRecords,
        myInterventionRecords,
        loading,
        errorMessages
      }
    };
    const mockDispatch = action => `Mocked Dispatch of ${action}`;
    let myRecordsPageProps = mapStateToProps(mockStore);
    myRecordsPageProps = {
      ...myRecordsPageProps,
      ...mapDispatchToProps(mockDispatch)
    };
    expect(myRecordsPageProps.isAdmin).toEqual(isAdmin);
    expect(myRecordsPageProps.token).toEqual(token);
    expect(myRecordsPageProps.loading).toEqual(loading);
    expect(myRecordsPageProps.errorMessages).toEqual(errorMessages);
    expect(myRecordsPageProps.myInterventionRecords).toEqual(
      myInterventionRecords
    );
    expect(myRecordsPageProps.myRedFlagRecords).toEqual(myRedFlagRecords);
    expect(myRecordsPageProps.fetchMyRecords()).toBeDefined();
    expect(myRecordsPageProps.fetchMyRecords()).toContain("Mocked Dispatch of");
    expect(myRecordsPageProps.clearErrors()).toBeDefined();
    expect(myRecordsPageProps.clearErrors()).toContain("Mocked Dispatch of");
  });
});
