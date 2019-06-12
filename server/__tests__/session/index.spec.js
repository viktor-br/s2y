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
});
