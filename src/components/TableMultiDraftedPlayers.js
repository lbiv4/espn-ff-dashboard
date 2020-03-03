import React from "react";
import {
  LineChart,
  Line,
  Brush,
  ResponsiveContainer,
  ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { Container, Spinner } from "reactstrap";
import apis from "../scripts/apis";
import { CustomTable, CustomTableHeader } from "./CustomTable.js";
import DataItem from "./DataItem.js";
import DashboardItem from "./DashboardItem.js";

/**
 * Expected props:
 *     average: Boolean indicating whether to take average or cumulative values. Defaults to cumulative
 *     title: Optional string title
 *
 */
class GraphCumulativeScores extends DataItem {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  async componentWillMount() {
    console.log("Will mount");
    await this.get_data(this.state.takeAverage);
    console.log("Done getting data");
  }

  /**
   * Function to get data for line plot
   *
   * @param {boolean} average Boolean indicating whether to take the average or cumulative sum. True is average, sum otherwies
   * @return Sets `this.state.data` to array of data objects, where each data point is styled like
   * {
   *   year:      //Year
   *   week:      //Week
   *   team1:     //Cumulative score of team with id=1 by that year/week
   *   team2:     //Cumulative score of team with id=2 by that year/week
   *   team3:     //Cumulative score of team with id=3 by that year/week
   *   ...
   * }
   */
  async get_data(average) {
    let data = window.localStorage.getItem("draft");
    if (!data) {
      data = await apis.get_all_draft_info();
      window.localStorage.setItem("draft", JSON.stringify(data));
    } else {
      data = JSON.parse(data);
    }
    let draftsByTeam = data.reduce((accum, player) => {
      //Skip if null player info (i.e. no one drafted)
      if (player.player == null) {
        return accum;
      }
      //Find drafting team and add data point if necessary
      let teamIndex = accum.findIndex(data => {
        return data.teamId === player.teamId;
      });
      if (teamIndex < 0) {
        accum.push({ teamId: player.teamId, draftedPlayers: [] });
        teamIndex = accum.length - 1;
      }
      //Find player for drafting team, adding data as necessary
      let playerIndex = accum[teamIndex].draftedPlayers.findIndex(data => {
        return data.playerId === player.player.id;
      });
      if (playerIndex < 0) {
        accum[teamIndex].draftedPlayers.push({
          playerId: player.player.id,
          name: player.player.fullName,
          drafted: []
        });
        playerIndex = accum[teamIndex].draftedPlayers.length - 1;
      }
      //Add this instance
      accum[teamIndex].draftedPlayers[playerIndex].drafted.push({
        year: player.year,
        overallNo: player.overallNo
      });
      return accum;
    }, []);
    /*let mostDrafted = draftsByTeam.map(team => {
      let max = team.draftedPlayers[0];
      for (let i = 0; i < team.draftedPlayers.length; i++) {
        if (team.draftedPlayers[i].drafted.length > max.drafted.length) {
          max = team.draftedPlayers[i];
        }
      }
      return { teamId: team.teamId, mostDrafted: max };
    });
    console.log("most drafted");
    console.log(mostDrafted);
    console.log(
      mostDrafted.map(data => {
        return {
          teamId: data.teamId,
          name: data.mostDrafted.name,
          count: data.mostDrafted.drafted.length
        };
      })
    );*/
    let multiDrafted = draftsByTeam.map(team => {
      let multipleDrafts = [];
      for (let i = 0; i < team.draftedPlayers.length; i++) {
        if (team.draftedPlayers[i].drafted.length > 1) {
          multipleDrafts.push(team.draftedPlayers[i]);
        }
      }
      multipleDrafts.sort((a, b) => {
        return b.drafted.length - a.drafted.length;
      });
      return { teamId: team.teamId, players: multipleDrafts };
    });
    console.log("multi drafted");
    console.log(multiDrafted);
    //Map data to data rows
    let output = [];
    multiDrafted.forEach(team => {
      team.players.forEach(player => {
        let yearsDrafted = player.drafted.map(data => {
          return data.year;
        });
        yearsDrafted.sort();
        output.push({
          teamId: team.teamId,
          player: player.name,
          draftCount: player.drafted.length,
          draftYears: yearsDrafted.join(", ")
        });
      });
    });
    this.setState({ data: output });
  }

  setOptions(newData) {
    this.setState({ options: newData });
  }

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
            new CustomTableHeader("player", "Player Name", true),
            new CustomTableHeader("draftCount", "Draft Count", false),
            new CustomTableHeader("draftYears", "Years Drafted", true)
          ]}
          itemData={this.state.data}
        ></CustomTable>
      );
    }
  }

  render() {
    return (
      <DashboardItem
        title="Multi-Drafted Players by Team"
        infoDataSplit={90}
        itemData={this.renderTable()}
      ></DashboardItem>
    );
  }
}

export default GraphCumulativeScores;
