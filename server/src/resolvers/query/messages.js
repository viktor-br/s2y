const getMessages = async (root, args, { user, messageRepository }) => {
  if (!user) {
    return [];
  }

  const { id: userID } = user;

  return messageRepository.findByUserID(userID);
};

module.exports = getMessages;
