import React from "react";

class DataItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  isLoading() {
    return this.state.data == undefined || this.state.data.length == 0;
  }

  render() {
    return <div></div>;
  }
}

export default DataItem;
