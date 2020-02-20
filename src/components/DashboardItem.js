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
      modalOpen: false,
      info: props.itemInfo,
      data: props.itemData
    };
  }

  toggleModal() {
    this.setState({ modalOpen: !this.state.modalOpen });
  }

  render() {
    return (
      <Container className="dashboard-item">
        <Container className="item-info">{this.state.info}</Container>
        <Container className="item-data">
          <Button color="primary" onClick={this.toggleModal.bind(this)}>
            Expand
          </Button>
          {this.props.dataItem}
          <Modal
            isOpen={this.state.modalOpen}
            toggle={this.toggleModal.bind(this)}
          >
            <ModalHeader toggle={this.toggleModal.bind(this)}>
              Modal title
            </ModalHeader>
            <ModalBody>{this.props.dataItem}</ModalBody>
          </Modal>
        </Container>
      </Container>
    );
  }
}

export default DashboardItem;
