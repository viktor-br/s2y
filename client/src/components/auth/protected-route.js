import React from 'react';
import { Route, Redirect } from 'react-router-dom';

function ProtectedRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={
        props => (
          // eslint-disable-next-line max-len
          authenticated === true ? <Component {...props} /> : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )
      }
    />
  );
}

export default ProtectedRoute;