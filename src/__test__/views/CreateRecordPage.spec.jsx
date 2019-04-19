import "babel-polyfill";
import React from "react";
import { shallow } from "enzyme";
import {
  CreateRecordPage,
  getState,
  mapStateToProps,
  mapDispatchToProps
} from "../../views/CreateRecordPage";

describe("Create record Page component", () => {
  const mockCreateRecord = jest.fn();
  const mockClearErrors = jest.fn();
  const mockResetMessage = jest.fn();
  const mockProps = {
    token: "abcd",
    createRecord: mockCreateRecord,
    loading: false,
    errorMessages: [],
    clearErrors: mockClearErrors,
    isAdmin: false,
    resetMessage: mockResetMessage,
    history: [],
    createdRecordMessage: ""
  };
  const createRecordPage = shallow(<CreateRecordPage {...mockProps} />);

  it("renders the page", () => {
    expect(createRecordPage.find("section.new-record-section").exists()).toBe(
      true
    );
    expect(createRecordPage.find("form#new-record-form").exists()).toBe(true);
  });

  it("resets the created message when it renders", () => {
    expect(mockResetMessage.mock.calls.length).toEqual(1);
  });

  it("updates the state when an input field is changed", () => {
    createRecordPage
      .find("textarea#description")
      .simulate("change", { target: { name: "description", value: "blabla" } });
    expect(getState().description).toEqual("blabla");
  });

  it("fires the create record function when the form is submitted", () => {
    createRecordPage
      .find("form")
      .simulate("submit", { preventDefault: () => "Prevented Default" });
    expect(mockCreateRecord.mock.calls.length).toEqual(1);
  });

  it("shows the loading svg while loading", () => {
    const loadingCreateRecordsPage = shallow(
      <CreateRecordPage {...{ ...mockProps, loading: true }} />
    );
    expect(loadingCreateRecordsPage.find("LoadingSvg").exists()).toBe(true);
  });

  it("shows the modal with the success message when the record has been created successfully", () => {
    const successCreateRecordsPage = shallow(
      <CreateRecordPage
        {...{
          ...mockProps,
          createdRecordMessage: "Successfully created red flag record"
        }}
      />
    );
    expect(successCreateRecordsPage.find("Modal").exists()).toBe(true);
    expect(successCreateRecordsPage.find("Modal").prop("modalHeader")).toEqual(
      "Success"
    );
    expect(successCreateRecordsPage.find("Modal").prop("modalText")).toEqual(
      "Successfully created red flag record"
    );
  });

  it("shows the modal with the error message when there is an error", () => {
    const errorCreateRecordsPage = shallow(
      <CreateRecordPage
        {...{ ...mockProps, errorMessages: [{ error: "Network Error" }] }}
      />
    );
    expect(errorCreateRecordsPage.find("Modal").exists()).toBe(true);
    expect(errorCreateRecordsPage.find("Modal").prop("modalHeader")).toEqual(
      "Error"
    );
    expect(errorCreateRecordsPage.find("Modal").prop("modalText")).toEqual(
      "Network Error"
    );
  });

  it("redirects to the admin dashboard if user is an admin", () => {
    const adminCreateRecordsPage = shallow(
      <CreateRecordPage {...{ ...mockProps, isAdmin: true }} />
    );
    expect(adminCreateRecordsPage.find("Redirect").exists()).toBe(true);
    expect(adminCreateRecordsPage.find("Redirect").prop("to")).toBe(
      "/admin-overview"
    );
  });

  it("receives the right props from the store", () => {
    const {
      token,
      isAdmin,
      loading,
      errorMessages,
      createdRecordMessage
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
        loading,
        errorMessages,
        createdRecordMessage
      }
    };
    const mockToken = "abc";
    const mockDetails = {};
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
    expect(myRecordsPageProps.createdRecordMessage).toEqual(
      createdRecordMessage
    );
    expect(
      myRecordsPageProps.createRecord(mockToken, mockDetails)
    ).toBeDefined();
    expect(myRecordsPageProps.createRecord(mockToken, mockDetails)).toContain(
      "Mocked Dispatch of"
    );
    expect(myRecordsPageProps.clearErrors()).toBeDefined();
    expect(myRecordsPageProps.clearErrors()).toContain("Mocked Dispatch of");
    expect(myRecordsPageProps.resetMessage()).toBeDefined();
    expect(myRecordsPageProps.resetMessage()).toContain("Mocked Dispatch of");
  });
});
