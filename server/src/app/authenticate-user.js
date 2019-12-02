const { AuthenticationError } = require('apollo-server');

const authenticateUser = async (sessionId, session) => {
  if (!sessionId) {
    throw new AuthenticationError('Authentication failed');
  }

  const userId = await session.get(sessionId);

  if (!userId) {
    throw new AuthenticationError('Authentication failed');
  }

  return { id: userId };
};

module.exports = authenticateUser;
