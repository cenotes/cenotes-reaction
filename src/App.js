import React, { Component } from "react";
import { Link, Switch, Route } from "react-router-dom";
import DecryptNote from "./DecryptNote";
import EncryptNote from "./EncryptNote";
import DecryptAction from "./DecryptAction";
import EncryptAction from "./EncryptAction";


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

const Header = () => (
  <header>
    <h1 className="ui center aligned icon header large">
      <i className="ui icon privacy"/>
        Welcome to CENotes
    </h1>
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
        <Header />
        <div className="ui section hidden divider"/>
        <div className="ui text container">
          <Main />
        </div>
      </div>
    );
  }
}

export default App;
