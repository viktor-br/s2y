import { Redirect, Switch, Route } from 'react-router-dom';
import React, { useState } from 'react';
import Home from './home';
import Login from './login';
import { MessageView } from './message';

const PagesSwitch = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route
        path="/login"
        exact
        render={(props) => (
          <Login
            {...props}
            onAuthenticated={() => {
              setIsAuthenticated(true);
              return <Redirect to="/messages/" />;
            }}
          />
        )}
      />
      <Route
        path="/messages"
        render={(props) =>
          isAuthenticated ? (
            <MessageView {...props} />
          ) : (
            <Redirect to="/login" />
          )
        }
      />
    </Switch>
  );
};

export default PagesSwitch;
