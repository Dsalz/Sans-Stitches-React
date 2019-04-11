import React from "react";
import { shallow } from "enzyme";
import IndexForm from "../../components/IndexForm";

describe("Index Form Component", () => {
  const mockSubmitHandler = jest.fn();
  const mockChangeHandler = jest.fn();
  const mockClearErrorMessagesHandler = jest.fn();

  const form = shallow(
    <IndexForm
      onSubmit={mockSubmitHandler}
      fields={[
        { id: "one", onChange: mockChangeHandler },
        { id: "two", onChange: mockChangeHandler },
        { id: "three", onChange: mockChangeHandler },
        { id: "four", onChange: mockChangeHandler },
        { id: "five", onChange: mockChangeHandler }
      ]}
      errorMessage="testErrorMessage"
      submitText="testSubmitText"
      customClass="testFormClass"
      clearErrorMessage={mockClearErrorMessagesHandler}
    />
  );

  it("renders the form", () => {
    expect(form.find("form").exists()).toBe(true);
  });

  it("has the custom class - testFormClass", () => {
    expect(form.find("form").hasClass("testFormClass")).toBe(true);
  });

  it("has the submit text passed in props on submit button - testSubmitText", () => {
    expect(form.find("button.rect-red-button").text()).toBe("testSubmitText");
  });

  it("displays the error message 'testErrorMessage' in a Modal", () => {
    expect(form.find("Modal").prop("modalText")).toEqual("testErrorMessage");
  });

  it("passes the clear error message to the Modal", () => {
    expect(form.find("Modal").prop("onClose")).toEqual(
      mockClearErrorMessagesHandler
    );
  });

  it("fires submit handler on submission of form", () => {
    expect(mockSubmitHandler.mock.calls.length).toEqual(0);
    form.find("form").simulate("submit");
    expect(mockSubmitHandler.mock.calls.length).toEqual(1);
  });

  it("has five input fields", () => {
    expect(form.find("BottomLineInput").length).toEqual(5);
  });
});
