import React from "react";

/**
 * Base class used by data item components. Used to help check for loading when API calls still in progress
 */
class DataItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  isLoading() {
    return this.state.data === undefined || this.state.data.length === 0;
  }

  render() {
    return <div></div>;
  }
}

export default DataItem;
