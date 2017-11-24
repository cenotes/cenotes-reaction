import React, { Component } from "react";
import { Link, Switch, Route } from "react-router-dom";
import DecryptNote from "./DecryptNote";
import EncryptNote from "./EncryptNote";
import DecryptAction from "./DecryptAction";
import EncryptAction from "./EncryptAction";
import { Header, Icon } from 'semantic-ui-react'
import { version } from "../package.json";


const Main = () => (
  <main>
    <Switch>
      <Route exact path="/decrypt/:payload/:key" component={DecryptAction}/>
      <Route path="/decrypt/" component={DecryptNote}/>
      <Route exact path='/encrypt/' component={EncryptNote}/>
      <Route exact path='/encrypt/go/' component={EncryptAction} />
    </Switch>
  </main>
);

const CenotesHeader = () => (
  <header>
    <Header as="h2" icon textAlign="center">
      <Icon name="privacy"/>
      <Header.Content>
        Welcome to CENotes

        <Header.Subheader>
          version: {version}
        </Header.Subheader>

      </Header.Content>
    </Header>
    <div className="ui center aligned header tiny">
      <a target="_blank" rel="noopener noreferrer"
         href='https://cenotes.readthedocs.io/en/latest/readme.html#what-is-this'>
        What is this about?
        <i className="ui help circle icon"/>
      </a>
    </div>
    <p/>
    <div className="ui center aligned basic segment">
      <Link className="ui red basic button" to='/encrypt'>
        Encrypt Note <i className="lock icon"/>
      </Link>
      <div className="ui horizontal divider">
        Or
      </div>
      <Link className="ui green basic button" to='/decrypt'>
        Decrypt Note <i className="unlock icon"/>
      </Link>
    </div>
  </header>
);

class App extends Component {
  render() {

    return (
      <div className="App">
        <CenotesHeader />
        <div className="ui section hidden divider"/>
        <div className="ui text container">
          <Main />
        </div>
      </div>
    );
  }
}

export default App;
