const getMessages = async (root, args, { user, messageRepository }) => {
  if (!user) {
    return [];
  }

  const { uuid: userUUID } = user;

  return messageRepository.findByUserUUID(userUUID);
};

module.exports = getMessages;
