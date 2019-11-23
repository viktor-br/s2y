const { createContext } = require('../../src/app');

describe('createContext', () => {
  test('handle subscription', async () => {
    const defaultContext = {
      repository: {
        get: () => 123,
      },
    };
    const connection = {
      context: defaultContext,
    };
    const returnedCreateContextFunc = createContext(defaultContext);

    const returnedContext = await returnedCreateContextFunc({ connection });
    expect(returnedContext).toEqual(defaultContext);
  });

  test('authenticateUser failed', async () => {
    const sessionId = '12345';
    const userId = '67890';
    const session = {
      get: () => userId,
    };
    const defaultContext = {
      session,
    };
    const user = { id: userId };
    const req = { cookies: { SID: sessionId } };

    const returnedCreateContextFunc = createContext(defaultContext);

    const returnedContext = await returnedCreateContextFunc({ req });

    expect(returnedContext).toEqual({
      ...defaultContext,
      user,
    });
  });
});
