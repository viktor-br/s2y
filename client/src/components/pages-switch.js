import { Redirect, Switch, Route } from 'react-router-dom';
import React from 'react';
import Home from './home';
import Login from './login';
import { MessageView } from './message';
import { parseServerError, ERR_UNAUTHENTICATED } from '../error';

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
        <MessageView
          {...props}
          onApiError={(err) => {
            if (parseServerError(err) === ERR_UNAUTHENTICATED) {
              return <Redirect to="/login" />;
            }
            return <div>API Error</div>;
          }}
        />
      )}
    />
  </Switch>
);

export default PagesSwitch;
