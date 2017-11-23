import React from "react";
import { Link } from "react-router-dom";
import { TextArea, Button, Form, Segment } from "semantic-ui-react";


class DecryptNote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: "",
      payload: "",
    };
  }

  handlePayloadChange = e => {
    this.setState({payload: "/" + e.target.value});
  };

  handleKeyChange = e => {
    this.setState({key: "/" + e.target.value});
  };

  render() {
    return (
      <div>
        <h1 className="ui header center aligned green">Decrypt</h1>
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
            <Button as={Link}
                    to={{
                      pathname: `/decrypt${this.state.payload}${this.state.key}`,
                    }}
                    positive>
              Decrypt
            </Button>
          </Form>
        </Segment>
      </div>
    );
  }
}

export default DecryptNote;
