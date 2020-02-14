import React from "react";
import Graph from "./Graph";
import {
  BarChart,
  Bar,
  Brush,
  ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import apis from "../scripts/apis";

class GraphScoreCounts extends Graph {
  constructor(props) {
    super(props);
  }

  async componentWillMount() {
    this.get_data();
  }

  async get_data() {
    let data = window.localStorage.getItem("games");
    if (!data) {
      data = await apis.get_alltime_schedule(2020);
      window.localStorage.setItem("games", JSON.stringify(data));
    } else {
      data = JSON.parse(data);
    }
    let output = data.reduce((accum, curr) => {
      ["home", "away"].forEach(team => {
        if (curr.hasOwnProperty(team)) {
          accum.forEach(score => {
            if (score.score == curr[team].totalPoints) {
              score.count += 1;
              return accum;
            }
          });
          accum.push({ score: curr[team].totalPoints, count: 1 });
        }
      });
      return accum;
    }, []);
    output.sort((a, b) => {
      return a.score - b.score;
    });
    this.setState({ data: output });
  }

  render() {
    return (
      <BarChart
        width={1200}
        height={600}
        data={this.state.data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="score" />
        <YAxis />
        <Tooltip />
        <Legend verticalAlign="top" wrapperStyle={{ lineHeight: "40px" }} />
        <Brush dataKey="score" height={30} stroke="#8884d8" />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    );
  }
}

export default GraphScoreCounts;
