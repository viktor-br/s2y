import React, { Component } from 'react';

class GoogleSignIn extends Component {
  constructor(props) {
    super(props);
    const { onSignInSuccess } = props;
    this.onSignInSuccess = onSignInSuccess;
    this.onSignIn = this.onSignIn.bind(this);
  }

  componentDidMount() {
    if (window.gapi && window.gapi.signin2 && window.gapi.signin2.render) {
      window.gapi.signin2.render('g-signin2', {
        scope: 'profile email',
        width: 240,
        height: 50,
        longtitle: true,
        theme: 'dark',
        onsuccess: this.onSignIn,
      });
    }
  }

  async onSignIn(googleUser) {
    const token = googleUser.getAuthResponse().id_token;

    this.onSignInSuccess(token);
  }

  render() {
    return (
      <div className="container sign-in">
        <div id="g-signin2" />
      </div>
    );
  }
}

export default GoogleSignIn;
