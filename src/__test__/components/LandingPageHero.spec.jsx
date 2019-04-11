import React from "react";
import { shallow } from "enzyme";
import LandingPageHero from "../../components/LandingPageHero";

describe("Landing page hero component", () => {
  const landingPageHero = shallow(<LandingPageHero />);
  it("renders the main section", () => {
    expect(landingPageHero.find("main.index-landing").exists()).toBe(true);
  });
  it("renders the image backdrop", () => {
    expect(landingPageHero.find("section.index-backdrop").exists()).toBe(true);
  });
  it("renders the landing page's information", () => {
    expect(landingPageHero.find("section.index-info").exists()).toBe(true);
    expect(landingPageHero.find("section.index-info > h2").exists()).toBe(true);
    expect(landingPageHero.find("section.index-info > p").exists()).toBe(true);
  });
  it("renders the landing page's image section", () => {
    expect(landingPageHero.find("div.index-landing-img-div").exists()).toBe(
      true
    );
  });
});
