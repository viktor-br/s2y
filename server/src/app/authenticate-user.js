const authenticateUser = async (sessionId, session) => {
  if (!sessionId) {
    throw new Error('Authentication failed');
  }

  const userID = await session.get(sessionId);

  if (!userID) {
    throw new Error('Authentication failed');
  }

  return { id: userID };
};

module.exports = authenticateUser;
