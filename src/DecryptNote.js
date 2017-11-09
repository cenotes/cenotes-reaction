import React from "react";
import Client from "./Client";
import { TextArea, Message, Form, Segment, Dimmer,
  Loader } from "semantic-ui-react";

class DecryptNote extends React.Component {
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

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
    const {payload, key} = this.props.match.params;
    if (payload && key){
      this.decrypt(payload, key)
    }
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

  handleSubmit = e => {
    this.setState({
      showError: false,
      showSuccess: false,
      showPlaintext: false
    });
    const [payload, key] = [this.state.payload, this.state.key];
    this.decrypt(payload, key)
  };

  decrypt = (payload="", key="") => {
    if (payload && key) {
      Client.sendDecryptionRequest(JSON.stringify({
        payload: payload,
        key: key,
      }), this.handleSubmitCb);
    }
  };

  handlePayloadChange = e => {
    this.setState({payload: e.target.value});
  };

  handleKeyChange = e => {
    this.setState({key: e.target.value});
  };

  handlePlaintextChange = e => {
    this.setState({plaintext: e.target.value});
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
        <h1 className="ui header center aligned green">Decrypt</h1>
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
        <Segment>
          <Form>
            <Form.Field>
              <label>Payload</label>
              <TextArea onChange={this.handlePayloadChange}
                        autoHeight
                        rows={1}
                        placeholder="Enter the payload here"/>
            </Form.Field>
            <Form.Field>
              <label>Key</label>
              <TextArea onChange={this.handleKeyChange}
                        rows={1}
                        autoHeight
                        placeholder="Enter key here"/>
            </Form.Field>
            <div className="ui button green"
                 onClick={this.handleSubmit}>Decrypt</div>
          </Form>
          <Dimmer active={this.state.showLoader}>
            <Loader>Sending decryption request</Loader>
          </Dimmer>
        </Segment>
        <p/>
        <Segment hidden={!this.state.showPlaintext}>
          <Form>
            <Form.Field hidden={!this.state.showPlaintext}>
              <label>Clear text</label>
              <TextArea value={this.state.plaintext}
                        onChange={this.handlePlaintextChange}
                        rows={1}
                        autoHeight
                        readOnly={true}/>
            </Form.Field>
          </Form>
        </Segment>
        <p/>
      </div>
    );
  }
}

export default DecryptNote;
