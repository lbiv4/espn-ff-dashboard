import React from "react";
import {
  CustomInput,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  FormGroup,
  Input,
  Label,
  Container
} from "reactstrap";

/**
 * Dropdown component that provides multi-select and toggle all functionality. Can be combined with other components like graphs
 *
 * Expected props:
 *     id: Id to uniquely identify props if there are multiple DropdownMultiSelect objects
 *     options: Object mapping data value to a name, the value, and an active state like { "team1": {name: "Team 1", value: "team1", active: false}}. Name is the label, value is the value of the checkbox, and active is checked state
 *     setOptions: Function allowing setting of options object described above
 *
 */
class DropdownMultiSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: props.getOptions(),
      dropdownOpen: false,
      allToggle: true
    };
  }

  toggleDropdown() {
    //Update data from parent
    this.props.setOptions(this.state.options);
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  }

  /**
   * Function to handle changes to individual options. Function assumes to be attached to dropdown item itself - may cause issues otherwise
   * @param {*} event
   */
  changeOption(event) {
    let currentData = this.state.options;
    //Find whether checkbox is checked and what the associated data value is
    let { checked, value } = event.target;
    currentData[value].active = checked;
    //Update local, then parent state
    this.setState({ options: currentData });
    this.props.setOptions(currentData);
  }

  /**
   * Function to handle changes to individual options. Function assumes to be attached to dropdown item itself - may cause issues otherwise
   * @param {*} event
   */
  changeAllOptions(event) {
    let optionInputs = document.getElementsByName(
      `multi-select-option-${this.props.id}`
    );
    console.log(optionInputs);
    let optionValues = this.state.options;
    optionInputs.forEach(input => {
      input.checked = !this.state.allToggle;
    });
    Object.keys(optionValues).forEach(key => {
      optionValues[key].active = !this.state.allToggle;
    });
    //Now change state of options and toggle, then update parent state
    this.setState({ options: optionValues, allToggle: !this.state.allToggle });
    this.props.setOptions(optionValues);
  }

  /**
   * Helper function to get the option checkboxes. Maps each this.props.options to an option input
   */
  getOptions() {
    let options = this.props.getOptions();
    return (
      <FormGroup tag="fieldset">
        {Object.keys(options).map(key => {
          const data = options[key];
          return (
            <FormGroup key={data.name} check>
              <Label check>
                <Input
                  type="checkbox"
                  id={`option-${data.value}-${this.props.id}`}
                  name={`multi-select-option-${this.props.id}`}
                  value={data.value}
                  defaultChecked={data.active}
                  onChange={this.changeOption.bind(this)}
                />{" "}
                {data.name}
              </Label>
            </FormGroup>
          );
        })}
      </FormGroup>
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
          <Container>
            <CustomInput
              type="switch"
              id={`selectAll-${this.props.id}`}
              name={`selectAll-${this.props.id}`}
              label="Toggle All"
              checked={this.state.allToggle}
              onChange={this.changeAllOptions.bind(this)}
            />{" "}
          </Container>
          <DropdownItem divider />
          <Container>{this.getOptions()}</Container>
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default DropdownMultiSelect;
