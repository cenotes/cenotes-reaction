import React from "react";
import Client from "./Client";
import { Accordion, Message, Label, Segment, Dimmer, Loader,
 Icon, Input, Divider, Form } from "semantic-ui-react";

import 'react-datepicker/dist/react-datepicker.css';


class EncryptAction extends React.Component {
  state = { activeIndex: 0 };

  constructor(props) {
    super(props);
    this.state = {
      key: "",
      duressKey: "",
      payload: "",
      showSuccess: false,
      showError: false,
      showEncryptionResults: false,
      showLoader: false,
      successMessageHeader: "",
    };

  }

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

  componentDidMount(){
    if (this.props.location.query){
      this.setState({
        showError: false,
        showSuccess: false,
        showEncryptionResults: false
      });

      const {plaintext, password, no_store, max_visits, expiration_date} = this.props.location.query;
      if (plaintext) {
        this.setState({showLoader: true,  shouldDim: true});
        Client.sendEncryptRequest(
          JSON.stringify({
            plaintext: plaintext,
            key: password,
            max_visits: max_visits,
            no_store: no_store,
            expiration_date: expiration_date
          }),
          this.handleSubmitCb);
      }
    }}

  handleAccordionClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex })
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

  craftDecryptLink() {
    return `${window.location.origin}/decrypt/${this.state.payload}/${this.state.key}`;
  };
  craftDuressLink() {
    return `${window.location.origin}/decrypt/${this.state.payload}/${this.state.duressKey}`;
  };

  handleCloseDim = () => {
    this.setState({showLoader: false});
  };

  render() {
    const { activeIndex } = this.state;
    return (
      <div>
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
        <Dimmer active={this.state.showLoader}
                page
                onClickOutside={this.handleCloseDim}>
          <Loader indeterminate>
            Sending encryption request
          </Loader>
        </Dimmer>
        <Segment hidden={!this.state.showEncryptionResults}>
          <Form>
            <Form.Field>
              <Label>Share privately the following link to decrypt the note</Label>
              <Input
                name="decrypt-link"
                icon={<Icon name='clipboard' link onClick={this.copyInputToClipboard}/>}
                value={this.craftDecryptLink()}
                onClick={this.selectInput}
              />
            </Form.Field>
            <Accordion fluid styled>
              <Accordion.Title
                active={activeIndex === 1}
                index={1}
                onClick={this.handleAccordionClick}>
                <Icon name='dropdown' />
                Advanced sharing
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 1}>
                <Form.Field>
                  <Label>This is the payload (you can share this in public)</Label>
                  <Input name="decrypt-link"
                         value={this.state.payload}
                         icon={
                           <Icon name='clipboard'
                                 link onClick={this.copyInputToClipboard}/>}
                         onClick={this.selectInput}
                  />
                </Form.Field>
                <Form.Field>
                  <Label>This is the key (you should share this in private)</Label>
                  <Input name="decrypt-link"
                         value={this.state.key}
                         icon={
                           <Icon name='clipboard'
                                 link onClick={this.copyInputToClipboard}/>}
                         onClick={this.selectInput}
                  />
                </Form.Field>
              </Accordion.Content>
            </Accordion>
            <div hidden={!this.state.duressKey}>
              <Divider horizontal>OR</Divider>
              <Form.Field>
                <Label>Share the following duress link to delete the note</Label>
                <Input
                  name="decrypt-link"
                  icon={<Icon name='clipboard' link onClick={this.copyInputToClipboard}/>}
                  value={this.craftDuressLink()}
                  onClick={this.selectInput}
                />
              </Form.Field>
              <Accordion fluid styled>
                <Accordion.Title
                  active={activeIndex === 2}
                  index={2}
                  onClick={this.handleAccordionClick}>
                  <Icon name='dropdown' />
                  Advanced sharing
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 2}>
                  <Form.Field>
                    <Label>This is the payload (you can share this in public)</Label>
                    <Input name="decrypt-link"
                           value={this.state.payload}
                           icon={
                             <Icon name='clipboard'
                                   link onClick={this.copyInputToClipboard}/>}
                           onClick={this.selectInput}
                    />
                  </Form.Field>
                  <Form.Field>
                    <Label>This is the duress key (you can share this in public)</Label>
                    <Input name="decrypt-link"
                           value={this.state.duressKey}
                           icon={
                             <Icon name='clipboard'
                                   link onClick={this.copyInputToClipboard}/>}
                           onClick={this.selectInput}
                    />
                  </Form.Field>
                </Accordion.Content>
              </Accordion>
            </div>
          </Form>
        </Segment>
        <p/>
      </div>
    );
  }
}

export default EncryptAction;
