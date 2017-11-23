import React from "react";
import Client from "./Client";
import { Message, Container, Segment, Dimmer,
  Loader } from "semantic-ui-react";

class DecryptAction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: "",
      payload: "",
      plaintext: "",
      errormessage:"",
      showError: false,
      showPlaintext: false,
      showSuccess: false,
      showLoader: false
    };

  }

  componentDidMount(){
    const {payload, key} = this.props.match.params;
    this.decrypt(payload, key)
  }


  handleSubmitCb = (err={}, response={}) => {
    this.setState({
      showSuccess: response.success,
      plaintext: response.plaintext,
      errormessage: response.error || err.message,
      showPlaintext: response.plaintext,
      showError: response.error || err.message
    });
  };

  decrypt = (payload="", key="") => {
    Client.sendDecryptionRequest(JSON.stringify({
      payload: payload,
      key: key,
    }), this.handleSubmitCb);
  };

  handleCloseError = e => {
    this.setState({showError: false});
  };

  handleCloseSuccess = e => {
    this.setState({showSuccess: false});
  };

  render() {
    return (
      <div>
        <Message
          positive
          hidden={!this.state.showSuccess}
          header="Note was decrypted successfully!"
          onDismiss={this.handleCloseSuccess}
        />
        <Message
          negative
          hidden={!this.state.showError}
          onDismiss={this.handleCloseError}
          header="There were some errors with your submission"
          content={this.state.errormessage}
        />
        <p/>
        <Dimmer active={this.state.showLoader}>
          <Loader>Sending decryption request</Loader>
        </Dimmer>
        <p/>
        <Segment hidden={!this.state.showPlaintext}>
          <Container
            hidden={!this.state.showPlaintext}>
            {this.state.plaintext}</Container>
        </Segment>
        <p/>
      </div>
    );
  }
}

export default DecryptAction;
