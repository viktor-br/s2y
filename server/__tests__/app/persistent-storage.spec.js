const { createPersistentStoragePool } = require('../../src/app');

describe('createSessionStorage', () => {
  test('redis client', async () => {
    const config = {
      get: () => '12345',
    };
    const promisifiedPool = createPersistentStoragePool(config);

    expect(promisifiedPool).not.toBeNull();
  });
});