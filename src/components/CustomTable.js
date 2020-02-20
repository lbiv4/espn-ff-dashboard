import React from "react";
import ReactDOM from "react-dom";
import { Container, Table } from "reactstrap";

class CustomTableHeader {
  constructor(dataName, headerTitle, defaultSortAscending) {
    this.dataName = dataName;
    this.headerName = headerTitle;
    this.sortAscending = defaultSortAscending;
  }
}

class CustomTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customHeaders: props.customHeaders,
      headers: null,
      rows: null,
      data: props.itemData,
      sortInfo: null
    };
  }

  componentWillMount() {
    this.setState({ headers: this.getTableHeader() });
    this.setState({ rows: this.getTableRows() });
  }

  getTableHeader() {
    if (this.props.customHeaders != null) {
      return this.props.customHeaders.map(header => {
        return (
          <th
            className={`table-header header-${header.dataName} ${
              header.sortAscending ? "sort-ascending" : "sort-descending"
            }`}
            id={`header-${header.dataName}`}
            key={header.headerName}
            onClick={this.sortColumn.bind(this)}
          >
            {header.headerName}
          </th>
        );
      });
    } else {
      return Object.keys(this.state.data[0]).map(key => {
        return (
          <th
            id={`header-${key}`}
            className={`table-header header-${key} sort-ascending`}
            key={key}
            onClick={this.sortColumn.bind(this)}
          >
            {key}
          </th>
        );
      });
    }
  }

  getTableRows() {
    return this.state.data.map((dataItem, index) => {
      let row = [];
      if (this.props.customHeaders != null) {
        this.props.customHeaders.forEach(header => {
          row.push(
            <td key={`row${index}-${header.headerName}`}>
              {dataItem[header.dataName]}
            </td>
          );
        });
      } else {
        Object.keys(dataItem).forEach(key => {
          row.push(<td key={`row${index}-${key}`}>{dataItem[key]}</td>);
        });
      }
      return <tr key={index}>{row}</tr>;
    });
  }

  sortColumn(event) {
    let classes = event.target.className.split(" ");
    let dataColumn = classes.find(className => {
      return className.startsWith("header-");
    });
    dataColumn = dataColumn.replace("header-", "");
    let defaultSortAscending = classes.includes("sort-descending")
      ? false
      : true;
    //If sortInfo not set or currently sorted column not target column, sort based on default
    if (
      this.state.sortInfo == null ||
      this.state.sortInfo.column !== dataColumn
    ) {
      this.setState({
        sortInfo: { column: dataColumn, ascending: defaultSortAscending }
      });
      let sorted = this.state.data.sort((a, b) => {
        let sortValue =
          a[dataColumn] < b[dataColumn]
            ? -1
            : a[dataColumn] > b[dataColumn]
            ? 1
            : 0;
        if (defaultSortAscending) {
          return sortValue;
        } else {
          return -1 * sortValue;
        }
      });
      this.setState({ data: sorted });
      //If currently sorted column is target column, flip sort order
    } else if (this.state.sortInfo.column === dataColumn) {
      let newSortOrder = !this.state.sortInfo.ascending;
      this.setState({
        sortInfo: { column: dataColumn, ascending: newSortOrder }
      });
      let sorted = this.state.data.sort((a, b) => {
        let sortValue =
          a[dataColumn] < b[dataColumn]
            ? -1
            : a[dataColumn] > b[dataColumn]
            ? 1
            : 0;
        if (newSortOrder) {
          return sortValue;
        } else {
          return -1 * sortValue;
        }
      });
      console.log(sorted);
      this.setState({ data: sorted });

      //Catch-all that should happen, so log for record and don't sort
    } else {
      console.log("Sorting unable to be processed");
    }
    //Re-render rows based on new data order
    this.setState({ rows: this.getTableRows() });
  }

  render() {
    return (
      <Container fluid={true} className="custom-table">
        <Table striped bordered>
          <thead>
            <tr>{this.state.headers}</tr>
          </thead>
          <tbody>{this.state.rows}</tbody>
        </Table>
      </Container>
    );
  }
}

export { CustomTable, CustomTableHeader };
