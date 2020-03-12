import React from "react";
import Graph from "./Graph";
import {
  BarChart,
  Bar,
  Brush,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { Container, Spinner, Form, FormGroup, Input, Label } from "reactstrap";
import apis from "../scripts/apis";
import DataItem from "./DataItem.js";
import DashboardItem from "./DashboardItem.js";
import DropdownMultiSelect from "./DropdownMultiSelect.js";

class GraphScoreCounts extends DataItem {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  async componentWillMount() {
    this.get_data();
  }

  async get_data() {
    let data = window.localStorage.getItem("games");
    if (!data) {
      //data = await apis.get_alltime_schedule(2020);
      data = await apis.get_alltime_schedule_local();
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
        <ResponsiveContainer id="graph-score-counts" height="90%">
          <BarChart
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
        </ResponsiveContainer>
      );
    }
  }

  setOptions(newData) {
    this.setState({ options: newData });
  }

  render() {
    let graph = this.renderGraph();
    return (
      <DashboardItem
        title="All-Time Score Counts"
        infoDataSplit={100}
        itemData={graph}
      ></DashboardItem>
    );
  }
}

export default GraphScoreCounts;
