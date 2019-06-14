const cookie = require('cookie');
const { authenticateUser } = require('./authentication');

const createSubscriptionOnConnectHandler = contextData => async (connectionParams, webSocket) => {
  const { SID: sessionId } = cookie.parse(webSocket.upgradeReq.headers.cookie);

  const { session } = contextData;

  const user = await authenticateUser(sessionId, session);

  return {
    ...contextData,
    user,
  };
};

module.exports = {
  createSubscriptionOnConnectHandler,
};
