import React, { Fragment } from "react";
import PropTypes from "prop-types";
import BottomLineInput from "./BottomLineInput";
import Modal from "./Modal";

const IndexForm = ({
  fields,
  onSubmit,
  customClass,
  submitText,
  errorMessage,
  clearErrorMessage
}) => {
  return (
    <form onSubmit={onSubmit} className={customClass}>
      {errorMessage && (
        <Modal
          modalHeader="Error"
          modalText={errorMessage}
          onClose={clearErrorMessage}
        />
      )}
      {fields.map(field => (
        <Fragment key={field.id}>
          <BottomLineInput
            placeHolder={field.placeholder}
            inputId={field.id}
            inputType={field.type || "text"}
            inputName={field.name}
            onChange={field.onChange}
            errorMessage={field.errorMessage}
            isRequired={field.required}
          />
          <br />
        </Fragment>
      ))}
      <button className="rect-red-button" type="submit">
        {submitText}
      </button>
    </form>
  );
};

IndexForm.propTypes = {
  /**
   * The details of the fields to be displayed in the form
   */
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * The function to be fired on submission of the form
   */
  onSubmit: PropTypes.func.isRequired,
  /**
   * A class containing extra styles for the form
   */
  customClass: PropTypes.string,
  /**
   * The text to write on the submit button
   */
  submitText: PropTypes.string.isRequired,
  /**
   * A general error message to display on the form
   */
  errorMessage: PropTypes.string,
  /**
   * A function to remove the error message
   */
  clearErrorMessage: PropTypes.func.isRequired
};

IndexForm.defaultProps = {
  customClass: "",
  errorMessage: ""
};

export default IndexForm;
