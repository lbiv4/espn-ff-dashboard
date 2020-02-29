import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Dashboard from "./components/Dashboard.js";
import DashboardItem from "./components/DashboardItem.js";
import GraphWeeklyScores from "./components/GraphWeeklyScores.js";
import GraphCumulativeScores from "./components/GraphCumulativeScores.js";
import ItemDraftByPosition from "./components/ItemDraftByPosition.js";
import DropdownMultiSelect from "./components/DropdownMultiSelect.js";
import { CustomTable, CustomTableHeader } from "./components/CustomTable.js";

let data = ["bar", "bar1", "bar2", "bar4"];

function App() {
  //eturn <GraphWeeklyScores></GraphWeeklyScores>;
  return (
    <Dashboard
      dashboardItems={[
        <GraphCumulativeScores average={true}></GraphCumulativeScores>
        /*<DashboardItem
          title="Cumulative Scores"
          itemData={
            <GraphCumulativeScores
              cumulative={true}
              teamId={1}
              roundNo={18}
            ></GraphCumulativeScores>
          }
        ></DashboardItem>
        /*<DashboardItem
          dataItem={
            <CustomTable
              customHeaders={[
                new CustomTableHeader("teamId", "Team", true),
                new CustomTableHeader("name", "Player Name", true),
                new CustomTableHeader("count", "Draft Count", false)
              ]}
              itemData={[
                { teamId: 1, name: "playerA", count: 3 },
                { teamId: 1, name: "playerB", count: 1 },
                { teamId: 1, name: "playerB", count: 2 },
                { teamId: 3, name: "playerC", count: 3 },
                { teamId: 2, name: "playerA", count: 1 },
                { teamId: 1, name: "playerA", count: 3 },
                { teamId: 1, name: "playerB", count: 1 },
                { teamId: 1, name: "playerB", count: 2 },
                { teamId: 3, name: "playerC", count: 3 },
                { teamId: 2, name: "playerA", count: 1 },
                { teamId: 1, name: "playerA", count: 3 },
                { teamId: 1, name: "playerB", count: 1 },
                { teamId: 1, name: "playerB", count: 2 },
                { teamId: 3, name: "playerC", count: 3 },
                { teamId: 2, name: "playerA", count: 1 },
                { teamId: 1, name: "playerA", count: 3 },
                { teamId: 1, name: "playerB", count: 1 },
                { teamId: 1, name: "playerB", count: 2 },
                { teamId: 3, name: "playerC", count: 3 },
                { teamId: 2, name: "playerA", count: 1 }
              ]}
            ></CustomTable>
          }
        ></DashboardItem>*/
      ]}
    ></Dashboard>
  );
}

export default App;
