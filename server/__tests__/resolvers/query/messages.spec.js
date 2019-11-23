const { Query: { getMessages } } = require('../../../src/resolvers');

describe('getMessages', () => {
  test('empty user', async () => {
    const result = await getMessages(null, null, {});

    expect(result).toEqual([]);
  });

  test('success', async () => {
    const userId = '12345';
    const messages = [
      { id: 123 },
      { id: 555 },
    ];
    const findByUserIdMock = jest.fn(() => messages);
    const messageRepository = {
      findByUserId: findByUserIdMock,
    };
    const context = { user: { id: userId }, messageRepository };

    const returnedMessages = await getMessages(null, {}, context);

    expect(findByUserIdMock).toHaveBeenCalledWith(userId);
    expect(returnedMessages).toEqual(messages);
  });
});
