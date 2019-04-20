import "babel-polyfill";
import React from "react";
import { shallow } from "enzyme";
import {
  RecordDetailsPage,
  getState,
  mapStateToProps,
  mapDispatchToProps
} from "../../views/RecordDetailsPage";

describe("Records Details Page component", () => {
  const mockResetDeletedRecord = jest.fn();
  const mockDeleteRecord = jest.fn();
  const mockFetchRecord = jest.fn();
  const mockClearErrors = jest.fn();
  const mockUpdateRecord = jest.fn();
  const mockResetUpdatedRecord = jest.fn();

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
    recordDeleted: false,
    history: {},
    recordFetched: mockRecordFetched,
    loading: false,
    token: "zxccvbnm",
    match: {
      params: {
        recordInfo: "redflag-3"
      }
    },
    userId: 14,
    errorMessages: [],
    isAdmin: false,
    updateRecordMessage: "",
    clearErrors: mockClearErrors,
    fetchRecord: mockFetchRecord,
    resetDeletedRecord: mockResetDeletedRecord,
    deleteRecord: mockDeleteRecord,
    resetUpdatedRecord: mockResetUpdatedRecord,
    updateRecord: mockUpdateRecord
  };
  const recordDetailsPage = shallow(<RecordDetailsPage {...mockProps} />);
  it("renders the page with all the article's information", () => {
    expect(recordDetailsPage.find("div.dashboard-body").exists()).toBe(true);
    expect(recordDetailsPage.find("main.dashboard-main").exists()).toBe(true);
    expect(recordDetailsPage.find("section.dashboard-card").exists()).toBe(
      true
    );
    expect(
      recordDetailsPage.find("section.record-details-section").exists()
    ).toBe(true);
    expect(recordDetailsPage.find("h2#comment").text()).toEqual(
      mockRecordFetched.comment
    );
    expect(recordDetailsPage.find("span#type").text()).toEqual(
      mockRecordFetched.type
    );
    expect(recordDetailsPage.find("span#status").text()).toEqual(
      mockRecordFetched.status
    );
    expect(recordDetailsPage.find("p#description").text()).toEqual(
      mockRecordFetched.description
    );
    expect(
      recordDetailsPage
        .find("img")
        .first()
        .prop("src")
    ).toContain(mockRecordFetched.images[0]);
    expect(
      recordDetailsPage
        .find("img")
        .last()
        .prop("src")
    ).toContain(mockRecordFetched.images[1]);
    expect(recordDetailsPage.find("a#video").text()).toEqual(
      mockRecordFetched.videos[0]
    );
    expect(recordDetailsPage.find("p#feedback").text()).toEqual(
      mockRecordFetched.feedback
    );
  });
  it("shows the edit and delete buttons when the logged in user is the creator of the record and record is pending review", () => {
    expect(recordDetailsPage.find("div.edit-record-button-div").exists()).toBe(
      true
    );
  });
  it("hides the edit and delete buttons only when the logged in user is not the creator of the record", () => {
    const nonCreatedRecordDetailsPage = shallow(
      <RecordDetailsPage {...{ ...mockProps, userId: 11 }} />
    );
    expect(
      nonCreatedRecordDetailsPage.find("div.edit-record-button-div").exists()
    ).toBe(false);
  });

  it("hides the form to update record when user is not an admin", () => {
    expect(recordDetailsPage.find("form#edit-status-form").exists()).toBe(
      false
    );
  });
  it("renders fields to update the status and feedback if the user is an admin", () => {
    const adminRecordDetailsPage = shallow(
      <RecordDetailsPage {...{ ...mockProps, isAdmin: true }} />
    );
    expect(adminRecordDetailsPage.find("form#edit-status-form").exists()).toBe(
      true
    );
    expect(adminRecordDetailsPage.find("input#pending-review").exists()).toBe(
      true
    );
    expect(
      adminRecordDetailsPage.find("input#under-investigation").exists()
    ).toBe(true);
    expect(adminRecordDetailsPage.find("input#resolved").exists()).toBe(true);
    expect(adminRecordDetailsPage.find("input#rejected").exists()).toBe(true);
    expect(adminRecordDetailsPage.find("textarea#feedback").exists()).toBe(
      true
    );

    const mockInputEvent = {
      target: {
        name: "adminFeedback",
        value: "Not enough Proof"
      }
    };

    adminRecordDetailsPage
      .find("textarea#feedback")
      .simulate("change", mockInputEvent);
    expect(getState().adminFeedback).toEqual(mockInputEvent.target.value);

    const mockFormEvent = {
      preventDefault: () => "Prevented Default"
    };

    adminRecordDetailsPage
      .find("form#edit-status-form")
      .simulate("submit", mockFormEvent);
    expect(mockUpdateRecord.mock.calls.length).toEqual(1);
  });
  it("hides the edit and delete buttons only when the record is not pending review", () => {
    const nonPendingRecordDetailsPage = shallow(
      <RecordDetailsPage
        {...{
          ...mockProps,
          recordFetched: { ...mockRecordFetched, status: "under investigation" }
        }}
      />
    );
    expect(
      nonPendingRecordDetailsPage.find("div.edit-record-button-div").exists()
    ).toBe(false);
  });
  it("shows the delete modal when delete button is clicked", () => {
    expect(getState().showDeleteModal).toEqual(false);
    recordDetailsPage.find("button#delete-btn").simulate("click");
    expect(getState().showDeleteModal).toEqual(true);
  });
  it("shows the index navbar if user is not logged in", () => {
    const nonLoggedInRecordDetailsPage = shallow(
      <RecordDetailsPage
        {...{
          ...mockProps,
          token: ""
        }}
      />
    );
    expect(nonLoggedInRecordDetailsPage.find("IndexNavbar").exists()).toBe(
      true
    );
  });
  it("shows empty state text when user does not provide all the information", () => {
    const emptyRecordDetailsPage = shallow(
      <RecordDetailsPage
        {...{
          ...mockProps,
          recordFetched: { images: [], videos: [] }
        }}
      />
    );
    expect(emptyRecordDetailsPage.find("p#description").text()).toEqual(
      "No Description Given"
    );
    expect(
      emptyRecordDetailsPage.find("div#image-preview-div > span").text()
    ).toEqual("No images Provided");
    expect(emptyRecordDetailsPage.find("a#video").exists()).toBe(false);
    expect(emptyRecordDetailsPage.find("ReactGoogleMapLoader").exists()).toBe(
      false
    );
    expect(emptyRecordDetailsPage.find("p#feedback").text()).toEqual(
      "No feedback given for this record"
    );
  });
  it("shows the loading svg while loading", () => {
    const loadingRecordDetailsPage = shallow(
      <RecordDetailsPage {...{ ...mockProps, loading: true }} />
    );
    expect(loadingRecordDetailsPage.find("LoadingSvg").exists()).toBe(true);
  });
  it("shows the modal with the error message when there is an error", () => {
    const errorRecordDetailsPage = shallow(
      <RecordDetailsPage
        {...{ ...mockProps, errorMessages: [{ error: "Network Error" }] }}
      />
    );
    expect(errorRecordDetailsPage.find("Modal").exists()).toBe(true);
    expect(errorRecordDetailsPage.find("Modal").prop("modalHeader")).toEqual(
      "Error"
    );
    expect(errorRecordDetailsPage.find("Modal").prop("modalText")).toEqual(
      "Network Error"
    );
  });
  it("shows the modal with the success message when the record has been deleted", () => {
    const successRecordDetailsPage = shallow(
      <RecordDetailsPage {...{ ...mockProps, recordDeleted: true }} />
    );
    expect(successRecordDetailsPage.find("Modal").exists()).toBe(true);
    expect(successRecordDetailsPage.find("Modal").prop("modalHeader")).toEqual(
      "Success"
    );
    expect(successRecordDetailsPage.find("Modal").prop("modalText")).toEqual(
      "You have successfully deleted this record"
    );
  });
  it("shows the modal with the success message when the record has been updated successfully", () => {
    const successRecordDetailsPage = shallow(
      <RecordDetailsPage
        {...{
          ...mockProps,
          updateRecordMessage: "Sucessfully updated record's status to rejected"
        }}
      />
    );
    expect(successRecordDetailsPage.find("Modal").exists()).toBe(true);
    expect(successRecordDetailsPage.find("Modal").prop("modalHeader")).toEqual(
      "Success"
    );
    expect(successRecordDetailsPage.find("Modal").prop("modalText")).toEqual(
      "Sucessfully updated record's status to rejected"
    );
  });
  it("receives the right props from the store", () => {
    const {
      loading,
      errorMessages,
      recordFetched,
      recordDeleted,
      token,
      isAdmin,
      userId,
      updateRecordMessage
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
        recordFetched,
        recordDeleted,
        loading,
        errorMessages,
        updateRecordMessage
      }
    };
    const mockToken = "absf";
    const mockRecordInfo = "redflag-1";
    const mockDetails = {};
    const mockDispatch = action => `Mocked Dispatch of ${action}`;
    let recordDetailsProps = mapStateToProps(mockStore);
    recordDetailsProps = {
      ...recordDetailsProps,
      ...mapDispatchToProps(mockDispatch)
    };
    expect(recordDetailsProps.isAdmin).toEqual(isAdmin);
    expect(recordDetailsProps.token).toEqual(token);
    expect(recordDetailsProps.loading).toEqual(loading);
    expect(recordDetailsProps.errorMessages).toEqual(errorMessages);
    expect(recordDetailsProps.recordDeleted).toEqual(recordDeleted);
    expect(recordDetailsProps.recordFetched).toEqual(recordFetched);
    expect(recordDetailsProps.updateRecordMessage).toEqual(updateRecordMessage);
    expect(recordDetailsProps.fetchRecord(mockRecordInfo)).toBeDefined();
    expect(recordDetailsProps.fetchRecord(mockRecordInfo)).toContain(
      "Mocked Dispatch of"
    );
    expect(recordDetailsProps.clearErrors()).toBeDefined();
    expect(recordDetailsProps.clearErrors()).toContain("Mocked Dispatch of");
    expect(recordDetailsProps.resetDeletedRecord()).toBeDefined();
    expect(recordDetailsProps.resetDeletedRecord()).toContain(
      "Mocked Dispatch of"
    );
    expect(recordDetailsProps.resetUpdatedRecord()).toBeDefined();
    expect(recordDetailsProps.resetUpdatedRecord()).toContain(
      "Mocked Dispatch of"
    );
    expect(
      recordDetailsProps.deleteRecord(mockToken, mockRecordInfo)
    ).toBeDefined();
    expect(
      recordDetailsProps.deleteRecord(mockToken, mockRecordInfo)
    ).toContain("Mocked Dispatch of");
    expect(
      recordDetailsProps.updateRecord(mockToken, mockDetails)
    ).toBeDefined();
    expect(recordDetailsProps.updateRecord(mockToken, mockDetails)).toContain(
      "Mocked Dispatch of"
    );
  });
});
