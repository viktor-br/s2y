const { Query: { getMessages } } = require('../../../src/resolvers');

describe('getMessages', () => {
  test('empty user', async () => {
    const result = await getMessages(null, null, {});

    expect(result).toEqual([]);
  });

  test('success', async () => {
    const userUUID = '12345';
    const messages = [
      { uuid: 123 },
      { uuid: 555 },
    ];
    const findByUserUUIDMock = jest.fn(() => messages);
    const messageRepository = {
      findByUserUUID: findByUserUUIDMock,
    };
    const context = { user: { uuid: userUUID }, messageRepository };

    const returnedMessages = await getMessages(null, {}, context);

    expect(findByUserUUIDMock).toHaveBeenCalledWith(userUUID);
    expect(returnedMessages).toEqual(messages);
  });
});
