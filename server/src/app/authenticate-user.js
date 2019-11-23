const authenticateUser = async (sessionId, session) => {
  if (!sessionId) {
    throw new Error('Authentication failed');
  }

  const userId = await session.get(sessionId);

  if (!userId) {
    throw new Error('Authentication failed');
  }

  return { id: userId };
};

module.exports = authenticateUser;
