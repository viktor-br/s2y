const { Kind } = require('graphql/language');
const DateTime = require('../../../src/resolvers/scalar/date-time');

describe('DateTime', () => {
  test('parseValue', () => {
    const d = new Date(Date.now());
    const resultDate = DateTime.parseValue(d.toISOString());
    expect(resultDate).toEqual(d);
  });

  test('serialise timestamp', () => {
    const timestamp = Date.now();
    const resultDate = DateTime.serialize(timestamp);
    expect(resultDate).toEqual(timestamp);
  });

  test('serialise date', () => {
    const timestamp = Date.now();
    const d = new Date(timestamp);
    const resultDate = DateTime.serialize(d);
    expect(resultDate).toEqual(timestamp);
  });

  test('parseLiteral valid', () => {
    const timestamp = Date.now();
    const d = new Date(timestamp);
    const resultDate = DateTime.parseLiteral({
      kind: Kind.INT,
      value: timestamp,
    });
    expect(resultDate).toEqual(d);
  });

  test('parseLiteral invalid', () => {
    const resultDate = DateTime.parseLiteral({});
    expect(resultDate).toBeNull();
  });
});
