import React, {Component} from 'react';
// import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Switch, Route} from "react-router-dom";
import {Home, Login, Messages} from './pages';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
    };
  };

  componentDidMount() {
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route path={'/'} exact component={Home} />
            <Route path={'/login'} exact component={Login} user={this.state.user} />
            <Route path={'/messages'} component={Messages} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
