const Repository = require('./repository');

class MessageRepository extends Repository {
  async findByUserId(userId) {
    const [messages] = await this.pool.query(
      'SELECT * FROM `message` WHERE user_id = ? ORDER BY `created_at` ASC LIMIT 20',
      [userId],
    );

    return messages.map((message) => {
      const { id, content, created_at: createdAt } = message;

      return {
        id,
        userId,
        content,
        createdAt,
      };
    });
  }

  async create({ id, userId, content, createdAt }) {
    await this.pool.query('INSERT INTO `message` SET ?', {
      id,
      user_id: userId,
      content,
      created_at: createdAt,
    });
  }

  async findById(messageId) {
    const [[message]] = await this.pool.query(
      'SELECT * FROM `message` WHERE id = ?',
      [messageId],
    );

    const { id, content, created_at: createdAt, user_id: userId } = message;

    return {
      id,
      userId,
      content,
      createdAt,
    };
  }

  async deleteById(messageId) {
    return this.pool.query('DELETE FROM `message` WHERE id = ?', [messageId]);
  }
}

module.exports = MessageRepository;
