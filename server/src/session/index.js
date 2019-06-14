const uuidv4 = require('uuid/v4');

class Session {
  constructor(storage) {
    this.storage = storage;
  }

  async createForUser(userUUID) {
    const newSessionId = uuidv4();

    await this.storage.set(`session_${newSessionId}`, userUUID);

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
