import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Login from './pages/login/index';

/**
 * Controllerクラス.
 */
class App extends Component {
  constructor(props) {
    super(props);
  }
  /**
   * ルーティング処理,
   */
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/" render={() => <Redirect to="/" />} />
        </Switch>
      </Router>
    );
  }
}
export default App;
