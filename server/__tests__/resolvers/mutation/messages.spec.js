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
    const userID = '12345';
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
      id: sessionId,
      userID,
      createdAt: currentDate,
      content,
    };
    const context = {
      user: { id: userID },
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
    const id = '123';
    const userID = '12345';
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
      userID,
      createdAt: currentDate,
      content,
    };

    const messageRepositoryFindByIDMock = jest.fn(
        () => message
    );
    const messageRepositoryDeleteByIDMock = jest.fn();
    const messageRepository = {
      findByID: messageRepositoryFindByIDMock,
      deleteByID: messageRepositoryDeleteByIDMock,
    };

    const context = {
      user: { id: userID },
      pubsub,
      messageRepository,
      getCurrentDate,
    };

    const returnedMessage = await deleteMessage(null, { id }, context);

    expect(messageRepositoryFindByIDMock).toHaveBeenCalledWith(id);
    expect(messageRepositoryDeleteByIDMock).toHaveBeenCalledWith(id);
    expect(pubsubPublishMock).toHaveBeenCalledWith('removeMessage', { removeMessage: message });
    expect(returnedMessage).toEqual(message);
  });

  test('empty user', async () => {
    const result = await deleteMessage(null, { id: '123' }, {});

    expect(result).toBeNull();
  });

  test('no message', async () => {
    const id = '123';
    const userID = '12345';
    const pubsubPublishMock = jest.fn();
    const pubsub = {
      publish: pubsubPublishMock,
    };

    const currentDate = new Date(Date.now());
    const getCurrentDate = () => currentDate;

    const messageRepositoryFindByIDMock = jest.fn(
        () => null
    );
    const messageRepositoryDeleteByIDMock = jest.fn();
    const messageRepository = {
      findByID: messageRepositoryFindByIDMock,
      deleteByID: messageRepositoryDeleteByIDMock,
    };

    const context = {
      user: { id: userID },
      pubsub,
      messageRepository,
      getCurrentDate,
    };

    await expect(deleteMessage(null, {id}, context)).rejects.toThrow(UserInputError);

    expect(messageRepositoryFindByIDMock).toHaveBeenCalledWith(id);
    expect(messageRepositoryDeleteByIDMock).not.toHaveBeenCalled();
    expect(pubsubPublishMock).not.toHaveBeenCalled();
  });

  test('message belongs other user', async () => {
    const id = '123';
    const userID = '12345';
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
      userID: 'other user',
      createdAt: currentDate,
      content,
    };

    const messageRepositoryFindByIDMock = jest.fn(
        () => message
    );
    const messageRepositoryDeleteByIDMock = jest.fn();
    const messageRepository = {
      findByID: messageRepositoryFindByIDMock,
      deleteByID: messageRepositoryDeleteByIDMock,
    };

    const context = {
      user: { id: userID },
      pubsub,
      messageRepository,
      getCurrentDate,
    };

    await expect(deleteMessage(null, {id}, context)).rejects.toThrow(ForbiddenError);

    expect(messageRepositoryFindByIDMock).toHaveBeenCalledWith(id);
    expect(messageRepositoryDeleteByIDMock).not.toHaveBeenCalled();
    expect(pubsubPublishMock).not.toHaveBeenCalled();
  });
});
