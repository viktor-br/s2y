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
    const userUUID = '55555';
    const storageSetMock = jest.fn();

    uuidv4.mockReturnValueOnce(sessionId);

    const storage = {
      set: storageSetMock,
    };
    const session = new Session(storage);
    const returnedSsessionId = await session.createForUser(userUUID);

    expect(storageSetMock).toHaveBeenCalledWith(`session_${sessionId}`, userUUID);

    expect(returnedSsessionId).toEqual(sessionId);
  });

  test('session get', async () => {
    const sessionId = '12345';
    const userUUID = '55555';
    const storageSetMock = jest.fn(() => userUUID);

    const storage = {
      getAsync: storageSetMock,
    };
    const session = new Session(storage);
    const returnedUserUUID = await session.get(sessionId);

    expect(storageSetMock).toHaveBeenCalledWith(`session_${sessionId}`);

    expect(returnedUserUUID).toBe(userUUID);
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
