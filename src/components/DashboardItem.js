import React from "react";
import {
  Button,
  Container,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "reactstrap";
import { FaExpandArrowsAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

class DashboardItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false
    };
  }

  componentDidMount() {
    /*let container = document.getElementById(this.getIdFromTitle());
    let children = container.childNodes;
    children.forEach(child => {
      if (child.hasChildNodes()) {
        child.style.display = "initial";
      } else {
        child.style.display = "none";
      }
    });*/
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
          >
            {this.props.itemInfo}
          </Container>
          <Container
            className="item-data"
            style={{ width: `${this.props.infoDataSplit}%` }}
          >
            {this.props.itemData}
            <Modal
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
