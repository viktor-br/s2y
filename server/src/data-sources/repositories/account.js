import uuidv4 from 'uuid/v4';
import Repository from './repository';

class AccountRepository extends Repository {
  async findByAuthProviderAndExternalId(authProvider, externalId) {
    const [rows] = await this.pool.query(
      'SELECT * FROM `account` WHERE `auth_provider` = ? AND external_id = ?',
      [authProvider, externalId],
    );

    if (rows.length > 0) {
      return rows[0];
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
    // TODO updaet name if needed
    let account = await this.findByAuthProviderAndExternalId(authProvider, externalId);

    if (account) {
      return account;
    }

    account = {
      id: uuidv4(),
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

export default AccountRepository;
