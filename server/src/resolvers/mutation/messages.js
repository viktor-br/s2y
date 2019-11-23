const uuidv4 = require('uuid/v4');
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
    content,
  };
  pubsub.publish('messageCreated', {
    messageCreated: message,
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

  pubsub.publish('messageDeleted', { messageDeleted: message });

  return message;
};

module.exports = { createMessage, deleteMessage };
