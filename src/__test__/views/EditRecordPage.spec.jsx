import "babel-polyfill";
import React from "react";
import { shallow } from "enzyme";
import {
  EditRecordPage,
  getState,
  mapStateToProps,
  mapDispatchToProps
} from "../../views/EditRecordPage";

describe("Create record Page component", () => {
  const mockEditRecord = jest.fn();
  const mockClearErrors = jest.fn();
  const mockResetMessage = jest.fn();
  const mockFetchRecord = jest.fn();
  const mockRecordFetched = {
    comment: "abc",
    type: "Red Flag",
    status: "pending review",
    description: "abcdefghij",
    images: ["abc.jpg", "def.png"],
    videos: ["www.abc.com/qwerty.mp4"],
    feedback: "dhdhddh",
    location: "22 , -3",
    id: 2,
    created_by: 14
  };
  const mockProps = {
    token: "abcd",
    editRecord: mockEditRecord,
    fetchRecord: mockFetchRecord,
    loading: false,
    errorMessages: [],
    clearErrors: mockClearErrors,
    isAdmin: false,
    resetMessage: mockResetMessage,
    history: {},
    editRecordMessage: "",
    recordFetchedForEdit: mockRecordFetched,
    userId: 14,
    match: {
      params: {}
    }
  };
  const editRecordPage = shallow(<EditRecordPage {...mockProps} />);

  it("renders the page", () => {
    expect(editRecordPage.find("section.edit-record-section").exists()).toBe(
      true
    );
    expect(editRecordPage.find("form#edit-record-form").exists()).toBe(true);
  });

  it("disables update button till field has been changed and updates the state when an updateable input field is changed", () => {
    expect(getState().comment).toEqual("");
    expect(
      editRecordPage.find("button#edit-record-update-btn").prop("disabled")
    ).toEqual(true);
    editRecordPage
      .find("BottomLineInput")
      .first()
      .simulate("change", {
        target: { name: "comment", value: "blabla" }
      });
    expect(getState().comment).toEqual("blabla");
    expect(getState().commentEditted).toEqual(true);
    expect(
      editRecordPage.find("button#edit-record-update-btn").prop("disabled")
    ).toEqual(false);
  });

  it("disables input fields that can't be changed", () => {
    expect(
      editRecordPage.find("textarea#description").prop("disabled")
    ).toEqual(true);
    expect(
      editRecordPage
        .find("input[name='type']")
        .first()
        .prop("disabled")
    ).toEqual(true);
    expect(
      editRecordPage
        .find("input[name='type']")
        .last()
        .prop("disabled")
    ).toEqual(true);
  });

  it("fires the edit record function when the form is submitted", () => {
    editRecordPage.find("form").simulate("submit", {
      preventDefault: () => "Prevented Default"
    });
    expect(mockEditRecord.mock.calls.length).toEqual(1);
  });

  it("shows the loading svg while loading", () => {
    const loadingEditRecordsPage = shallow(
      <EditRecordPage {...{ ...mockProps, loading: true }} />
    );
    expect(loadingEditRecordsPage.find("LoadingSvg").exists()).toBe(true);
  });

  it("shows the modal with the success message when the record has been edited successfully", () => {
    const successEditRecordsPage = shallow(
      <EditRecordPage
        {...{
          ...mockProps,
          editRecordMessage: "Successfully edited record"
        }}
      />
    );
    expect(successEditRecordsPage.find("Modal").exists()).toBe(true);
    expect(successEditRecordsPage.find("Modal").prop("modalHeader")).toEqual(
      "Success"
    );
    expect(successEditRecordsPage.find("Modal").prop("modalText")).toEqual(
      "Successfully edited record"
    );
  });

  it("shows the modal with the error message when there is an error", () => {
    const errorEditRecordsPage = shallow(
      <EditRecordPage
        {...{ ...mockProps, errorMessages: [{ error: "Network Error" }] }}
      />
    );
    expect(errorEditRecordsPage.find("Modal").exists()).toBe(true);
    expect(errorEditRecordsPage.find("Modal").prop("modalHeader")).toEqual(
      "Error"
    );
    expect(errorEditRecordsPage.find("Modal").prop("modalText")).toEqual(
      "Network Error"
    );
  });

  it("redirects to the admin dashboard if user is an admin", () => {
    const adminEditRecordsPage = shallow(
      <EditRecordPage {...{ ...mockProps, isAdmin: true }} />
    );
    expect(adminEditRecordsPage.find("Redirect").exists()).toBe(true);
    expect(adminEditRecordsPage.find("Redirect").prop("to")).toBe(
      "/admin-overview"
    );
  });

  it("shows the modal with an error message when the user is not the creator of the record", () => {
    const errorEditRecordsPage = shallow(
      <EditRecordPage {...{ ...mockProps, userId: 13 }} />
    );
    expect(errorEditRecordsPage.find("Modal").exists()).toBe(true);
    expect(errorEditRecordsPage.find("Modal").prop("modalHeader")).toEqual(
      "Error"
    );
    expect(errorEditRecordsPage.find("Modal").prop("modalText")).toEqual(
      "You can't edit a record that you didn't create"
    );
  });

  it("shows the modal with an error message when the record is not pending review", () => {
    const errorEditRecordsPage = shallow(
      <EditRecordPage
        {...{
          ...mockProps,
          recordFetchedForEdit: { ...mockRecordFetched, status: "resolved" }
        }}
      />
    );
    expect(errorEditRecordsPage.find("Modal").exists()).toBe(true);
    expect(errorEditRecordsPage.find("Modal").prop("modalHeader")).toEqual(
      "Error"
    );
    expect(errorEditRecordsPage.find("Modal").prop("modalText")).toEqual(
      "You can't edit a record that isn't pending review"
    );
  });

  it("receives the right props from the store", () => {
    const {
      token,
      isAdmin,
      loading,
      errorMessages,
      editRecordMessage,
      recordFetchedForEdit,
      userId
    } = mockProps;
    const mockStore = {
      auth: {
        token
      },
      user: {
        user: {
          is_admin: isAdmin,
          id: userId
        }
      },
      records: {
        loading,
        errorMessages,
        editRecordMessage,
        recordFetchedForEdit
      }
    };
    const mockToken = "abc";
    const mockRecordInfo = "abcdef-1";
    const mockDetails = {};
    const mockDispatch = action => `Mocked Dispatch of ${action}`;
    let editPageProps = mapStateToProps(mockStore);
    editPageProps = {
      ...editPageProps,
      ...mapDispatchToProps(mockDispatch)
    };
    expect(editPageProps.isAdmin).toEqual(isAdmin);
    expect(editPageProps.token).toEqual(token);
    expect(editPageProps.loading).toEqual(loading);
    expect(editPageProps.errorMessages).toEqual(errorMessages);
    expect(editPageProps.editRecordMessage).toEqual(editRecordMessage);
    expect(editPageProps.editRecord(mockToken, mockDetails)).toBeDefined();
    expect(editPageProps.editRecord(mockToken, mockDetails)).toContain(
      "Mocked Dispatch of"
    );
    expect(editPageProps.clearErrors()).toBeDefined();
    expect(editPageProps.clearErrors()).toContain("Mocked Dispatch of");
    expect(editPageProps.resetMessage()).toBeDefined();
    expect(editPageProps.resetMessage()).toContain("Mocked Dispatch of");
    expect(editPageProps.fetchRecord(mockRecordInfo)).toBeDefined();
    expect(editPageProps.fetchRecord(mockRecordInfo)).toContain(
      "Mocked Dispatch of"
    );
  });
});
