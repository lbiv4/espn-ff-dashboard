import React from "react";
import { Container } from "reactstrap";

class DashboardItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: props.dashboardItems
    };
  }

  render() {
    return <Container>DashboardItem</Container>;
  }
}

export default DashboardItem;
