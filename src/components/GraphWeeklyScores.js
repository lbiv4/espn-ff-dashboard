import React from "react";
import {
  LineChart,
  Line,
  Brush,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { Container, Form, FormGroup, Input, Label, Spinner } from "reactstrap";
import apis from "../scripts/apis";
import DataItem from "./DataItem.js";
import DashboardItem from "./DashboardItem.js";

/**
 * Data component class displaying line chart of weekly scores for a specific team plus the median and average for that week.
 * Includes ability to filter by team and round with select inputs
 *
 * Expected props: None
 *
 */
class GraphWeeklyScores extends DataItem {
  constructor(props) {
    super(props);
    this.state = {
      teamId: 1,
      data: []
    };
  }

  async componentWillMount() {
    this.get_data(this.state.teamId);
  }

  /**
   * Function to get data for line plot
   *
   * @param {number} teamId Integer representing teamId
   * @return Sets `this.state.data` to array of data objects, where each data point is styled like
   * {
   *   year:      //Year
   *   week:      //Week
   *   teamScore: //Score of team for that year/week
   *   median:    //Median of all scores in league for year/week
   *   average:   //Average of all scores in league for year/week
   * }
   */
  async get_data(teamId) {
    let data = window.localStorage.getItem("games");
    if (!data) {
      data = await apis.get_alltime_schedule(2020);
      //data = await apis.get_alltime_schedule_local();
      window.localStorage.setItem("games", JSON.stringify(data));
    } else {
      data = JSON.parse(data);
    }
    //League statistics
    let stats = data.reduce((accum, curr) => {
      let matchingIndex = accum.findIndex(elem => {
        return elem.week === curr.week && elem.year === curr.year;
      });
      //Check if match, add new data point if not
      if (matchingIndex < 0) {
        matchingIndex = accum.length;
        accum.push({
          year: curr.year,
          week: curr.week,
          teamScore: 0,
          allScores: []
        });
      }
      ["home", "away"].forEach(team => {
        if (curr.hasOwnProperty(team)) {
          //Check if this is the target team's score, updating data accordingly
          if (curr[team].teamId === teamId) {
            accum[matchingIndex].teamScore = curr[team].totalPoints;
          }
          //Regardless, update weekly data for later median/mean calcs
          accum[matchingIndex].allScores.push(curr[team].totalPoints);
        }
      });
      return accum;
    }, []);
    //Now transform data to use median/mode
    let output = stats.map(weekData => {
      weekData.allScores.sort();
      let medianIndex = Math.floor(weekData.allScores.length / 2);
      let median =
        weekData.allScores.length % 2 === 0
          ? (weekData.allScores[medianIndex] +
              weekData.allScores[medianIndex - 1]) /
            2
          : weekData.allScores[medianIndex];
      let average =
        weekData.allScores.reduce((accum, curr) => {
          return accum + curr;
        }, 0) / weekData.allScores.length;
      return {
        year: weekData.year,
        week: weekData.week,
        teamScore: Number(weekData.teamScore.toFixed(2)),
        median: Number(median.toFixed(2)),
        average: Number(average.toFixed(2))
      };
    });
    this.setState({ data: output, totalTeams: stats[0].allScores.length });
  }

  changeTeam(event) {
    let value = Number(event.target.value);
    this.get_data(value, this.state.roundNo);
    this.setState({ teamId: value });
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
   * Helper function to render graph
   */
  renderGraph() {
    if (this.isLoading()) {
      return (
        <Container fluid>
          <Spinner size="lg" color="danger" />
          <h2>Loading data...</h2>
        </Container>
      );
    } else {
      return (
        <ResponsiveContainer height="90%">
          <LineChart
            width={600}
            height={300}
            data={this.state.data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis xAxisId={0} dataKey="week" />
            <XAxis xAxisId={1} dataKey="year" />
            <YAxis type="number" domain={["auto", "auto"]} />
            <Tooltip />
            <Legend verticalAlign="top" wrapperStyle={{ lineHeight: "40px" }} />
            <Brush dataKey="year" height={30} stroke="#8884d8" />
            <Line
              type="monotone"
              dataKey="teamScore"
              stroke="green"
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="median"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="average"
              stroke="red"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }
  }

  render() {
    let graph = this.renderGraph();
    let teamOptions = this.getTeamIdOptions();
    return (
      <DashboardItem
        title="Weekly Scoring"
        infoDataSplit={80}
        itemInfo={
          <Form>
            <FormGroup>
              <Label for="teamNoSelect">Team</Label>
              <Input
                type="select"
                name="teamId"
                id="teamNoSelect"
                onChange={this.changeTeam.bind(this)}
              >
                {teamOptions}
              </Input>
            </FormGroup>
          </Form>
        }
        itemData={graph}
      ></DashboardItem>
    );
  }
}

export default GraphWeeklyScores;
