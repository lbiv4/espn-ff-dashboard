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
import apis from "../scripts/apis";

class GraphCumulativeScores extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      takeAverage: props.average || false,
      lines: <div></div>
    };
  }

  async componentWillMount() {
    console.log("Will mount");
    this.get_data(this.state.takeAverage);
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
    let data = window.localStorage.getItem("games");
    if (!data) {
      data = await apis.test(2020);
      window.localStorage.setItem("games", JSON.stringify(data));
    } else {
      data = JSON.parse(data);
    }
    console.log("In data");
    //Make sure in sorted order so cumulative effect works properly
    data.sort((a, b) => {
      if (a.year - b.year !== 0) {
        return a.year - b.year;
      } else {
        return a.week - b.week;
      }
    });
    console.log("Done sorting");
    //Map data to cumulative scores
    let output = data.reduce((accum, curr) => {
      let matchingIndex = accum.findIndex(elem => {
        return elem.week === curr.week && elem.year === curr.year;
      });
      //Check if match, add new data point if not
      if (matchingIndex < 0) {
        matchingIndex = accum.length;
        accum.push({
          year: curr.year,
          week: curr.week
        });
      }
      ["home", "away"].forEach(team => {
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
    console.log("Done reducing");

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
      "#da46ff"
    ];
    let id = 1;
    let lines = [];
    while (output[0].hasOwnProperty(`team${id}`)) {
      lines.push(
        <Line type="monotone" dataKey={`team${id}`} stroke={colors[id - 1]} />
      );
      id++;
    }
    console.log("Got lines");
    console.log(lines);
    this.setState({ lines: lines });
    this.setState({ data: output });
  }

  render() {
    return (
      <ResponsiveContainer width="90%" height="90%">
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
          {this.state.lines}
        </LineChart>
      </ResponsiveContainer>
    );
  }
}

export default GraphCumulativeScores;
