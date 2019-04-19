import "babel-polyfill";
import React from "react";
import { shallow } from "enzyme";
import {
  ProfilePage,
  getState,
  mapStateToProps,
  mapDispatchToProps
} from "../../views/ProfilePage";

describe("Profile Page component", () => {
  const mockFetchMyRecords = jest.fn();
  const mockClearErrors = jest.fn();
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
    firstname: "John",
    lastname: "David",
    email: "johnny@yahoo.com",
    phoneNumber: "0812345678",
    isAdmin: false
  };
  const profilePage = shallow(
    <ProfilePage
      fetchMyRecords={mockFetchMyRecords}
      clearErrors={mockClearErrors}
      {...mockProps}
    />
  );
  it("renders the statistics section correctly with the passed in data", () => {
    const { myRedFlagRecords, myInterventionRecords } = mockProps;
    expect(
      profilePage.find("section.dashboard-main-statistics-section").exists()
    ).toBe(true);
    expect(profilePage.find("h3#total-no").text()).toEqual(
      String([...myRedFlagRecords, ...myInterventionRecords].length)
    );
    expect(profilePage.find("h3#red-flag-no").text()).toEqual(
      String(myRedFlagRecords.length)
    );
    expect(profilePage.find("h3#intervention-no").text()).toEqual(
      String(myInterventionRecords.length)
    );
    expect(profilePage.find("h3#red-flag-pending-no").text()).toEqual(
      String(
        myRedFlagRecords.filter(record => record.status === "pending review")
          .length
      )
    );
    expect(
      profilePage.find("h3#red-flag-under-investigation-no").text()
    ).toEqual(
      String(
        myRedFlagRecords.filter(
          record => record.status === "under investigation"
        ).length
      )
    );
    expect(profilePage.find("h3#red-flag-resolved-no").text()).toEqual(
      String(
        myRedFlagRecords.filter(record => record.status === "resolved").length
      )
    );
    expect(profilePage.find("h3#red-flag-rejected-no").text()).toEqual(
      String(
        myRedFlagRecords.filter(record => record.status === "rejected").length
      )
    );
    expect(profilePage.find("h3#intervention-pending-no").text()).toEqual(
      String(
        myInterventionRecords.filter(
          record => record.status === "pending review"
        ).length
      )
    );
    expect(
      profilePage.find("h3#intervention-under-investigation-no").text()
    ).toEqual(
      String(
        myInterventionRecords.filter(
          record => record.status === "under investigation"
        ).length
      )
    );
    expect(profilePage.find("h3#intervention-resolved-no").text()).toEqual(
      String(
        myInterventionRecords.filter(record => record.status === "resolved")
          .length
      )
    );
    expect(profilePage.find("h3#intervention-rejected-no").text()).toEqual(
      String(
        myInterventionRecords.filter(record => record.status === "rejected")
          .length
      )
    );
  });
  it("renders the info section correctly with the passed in data", () => {
    const { firstname, lastname, email, phoneNumber } = mockProps;
    expect(
      profilePage.find("section.dashboard-main-generalinfo-section").exists()
    ).toBe(true);
    expect(profilePage.find("span#fullName").text()).toEqual(
      `${firstname} ${lastname}`
    );
    expect(profilePage.find("span#email").text()).toEqual(email);
    expect(profilePage.find("span#phoneNumber").text()).toEqual(phoneNumber);
  });
  it("redirects to the admin dashboard if user is an admin", () => {
    const adminProfilePage = shallow(
      <ProfilePage
        fetchMyRecords={mockFetchMyRecords}
        clearErrors={mockClearErrors}
        {...{ ...mockProps, isAdmin: true }}
      />
    );
    expect(adminProfilePage.find("Redirect").exists()).toBe(true);
    expect(adminProfilePage.find("Redirect").prop("to")).toBe(
      "/admin-overview"
    );
  });
  it("fires the function to update the records as soon as it is mounted and updates it's state so as not to make subsequent calls", () => {
    expect(mockFetchMyRecords.mock.calls.length).toEqual(1);
    expect(getState().updatedRecords).toEqual(true);
  });
  it("shows the loading svg while loading", () => {
    const loadingProfilePage = shallow(
      <ProfilePage
        fetchMyRecords={mockFetchMyRecords}
        clearErrors={mockClearErrors}
        {...{ ...mockProps, loading: true }}
      />
    );
    expect(loadingProfilePage.find("LoadingSvg").exists()).toBe(true);
  });
  it("shows the modal with the error message when there is an error", () => {
    const errorProfilePage = shallow(
      <ProfilePage
        fetchMyRecords={mockFetchMyRecords}
        clearErrors={mockClearErrors}
        {...{ ...mockProps, errorMessages: [{ error: "Network Error" }] }}
      />
    );
    expect(errorProfilePage.find("Modal").exists()).toBe(true);
    expect(errorProfilePage.find("Modal").prop("modalHeader")).toEqual("Error");
    expect(errorProfilePage.find("Modal").prop("modalText")).toEqual(
      "Network Error"
    );
  });
  it("receives the right props from the store", () => {
    const {
      token,
      firstname,
      lastname,
      email,
      phoneNumber,
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
          firstname,
          lastname,
          email,
          phone_number: phoneNumber,
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
    let profilePageProps = mapStateToProps(mockStore);
    profilePageProps = {
      ...profilePageProps,
      ...mapDispatchToProps(mockDispatch)
    };
    expect(profilePageProps.email).toEqual(email);
    expect(profilePageProps.firstname).toEqual(firstname);
    expect(profilePageProps.lastname).toEqual(lastname);
    expect(profilePageProps.phoneNumber).toEqual(phoneNumber);
    expect(profilePageProps.isAdmin).toEqual(isAdmin);
    expect(profilePageProps.token).toEqual(token);
    expect(profilePageProps.loading).toEqual(loading);
    expect(profilePageProps.errorMessages).toEqual(errorMessages);
    expect(profilePageProps.myInterventionRecords).toEqual(
      myInterventionRecords
    );
    expect(profilePageProps.myRedFlagRecords).toEqual(myRedFlagRecords);
    expect(profilePageProps.fetchMyRecords()).toBeDefined();
    expect(profilePageProps.fetchMyRecords()).toContain("Mocked Dispatch of");
    expect(profilePageProps.clearErrors()).toBeDefined();
    expect(profilePageProps.clearErrors()).toContain("Mocked Dispatch of");
  });
});
