import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Dashboard from "./components/Dashboard.js";
import { CustomTable, CustomTableHeader } from "./components/CustomTable.js";
import TitleHeader from "./components/TitleHeader.js";
import { Container, Nav } from "reactstrap";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dashboards: {
        Scores: [
          "average_scores",
          "cumulative_scores",
          "weekly_scores",
          "score_counts"
        ],
        Draft: [
          "draft_by_position_independent",
          "draft_by_position_cumulative",
          "multi_drafted_players"
        ]
      },
      currentDashboard: "Scores"
    };
  }
  updateDashboards(newData) {
    this.setState({ dashboards: newData });
  }
  setDashboard(name) {
    this.setState({ currentDashboard: name });
  }
  render() {
    console.log("App rerender");
    return (
      <div>
        <TitleHeader
          dashboards={this.state.dashboards}
          updateDashboards={this.updateDashboards.bind(this)}
          setDashboard={this.setDashboard.bind(this)}
        ></TitleHeader>
        <div className="main-content">
          <div className="sidebar"></div>
          <Dashboard
            title={this.state.currentDashboard}
            dashboards={this.state.dashboards}
          ></Dashboard>
        </div>
      </div>
    );
  }
}

export default App;
