const uuidv4 = require('uuid/v4');
const { Mutation: { sendMessage } } = require('../../../src/resolvers');

jest.mock('uuid/v4');

describe('sendMessage', () => {
  test('empty user', async () => {
    const result = await sendMessage(null, { content: 'test' }, {});

    expect(result).toBeNull();
  });

  test('success', async () => {
    const userUUID = '12345';
    const sessionId = '5555555';
    const content = 'test';
    const pubsubPublishMock = jest.fn();
    const pubsub = {
      publish: pubsubPublishMock,
    };
    const messageRepositoryCreateMock = jest.fn();
    const messageRepository = {
      create: messageRepositoryCreateMock,
    };
    const currentDate = new Date(Date.now());
    const getCurrentDate = () => currentDate;
    const message = {
      uuid: sessionId,
      userUUID,
      createdAt: currentDate,
      content,
    };
    const context = {
      user: { uuid: userUUID },
      pubsub,
      messageRepository,
      getCurrentDate,
    };
    uuidv4.mockReturnValueOnce(sessionId);
    const returnedMessage = await sendMessage(null, { content }, context);

    expect(pubsubPublishMock).toHaveBeenCalledWith('messages', { receiveMessage: message });
    expect(messageRepositoryCreateMock).toHaveBeenCalledWith(message);

    expect(returnedMessage).toEqual(message);
  });
});
