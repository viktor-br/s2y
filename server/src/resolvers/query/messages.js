const getMessages = async (root, args, { user, messageRepository }) => {
  if (!user) {
    return [];
  }

  const { id: userId } = user;

  return messageRepository.findByUserId(userId);
};

module.exports = getMessages;
