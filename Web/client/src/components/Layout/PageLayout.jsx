import React from "react";
import Nav from "./Nav";
import Footer from "./Footer";

const PageLayout = ({ childPage, navElements }) => {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Nav navElements={navElements} />
      <div className="flex-grow z-20">{childPage}</div>
      <Footer />
    </div>
  );
};

export default PageLayout;
