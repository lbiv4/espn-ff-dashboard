import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Form, FormGroup, Input, Label, Container, Spinner } from "reactstrap";
import apis from "../scripts/apis";
import DataItem from "./DataItem.js";
import DashboardItem from "./DashboardItem.js";

/**
 * Data component class displaying pie chart of players drafted by position for a specific team and either a specific round or cumulative through
 * a given round. Includes ability to filter by team and round with select inputs
 *  *
 * Expected props:
 *     cumulative: Boolean indicating whether to take cumulative or single round values. Defaults to single round
 *
 */
class GraphDraftByPosition extends DataItem {
  constructor(props) {
    super(props);
    this.state = {
      takeCumulative: props.cumulative || false,
      title:
        props.cumulative || false
          ? "Cumulative Draft By Position (Through Round)"
          : "Draft By Position (By Round)",
      teamId: 1,
      roundNo: 1,
      totalTeams: 0,
      totalRounds: 0,
      data: []
    };
  }

  async componentWillMount() {
    await this.get_data(this.state.teamId, this.state.roundNo);
  }

  /**
   * Function to get data for pie chart
   * @param {Number} teamId Team id to filter on
   * @param {Number} round Value of round to filter on OR take cumulative results through
   */
  async get_data(teamId, round) {
    let data = window.localStorage.getItem("draft");
    if (!data) {
      data = await apis.get_all_draft_info(2020);
      //data = await apis.get_all_draft_info_local();
      window.localStorage.setItem("draft", JSON.stringify(data));
    } else {
      data = JSON.parse(data);
    }
    let teamIds = [teamId];
    let teamData = data.reduce((accum, player) => {
      //Skip if null player info (i.e. no one drafted) or not part of the team
      if (player.player == null) {
        return accum;
      } else if (player.teamId !== teamId) {
        //Track total teams
        if (!teamIds.includes(player.teamId)) {
          teamIds.push(player.teamId);
        }
        return accum;
      }
      //Find team and round
      let teamAndRoundIndex = accum.findIndex(data => {
        return data.teamId === player.teamId && data.roundNo === player.roundNo;
      });
      if (teamAndRoundIndex < 0) {
        accum.push({
          teamId: player.teamId,
          roundNo: player.roundNo,
          playerCounts: []
        });
        teamAndRoundIndex = accum.length - 1;
      }
      //Add count of player for team and round
      const pos = {
        1: "QB",
        2: "RB",
        3: "WR",
        4: "TE",
        5: "K",
        16: "D/ST"
      };
      let playerPos;
      //Handles discrepancy between api data (an integer value) and local data (I already converted position)
      if (Number.isInteger(player.player.defaultPositionId)) {
        playerPos = pos[player.player.defaultPositionId];
      } else {
        playerPos = player.player.defaultPositionId;
      }
      let posIndex = accum[teamAndRoundIndex].playerCounts.findIndex(data => {
        return data.position === playerPos;
      });
      if (posIndex < 0) {
        accum[teamAndRoundIndex].playerCounts.push({
          position: playerPos,
          count: 1
        });
      } else {
        accum[teamAndRoundIndex].playerCounts[posIndex].count += 1;
      }
      return accum;
    }, []);
    //Sort so rounds in order
    teamData.sort((a, b) => {
      return a.roundNo - b.roundNo;
    });
    //Cumulative - assumes filtering by teamId
    if (this.state.takeCumulative) {
      for (let i = 0; i < teamData.length - 1; i++) {
        for (let j = 0; j < teamData[i].playerCounts.length; j++) {
          let posIndex = teamData[i + 1].playerCounts.findIndex(nextData => {
            return nextData.position === teamData[i].playerCounts[j].position;
          });
          if (posIndex >= 0) {
            teamData[i + 1].playerCounts[posIndex].count +=
              teamData[i].playerCounts[j].count;
          } else {
            teamData[i + 1].playerCounts.push(teamData[i].playerCounts[j]);
          }
        }
      }
    }
    let countData = teamData[round - 1].playerCounts;
    countData.sort((a, b) => {
      return a.position < b.position ? -1 : 1;
    });
    this.setState({
      data: countData,
      totalTeams: teamIds.length,
      totalRounds: teamData.length,
      loading: false
    });
  }

