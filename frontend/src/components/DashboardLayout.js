import React from "react";
import { Outlet } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import DashboardFooter from "./DashboardFooter";

const DashboardLayout = () => {
  return (
    <>
      <DashboardHeader />
      <div className="dash-container">
        <Outlet />
      </div>
      <DashboardFooter />
    </>
  );
};

export default DashboardLayout;
