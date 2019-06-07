import uuidv4 from 'uuid/v4';

const getMessages = async (root, args, { user, messageRepository }) => {
  if (!user) {
    return [];
  }

  const { uuid: userUUID } = user;

  return messageRepository.findByUserUUID(userUUID);
};

const sendMessage = async (root, { content }, { user, pubsub, messageRepository }) => {
  if (!user) {
    return null;
  }

  const { uuid: userUUID } = user;

  const message = {
    uuid: uuidv4(),
    userUUID,
    created_at: new Date(Date.now()),
    content,
  };
  pubsub.publish('messages', { receiveMessage: message });

  messageRepository.create(message);

  return message;
};

export {
  getMessages,
  sendMessage,
};
