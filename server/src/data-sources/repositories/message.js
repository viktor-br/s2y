import Repository from './repository';

class MessageRepository extends Repository {
  async findByUserUUID(userUUID) {
    const [messages] = await this.pool.query(
      'SELECT * FROM `message` WHERE user_id = ? LIMIT 10',
      [userUUID],
    );

    return messages;
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
        user_id: userUUID,
        content,
        created_at: createdAt,
      },
    );
  }
}

export default MessageRepository;
