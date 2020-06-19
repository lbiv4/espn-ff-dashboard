import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Dashboard from "./components/Dashboard.js";
import TitleHeader from "./components/TitleHeader.js";
import apis from "./scripts/apis.js";

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
            "score_counts",
          ],
          Draft: [
            "draft_by_position_independent",
            "draft_by_position_cumulative",
            "multi_drafted_players",
          ],
        },
        currentDashboard: "Scores",
        data: {
          owners: {},
          games: [],
          draft: [],
        },
      };
    }
  }

  async componentDidMount() {
    let apiCalls = [];
    const dataToCall = ["owners", "games", "draft"];
    let dataCalled = [];
    dataToCall.forEach((name) => {
      let storageData = window.localStorage.getItem(name);
      if (Object.entries(this.state.data[name]).length > 0) {
        window.localStorage.setItem(
          name,
          JSON.stringify(this.state.data[name])
        );
      } else if (storageData != null) {
        //Assign all properties in this.state.data, overwrite new value, update entire this.state.data object
        let newData = Object.assign({}, this.state.data);
        newData[name] = JSON.parse(storageData);
        this.setState({ data: newData });
      } else {
        dataCalled.push(name);
        switch (name) {
          case "owners":
            apiCalls.push(this.get_owner_data(2020));
            break;
          case "games":
            apiCalls.push(apis.get_alltime_schedule(2020));
            break;
          case "draft":
            apiCalls.push(apis.get_all_draft_info(2020));
            break;
          default:
            console.log(
              `Unable to identify api associated with '${name}' - please check code implementation`
            );
        }
      }
    });
    await Promise.all(apiCalls).then((outputs) => {
      //Assign all properties in this.state.data, overwrite new value, update entire this.state.data object
      let newData = Object.assign({}, this.state.data);
      for (let i = 0; i < outputs.length; i++) {
        let dataName = dataCalled[i];
        if (outputs[i] == null) {
          console.log(`Unable to get data for '${dataName}'`);
        } else {
          window.localStorage.setItem(dataName, JSON.stringify(outputs[i]));
          newData[dataName] = outputs[i];
        }
      }
      this.setState({ data: newData });
    });
  }

  get_owner_data(year) {
    return apis.get_general_team_info(year).then((output) => {
      console.log("GET OWNER DATA");
      console.log(output);
      //Get owner info
      let owners = [];
      output.forEach((data) => {
        data.members.forEach((member) => {
          let memberInfo = {
            id: owners.length + 1,
            espnId: member.id,
            firstName: member.firstName,
            lastName: member.lastName,
            fullName: `${member.firstName} ${member.lastName}`,
          };
          if (
            owners.findIndex((owner) => {
              return owner.espnId === member.id;
            }) < 0
          ) {
            owners.push(memberInfo);
          }
        });
      });
      //Get team-owner mappings
      let teamsWithOwners = {};
      output.forEach((data) => {
        data.teams.forEach((team) => {
          if (!teamsWithOwners.hasOwnProperty(team.id)) {
            teamsWithOwners[team.id] = {};
          }
          //TODO: Account for teams with multiple owners?
          if (team.hasOwnProperty("primaryOwner")) {
            let ownerIndex = owners.findIndex((owner) => {
              return owner.espnId === team.primaryOwner;
            });
            if (ownerIndex >= 0) {
              teamsWithOwners[team.id][data.seasonId] = owners[ownerIndex].id;
            }
          }
        });
      });
      return {
        owners: owners,
        teamOwners: teamsWithOwners,
      };
    });
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
