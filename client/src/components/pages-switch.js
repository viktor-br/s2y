import { Redirect, Switch, Route } from 'react-router-dom';
import React from 'react';
import Home from './home';
import Login from './login';
import { MessageView } from './message';

const PagesSwitch = () => (
  <Switch>
    <Route path="/" exact component={Home} />
    <Route
      path="/login"
      exact
      render={(props) => (
        <Login {...props} onAuthenticated={() => <Redirect to="/messages" />} />
      )}
    />
    <Route
      path="/messages"
      render={(props) => (
        <MessageView {...props} onApiError={() => <Redirect to="/login" />} />
      )}
    />
  </Switch>
);

export default PagesSwitch;
