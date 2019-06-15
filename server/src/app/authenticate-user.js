const authenticateUser = async (sessionId, session) => {
  if (!sessionId) {
    throw new Error('Authentication failed');
  }

  const userUUID = await session.get(sessionId);

  if (!userUUID) {
    throw new Error('Authentication failed');
  }

  return { uuid: userUUID };
};

module.exports = authenticateUser;
