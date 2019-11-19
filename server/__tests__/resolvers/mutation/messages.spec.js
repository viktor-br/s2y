const uuidv4 = require('uuid/v4');
const { ForbiddenError, UserInputError } = require('apollo-server');
const { Mutation: { sendMessage, deleteMessage } } = require('../../../src/resolvers');

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

    expect(pubsubPublishMock).toHaveBeenCalledWith('receiveMessage', { receiveMessage: message });
    expect(messageRepositoryCreateMock).toHaveBeenCalledWith(message);

    expect(returnedMessage).toEqual(message);
  });
});

describe('deleteMessage', () => {
  test('success', async () => {
    const uuid = '123';
    const userUUID = '12345';
    const sessionId = '5555555';
    const content = 'test';
    const pubsubPublishMock = jest.fn();
    const pubsub = {
      publish: pubsubPublishMock,
    };

    const currentDate = new Date(Date.now());
    const getCurrentDate = () => currentDate;

    const message = {
      uuid: sessionId,
      userUUID,
      createdAt: currentDate,
      content,
    };

    const messageRepositoryFindByUUIDMock = jest.fn(
        () => message
    );
    const messageRepositoryDeleteByUUIDMock = jest.fn();
    const messageRepository = {
      findByUUID: messageRepositoryFindByUUIDMock,
      deleteByUUID: messageRepositoryDeleteByUUIDMock,
    };

    const context = {
      user: { uuid: userUUID },
      pubsub,
      messageRepository,
      getCurrentDate,
    };

    const returnedMessage = await deleteMessage(null, { uuid }, context);

    expect(messageRepositoryFindByUUIDMock).toHaveBeenCalledWith(uuid);
    expect(messageRepositoryDeleteByUUIDMock).toHaveBeenCalledWith(uuid);
    expect(pubsubPublishMock).toHaveBeenCalledWith('removeMessage', { removeMessage: message });
    expect(returnedMessage).toEqual(message);
  });

  test('empty user', async () => {
    const result = await deleteMessage(null, { uuid: '123' }, {});

    expect(result).toBeNull();
  });

  test('no message', async () => {
    const uuid = '123';
    const userUUID = '12345';
    const pubsubPublishMock = jest.fn();
    const pubsub = {
      publish: pubsubPublishMock,
    };

    const currentDate = new Date(Date.now());
    const getCurrentDate = () => currentDate;

    const messageRepositoryFindByUUIDMock = jest.fn(
        () => null
    );
    const messageRepositoryDeleteByUUIDMock = jest.fn();
    const messageRepository = {
      findByUUID: messageRepositoryFindByUUIDMock,
      deleteByUUID: messageRepositoryDeleteByUUIDMock,
    };

    const context = {
      user: { uuid: userUUID },
      pubsub,
      messageRepository,
      getCurrentDate,
    };

    await expect(deleteMessage(null, {uuid}, context)).rejects.toThrow(UserInputError);

    expect(messageRepositoryFindByUUIDMock).toHaveBeenCalledWith(uuid);
    expect(messageRepositoryDeleteByUUIDMock).not.toHaveBeenCalled();
    expect(pubsubPublishMock).not.toHaveBeenCalled();
  });

  test('message belongs other user', async () => {
    const uuid = '123';
    const userUUID = '12345';
    const sessionId = '5555555';
    const content = 'test';
    const pubsubPublishMock = jest.fn();
    const pubsub = {
      publish: pubsubPublishMock,
    };

    const currentDate = new Date(Date.now());
    const getCurrentDate = () => currentDate;

    const message = {
      uuid: sessionId,
      userUUID: 'other user',
      createdAt: currentDate,
      content,
    };

    const messageRepositoryFindByUUIDMock = jest.fn(
        () => message
    );
    const messageRepositoryDeleteByUUIDMock = jest.fn();
    const messageRepository = {
      findByUUID: messageRepositoryFindByUUIDMock,
      deleteByUUID: messageRepositoryDeleteByUUIDMock,
    };

    const context = {
      user: { uuid: userUUID },
      pubsub,
      messageRepository,
      getCurrentDate,
    };

    await expect(deleteMessage(null, {uuid}, context)).rejects.toThrow(ForbiddenError);

    expect(messageRepositoryFindByUUIDMock).toHaveBeenCalledWith(uuid);
    expect(messageRepositoryDeleteByUUIDMock).not.toHaveBeenCalled();
    expect(pubsubPublishMock).not.toHaveBeenCalled();
  });
});
