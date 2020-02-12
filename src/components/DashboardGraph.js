import React from "react";
import { Container } from "reactstrap";
import DashboardItem from "./DashboardItem.js";

class DashboardItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title
    };
  }

  render() {
    return (
      <Container className="dashboard-item">
        <Container className="item-info">{this.state.info}</Container>
        <Container className="item-data">{this.state.data}</Container>
      </Container>
    );
  }
}

export default DashboardItem;
