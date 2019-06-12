const Repository = require('./repository');

class MessageRepository extends Repository {
  async findByUserUUID(userUUID) {
    const [messages] = await this.pool.query(
      'SELECT * FROM `message` WHERE user_uuid = ? ORDER BY `created_at` ASC LIMIT 20',
      [userUUID],
    );

    return messages.map(
      (message) => {
        const { uuid, content, created_at: createdAt } = message;

        return {
          uuid,
          userUUID,
          content,
          createdAt,
        };
      },
    );
  }

  async create(
    {
      uuid,
      userUUID,
      content,
      createdAt,
    },
  ) {
    await this.pool.query(
      'INSERT INTO `message` SET ?',
      {
        uuid,
        user_uuid: userUUID,
        content,
        created_at: createdAt,
      },
    );
  }
}

module.exports = MessageRepository;
