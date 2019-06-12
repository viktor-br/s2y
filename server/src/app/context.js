const { authenticateUser } = require('./authentication');

const createContext = contextData => async ({ req, connection }) => {
  if (connection) {
    return connection.context;
  }

  const { cookies: { SID: sessionId } } = req;

  const user = await authenticateUser(sessionId, contextData);

  return {
    ...contextData,
    user,
  };
};

module.exports = {
  createContext,
};
