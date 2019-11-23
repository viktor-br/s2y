const uuidv4 = require('uuid/v4');
const Repository = require('./repository');

class AccountRepository extends Repository {
  async findById(id) {
    const [rows] = await this.pool.query(
      'SELECT * FROM `account` WHERE `id` = ?',
      [id],
    );

    if (!rows) {
      return null;
    }

    if (rows.length === 0) {
      return null;
    }

    const {
      name,
      auth_provider: authProvider,
      external_id: externalId,
      picture,
      created_at: createdAt,
    } = rows[0];

    return {
      id,
      authProvider,
      externalId,
      name,
      picture,
      createdAt,
    };
  }

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

    const { id, name, picture, created_at: createdAt } = rows[0];

    return {
      id,
      authProvider,
      externalId,
      name,
      picture,
      createdAt,
    };
  }

  async createOrGetExisting({
    authProvider,
    externalId,
    name,
    picture,
    createdAt,
  }) {
    // TODO update name if needed
    const account = await this.findByAuthProviderAndExternalId(
      authProvider,
      externalId,
    );

    if (account) {
      return account;
    }

    const id = uuidv4();

    await this.pool.query('INSERT INTO `account` SET ?', {
      id,
      auth_provider: authProvider,
      external_id: externalId,
      name,
      picture,
      created_at: createdAt,
    });

    return {
      id,
      authProvider,
      externalId,
      name,
      picture,
      createdAt,
    };
  }
}

module.exports = AccountRepository;
