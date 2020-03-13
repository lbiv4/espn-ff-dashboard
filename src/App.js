import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Dashboard from "./components/Dashboard.js";
import TitleHeader from "./components/TitleHeader.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    let storedDashboardData = window.localStorage.getItem("dashboards");
    //Check is local storage has save custom scoreboards. Use them if they exist, use defaults otherwise
    if (storedDashboardData != null) {
      let data = JSON.parse(storedDashboardData);
      this.state = { dashboards: data, currentDashboard: Object.keys(data)[0] };
    } else {
      this.state = {
        dashboards: {
          Scores: [
            "scoring_highlights",
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
  }
  updateDashboards(newData) {
    window.localStorage.setItem("dashboards", JSON.stringify(newData));
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
            dashboardItems={this.state.dashboards[this.state.currentDashboard]}
          ></Dashboard>
        </div>
      </div>
    );
  }
}

export default App;
