const { authenticateUser } = require('../../src/app');

describe('authenticateUser', () => {
  test('success', async () => {
    expect.assertions(1);

    const userId = 'abc';
    const session = {
      get: jest.fn(() => userId),
    };

    const user = await authenticateUser('123', session);

    expect(user).toEqual({ id: userId });
  });

  test('failed: sessionId empty', async () => {
    expect.assertions(1);
    await expect(authenticateUser(null, {})).rejects.toEqual(new Error('Authentication failed'));
  });

  test('failed: wrong sessionId', async () => {
    expect.assertions(1);

    const session = {
      get: jest.fn(() => null),
    };

    await expect(authenticateUser('123', session)).rejects.toEqual(new Error('Authentication failed'));
  });
});
