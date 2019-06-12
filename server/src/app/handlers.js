const createLoginHandler = (session, accountRepository) => async (req, res) => {
  const { query: { token } } = req;

  if (token) {
    // TODO fetch from google auth

    const externalId = (token === '123') ? 123456789 : 555555555;
    const name = (token === '123') ? 'Viktor Brusylovets' : 'John Dow';
    const authProvider = 'google';

    const { uuid: userUUID } = await accountRepository.createOrGetExisting({
      externalId,
      name,
      authProvider,
    });

    // remove current session if exists
    const { cookies: { SID: sessionId } } = req;
    if (sessionId) {
      await session.remove(sessionId);
    }

    const newSessionId = await session.createForUser(userUUID);

    res.cookie('SID', newSessionId);
    res.redirect('/messages');
  } else {
    res.send('Wrong token');
  }
};

module.exports = {
  createLoginHandler,
};
