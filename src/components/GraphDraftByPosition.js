import React from "react";
import {
  Cell,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import apis from "../scripts/apis";

class GraphDraftByPosition extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      takeCumulative: props.cumulative || false,
      teamId: props.teamId,
      roundNo: props.roundNo,
      data: []
    };
  }

  async componentWillMount() {
    console.log("Will mount");
    this.get_data();
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
  async get_data() {
    let data = window.localStorage.getItem("draft");
    if (!data) {
      data = await apis.get_all_draft_info(2020);
      window.localStorage.setItem("draft", JSON.stringify(data));
    } else {
      data = JSON.parse(data);
    }
    console.log("In data");
    let teamData = data.reduce((accum, player) => {
      //Skip if null player info (i.e. no one drafted) or not part of the team
      if (player.player == null || player.teamId !== this.state.teamId) {
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
      const playerPos = pos[player.player.defaultPositionId];
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
    console.log(teamData);
    this.setState({ data: teamData[this.state.roundNo - 1].playerCounts });
  }

  render() {
    //Customization for pie chart inspired by this example: https://jsfiddle.net/alidingling/c9pL8k61/
    const colorForPosition = {
      QB: "#ff0000",
      RB: "#00ff00",
      WR: "#0000ff",
      TE: "#ffff00",
      K: "#ff00ff",
      "D/ST": "#00ffff"
    };
    return (
      <ResponsiveContainer width="90%" height="90%">
        <PieChart width={400} height={400}>
          <Pie
            dataKey="count"
            nameKey="position"
            isAnimationActive={false}
            data={this.state.data}
            label
          >
            {this.state.data.map(entry => (
              <Cell fill={colorForPosition[entry.position]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }
}

export default GraphDraftByPosition;