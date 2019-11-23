const { createSubscriptionOnConnectHandler } = require('../../src/app');

describe('createSubscriptionOnConnectHandler', () => {
  test('success call', async () => {
    const userId = '56789';
    const sessionId = '12345';
    const user = { id: userId };
    const session = {
      get: () => userId,
    };
    const defaultContext = {
      session,
    };
    const subscriptionOnConnectHandlerFunc = createSubscriptionOnConnectHandler(defaultContext);
    const webSocket = {
      upgradeReq: {
        headers: {
          cookie: `SID=${sessionId}`,
        },
      },
    };
    const returnedContext = await subscriptionOnConnectHandlerFunc({}, webSocket);
    expect(returnedContext).toEqual({
      ...defaultContext,
      user,
    });
  });
});
