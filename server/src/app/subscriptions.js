import cookie from 'cookie';
import authenticateUser from './authentication';

const createSubscriptionOnConnectHandler = contextData => async (connectionParams, webSocket) => {
  const { SID: sessionId } = cookie.parse(webSocket.upgradeReq.headers.cookie);

  const user = await authenticateUser(sessionId, contextData);

  return {
    ...contextData,
    user,
  };
};

export default createSubscriptionOnConnectHandler;
