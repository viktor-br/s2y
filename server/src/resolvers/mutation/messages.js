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

  const { id: userID } = user;

  const message = {
    id: uuidv4(),
    userID,
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

  const { id: userID } = user;

  const message = await messageRepository.findByID(id);

  if (!message) {
    throw new UserInputError('Message does not exist');
  }

  if (message.userID !== userID) {
    throw new ForbiddenError('Access forbidden');
  }

  await messageRepository.deleteByID(id);

  pubsub.publish('messageDeleted', { messageDeleted: message });

  return message;
};

module.exports = { createMessage, deleteMessage };
