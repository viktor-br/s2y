const myProfile = async (root, args, { user, accountRepository }) => {
  if (!user) {
    return null;
  }

  const { id } = user;

  const { picture: pictureUrl, name } = await accountRepository.findByID(id);

  return { id, name, pictureUrl };
};

module.exports = myProfile;
