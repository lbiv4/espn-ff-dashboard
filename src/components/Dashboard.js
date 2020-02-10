import React from "react";
import { Container } from "reactstrap";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: props.dashboardItems
    };
  }

  render() {
    return <Container className="dashboard">{this.state.items};</Container>;
  }
}

export default Dashboard;
