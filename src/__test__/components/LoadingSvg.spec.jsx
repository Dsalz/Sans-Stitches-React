import React from "react";
import { shallow } from "enzyme";
import LoadingSvg from "../../components/LoadingSvg";

describe("Loading Svg Component", () => {
  const loadingSvg = shallow(<LoadingSvg />);

  it("renders the loading svg", () => {
    expect(loadingSvg.find("div.loading-svg-div").exists()).toBe(true);
    expect(loadingSvg.find("svg").exists()).toBe(true);
  });
  it("renders the light loading svg when prop is passed", () => {
    const lightLoadingSvg = shallow(<LoadingSvg light />);
    expect(lightLoadingSvg.find("div.light").exists()).toBe(true);
    expect(lightLoadingSvg.find("svg").exists()).toBe(true);
  });
});
