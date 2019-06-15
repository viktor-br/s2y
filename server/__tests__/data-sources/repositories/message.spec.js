const { MessageRepository } = require('../../../src/data-sources');

jest.mock('uuid/v4');

describe('AccountRepository', () => {
  test('create', async () => {
    const uuid = '12345';
    const userUUID = '5555';
    const content = 'message';
    const createdAt = new Date();
    const queryMock = jest.fn();
    const pool = {
      query: queryMock,
    };
    const messageRepository = new MessageRepository(pool);
    await messageRepository.create(
      {
        uuid,
        userUUID,
        content,
        createdAt,
      },
    );

    expect(queryMock).toHaveBeenCalledWith(
      'INSERT INTO `message` SET ?',
      {
        uuid,
        user_uuid: userUUID,
        content,
        created_at: createdAt,
      },
    );
  });

  test('findByUserUUID', async () => {
    const userUUID = '5555';
    const uuid1 = 'uuid1';
    const content1 = 'message1';
    const createdAt1 = new Date();
    const uuid2 = 'uuid1';
    const content2 = 'message1';
    const createdAt2 = new Date();
    const queryMock = jest.fn(
      () => [
        [
          {
            uuid: uuid1,
            user_uuid: userUUID,
            content: content1,
            created_at: createdAt1,
          },
          {
            uuid: uuid2,
            user_uuid: userUUID,
            content: content2,
            created_at: createdAt2,
          },
        ],
      ],
    );
    const pool = {
      query: queryMock,
    };
    const messageRepository = new MessageRepository(pool);
    const messages = await messageRepository.findByUserUUID(userUUID);

    expect(queryMock).toHaveBeenCalledWith(
      'SELECT * FROM `message` WHERE user_uuid = ? ORDER BY `created_at` ASC LIMIT 20',
      [userUUID],
    );

    expect(messages).toEqual(
      [
        {
          uuid: uuid1,
          userUUID,
          content: content1,
          createdAt: createdAt1,
        },
        {
          uuid: uuid2,
          userUUID,
          content: content2,
          createdAt: createdAt2,
        },
      ],
    );
  });
});
