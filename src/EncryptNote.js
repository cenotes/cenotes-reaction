import React from "react";
import { Link } from "react-router-dom";
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { Accordion, Checkbox, Message, Button, Segment, TextArea, Icon, Input,
  Form } from "semantic-ui-react";

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
      enableMaxVisits: true,
      expirationDate: moment().add(2,'week'),
      expirationDatePlaceHolder: "Note does not expire",
      expirationDateEnabled: true,
    };

  }

  handleAccordionClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex })
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

  handlePasswordChange = e => {
    this.setState({password: e.target.value});
  };

  handlePlaintextChange = e => {
    this.setState({plaintext: e.target.value});
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
              <label>Password to generate key</label>
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
            <Link
              to={{pathname: "/encrypt/go/",
                query: {
                  plaintext: this.state.plaintext,
                  password: this.state.password,
                  max_visits: this.state.max_visits,
                  no_store: !Boolean(this.state.store),
                  expiration_date: this.state.expirationDate || ""}
              }}>
              <Button negative>
                Encrypt
              </Button>
            </Link>
          </Form>
        </Segment>
        <p/>
      </div>
    );
  }
}

export default EncryptNote;
