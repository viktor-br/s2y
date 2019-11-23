const uuidv4 = require('uuid/v4');
const { AccountRepository } = require('../../../src/data-sources');

jest.mock('uuid/v4');

describe('AccountRepository:findByAuthProviderAndExternalId', () => {
  test('empty response', async () => {
    const authProvider = 'google';
    const externalId = '123456';

    const queryMock = jest.fn(() => [[]]);
    const pool = {
      query: queryMock,
    };

    const accountRepository = new AccountRepository(pool);

    const returnedAccount = await accountRepository.findByAuthProviderAndExternalId(
      authProvider,
      externalId,
    );

    expect(queryMock).toHaveBeenCalledWith(
      'SELECT * FROM `account` WHERE `auth_provider` = ? AND external_id = ?',
      [authProvider, externalId],
    );

    expect(returnedAccount).toBeNull();
  });

  test('success', async () => {
    const id = '12345';
    const authProvider = 'google';
    const externalId = '123456';
    const name = 'John Dow';

    const queryMock = jest.fn(() => [
      [
        {
          id,
          external_id: externalId,
          auth_provider: authProvider,
          name,
        },
      ],
    ]);
    const pool = {
      query: queryMock,
    };

    const accountRepository = new AccountRepository(pool);

    const returnedAccount = await accountRepository.findByAuthProviderAndExternalId(
      authProvider,
      externalId,
    );

    expect(queryMock).toHaveBeenCalledWith(
      'SELECT * FROM `account` WHERE `auth_provider` = ? AND external_id = ?',
      [authProvider, externalId],
    );

    expect(returnedAccount).toEqual({
      id,
      externalId,
      authProvider,
      name,
    });
  });
});

describe('AccountRepository:findById', () => {
  test('empty response', async () => {
    const id = '123456';

    const queryMock = jest.fn(() => [[]]);
    const pool = {
      query: queryMock,
    };

    const accountRepository = new AccountRepository(pool);

    const returnedAccount = await accountRepository.findById(id);

    expect(queryMock).toHaveBeenCalledWith(
      'SELECT * FROM `account` WHERE `id` = ?',
      [id],
    );

    expect(returnedAccount).toBeNull();
  });

  test('rows is empty response', async () => {
    const id = '123456';

    const queryMock = jest.fn(() => [null]);
    const pool = {
      query: queryMock,
    };

    const accountRepository = new AccountRepository(pool);

    const returnedAccount = await accountRepository.findById(id);

    expect(queryMock).toHaveBeenCalledWith(
      'SELECT * FROM `account` WHERE `id` = ?',
      [id],
    );

    expect(returnedAccount).toBeNull();
  });

  test('success', async () => {
    const id = '123456';
    const name = 'John Dow';
    const picture = 'picture url';
    const authProvider = 'google';
    const externalId = '67890';

    const queryMock = jest.fn(() => [
      [
        {
          id,
          external_id: externalId,
          auth_provider: authProvider,
          picture,
          name,
        },
      ],
    ]);
    const pool = {
      query: queryMock,
    };

    const accountRepository = new AccountRepository(pool);

    const returnedAccount = await accountRepository.findById(id);

    expect(queryMock).toHaveBeenCalledWith(
      'SELECT * FROM `account` WHERE `id` = ?',
      [id],
    );

    expect(returnedAccount).toEqual({
      id,
      externalId,
      authProvider,
      picture,
      name,
    });
  });
});

describe('AccountRepository:createOrGetExisting', () => {
  test('account exists', async () => {
    const id = '12345';
    const authProvider = 'google';
    const externalId = '123456';
    const name = 'John Dow';

    const queryMock = jest.fn(() => [
      [
        {
          id,
          external_id: externalId,
          auth_provider: authProvider,
          name,
        },
      ],
    ]);
    const pool = {
      query: queryMock,
    };

    const accountRepository = new AccountRepository(pool);

    const returnedAccount = await accountRepository.createOrGetExisting({
      authProvider,
      externalId,
      name,
    });

    expect(returnedAccount).toEqual({
      id,
      externalId,
      authProvider,
      name,
    });
  });

  test('create new account', async () => {
    const id = '12345';
    const authProvider = 'google';
    const externalId = '123456';
    const name = 'John Dow';

    uuidv4.mockReturnValueOnce(id);

    const queryMock = jest.fn();
    queryMock.mockReturnValue([]);

    const pool = {
      query: queryMock,
    };

    const accountRepository = new AccountRepository(pool);

    const returnedAccount = await accountRepository.createOrGetExisting({
      authProvider,
      externalId,
      name,
    });

    expect(queryMock.mock.calls.length).toBe(2);
    expect(queryMock.mock.calls[1][0]).toBe('INSERT INTO `account` SET ?');
    expect(queryMock.mock.calls[1][1]).toEqual({
      id,
      auth_provider: authProvider,
      external_id: externalId,
      name,
    });

    expect(returnedAccount).toEqual({
      id,
      externalId,
      authProvider,
      name,
    });
  });
});
