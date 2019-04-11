import React from "react";
import { shallow } from "enzyme";
import LoadingSvg from "../../components/LoadingSvg";

describe("Loading Svg Component", () => {
  const loadingSvg = shallow(<LoadingSvg />);

  it("renders the loading svg", () => {
    expect(loadingSvg.find("div.loading-svg-div").exists()).toBe(true);
    expect(loadingSvg.find("svg").exists()).toBe(true);
  });
});
