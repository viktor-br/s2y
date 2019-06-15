const uuidv4 = require('uuid/v4');

class Session {
  constructor(storage) {
    this.storage = storage;
  }

  async createForUser(userUUID, expirationDate) {
    const newSessionId = uuidv4();

    const sessionKey = `session_${newSessionId}`;

    await this.storage.set(sessionKey, userUUID);
    await this.storage.expireat(sessionKey, expirationDate);

    return newSessionId;
  }

  async remove(sessionId) {
    this.storage.del(`session_${sessionId}`);
  }

  async get(sessionId) {
    return this.storage.getAsync(`session_${sessionId}`);
  }
}

module.exports = Session;
