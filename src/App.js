import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Dashboard from "./components/Dashboard.js";
import DashboardItem from "./components/DashboardItem.js";
import GraphWeeklyScores from "./components/GraphWeeklyScores";
import GraphCumulativeScores from "./components/GraphCumulativeScores";

function App() {
  //return <GraphWeeklyScores></GraphWeeklyScores>;
  return (
    <DashboardItem
      dataItem={<GraphCumulativeScores average={true}></GraphCumulativeScores>}
    ></DashboardItem>
  );
}

export default App;
