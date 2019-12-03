const uuidv4 = require('uuid/v4');
const striptags = require('striptags');
const { ForbiddenError, UserInputError } = require('apollo-server');
const { Mutation: { createMessage, deleteMessage } } = require('../../../src/resolvers');

jest.mock('uuid/v4');

describe('createMessage', () => {
  test('empty user', async () => {
    const result = await createMessage(null, { content: 'test' }, {});

    expect(result).toBeNull();
  });

  test('success', async () => {
    const userId = '12345';
    const sessionId = '5555555';
    const content = 'test<b>rest</b>';
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
      id: sessionId,
      userId,
      createdAt: currentDate,
      content: striptags(content),
    };
    const context = {
      user: { id: userId },
      pubsub,
      messageRepository,
      getCurrentDate,
    };
    uuidv4.mockReturnValueOnce(sessionId);
    const returnedMessage = await createMessage(null, { content }, context);

    expect(pubsubPublishMock).toHaveBeenCalledWith('messageCreated', { messageCreated: message });
    expect(messageRepositoryCreateMock).toHaveBeenCalledWith(message);

    expect(returnedMessage).toEqual(message);
  });
});

describe('deleteMessage', () => {
  test('success', async () => {
    const id = '123';
    const userId = '2345';
    const sessionId = '5555555';
    const content = 'test';
    const pubsubPublishMock = jest.fn();
    const pubsub = {
      publish: pubsubPublishMock,
    };

    const currentDate = new Date(Date.now());
    const getCurrentDate = () => currentDate;

    const message = {
      id: sessionId,
      userId,
      createdAt: currentDate,
      content,
    };

    const messageRepositoryFindByIdMock = jest.fn(
        () => message
    );
    const messageRepositoryDeleteByIdMock = jest.fn();
    const messageRepository = {
      findById: messageRepositoryFindByIdMock,
      deleteById: messageRepositoryDeleteByIdMock,
    };

    const context = {
      user: { id: userId },
      pubsub,
      messageRepository,
      getCurrentDate,
    };

    const returnedMessage = await deleteMessage(null, { id }, context);

    expect(messageRepositoryFindByIdMock).toHaveBeenCalledWith(id);
    expect(messageRepositoryDeleteByIdMock).toHaveBeenCalledWith(id);
    expect(pubsubPublishMock).toHaveBeenCalledWith('messageDeleted', { messageDeleted: message });
    expect(returnedMessage).toEqual(message);
  });

  test('empty user', async () => {
    const result = await deleteMessage(null, { id: '123' }, {});

    expect(result).toBeNull();
  });

  test('no message', async () => {
    const id = '123';
    const userId = '34567';
    const pubsubPublishMock = jest.fn();
    const pubsub = {
      publish: pubsubPublishMock,
    };

    const currentDate = new Date(Date.now());
    const getCurrentDate = () => currentDate;

    const messageRepositoryFindByIdMock = jest.fn(
        () => null
    );
    const messageRepositoryDeleteByIdMock = jest.fn();
    const messageRepository = {
      findById: messageRepositoryFindByIdMock,
      deleteById: messageRepositoryDeleteByIdMock,
    };

    const context = {
      user: { id: userId },
      pubsub,
      messageRepository,
      getCurrentDate,
    };

    await expect(deleteMessage(null, {id}, context)).rejects.toThrow(UserInputError);

    expect(messageRepositoryFindByIdMock).toHaveBeenCalledWith(id);
    expect(messageRepositoryDeleteByIdMock).not.toHaveBeenCalled();
    expect(pubsubPublishMock).not.toHaveBeenCalled();
  });

  test('message belongs other user', async () => {
    const id = '123';
    const userId = '456789';
    const sessionId = '5555555';
    const content = 'test';
    const pubsubPublishMock = jest.fn();
    const pubsub = {
      publish: pubsubPublishMock,
    };

    const currentDate = new Date(Date.now());
    const getCurrentDate = () => currentDate;

    const message = {
      id: sessionId,
      userId: 'other user',
      createdAt: currentDate,
      content,
    };

    const messageRepositoryFindByIdMock = jest.fn(
        () => message
    );
    const messageRepositoryDeleteByIdMock = jest.fn();
    const messageRepository = {
      findById: messageRepositoryFindByIdMock,
      deleteById: messageRepositoryDeleteByIdMock,
    };

    const context = {
      user: { id: userId },
      pubsub,
      messageRepository,
      getCurrentDate,
    };

    await expect(deleteMessage(null, {id}, context)).rejects.toThrow(ForbiddenError);

    expect(messageRepositoryFindByIdMock).toHaveBeenCalledWith(id);
    expect(messageRepositoryDeleteByIdMock).not.toHaveBeenCalled();
    expect(pubsubPublishMock).not.toHaveBeenCalled();
  });
});
