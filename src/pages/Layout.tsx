import React from "react";
import {Outlet} from "react-router-dom";
import Navbar from "../components/Navbar";
import FPSStats from "react-fps-stats";

const Layout = () => {
  return (
    <>
      <FPSStats left="auto" right="0" />
      <Navbar />
      <Outlet />
    </>
  );
};

export default Layout;