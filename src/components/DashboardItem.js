import React from "react";
import ReactDOM from "react-dom";
import {
  Button,
  Container,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "reactstrap";

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
    console.log("Modal");
    console.log(this.state.data);
  }

  render() {
    return (
      <Container id={this.getIdFromTitle()} className="dashboard-item">
        <h3>{this.props.title}</h3>
        <Container fluid className="dashboard-item-content">
          <Container
            className="item-info"
            style={{ width: `${100 - this.props.infoDataSplit}%` }}
          >
            <Button color="primary" onClick={this.toggleModal.bind(this)}>
              Expand
            </Button>
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
              <ModalBody>{this.props.itemData}</ModalBody>
            </Modal>
          </Container>
        </Container>
      </Container>
    );
  }
}

export default DashboardItem;
