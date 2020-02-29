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
 * Expected props:
 *     options: Object mapping data value to a name, the value, and an active state like { "team1": {name: "Team 1", value: "team1", active: false}}
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

  async componentWillMount() {
    console.log("Will mount");
  }

  toggleDropdown() {
    //Update data from parent
    this.props.setOptions(this.state.options);
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
    let optionInputs = document.getElementsByName("multiSelectOption");
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
                  id={`option${data.value}`}
                  name="multiSelectOption"
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
              id="selectAll"
              name="selectAll"
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
