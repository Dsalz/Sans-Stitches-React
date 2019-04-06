import React from "react";
import IndexNavbar from "../components/Layout/IndexNavbar";
import LandingPageHero from "../components/LandingPageHero";

const LandingPage = () => {
  return (
    <div className="blk-rd-gradient">
      <IndexNavbar />
      <LandingPageHero />
    </div>
  );
};

export default LandingPage;
