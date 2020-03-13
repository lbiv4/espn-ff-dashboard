import React from "react";
import { Container, Row, Col } from "reactstrap";

import GraphWeeklyScores from "./GraphWeeklyScores.js";
import GraphCumulativeScores from "./GraphCumulativeScores.js";
import GraphDraftByPosition from "./GraphDraftByPosition.js";
import GraphScoreCounts from "./GraphScoreCounts.js";
import TableMultiDraftedPlayer from "./TableMultiDraftedPlayers.js";
import TableScoringHighlights from "./TableScoringHighlights.js";

/**
 * Class representing a dashboard, or grid of dashboard items. Uses bootstrap grid.
 *
 * Required props:
 *     dashboardItems: Array of names for dashboard items to render. See `get_dashboard_item()` for mapping of names to React objects
 *     title: Title of the graph - ties into which dashboard items are included
 */
class Dashboard extends React.Component {
  /**
   * Helper function mapping a name for a dashboard item to the component that should be rendered
   * @param {*} name String representing name of dashboard to render
   * @returns React object corresponding to name or an empty div if no mapping exists
   */
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
      multi_drafted_players: (
        <TableMultiDraftedPlayer></TableMultiDraftedPlayer>
      ),
      scoring_highlights: <TableScoringHighlights></TableScoringHighlights>
    };
    return mapping.hasOwnProperty(name) ? mapping[name] : <div></div>;
  }

  /**
   * Helper function to map names in this.props.dashboardItems to components to render.
   * TODO: Currently making the first item large and the rest smaller, may tweak later
   * @returns Mapping/array of components to render
   */
  get_items() {
    return this.props.dashboardItems.map((name, index) => {
      /*if (index === 0) {
        return (
          <Col key={name} xs="12">
            {this.get_dashboard_item(name)}
          </Col>
        );
      } else {*/
      return (
        <Col key={name} md="12" lg="6">
          {this.get_dashboard_item(name)}
        </Col>
      );
      //}
    });
  }

  render() {
    return (
      <Container fluid>
        <Row id={`dashboard-${this.props.title}`} className="dashboard">
          {this.get_items()}
        </Row>
      </Container>
    );
  }
}

export default Dashboard;
