const createAuthHandler = ({
  logger,
  session,
  accountRepository,
  googleSignInClient,
  getCurrentDate,
}) => async (req, res) => {
  logger.info('Authentication: started');
  const {
    body: { token },
  } = req;

  if (!token) {
    logger.info('Authentication: request with empty token');
    res.status(401);
    res.send('');
    return;
  }

  let failed = false;
  const payload = await googleSignInClient
    .verifyAndGetUserInfo(token)
    .catch((err) => {
      // TODO error contains user details if token is outdated.
      logger.info(err);
      failed = true;
    });

  if (failed) {
    logger.info('Authentication failed. Return 401 error');
    res.status(401);
    res.send('');
    return;
  }

  const { sub: externalId, name, picture } = payload;

  logger.info('Authentication: %s authenticated', externalId);

  const authProvider = 'google';

  const { id: userID } = await accountRepository.createOrGetExisting({
    externalId,
    name,
    authProvider,
    picture,
    createdAt: getCurrentDate(),
  });

  // remove current session if exists
  const {
    cookies: { SID: sessionId },
  } = req;
  if (sessionId) {
    await session.remove(sessionId);
    logger.info('Authentication: old session removed.');
  }

  const expirationDate = getCurrentDate() / 1000 + 86400;
  const newSessionId = await session.createForUser(userID, expirationDate);

  res.cookie('SID', newSessionId, {
    maxAge: 86400000,
    sameSite: true,
    httpOnly: true,
  });
  res.status(204);
  res.send('');
  logger.info('Authentication: completed');
};

const createLogoutHandler = ({ logger, session }) => async (req, res) => {
  logger.info('Logout: started');
  const {
    cookies: { SID: sessionId },
  } = req;
  if (sessionId) {
    await session.remove(sessionId);
    logger.info('Logout: session removed.');
  }

  res.clearCookie('SID');
  res.send('');
  logger.info('Logout: completed');
};

module.exports = {
  createAuthHandler,
  createLogoutHandler,
};
