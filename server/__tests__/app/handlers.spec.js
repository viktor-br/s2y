const { createAuthHandler, createLogoutHandler } = require('../../src/app');

describe('createAuthHandler', () => {
  test('handle empty token', async () => {
    const req = { body: {} };
    const logger = {
      info: () => {},
    };
    const resSendMock = jest.fn();
    const resStatusMock = jest.fn();

    const context = {
      logger,
    };

    const createLoginHandlerFund = createAuthHandler(context);

    const res = {
      send: resSendMock,
      status: resStatusMock,
    };
    createLoginHandlerFund(req, res);
    expect(resSendMock).toHaveBeenCalledWith('');
    expect(resStatusMock).toHaveBeenCalledWith(401);
  });

  test('handle failed authentication', async () => {
    const token = '12345';
    const req = { body: { token } };
    const verifyAndGetUserInfoMock = jest.fn(() => Promise.reject(new Error('fail')));
    const googleSignInClient = {
      verifyAndGetUserInfo: verifyAndGetUserInfoMock,
    };
    const logger = {
      info: () => {},
    };
    const context = {
      logger,
      googleSignInClient,
    };

    const createLoginHandlerFund = createAuthHandler(context);

    const resSendMock = jest.fn();
    const resStatusMock = jest.fn();
    const res = {
      send: resSendMock,
      status: resStatusMock,
    };
    await createLoginHandlerFund(req, res);
    expect(resSendMock).toHaveBeenCalledWith('');
    expect(resStatusMock).toHaveBeenCalledWith(401);
  });

  test.each([[null], ['999999']])('success', async (sessionId) => {
    const token = '12345';
    // const sessionId = '999999';
    const req = { body: { token }, cookies: { SID: sessionId } };
    const externalId = '56789';
    const name = 'name';
    const authProvider = 'google';
    const picture = 'pic';
    const payload = {
      sub: externalId,
      name,
      picture,
    };
    const userUUID = '2345';
    const newSessionId = '5555';
    const createOrGetExistingMock = jest.fn(() => ({ uuid: userUUID }));
    const accountRepository = {
      createOrGetExisting: createOrGetExistingMock,
    };
    const verifyAndGetUserInfoMock = jest.fn(() => Promise.resolve(payload));
    const googleSignInClient = {
      verifyAndGetUserInfo: verifyAndGetUserInfoMock,
    };
    const sessionRemoveMock = jest.fn();
    const sessionCreateForUserMock = jest.fn(() => newSessionId);
    const session = {
      remove: sessionRemoveMock,
      createForUser: sessionCreateForUserMock,
    };
    const currentDate = new Date(Date.now());
    const getCurrentDate = () => currentDate;
    const logger = {
      info: () => {},
    };
    const context = {
      logger,
      session,
      googleSignInClient,
      accountRepository,
      getCurrentDate,
    };

    const createLoginHandlerFund = createAuthHandler(context);

    const resSendMock = jest.fn();
    const resStatusMock = jest.fn();
    const resCookieMock = jest.fn();
    const res = {
      send: resSendMock,
      status: resStatusMock,
      cookie: resCookieMock,
    };
    await createLoginHandlerFund(req, res);
    expect(resSendMock).toHaveBeenCalledWith('');
    expect(resStatusMock).toHaveBeenCalledWith(204);
    expect(resCookieMock).toHaveBeenCalledWith(
      'SID',
      newSessionId,
      {
        maxAge: 86400000,
        sameSite: true,
        httpOnly: true,
      },
    );

    if (sessionId) {
      expect(sessionRemoveMock).toHaveBeenCalledWith(sessionId);
    } else {
      expect(sessionRemoveMock).not.toHaveBeenCalledWith(sessionId);
    }
    const expirationDate = (getCurrentDate() / 1000) + 86400;
    expect(sessionCreateForUserMock).toHaveBeenCalledWith(userUUID, expirationDate);
    expect(createOrGetExistingMock).toHaveBeenCalledWith({
      externalId,
      name,
      authProvider,
      picture,
      createdAt: getCurrentDate(),
    });
  });
});

describe('createLogoutHandler', () => {
  test('empty session', async () => {
    const context = {
      logger: {
        info: () => {},
      },
    };
    const createLogoutHandlerFunc = createLogoutHandler(context);
    const req = { cookies: {} };
    const clearCookieMock = jest.fn();
    const sendMock = jest.fn();
    const res = {
      clearCookie: clearCookieMock,
      send: sendMock,
    };

    await createLogoutHandlerFunc(req, res);

    expect(clearCookieMock).toHaveBeenCalledWith('SID');
    expect(sendMock).toHaveBeenCalledWith('');
  });

  test('non empty session', async () => {
    const sessionId = '12345';
    const clearCookieMock = jest.fn();
    const removeMock = jest.fn();
    const sendMock = jest.fn();
    const context = {
      logger: {
        info: () => {},
      },
      session: {
        remove: removeMock,
      },
    };
    const createLogoutHandlerFunc = createLogoutHandler(context);
    const req = { cookies: { SID: sessionId } };

    const res = {
      clearCookie: clearCookieMock,
      send: sendMock,
    };

    await createLogoutHandlerFunc(req, res);
    expect(removeMock).toHaveBeenCalledWith(sessionId);
    expect(clearCookieMock).toHaveBeenCalledWith('SID');
    expect(sendMock).toHaveBeenCalledWith('');
  });
});
