import React from "react";
import {
  Container,
  Collapse,
  DropdownItem,
  DropdownMenu,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";

class TitleHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openNavbar: false
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
    return this.props.dashboards.map(name => {
      return (
        <NavItem
          key={name.toLowerCase()}
          className={`dashboard-nav-${name.toLowerCase()}`}
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

  render() {
    return (
      <div>
        <div className="title-header">
          <Navbar color="faded" light>
            <NavbarToggler
              onClick={this.toggleNavbar.bind(this)}
              className="mr-2"
            />
            <NavbarBrand href="/" className="mr-auto">
              reactstrap
            </NavbarBrand>
          </Navbar>
          <Collapse isOpen={this.state.openNavbar} className="foo" navbar>
            <Container className="navbar-dropdown">
              <h5>Dashboards</h5>
              <Nav vertical>{this.getDashboardNavs()}</Nav>
            </Container>
          </Collapse>
        </div>
        {/*The following is a placeholder to go below the actual header so the header doesn't cover other info at the top */}
        <div>
          <Navbar color="faded" light>
            <NavbarToggler className="mr-2" />
            <NavbarBrand href="/" className="mr-auto">
              reactstrap
            </NavbarBrand>
          </Navbar>
        </div>
      </div>
    );
  }
}

export default TitleHeader;
