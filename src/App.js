import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Dashboard from "./components/Dashboard.js";
import DashboardItem from "./components/DashboardItem.js";
import GraphWeeklyScores from "./components/GraphWeeklyScores";
import GraphCumulativeScores from "./components/GraphCumulativeScores";
import GraphDraftByPosition from "./components/GraphDraftByPosition";

function App() {
  //return <GraphWeeklyScores></GraphWeeklyScores>;
  return (
    <DashboardItem
      dataItem={
        <GraphDraftByPosition
          cumulative={true}
          teamId={1}
          roundNo={18}
        ></GraphDraftByPosition>
      }
    ></DashboardItem>
  );
}

export default App;