  /**
   * Helper function to render customized label. Based on work in Recharts examples: http://recharts.org/en-US/examples/PieChartWithCustomizedLabel
   * @param {*} props
   */
  renderLabel(props) {
    return (
      <text
        x={props.x}
        y={props.y}
        fill={props.fill}
        textAnchor={props.x > props.cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${props.name}: ${(props.percent * 100).toFixed(2)}%`}
      </text>
    );
  }

  /**
   * Helpder function to render the graph. Custom label based on Recharts example: http://recharts.org/en-US/examples/PieChartWithCustomizedLabel
   */
  renderGraph() {
    const colorForPosition = {
      QB: "#ff0000",
      RB: "#00ff00",
      WR: "#0000ff",
      TE: "#ffff00",
      K: "#ff00ff",
      "D/ST": "#00ffff"
    };
    if (this.isLoading()) {
      return (
        <Container fluid>
          <Spinner size="lg" color="danger" />
          <h2>Loading data...</h2>
        </Container>
      );
    } else {
      return (
        <ResponsiveContainer id="graph-draft-by-position" height="90%">
          <PieChart width={400} height={400}>
            <Pie
              dataKey="count"
              nameKey="position"
              isAnimationActive={false}
              data={this.state.data}
              labelLine={false}
              label={this.renderLabel}
            >
              {this.state.data.map(entry => (
                <Cell
                  key={entry.position}
                  fill={colorForPosition[entry.position]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    }
  }

  changeTeam(event) {
    let value = Number(event.target.value);
    this.get_data(value, this.state.roundNo);
    this.setState({ teamId: value });
  }

  changeRound(event) {
    let value = Number(event.target.value);
    this.get_data(this.state.teamId, value);
    this.setState({ roundNo: value });
  }

  /**
   * Helper function to create list of options for each team. Needed since number of teams in league may be dynamic
   * TODO: Store number of teams in localStorage somewhere?
   */
  getTeamIdOptions() {
    let output = [];
    for (let i = 1; i < this.state.totalTeams + 1; i++) {
      output.push(<option key={`team${i}`}>{i}</option>);
    }
    return output;
  }

  /**
   * Helper function to create list of options for each possible round. Needed since number of draft rounds in league may be dynamic
   * TODO: Store draft rounds in localStorage somewhere?
   */
  getRoundNoOptions() {
    let output = [];
    for (let i = 1; i < this.state.totalRounds + 1; i++) {
      output.push(<option key={`round${i}`}>{i}</option>);
    }
    return output;
  }

  render() {
    let graph = this.renderGraph();
    let teamOptions = this.getTeamIdOptions();
    let roundOptions = this.getRoundNoOptions();
    let cumOrAv = this.state.takeCumulative ? "cumulative" : "average";
    return (
      <DashboardItem
        title={this.state.title}
        infoDataSplit={80}
        itemInfo={
          <Form>
            <FormGroup>
              <Label for={`teamNoSelect-${cumOrAv}`}>Team</Label>
              <Input
                type="select"
                name="teamId"
                id={`teamNoSelect-${cumOrAv}`}
                onChange={this.changeTeam.bind(this)}
              >
                {teamOptions}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for={`roundNoSelect-${cumOrAv}`}>Round</Label>
              <Input
                type="select"
                name="roundNo"
                id={`roundNoSelect-${cumOrAv}`}
                onChange={this.changeRound.bind(this)}
              >
                {roundOptions}
              </Input>
            </FormGroup>
          </Form>
        }
        itemData={graph}
      ></DashboardItem>
    );
  }
}

export default GraphDraftByPosition;
