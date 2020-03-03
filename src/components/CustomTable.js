import React from "react";
import ReactDOM from "react-dom";
import { Container, Table } from "reactstrap";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

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
    this.setState({ rows: this.getTableRows(this.state.data) });
  }

  /**
   * Helper function to create headers for table based on whether custom headers exist.
   * If custom headers don't exist, looks at first data item keys for headings
   */
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
            {header.headerName}{" "}
            <a>
              <FaSort className={`sort-icon-${header.dataName}`} />
            </a>
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
            {key} <FaSort className={`sort-icon-${key}`} />
          </th>
        );
      });
    }
  }

  /**
   * Helper function to generate the table rows. Takes input data and creates a row from each data object,
   * accounting for order of headers if customHeaders exist
   * @param {Object[]} data List of data objects to map into rows
   */
  getTableRows(data) {
    return data.map((dataItem, index) => {
      let cells = [];
      //If there are custom headers, create cells in order of headers
      if (this.props.customHeaders != null) {
        this.props.customHeaders.forEach(header => {
          cells.push(
            <td key={`row${index}-${header.headerName}`}>
              {dataItem[header.dataName]}
            </td>
          );
        });
        //If no customer headers, fill cells in order of data keys
      } else {
        Object.keys(dataItem).forEach(key => {
          cells.push(<td key={`row${index}-${key}`}>{dataItem[key]}</td>);
        });
      }
      return <tr key={index}>{cells}</tr>;
    });
  }

  /**
   * Handler for clicking a column header to sort the column. Columns are expected to have at least a class
   * like `header-foo` for a column for a data item named `foo` and optionally a class to determine default sort order
   * (styled `sort-ascending` or `sort-descending`)
   * @param {SyntheticEvent} event Event handler used to find column to sort.
   */
  sortColumn(event) {
    let classes = event.currentTarget.className.split(" ");
    let dataColumn = classes.find(className => {
      return className.startsWith("header-");
    });
    dataColumn = dataColumn.replace("header-", "");
    let defaultSortAscending = classes.includes("sort-descending")
      ? false
      : true;
    let sortedData;
    let newSortOrder;
    //If sortInfo not set or currently sorted column not target column, sort based on default
    if (
      this.state.sortInfo == null ||
      this.state.sortInfo.column !== dataColumn
    ) {
      newSortOrder = defaultSortAscending;
      this.setState({
        sortInfo: { column: dataColumn, ascending: defaultSortAscending }
      });
      sortedData = this.state.data.sort((a, b) => {
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
      this.setState({ data: sortedData });
      //If currently sorted column is target column, flip sort order
    } else if (this.state.sortInfo.column === dataColumn) {
      newSortOrder = !this.state.sortInfo.ascending;
      this.setState({
        sortInfo: { column: dataColumn, ascending: newSortOrder }
      });
      sortedData = this.state.data.sort((a, b) => {
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
      this.setState({ data: sortedData });
      //Catch-all that should happen, so log for record and don't sort
    } else {
      console.log("Sorting unable to be processed");
      return;
    }
    //Change sort styling
    this.state.headers.forEach(header => {
      let h = document.getElementById(header.props.id);
      let iconDiv = h.childNodes[h.childNodes.length - 1];
      //If header of sort, change icon to up or down depending on sort order
      if (header.props.id === event.currentTarget.id) {
        if (newSortOrder) {
          ReactDOM.render(
            <FaSortUp className={`sort-icon-${header.dataName}`} />,
            iconDiv
          );
        } else {
          ReactDOM.render(
            <FaSortDown className={`sort-icon-${header.dataName}`} />,
            iconDiv
          );
        }
        //Otherwise, replace icon with grayscale default to show not sorted
      } else {
        ReactDOM.render(
          <FaSort
            className={`sort-icon-${header.dataName}`}
            style={{ filter: "grayscale(50%)" }}
          />,
          iconDiv
        );
      }
    });
    //Re-render rows based on newly sorted data
    this.setState({ rows: this.getTableRows(sortedData) });
  }

  render() {
    return (
      <Container fluid={true} className="custom-table">
        <Table striped bordered height="100%">
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
