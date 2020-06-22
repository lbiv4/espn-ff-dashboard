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
} from "recharts";
import { Container, Spinner } from "reactstrap";
import apis from "../scripts/apis";
import DataItem from "./DataItem.js";
import DashboardItem from "./DashboardItem.js";
import DropdownMultiSelect from "./DropdownMultiSelect.js";

/**
 * Data component class displaying line graph of average or cumulative scores for each team over time. Includes functionality
 * to filter by specific teams
 *
 * Expected props:
 *     average: Boolean indicating whether to take average or cumulative values. Defaults to cumulative
 *
 * Optional props:
 *     title: Optional string title
 *
 */
class GraphCumulativeScores extends DataItem {
  constructor(props) {
    super(props);
    this.state = {
      takeAverage: props.average || false,
      title:
        props.title !== undefined
          ? props.title
          : props.average
          ? "Average Scores Over Time"
          : "Cumulative Scores Over Time",
      data: [],
      lines: <div></div>,
      options: {},
    };
  }

  async componentWillMount() {
    await this.get_data(this.state.takeAverage);
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
    let data = await this.getDataFromStorage("games");
    //Make sure in sorted order so cumulative effect works properly
    data.sort((a, b) => {
      if (a.year - b.year !== 0) {
        return a.year - b.year;
      } else {
        return a.week - b.week;
      }
    });
    //Map data to cumulative scores
    let output = data.reduce((accum, curr) => {
      let matchingIndex = accum.findIndex((elem) => {
        return elem.week === curr.week && elem.year === curr.year;
      });
      //Check if match, add new data point if not
      if (matchingIndex < 0) {
        matchingIndex = accum.length;
        let previous = Object.assign({}, accum[matchingIndex - 1] || {});
        Object.assign(previous, {
          year: curr.year,
          week: curr.week,
        });
        accum.push(previous);
      }
      ["home", "away"].forEach((team) => {
        if (curr.hasOwnProperty(team)) {
          //Create value `teamX` where x=teamId
          accum[matchingIndex][`team${curr[team].teamId}`] =
            curr[team].totalPoints;
          //If data points there, get previous value for cumulative sum
          if (matchingIndex > 0) {
            accum[matchingIndex][`team${curr[team].teamId}`] +=
              accum[matchingIndex - 1][`team${curr[team].teamId}`];
          }
        }
      });
      return accum;
    }, []);
    //If you want average, adjust accordingly
    if (average) {
      for (let i = 0; i < output.length; i++) {
        let id = 1;
        while (output[i].hasOwnProperty(`team${id}`)) {
          output[i][`team${id}`] = Number(
            (output[i][`team${id}`] / (i + 1)).toFixed(2)
          );
          id++;
        }
      }
    }
    //Now create lines so they aren't re-rendered constantly
    let colors = [
      "#ff0000",
      "#00ff00",
      "#0000ff",
      "#ffff00",
      "#ff00ff",
      "#00ffff",
      "#ff8000",
      "#ff5aa7",
      "#a7ff5a",
      "#5af7ff",
      "#ff865a",
      "#da46ff",
    ];
    //Create all lines and options
    let id = 1;
    let lines = [];
    let options = {};
    while (output[0].hasOwnProperty(`team${id}`)) {
      lines.push(
        <Line
          key={`team${id}`}
          type="monotone"
          name={`Team ${id}`}
          dataKey={`team${id}`}
          stroke={colors[id - 1]}
        />
      );
      options[`team${id}`] = {
        name: `Team ${id}`,
        value: `team${id}`,
        active: true,
      };
      id++;
    }
    this.setState({
      options: options,
      lines: lines,
      data: output,
    });
  }

  /**
   * Helper function that outputs how graph should be rendered
   */
  renderGraph() {
    //Check if loading and display spinner as necessary
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
            <Brush dataKey="year" height={30} stroke="#8884d8" />
            {this.state.lines.filter((line) => {
              return this.state.options[line.key].active;
            })}
          </LineChart>
        </ResponsiveContainer>
      );
    }
  }

  setOptions(newData) {
    this.setState({ options: newData });
  }

  render() {
    let title = this.state.title.toLowerCase().split(" ").join("_");
    return (
      <DashboardItem
        title={this.state.title}
        infoDataSplit={90}
        itemInfo={
          <DropdownMultiSelect
            id={title}
            setOptions={this.setOptions.bind(this)}
            getOptions={() => this.state.options}
          ></DropdownMultiSelect>
        }
        itemData={this.renderGraph()}
      ></DashboardItem>
    );
  }
}

export default GraphCumulativeScores;
