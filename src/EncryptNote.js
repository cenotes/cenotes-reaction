import React from "react";
import Client from "./Client";
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { Accordion, Checkbox, Message, Label, Segment, Dimmer, Loader,
  TextArea, Icon, Input, Divider, Form } from "semantic-ui-react";

import 'react-datepicker/dist/react-datepicker.css';


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
      showLoader: false,
      successMessageHeader: "",
      expirationDate: moment().add(2,'week'),
      expirationDatePlaceHolder: "Note does not expire",
      expirationDateEnabled: true,
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
      duressKey: response.duress_key,
      errormessage: response.error || err.message,
      showError: response.error || err.message,
      showEncryptionResults: response.success,
      showLoader: false,
      successMessageHeader: "Note was encrypted successfully"
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
          no_store: !Boolean(this.state.store),
          expiration_date: this.state.expirationDate || ""
        }),
        this.handleSubmitCb);
    }
  };

  handleStoreChange = e => {
    const store = !this.state.store;
    if (!store){
      this.setState({
        enableMaxVisits: false,
        max_visits: 0,
        expirationDateEnabled: false,
        expirationDate: null,
      });
    }
    else {
      this.setState({enableMaxVisits: true,
        expirationDate: moment().add(2,'week'),
        expirationDateEnabled: true,
        max_visits: 1
      });
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

  copyInputToClipboard = e => {
    const icon = e.target;
    const field = icon.parentElement;
    const decrypt_link = field.querySelector('[name="decrypt-link"]');
    this.selectInput({target: decrypt_link});
    document.execCommand("copy");
    this.setState({successMessageHeader: "Link copied successfully"});
  };

  selectInput = e => {
    const decrypt_link = e.target;
    decrypt_link.select();
  };

  handleExpirationDateChange = date => {
    this.setState({expirationDate: date});
  };

  render() {
    const { activeIndex } = this.state;
    return (
      <div>
        <h1 className="ui header center aligned red">Encrypt</h1>
        <Message
          positive
          hidden={!this.state.showSuccess}
          header={this.state.successMessageHeader}
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
                <DatePicker
                  selected={this.state.expirationDate}
                  onChange={this.handleExpirationDateChange}
                  placeholderText={this.state.expirationDatePlaceHolder}
                  isClearable={true}
                  disabled={!this.state.expirationDateEnabled}
                  dateFormat="DD/MM/YYYY"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                />
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
            <div hidden={!this.state.duressKey}>
              <Divider horizontal>AND</Divider>
              <Form.Field>
                <Label>This is the duress key to signal deletion of note</Label>
                <TextArea value={this.state.duressKey} rows={1} autoHeight readOnly={true}/>
              </Form.Field>
            </div>
            <Divider horizontal>OR</Divider>
            <Form.Field>
              <Label>Alternatively you can share privately the following link to decrypt the note</Label>
              <Input
                name="decrypt-link"
                icon={<Icon name='clipboard' link onClick={this.copyInputToClipboard}/>}
                value={`${window.location.origin}/decrypt/${this.state.payload}/${this.state.key}`}
                onClick={this.selectInput}
              />
            </Form.Field>
            <div hidden={!this.state.duressKey}>
              <Divider horizontal>AND</Divider>
              <Form.Field>
                <Label>You can share the following link to delete the note</Label>
                <Input
                  name="decrypt-link"
                  icon={<Icon name='clipboard' link onClick={this.copyInputToClipboard}/>}
                  value={`${window.location.origin}/decrypt/${this.state.payload}/${this.state.duressKey}`}
                  onClick={this.selectInput}
                />
              </Form.Field>
            </div>
          </Form>
        </Segment>
        <p/>
      </div>
    );
  }
}

export default EncryptNote;
