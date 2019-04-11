import React from "react";
import { shallow } from "enzyme";
import Modal from "../../components/Modal";

describe("Modal Component", () => {
  const mockCloseHandler = jest.fn();

  const modal = shallow(
    <Modal
      modalHeader="testModalHeader"
      modalText="testModalText"
      onClose={mockCloseHandler}
    />
  );

  it("renders the modal", () => {
    expect(modal.find("div.modal").exists()).toBe(true);
    expect(modal.find("div.modal-backdrop").exists()).toBe(true);
    expect(modal.find("section.actual-modal").exists()).toBe(true);
  });

  it("has the header passed in props - testModalHeader", () => {
    expect(modal.find("h3.modal-header-text").text()).toEqual(
      "testModalHeader"
    );
  });

  it("has the text passed in props - testModalText", () => {
    expect(modal.find("p.modal-body-text").text()).toEqual("testModalText");
  });

  it("fires the onClose handler when both backdrop and close button are clicked", () => {
    expect(mockCloseHandler.mock.calls.length).toEqual(0);

    modal.find("div.modal-backdrop").simulate("click");

    expect(mockCloseHandler.mock.calls.length).toEqual(1);

    modal.find("span.modal-header-close").simulate("click");

    expect(mockCloseHandler.mock.calls.length).toEqual(2);
  });
});
