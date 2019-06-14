const config = require('../../src/config');

describe('config', () => {
  test('get value from config', async () => {
    expect(config.get('db.host')).toBe('localhost');
  });
});