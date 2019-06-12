const { authenticateUser } = require('../../src/app/authentication');

describe('authenticateUser', () => {
  test('success', async () => {
    expect.assertions(1);

    const userUUID = 'abc';
    const contextData = {
      session: {
        get: jest.fn(() => userUUID),
      },
    };

    const user = await authenticateUser('123', contextData);

    expect(user).toEqual({ uuid: userUUID });
  });

  test('failed: sessionId empty', async () => {
    expect.assertions(1);
    await expect(authenticateUser(null, {})).rejects.toEqual(new Error('Authentication failed'));
  });

  test('failed: wrong sessionId', async () => {
    expect.assertions(1);

    const contextData = {
      session: {
        get: jest.fn(() => null),
      },
    };

    await expect(authenticateUser('123', contextData)).rejects.toEqual(new Error('Authentication failed'));
  });
});
