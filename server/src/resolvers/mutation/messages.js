const uuidv4 = require('uuid/v4');
const { ForbiddenError, UserInputError } = require('apollo-server');

const sendMessage = async (
  root,
  { content },
  { user, pubsub, messageRepository, getCurrentDate },
) => {
  if (!user) {
    return null;
  }

  const { uuid: userUUID } = user;

  const message = {
    uuid: uuidv4(),
    userUUID,
    createdAt: getCurrentDate(),
    content,
  };
  pubsub.publish('receiveMessage', {
    receiveMessage: message,
  });

  messageRepository.create(message);

  return message;
};

const deleteMessage = async (
  root,
  { uuid },
  { user, pubsub, messageRepository },
) => {
  if (!user) {
    return null;
  }

  const { uuid: userUUID } = user;

  const message = await messageRepository.findByUUID(uuid);

  if (!message) {
    throw new UserInputError('Message does not exist');
  }

  if (message.userUUID !== userUUID) {
    throw new ForbiddenError('Access forbidden');
  }

  await messageRepository.deleteByUUID(uuid);

  pubsub.publish('removeMessage', { removeMessage: message });

  return message;
};

module.exports = { sendMessage, deleteMessage };
