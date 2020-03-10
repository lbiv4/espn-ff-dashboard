import React from "react";
import {
  Button,
  Col,
  Container,
  Collapse,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";
import { MdSettings, MdAdd } from "react-icons/md";

class TitleHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openNavbar: false,
      createModalOpen: false
    };
  }

  toggleNavbar() {
    let sidebarDiv = document.querySelector(".sidebar");
    if (!this.state.openNavbar) {
      sidebarDiv.className = sidebarDiv.className + " sidebar-open";
    } else {
      sidebarDiv.className = sidebarDiv.className.replace(" sidebar-open", "");
    }
    this.setState({ openNavbar: !this.state.openNavbar });
  }

  getDashboardNavs() {
    return Object.keys(this.props.dashboards).map(name => {
      return (
        <NavItem
          key={name}
          className={`dashboard-nav dashboard-nav-${name}`}
          onClick={this.changeDashboard.bind(this)}
        >
          <NavLink>{name}</NavLink>
        </NavItem>
      );
    });
  }

  changeDashboard(event) {
    event.preventDefault();
    let name = event.currentTarget.className.split(" ").filter(c => {
      return c.startsWith("dashboard-nav-");
    });
    if (name.length == 1) {
      name = name[0].replace("dashboard-nav-", "");
      this.props.setDashboard(name);
    }
  }

  toggleCreateModal() {
    this.setState({ createModalOpen: !this.state.createModalOpen });
  }

  getDashboardItems() {
    let dashboardItems = [];
    for (let key in this.props.dashboards) {
      this.props.dashboards[key].forEach(item => {
        if (!dashboardItems.includes(item)) {
          dashboardItems.push(item);
        }
      });
    }
    dashboardItems.sort();
    return dashboardItems;
  }

  validateNewDashboard(event) {
    event.preventDefault();
    let title = document.getElementById("new-dashboard-title");
    if (title.value === undefined || title.value.trim() === "") {
      console.log("Need a title");
    } else if (
      Object.keys(this.props.dashboards).includes(
        title.value.trim().toLowerCase()
      )
    ) {
      console.log(`Dashboard with name like ${title.value} already created`);
    } else {
      let itemValues = [];
      let itemNodes = document.querySelectorAll(
        `input[name=dashboardItemOption]`
      );
      itemNodes.forEach(item => {
        console.log(`${item.value}: ${item.checked}`);
        if (item.checked) {
          itemValues.push(item.value);
        }
      });
      console.log(itemValues);
    }
  }

  createModelForm() {
    return (
      <Form onSubmit={this.validateNewDashboard.bind(this)}>
        <FormGroup key="title">
          <Label for="new-dashboard-title">Dashboard Title</Label>
          <Input type="text" id="new-dashboard-title" name="title" />
        </FormGroup>
        <Label for="new-dashboard-items">Select Dashboard Items:</Label>
        <FormGroup id="new-dashboard-items" key="items" tag="fieldset" row>
          <Col sm={10}>
            {this.getDashboardItems().map(item => {
              return (
                <FormGroup key={item} check>
                  <Label check>
                    <Input
                      key={item}
                      type="checkbox"
                      name="dashboardItemOption"
                      value={item}
                      defaultChecked={false}
                    />{" "}
                    {item.toUpperCase()}
                  </Label>
                </FormGroup>
              );
            })}
          </Col>
        </FormGroup>
        <Button>Create Dashboard</Button>
      </Form>
    );
  }

  //#8b0000, #E5E7E6, #B7B5B3, #141301, #8C7A6B
  //#8b0000, #111D4A, #1E1E24, #FFF8F0, #FFCF99

  render() {
    return (
      <div>
        <div className="title-header">
          <Navbar color="faded" light>
            <NavbarToggler
              onClick={this.toggleNavbar.bind(this)}
              className="header-button"
            />
            <h1 id="title">Fantasy Football Infoboard</h1>
            <NavbarToggler
              onClick={this.toggleNavbar.bind(this)}
              className="mr-3 header-button"
            >
              <Button size="lg" className="header-button" close>
                <MdSettings />
              </Button>
            </NavbarToggler>
          </Navbar>
          <Collapse isOpen={this.state.openNavbar} className="foo" navbar>
            <Container className="navbar-dropdown">
              <h5>Dashboards</h5>
              <Nav vertical>{this.getDashboardNavs()}</Nav>
              <hr />
              <h5 onClick={this.toggleCreateModal.bind(this)}>
                Create Dashboard
                <Button size="lg" className="header-button" close>
                  <MdAdd />
                </Button>
              </h5>
              <Modal
                isOpen={this.state.createModalOpen}
                toggle={this.toggleCreateModal.bind(this)}
              >
                <ModalHeader toggle={this.toggleCreateModal.bind(this)}>
                  Create a Dashboard
                </ModalHeader>
                <ModalBody className="create-dashboard-modal">
                  {this.createModelForm()}
                </ModalBody>
              </Modal>
            </Container>
          </Collapse>
        </div>
        {/*The following is a placeholder to go below the actual header so the header doesn't cover other info at the top */}
        <div>
          <Navbar color="faded" light>
            <NavbarToggler />
            <NavbarBrand href="/" className="mr-auto">
              Title
            </NavbarBrand>
          </Navbar>
        </div>
      </div>
    );
  }
}

export default TitleHeader;
