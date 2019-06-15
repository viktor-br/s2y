const { GoogleSignInClient } = require('../../src/authentication');

describe('GoogleSingInClient', () => {
  test('verifyAndGetUserInfo call', async () => {
    const googleClientId = '12345';
    const token = '567890';
    const verifyIdTokenMock = jest.fn(
      () => ({
        getPayload: () => [1, 2, 3],
      }),
    );
    const oAuth2Client = {
      verifyIdToken: verifyIdTokenMock,
    };
    const client = new GoogleSignInClient(oAuth2Client, googleClientId);
    const returnedPayload = await client.verifyAndGetUserInfo(token);

    expect(returnedPayload).toEqual([1, 2, 3]);

    expect(verifyIdTokenMock).toHaveBeenCalledWith({
      idToken: token,
      audience: googleClientId,
    });
  });
});
