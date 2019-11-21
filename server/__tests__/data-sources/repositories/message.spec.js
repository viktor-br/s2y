const { MessageRepository } = require('../../../src/data-sources');

jest.mock('uuid/v4');

describe('AccountRepository', () => {
  test('create', async () => {
    const id = '12345';
    const userID = '5555';
    const content = 'message';
    const createdAt = new Date();
    const queryMock = jest.fn();
    const pool = {
      query: queryMock,
    };
    const messageRepository = new MessageRepository(pool);
    await messageRepository.create(
      {
        id,
        userID,
        content,
        createdAt,
      },
    );

    expect(queryMock).toHaveBeenCalledWith(
      'INSERT INTO `message` SET ?',
      {
        id,
        user_id: userID,
        content,
        created_at: createdAt,
      },
    );
  });

  test('findByUserID', async () => {
    const userID = '5555';
    const id1 = 'id1';
    const content1 = 'message1';
    const createdAt1 = new Date();
    const id2 = 'id1';
    const content2 = 'message1';
    const createdAt2 = new Date();
    const queryMock = jest.fn(
      () => [
        [
          {
            id: id1,
            user_id: userID,
            content: content1,
            created_at: createdAt1,
          },
          {
            id: id2,
            user_id: userID,
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
    const messages = await messageRepository.findByUserID(userID);

    expect(queryMock).toHaveBeenCalledWith(
      'SELECT * FROM `message` WHERE user_id = ? ORDER BY `created_at` ASC LIMIT 20',
      [userID],
    );

    expect(messages).toEqual(
      [
        {
          id: id1,
          userID,
          content: content1,
          createdAt: createdAt1,
        },
        {
          id: id2,
          userID,
          content: content2,
          createdAt: createdAt2,
        },
      ],
    );
  });

  test('findByID', async () => {
    const messageID = 'abc';
    const queryMock = jest.fn(
        () => [
          [
            {
              id: messageID,
              user_id: 'def',
              content: 'content',
              created_at: '123456',
            }
          ]
        ]
    );
    const pool = {
      query: queryMock,
    };
    const messageRepository = new MessageRepository(pool);
    const message = await messageRepository.findByID(messageID);

    expect(queryMock).toHaveBeenCalledWith(
        'SELECT * FROM `message` WHERE id = ?',
        [messageID],
    );

    expect(message).toEqual(
      {
        id: messageID,
        userID: 'def',
        content: 'content',
        createdAt: '123456',
      },
    );
  });

  test('delete', async () => {
    const messageID = 'abc';
    const queryMock = jest.fn();
    const pool = {
      query: queryMock,
    };
    const messageRepository = new MessageRepository(pool);
    await messageRepository.deleteByID(messageID);

    expect(queryMock).toHaveBeenCalledWith(
        'DELETE FROM `message` WHERE id = ?',
        [messageID],
    );
  });
});
