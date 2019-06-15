class GoogleSignInClient {
  constructor(oAuth2Client, googleSignInClientId) {
    this.googleSignInClientId = googleSignInClientId;
    this.oAuth2Client = oAuth2Client;
  }

  async verifyAndGetUserInfo(token) {
    const ticket = await this.oAuth2Client.verifyIdToken({
      idToken: token,
      audience: this.googleSignInClientId,
    });

    return ticket.getPayload();
  }
}

module.exports = GoogleSignInClient;
