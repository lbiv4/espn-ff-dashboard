import React from "react";
import { Container } from "reactstrap";

class DashboardItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: props.itemInfo,
      data: props.itemData
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
