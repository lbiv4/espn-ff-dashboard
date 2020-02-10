import React from "react";
import "./App.css";
import Dashboard from "./components/Dashboard.js";
import DashboardItem from "./components/DashboardItem.js";

function App() {
  return (
    <Dashboard
      dashboardItems={[
        <DashboardItem></DashboardItem>,
        <DashboardItem></DashboardItem>,
        <DashboardItem></DashboardItem>
      ]}
    ></Dashboard>
  );
}

export default App;
