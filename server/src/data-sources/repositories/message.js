const Repository = require('./repository');

class MessageRepository extends Repository {
  async findByUserID(userID) {
    const [messages] = await this.pool.query(
      'SELECT * FROM `message` WHERE user_id = ? ORDER BY `created_at` ASC LIMIT 20',
      [userID],
    );

    return messages.map((message) => {
      const { id, content, created_at: createdAt } = message;

      return {
        id,
        userID,
        content,
        createdAt,
      };
    });
  }

  async create({ id, userID, content, createdAt }) {
    await this.pool.query('INSERT INTO `message` SET ?', {
      id,
      user_id: userID,
      content,
      created_at: createdAt,
    });
  }

  async findByID(messageID) {
    const [[message]] = await this.pool.query(
      'SELECT * FROM `message` WHERE id = ?',
      [messageID],
    );

    const {
      id,
      content,
      created_at: createdAt,
      user_id: userID,
    } = message;

    return {
      id,
      userID,
      content,
      createdAt,
    };
  }

  async deleteByID(messageID) {
    return this.pool.query('DELETE FROM `message` WHERE id = ?', [
      messageID,
    ]);
  }
}

module.exports = MessageRepository;
