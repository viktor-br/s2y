import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import GoogleSignIn from '../../auth/google-sign-in';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authenticated: null,
    };

    this.onSignInSuccess = this.onSignInSuccess.bind(this);
  }

  async onSignInSuccess(token) {
    const response = await fetch(
      '/auth/',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      },
    ).catch((err) => console.log(err));


    if (response.status === 204) {
      this.setState({ authenticated: true });
    }
  }

  render() {
    const { authenticated } = this.state;
    if (authenticated) {
      return <Redirect to="/messages/" />;
    }

    if (authenticated === false) {
      return <div>Authentication failed. Please try again.</div>;
    }

    return <GoogleSignIn onSignInSuccess={this.onSignInSuccess} />;
  }
}

export default Login;
