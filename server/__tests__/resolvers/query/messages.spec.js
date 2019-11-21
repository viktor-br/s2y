const { Query: { getMessages } } = require('../../../src/resolvers');

describe('getMessages', () => {
  test('empty user', async () => {
    const result = await getMessages(null, null, {});

    expect(result).toEqual([]);
  });

  test('success', async () => {
    const userID = '12345';
    const messages = [
      { id: 123 },
      { id: 555 },
    ];
    const findByUserIDMock = jest.fn(() => messages);
    const messageRepository = {
      findByUserID: findByUserIDMock,
    };
    const context = { user: { id: userID }, messageRepository };

    const returnedMessages = await getMessages(null, {}, context);

    expect(findByUserIDMock).toHaveBeenCalledWith(userID);
    expect(returnedMessages).toEqual(messages);
  });
});
