import React from "react";
import Client from "./Client";
import { Accordion, Checkbox, Message, Label, Segment, Dimmer, Loader,
  TextArea, Icon, Input, Divider, Form } from "semantic-ui-react";

class EncryptNote extends React.Component {
  state = { activeIndex: 0 };

  constructor(props) {
    super(props);
    this.state = {
      password: "",
      plaintext: "",
      expiration:"",
      store: true,
      max_visits: 1,
      showSuccess: false,
      showError: false,
      enableMaxVisits: true,
      showEncryptionResults: false,
      showLoader:false
    };

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleAccordionClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex })
  };

  handleSubmitCb = (err={}, response={}) => {
    this.setState({
      showSuccess: response.success,
      payload: response.payload,
      key: response.key,
      errormessage: response.error || err.message,
      showError: response.error || err.message,
      showEncryptionResults: response.success,
      showLoader: false
    });
  };

  handleFormSubmit = e => {
    this.setState({
      showError: false,
      showSuccess: false,
      showEncryptionResults: false
    });
    const [plaintext, password] = [this.state.plaintext, this.state.password];
    if (plaintext) {
      this.setState({showLoader: true});
      Client.sendEncryptRequest(
        JSON.stringify({
          plaintext: plaintext,
          key: password,
          max_visits: this.state.max_visits,
          no_store: !Boolean(this.state.store)
        }),
        this.handleSubmitCb);
    }
  };

  handleStoreChange = e => {
    const store = !this.state.store;
    if (!store){
      this.setState({enableMaxVisits: false});
      this.setState({max_visits: 0});
    }
    else {
      this.setState({enableMaxVisits: true});
      this.setState({max_visits: 1});
    }
    this.setState({store: store})

  };

  handleMaxVisitsChange = e => {
    if (this.state.enableMaxVisits){
      this.setState({max_visits: Number(e.target.value) || 1});
    }
  };

  handlePayloadChange = e => {
    this.setState({payload: e.target.value});
  };

  handlePasswordChange = e => {
    this.setState({password: e.target.value});
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
    const { activeIndex } = this.state;
    return (
      <div>
        <h1 className="ui header center aligned red">Encrypt</h1>
        <Message
          positive
          hidden={!this.state.showSuccess}
          header="Note was encrypted successfully!"
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
              <label>Note</label>
              <TextArea onChange={this.handlePlaintextChange}
                        rows="1" autoHeight
                        placeholder="Enter your note here"/>
            </Form.Field>
            <Form.Field>
              <label>Password</label>
              <TextArea onChange={this.handlePasswordChange}
                        rows="1" autoHeight
                        placeholder="Enter password here"/>
            </Form.Field>
            <Accordion fluid styled>
              <Accordion.Title
                active={activeIndex === 0}
                index={0}
                onClick={this.handleAccordionClick}>
                <Icon name='dropdown' />
                More options
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 0}>
                <div>
                  Max visits: {this.state.max_visits}
                </div>
                <Input type="range" min={1} max={100}
                       value={this.state.max_visits}
                       disabled={!this.state.enableMaxVisits}
                       onChange={this.handleMaxVisitsChange}/>
                <div>
                  <Checkbox label="Store on server"
                            checked={this.state.store}
                            onChange={this.handleStoreChange}/>
                </div>
                <p>
                  <sub><i>expiration date coming soon</i></sub>
                </p>
              </Accordion.Content>
            </Accordion>
            <p/>
            <div className="ui button red" onClick={this.handleFormSubmit}>
              Encrypt
            </div>
          </Form>
          <Dimmer active={this.state.showLoader}>
            <Loader>Sending encryption request</Loader>
          </Dimmer>
        </Segment>
        <p/>
        <Segment hidden={!this.state.showEncryptionResults}>
          <Form>
            <Form.Field>
              <Label>This is the payload (you can share this in public)</Label>
              <TextArea value={this.state.payload} rows={1} autoHeight readOnly={true}/>
            </Form.Field>
            <Divider horizontal>AND</Divider>
            <Form.Field>
              <Label>This is the key to decrypt (you should share this in private)</Label>
              <TextArea value={this.state.key} rows={1} autoHeight readOnly={true}/>
            </Form.Field>
            <Divider horizontal>OR</Divider>
            <Form.Field>
              <Label>Alternatively you can share privately the following link</Label>
              <p/>
              <Link
                to={`/decrypt/${this.state.payload}/${this.state.key}`}>
                Link to decrypt note
              </Link>
            </Form.Field>
          </Form>
        </Segment>
        <p/>
      </div>
    );
  }
}

export default EncryptNote;
