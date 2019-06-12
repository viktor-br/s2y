const authenticateUser = async (sessionId, contextData) => {
  if (!sessionId) {
    throw new Error('Authentication failed');
  }

  const { session } = contextData;

  const userUUID = await session.get(sessionId);

  if (!userUUID) {
    throw new Error('Authentication failed');
  }

  return { uuid: userUUID };
};

module.exports = {
  authenticateUser,
};
