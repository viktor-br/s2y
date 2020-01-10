import React, { Component } from 'react';
import GoogleSignIn from '../../auth/google-sign-in';

class Login extends Component {
  constructor(props) {
    super(props);
    const { onAuthenticated } = props;

    this.state = {
      authenticated: null,
    };

    this.onAuthenticated = onAuthenticated;

    this.onSignInSuccess = this.onSignInSuccess.bind(this);
  }

  async onSignInSuccess(token) {
    const response = await fetch('/auth/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
    // TODO add proper handler
    // ).catch((err) => console.log(err));

    let authenticated = false;
    if (response.status === 204) {
      authenticated = true;
    }

    this.setState({ authenticated });
  }

  render() {
    const { authenticated } = this.state;
    if (authenticated && this.onAuthenticated) {
      return this.onAuthenticated();
    }

    if (authenticated === false) {
      return <div>Authentication failed. Please try again.</div>;
    }

    return <GoogleSignIn onSignInSuccess={this.onSignInSuccess} />;
  }
}

export default Login;
