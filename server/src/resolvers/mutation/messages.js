const uuidv4 = require('uuid/v4');

const sendMessage = async (
  root,
  { content },
  {
    user,
    pubsub,
    messageRepository,
    getCurrentDate,
  },
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
  pubsub.publish('messages', { receiveMessage: message });

  messageRepository.create(message);

  return message;
};

module.exports = sendMessage;
