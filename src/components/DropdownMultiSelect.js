import React from "react";
import {
  CustomInput,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
  Label
} from "reactstrap";

class DropdownMultiSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      allToggle: true
    };
  }

  async componentWillMount() {
    console.log("Will mount");
  }

  toggleDropdown() {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  }

  findFirstDescendant(ancestor, tagName) {
    let queue = [ancestor];
    while (queue.length > 0) {
      let next = queue.shift();
      if (next.tagName === tagName) {
        return next;
      } else {
        next.childNodes.forEach(child => {
          queue.push(child);
        });
      }
    }
    return null;
  }

  /**
   * Function to handle changes to individual options. Function assumes to be attached to dropdown item itself - may cause issues otherwise
   * @param {*} event
   */
  changeOption(event) {
    let currentData = this.props.getData();
    let input = this.findFirstDescendant(event.target, "INPUT");
    let checkboxClicked = input === event.target;
    if (input) {
      //If checkbox clicked, action takes place. Otherwise, need to do clicking action
      if (!checkboxClicked) {
        input.checked = !input.checked;
      }
      //Find whether checkbox is checked and what the associated data value is
      let { checked, value } = input;
      //Remove data value from data set and only readd if checkbox is checked
      let newData = currentData.filter(v => {
        return v !== value;
      });
      if (checked) {
        newData.push(value);
      }
      //Update data set
      this.props.setData(newData);
    }
  }

  /**
   * Function to handle changes to individual options. Function assumes to be attached to dropdown item itself - may cause issues otherwise
   * @param {*} event
   */
  changeAllOptions(event) {
    //TODO: Add title to account for different instances of this class (and thus duplicate multiSelectOptions)?
    let optionInputs = document.getElementsByName("multiSelectOption");
    let allInputs = [];
    optionInputs.forEach(input => {
      input.checked = !this.state.allToggle;
      allInputs.push(input.value);
    });
    //If toggle is currently set, switching to all off, so set data to empty array.
    if (this.state.allToggle) {
      this.props.setData([]);
      //Otherwise toggle is currently off and going to on, so set data to all inputs
    } else {
      this.props.setData(allInputs);
    }
    //Now change state of toggle
    this.setState({ allToggle: !this.state.allToggle });
  }

  getOptions() {
    let currentChecked = this.props.getData();
    return (
      this.props.options
        //Identify whether current data indicates that it should be checked by whether data includes value
        .map(data => {
          let checked = currentChecked.includes(data.value);
          return { data: data, checked: checked };
        })
        //Now create element
        .map(dataAndChecked => {
          return (
            <DropdownItem onClick={this.changeOption.bind(this)}>
              <Label check>
                <Input
                  type="checkbox"
                  id={`option${dataAndChecked.data.value}`}
                  key={dataAndChecked.data.name}
                  name="multiSelectOption"
                  value={dataAndChecked.data.value}
                  defaultChecked={dataAndChecked.checked}
                />{" "}
                {dataAndChecked.data.name}
              </Label>
            </DropdownItem>
          );
        })
    );
  }

  render() {
    return (
      <Dropdown
        isOpen={this.state.dropdownOpen}
        toggle={this.toggleDropdown.bind(this)}
      >
        <DropdownToggle caret>Filter</DropdownToggle>
        <DropdownMenu>
          <DropdownItem header>Select options</DropdownItem>
          <DropdownItem onClick={this.changeAllOptions.bind(this)}>
            <div>
              <CustomInput
                type="switch"
                id="selectAll"
                name="selectAll"
                label="Toggle All"
                checked={this.state.allToggle}
              />{" "}
            </div>
          </DropdownItem>
          <DropdownItem divider />
          {this.getOptions()}
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default DropdownMultiSelect;
