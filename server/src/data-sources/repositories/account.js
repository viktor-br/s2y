const uuidv4 = require('uuid/v4');
const Repository = require( './repository');

class AccountRepository extends Repository {
  async findByAuthProviderAndExternalId(authProvider, externalId) {
    const [rows] = await this.pool.query(
      'SELECT * FROM `account` WHERE `auth_provider` = ? AND external_id = ?',
      [authProvider, externalId],
    );

    if (rows.length > 0) {
      const { uuid, name } = rows[0];

      return {
        uuid,
        authProvider,
        externalId,
        name,
      };
    }

    return null;
  }

  async createOrGetExisting(
    {
      authProvider,
      externalId,
      name,
    },
  ) {
    // TODO update name if needed
    let account = await this.findByAuthProviderAndExternalId(authProvider, externalId);

    if (account) {
      return account;
    }

    account = {
      uuid: uuidv4(),
      auth_provider: authProvider,
      external_id: externalId,
      name,
    };

    await this.pool.query(
      'INSERT INTO `account` SET ?',
      account,
    );

    return account;
  }
}

module.exports = AccountRepository;
