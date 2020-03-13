import React from "react";
import { Container, Spinner } from "reactstrap";
import apis from "../scripts/apis";
import { CustomTable, CustomTableHeader } from "./CustomTable.js";
import DataItem from "./DataItem.js";
import DashboardItem from "./DashboardItem.js";

/**
 * Data component class to create table summarizing scoring by team - min, max, av. points for, av. points against, etc
 *
 * Expected props:
 *     average: Boolean indicating whether to take average or cumulative values. Defaults to cumulative
 *     title: Optional string title
 *
 */
class TableScoringHighlights extends DataItem {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  async componentWillMount() {
    await this.get_data(this.state.takeAverage);
  }

  /**
   * Function to get data for table
   */
  async get_data() {
    let data = window.localStorage.getItem("games");
    if (!data) {
      data = await apis.get_alltime_schedule();
      //data = await apis.get_all_draft_info_local();
      window.localStorage.setItem("games", JSON.stringify(data));
    } else {
      data = JSON.parse(data);
    }
    let scoresByTeam = data.reduce((accum, curr) => {
      ["home", "away"].forEach(team => {
        if (curr.hasOwnProperty(team)) {
          let matchingIndex = accum.findIndex(elem => {
            return elem.teamId === curr[team].teamId;
          });
          //Check if match, add new data point if not
          if (matchingIndex < 0) {
            matchingIndex = accum.length;
            accum.push({
              teamId: curr[team].teamId,
              scores: []
            });
          }
          let opponentLabel = team === "home" ? "away" : "home";
          let pointsFor = curr[team].totalPoints;
          let pointsAgainst = null;
          if (curr.hasOwnProperty(opponentLabel)) {
            pointsAgainst = curr[opponentLabel].totalPoints;
          }
          accum[matchingIndex].scores.push({
            year: curr.year,
            week: curr.week,
            pointsFor: pointsFor,
            pointsAgainst: pointsAgainst
          });
        }
      });
      return accum;
    }, []);
    //Map scores for each team to the desired data output
    let output = scoresByTeam.map(data => {
      return data.scores.reduce(
        (accum, curr) => {
          if (curr.pointsAgainst !== null) {
            return {
              teamId: data.teamId,
              games: accum.games + 1,
              maxFor: Math.max(accum.maxFor, curr.pointsFor),
              minFor: Math.min(accum.minFor, curr.pointsFor),
              //Currently just take sum, take average later
              avFor: accum.avFor + curr.pointsFor,
              maxAgainst: Math.max(accum.maxAgainst, curr.pointsAgainst),
              minAgainst: Math.min(accum.minAgainst, curr.pointsAgainst),
              //Currently just take sum, take average later
              avAgainst: accum.avAgainst + curr.pointsAgainst
            };
          } else {
            return {
              teamId: data.teamId,
              games: accum.games,
              maxFor: Math.max(accum.maxFor, curr.pointsFor),
              minFor: Math.min(accum.minFor, curr.pointsFor),
              //Currently just take sum, take average later
              avFor: accum.avFor + curr.pointsFor,
              maxAgainst: accum.maxAgainst,
              minAgainst: accum.minAgainst,
              //Currently just take sum, take average later
              avAgainst: accum.avAgainst
            };
          }
        },
        {
          teamId: 0,
          games: 0,
          maxFor: 0,
          minFor: 1000,
          avFor: 0,
          maxAgainst: 0,
          minAgainst: 1000,
          avAgainst: 0
        }
      );
    });
    output = output.map(data => {
      return {
        teamId: data.teamId,
        maxFor: data.maxFor,
        minFor: data.minFor,
        avFor: (data.avFor / data.games).toFixed(2),
        maxAgainst: data.maxAgainst,
        minAgainst: data.minAgainst,
        avAgainst: (data.avAgainst / data.games).toFixed(2)
      };
    });
    output.sort((a, b) => {
      return a.teamId - b.teamId;
    });
    this.setState({ data: output });
  }

  setOptions(newData) {
    this.setState({ options: newData });
  }

  /**
   * Helper function to render the table is data isn't be loaded
   */
  renderTable() {
    if (this.isLoading()) {
      return (
        <Container fluid>
          <Spinner size="lg" color="danger" />
          <h2>Loading data...</h2>
        </Container>
      );
    } else {
      return (
        <CustomTable
          customHeaders={[
            new CustomTableHeader("teamId", "Team", true),
            new CustomTableHeader("maxFor", "Max Score", true),
            new CustomTableHeader("minFor", "Min Score", false),
            new CustomTableHeader("avFor", "Average Score", true),
            new CustomTableHeader("maxAgainst", "Max Against", true),
            new CustomTableHeader("minAgainst", "Min Against", false),
            new CustomTableHeader("avAgainst", "Average Against", true)
          ]}
          itemData={this.state.data}
        ></CustomTable>
      );
    }
  }

  render() {
    return (
      <DashboardItem
        title="Scoring Highlights by Team"
        infoDataSplit={100}
        itemData={this.renderTable()}
      ></DashboardItem>
    );
  }
}

export default TableScoringHighlights;
