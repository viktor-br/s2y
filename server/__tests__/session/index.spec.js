const uuidv4 = require('uuid/v4');
const Session = require('../../src/session');

jest.mock('uuid/v4');

describe('session', () => {
  test('session object creation', () => {
    const storage = {
      set() {},
      get() {},
    };
    const session = new Session(storage);

    expect(session.storage).toEqual(storage);
  });

  test('session set', async () => {
    const sessionId = '12345';
    const userId = '55555';
    const storageSetMock = jest.fn();
    const storageExpireAtMock = jest.fn();

    uuidv4.mockReturnValueOnce(sessionId);

    const storage = {
      set: storageSetMock,
      expireat: storageExpireAtMock,
    };
    const session = new Session(storage);
    const expirationDate = (new Date(Date.now()) / 1000) + 86400;
    const returnedSsessionId = await session.createForUser(userId, expirationDate);

    expect(storageSetMock).toHaveBeenCalledWith(`session_${sessionId}`, userId);
    expect(storageExpireAtMock).toHaveBeenCalledWith(`session_${sessionId}`, expirationDate);

    expect(returnedSsessionId).toEqual(sessionId);
  });

  test('session get', async () => {
    const sessionId = '12345';
    const userId = '55555';
    const storageSetMock = jest.fn(() => userId);

    const storage = {
      getAsync: storageSetMock,
    };
    const session = new Session(storage);
    const returnedUserId = await session.get(sessionId);

    expect(storageSetMock).toHaveBeenCalledWith(`session_${sessionId}`);

    expect(returnedUserId).toBe(userId);
  });

  test('session del', () => {
    const sessionId = '12345';
    const storageSetMock = jest.fn();

    const storage = {
      del: storageSetMock,
    };
    const session = new Session(storage);
    session.remove(sessionId);

    expect(storageSetMock).toHaveBeenCalledWith(`session_${sessionId}`);
  });
});
