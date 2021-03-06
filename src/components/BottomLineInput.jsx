import React from "react";
import { string, func, bool } from "prop-types";

/**
 * @description reusable input component
 * @returns {HTMLInputElement} input
 */
const BottomLineInput = ({
  customClass,
  inputId,
  inputName,
  inputType,
  placeHolder,
  onChange,
  errorMessage,
  isRequired,
  inputValue,
  isDisabled
}) => (
  <>
    <input
      className={`bottom-line-input ${customClass && customClass}`}
      placeholder={placeHolder}
      id={inputId}
      name={inputName}
      type={inputType}
      onChange={onChange}
      required={isRequired}
      value={inputValue}
      disabled={isDisabled}
    />
    {errorMessage && <p className="form-error red-cl">{errorMessage}</p>}
  </>
);

BottomLineInput.propTypes = {
  /**
   * The input's value
   */
  inputValue: string,
  /**
   * The custom class containing extra styles for the input
   */
  customClass: string,
  /**
   * The id of the input
   */
  inputId: string,
  /**
   * The name attribute for the input
   */
  inputName: string,
  /**
   * The type attribute for the input
   */
  inputType: string,
  /**
   * The placeholder for the input
   */
  placeHolder: string,
  /**
   * The function handler for a change event on the input
   */
  onChange: func.isRequired,
  /**
   * The error message to display for the input field
   */
  errorMessage: string,
  /**
   * if the input field is required or not
   */
  isRequired: bool,
  /**
   * if the input field is disabled or not
   */
  isDisabled: bool
};

BottomLineInput.defaultProps = {
  customClass: "",
  inputId: "",
  inputName: "",
  inputType: "text",
  placeHolder: "",
  errorMessage: "",
  isRequired: false,
  inputValue: "",
  isDisabled: false
};

export default BottomLineInput;
