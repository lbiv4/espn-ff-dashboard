import React from "react";
import { Container, Row, Col } from "reactstrap";

import GraphWeeklyScores from "./GraphWeeklyScores.js";
import GraphCumulativeScores from "./GraphCumulativeScores.js";
import GraphDraftByPosition from "./GraphDraftByPosition.js";
import GraphScoreCounts from "./GraphScoreCounts.js";
import TableMultiDraftedPlayer from "./TableMultiDraftedPlayers.js";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.default_items = {
      scores: [
        "average_scores",
        "cumulative_scores",
        "weekly_scores",
        "score_counts"
      ],
      draft: [
        "draft_by_position_independent",
        "draft_by_position_cumulative",
        "multi_drafted_players"
      ]
    };
  }

  get_dashboard_item(name) {
    const mapping = {
      cumulative_scores: (
        <GraphCumulativeScores average={false}></GraphCumulativeScores>
      ),
      average_scores: (
        <GraphCumulativeScores average={true}></GraphCumulativeScores>
      ),
      weekly_scores: <GraphWeeklyScores></GraphWeeklyScores>,
      score_counts: <GraphScoreCounts>,</GraphScoreCounts>,
      draft_by_position_independent: (
        <GraphDraftByPosition></GraphDraftByPosition>
      ),
      draft_by_position_cumulative: (
        <GraphDraftByPosition cumulative={true}></GraphDraftByPosition>
      ),

      multi_drafted_players: <TableMultiDraftedPlayer></TableMultiDraftedPlayer>
    };
    return mapping.hasOwnProperty(name) ? mapping[name] : <div></div>;
  }

  get_items(label) {
    let data = window.localStorage.getItem("dashboards");
    if (!data) {
      window.localStorage.setItem(
        "dashboards",
        JSON.stringify(this.default_items)
      );
      data = this.default_items;
    } else {
      data = JSON.parse(data);
    }
    return data[label].map((name, index) => {
      if (index === 0) {
        return <Col xs="12">{this.get_dashboard_item(name)}</Col>;
      } else {
        return (
          <Col xs="12" md="6">
            {this.get_dashboard_item(name)}
          </Col>
        );
      }
    });
  }

  render() {
    return (
      <Container fluid>
        <Row
          id={`dashboard-${this.props.title.toLowerCase()}`}
          className="dashboard"
        >
          {this.get_items(this.props.title.toLowerCase())}
        </Row>
      </Container>
    );
  }
}

export default Dashboard;
