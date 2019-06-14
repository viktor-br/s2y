const { authenticateUser } = require('./authentication');

const createContext = contextData => async ({ req, connection }) => {
  if (connection) {
    return connection.context;
  }

  const { cookies: { SID: sessionId } } = req;

  const { session } = contextData;

  const user = await authenticateUser(sessionId, session);

  return {
    ...contextData,
    user,
  };
};

module.exports = {
  createContext,
};
