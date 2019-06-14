const { createLoginHandler } = require('../../src/app');

describe('createLoginHandler', () => {
  test('handle wrong token', async () => {
    const req = { query: {} };
    const createLoginHandlerFund = createLoginHandler({}, {});
    const resSendMock = jest.fn();

    const res = {
      send: resSendMock,
    };
    createLoginHandlerFund(req, res);
    expect(resSendMock).toHaveBeenCalledWith('Wrong token');
  });

  test.each(
    [['555', 555555555, 'John Dow', '123456'], ['123', 123456789, 'Jane Dow', null]],
  )('handle valid token', async (token, externalId, name, sessionId) => {
    const newSessionId = '56789';
    const userUUID = '45678';
    const authProvider = 'google';
    const sessionRemoveMock = jest.fn();
    const sessionCreateForUserMock = jest.fn(() => newSessionId);
    const session = {
      remove: sessionRemoveMock,
      createForUser: sessionCreateForUserMock,
    };
    const createOrGetExistingMock = jest.fn(() => ({ uuid: userUUID }));
    const accountRepository = {
      createOrGetExisting: createOrGetExistingMock,
    };
    const createLoginHandlerFund = createLoginHandler(session, accountRepository);
    const resCookieMock = jest.fn();
    const resRedirectMock = jest.fn();
    const req = {
      query: { token },
      cookies: { SID: sessionId },
    };
    const res = {
      cookie: resCookieMock,
      redirect: resRedirectMock,
    };
    await createLoginHandlerFund(req, res);
    expect(resCookieMock).toHaveBeenCalledWith('SID', newSessionId);
    expect(resRedirectMock).toHaveBeenCalledWith('/messages');
    if (sessionId) {
      expect(sessionRemoveMock).toHaveBeenCalledWith(sessionId);
    } else {
      expect(sessionRemoveMock).not.toHaveBeenCalledWith(sessionId);
    }
    expect(sessionCreateForUserMock).toHaveBeenCalledWith(userUUID);
    expect(createOrGetExistingMock).toHaveBeenCalledWith({
      externalId,
      name,
      authProvider,
    });
  });
});
