import React from "react";
import PropTypes from "prop-types";

/**
 * @description svg to depict loading state component
 * @returns {HTMLSvgElement} svg
 */
const Modal = ({ modalHeader, modalText, onClose }) => (
  <div className="modal" id="modal">
    <div
      className="modal-backdrop"
      id="modalBackdrop"
      onClick={onClose}
      role="presentation"
    />
    <section className="actual-modal">
      <section className="modal-header">
        <h3 className="modal-header-text">{modalHeader}</h3>
        <span
          className="modal-header-close"
          id="closeModal"
          onClick={onClose}
          role="presentation"
        >
          &times; <span />
        </span>
      </section>
      <section className="modal-body">
        <p className="modal-body-text">{modalText}</p>
      </section>
    </section>
  </div>
);

Modal.propTypes = {
  modalHeader: PropTypes.string.isRequired,
  modalText: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
};

export default Modal;
