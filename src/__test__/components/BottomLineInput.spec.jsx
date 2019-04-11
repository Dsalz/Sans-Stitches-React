import React from "react";
import { shallow } from "enzyme";
import BottomLineInput from "../../components/BottomLineInput";

describe("Bottom Line Input component", () => {
  const mockChangeHandler = jest.fn();

  const input = shallow(
    <BottomLineInput
      onChange={mockChangeHandler}
      inputId="testInputId"
      inputName="testInputName"
      placeHolder="testInputPlaceHolder"
      customClass="testInputClass"
    />
  );

  it("renders the input field", () => {
    expect(input.find("input").exists()).toBe(true);
  });

  it("has the default class - bottom-line-input", () => {
    expect(input.find("input").hasClass("bottom-line-input")).toBe(true);
  });

  it("has the custom class passed in props - testInputClass", () => {
    expect(input.find("input").hasClass("testInputClass")).toBe(true);
  });

  it("has the placeholder passed in props - testInputPlaceHolder", () => {
    expect(input.find("input").prop("placeholder")).toEqual(
      "testInputPlaceHolder"
    );
  });

  it("has the name passed in props - testInputName", () => {
    expect(input.find("input").prop("name")).toEqual("testInputName");
  });

  it("has the id passed in props - testInputId", () => {
    expect(input.find("input").prop("id")).toEqual("testInputId");
  });

  it("has the default type 'text' when none is passed in the props", () => {
    expect(input.find("input").prop("type")).toEqual("text");
  });

  it("is not required by default", () => {
    expect(input.find("input").prop("required")).toEqual(false);
  });

  it("is required when passed in the props", () => {
    const requiredInput = shallow(
      <BottomLineInput
        onChange={mockChangeHandler}
        inputId="testInputId"
        inputName="testInputName"
        placeHolder="testInputPlaceHolder"
        customClass="testInputClass"
        inputType="password"
        isRequired
      />
    );
    expect(requiredInput.find("input").prop("required")).toEqual(true);
  });

  it("calls the onChange function when change event is fired", () => {
    input.find("input").simulate("change");
    expect(mockChangeHandler.mock.calls.length).toEqual(1);
  });

  it("has the type 'password' when it is passed in the props", () => {
    const passwordInput = shallow(
      <BottomLineInput
        onChange={mockChangeHandler}
        inputId="testInputId"
        inputName="testInputName"
        placeHolder="testInputPlaceHolder"
        customClass="testInputClass"
        inputType="password"
      />
    );
    expect(passwordInput.find("input").prop("type")).toEqual("password");
  });

  it("displays the error message passed in the props", () => {
    const errorInput = shallow(
      <BottomLineInput
        onChange={mockChangeHandler}
        inputId="testInputId"
        inputName="testInputName"
        placeHolder="testInputPlaceHolder"
        customClass="testInputClass"
        inputType="password"
        errorMessage="testInputErrorMessage"
      />
    );
    expect(errorInput.find("p.form-error").exists()).toBe(true);
    expect(errorInput.find("p.form-error").text()).toEqual(
      "testInputErrorMessage"
    );
  });
});
