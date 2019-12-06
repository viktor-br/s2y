const uuidv4 = require('uuid/v4');
const striptags = require('striptags');
const { ForbiddenError, UserInputError } = require('apollo-server');

const createMessage = async (
  root,
  { content },
  { user, pubsub, messageRepository, getCurrentDate },
) => {
  if (!user) {
    return null;
  }

  const { id: userId } = user;

  const message = {
    id: uuidv4(),
    userId,
    createdAt: getCurrentDate(),
    content: striptags(content),
  };
  // there is an issue here with serialisation, date is serialised to string by default
  await pubsub.publish('messageCreated', {
    messageCreated: { ...message, createdAt: message.createdAt.getTime() },
  });

  messageRepository.create(message);

  return message;
};

const deleteMessage = async (
  root,
  { id },
  { user, pubsub, messageRepository },
) => {
  if (!user) {
    return null;
  }

  const { id: userId } = user;

  const message = await messageRepository.findById(id);

  if (!message) {
    throw new UserInputError('Message does not exist');
  }

  if (message.userId !== userId) {
    throw new ForbiddenError('Access forbidden');
  }

  await messageRepository.deleteById(id);

  await pubsub.publish('messageDeleted', { messageDeleted: message });

  return message;
};

module.exports = { createMessage, deleteMessage };
