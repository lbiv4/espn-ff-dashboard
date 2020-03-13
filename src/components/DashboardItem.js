import React from "react";
import { Button, Container, Modal, ModalBody, ModalHeader } from "reactstrap";
import { FaExpandArrowsAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

/**
 * Component class meant to hold a data and information/control item. Used to standardize display of dashboard items
 * while allowing some flexibility in contents. Includes a title and option to expand data component into a full-screen modal
 *
 * Required props:
 *     title: Name of item displayed in header section
 *     infoDataSplit: Number from 0 to 100 indicating what percentage of the item width the data section should take up. Can be 100 when no info included
 *     itemData: React Component to be rendered in data section
 *
 * Optional props:
 *      infoData: React Component to be rendered in info section
 */
class DashboardItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false
    };
  }

  getIdFromTitle() {
    return this.props.title.toLowerCase().replace(/ /g, "-");
  }

  toggleModal() {
    this.setState({ modalOpen: !this.state.modalOpen });
  }

  render() {
    return (
      <Container id={this.getIdFromTitle()} className="dashboard-item" fluid>
        <Container fluid className="dashboard-item-header">
          <div>
            <Button size="lg" close onClick={this.toggleModal.bind(this)}>
              <FaExpandArrowsAlt />
            </Button>
          </div>
          <div>
            <h3>{this.props.title}</h3>
          </div>
          <div>
            <Button size="lg" close onClick={this.toggleModal.bind(this)}>
              <MdDelete />
            </Button>
          </div>
        </Container>
        <Container fluid className="dashboard-item-content">
          <Container
            className="item-info"
            style={{ width: `${100 - this.props.infoDataSplit}%` }}
            fluid
          >
            {this.props.itemInfo}
          </Container>
          <Container
            className="item-data"
            style={{ width: `${this.props.infoDataSplit}%` }}
          >
            {this.props.itemData}
            <Modal
              className="item-modal"
              isOpen={this.state.modalOpen}
              toggle={this.toggleModal.bind(this)}
            >
              <ModalHeader toggle={this.toggleModal.bind(this)}>
                {this.props.title}
              </ModalHeader>
              <ModalBody className="dashboard-item-content">
                {this.props.itemData}
              </ModalBody>
            </Modal>
          </Container>
        </Container>
      </Container>
    );
  }
}

export default DashboardItem;
