const {
  Query: { myProfile },
} = require('../../../src/resolvers');

describe('myProfile', () => {
  test('empty user', async () => {
    const result = await myProfile(null, null, {});

    expect(result).toEqual(null);
  });

  test('success', async () => {
    const userId = '123';
    const name = 'Name';
    const picture = 'picture url';
    const profile = {
      id: userId,
      name,
      picture,
    };
    const findByIdMock = jest.fn(() => profile);
    const accountRepository = {
      findById: findByIdMock,
    };
    const context = { user: { id: userId }, accountRepository };

    const returnedProfile = await myProfile(null, {}, context);

    expect(findByIdMock).toHaveBeenCalledWith(userId);
    expect(returnedProfile).toEqual({ id: userId, name, pictureUrl: picture });
  });
});
