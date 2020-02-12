import React from "react";
import {
  LineChart,
  Line,
  Brush,
  ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import apis from "../scripts/apis";

class GraphWeeklyScores extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentWillMount() {
    this.get_data(1);
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
      data = await apis.test(2020);
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
            if (curr.year === 2016) {
              console.log(curr);
            }
            accum[matchingIndex].teamScore = curr[team].totalPoints;
          }
          //Regardless, update weekly data for later median/mean calcs
          accum[matchingIndex].allScores.push(curr[team].totalPoints);
        }
      });
      return accum;
    }, []);
    console.log(stats);
    //Now transform data to use median/mode
    let output = stats.map(weekData => {
      weekData.allScores.sort();
      let medianIndex = Math.floor(weekData.allScores.length / 2);
      let median =
        weekData.allScores.length % 2 == 0
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
    console.log("Setting");
    this.setState({ data: output });
  }

  render() {
    return (
      <LineChart
        width={600}
        height={300}
        data={this.state.data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis xAxisId={0} dataKey="week" />
        <XAxis xAxisId={1} dataKey="year" />
        <YAxis />
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
    );
  }
}

export default GraphWeeklyScores;
