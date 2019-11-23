const {
  Query: { myProfile },
} = require('../../../src/resolvers');

describe('myProfile', () => {
  test('empty user', async () => {
    const result = await myProfile(null, null, {});

    expect(result).toEqual(null);
  });

  test('success', async () => {
    const userID = '123';
    const name = 'Name';
    const picture = 'picture url';
    const profile = {
      id: userID,
      name,
      picture,
    };
    const findByIDMock = jest.fn(() => profile);
    const accountRepository = {
      findByID: findByIDMock,
    };
    const context = { user: { id: userID }, accountRepository };

    const returnedProfile = await myProfile(null, {}, context);

    expect(findByIDMock).toHaveBeenCalledWith(userID);
    expect(returnedProfile).toEqual({ id: userID, name, pictureUrl: picture });
  });
});
