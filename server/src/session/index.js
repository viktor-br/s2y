import uuidv4 from 'uuid/v4';


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
    const key = `session_${sessionId}`;
    await this.storage.del(
      key,
      (error) => {
        if (error) {
          throw error;
        }
      },
    );
  }

  async get(sessionId) {
    return this.storage.getAsync(`session_${sessionId}`);
  }
}

export default Session;
