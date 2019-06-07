import authenticateUser from './authentication';

const createContext = contextData => async ({ req, connection }) => {
  if (connection) {
    return connection.context;
  }

  if (!req) {
    throw new Error('Authentication failed');
  }

  const { cookies: { SID: sessionId } } = req;

  const user = await authenticateUser(sessionId, contextData);

  return {
    ...contextData,
    user,
  };
};

export default createContext;
