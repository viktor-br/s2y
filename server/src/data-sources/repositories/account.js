const uuidv4 = require('uuid/v4');
const Repository = require('./repository');

class AccountRepository extends Repository {
  async findByAuthProviderAndExternalId(authProvider, externalId) {
    const [rows] = await this.pool.query(
      'SELECT * FROM `account` WHERE `auth_provider` = ? AND external_id = ?',
      [authProvider, externalId],
    );

    if (!rows) {
      return null;
    }

    if (rows.length === 0) {
      return null;
    }

    const {
      uuid,
      name,
      picture,
      created_at: createdAt,
    } = rows[0];

    return {
      uuid,
      authProvider,
      externalId,
      name,
      picture,
      createdAt,
    };
  }

  async createOrGetExisting(
    {
      authProvider,
      externalId,
      name,
      picture,
      createdAt,
    },
  ) {
    // TODO update name if needed
    const account = await this.findByAuthProviderAndExternalId(authProvider, externalId);

    if (account) {
      return account;
    }

    const uuid = uuidv4();

    await this.pool.query(
      'INSERT INTO `account` SET ?',
      {
        uuid,
        auth_provider: authProvider,
        external_id: externalId,
        name,
        picture,
        created_at: createdAt,
      },
    );

    return {
      uuid,
      authProvider,
      externalId,
      name,
      picture,
      createdAt,
    };
  }
}

module.exports = AccountRepository;
