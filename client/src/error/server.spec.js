import { parseServerError, ERR_UNAUTHENTICATED, ERR_INTERNAL } from './server';

describe('parseServerError', () => {
  test('no error', () => {
    expect(parseServerError(null)).toBeNull();
  });
  test('not a network error', () => {
    expect(parseServerError({})).toEqual(ERR_INTERNAL);
  });

  test('unauthenticated error', () => {
    expect(
      parseServerError({
        networkError: {
          result: { errors: [{ extensions: { code: 'UNAUTHENTICATED' } }] },
        },
      }),
    ).toEqual(ERR_UNAUTHENTICATED);
  });

  test('other than unauthenticated error', () => {
    expect(
      parseServerError({
        networkError: {
          result: { errors: [{ extensions: { code: 'UNKNOWN' } }] },
        },
      }),
    ).toEqual(ERR_INTERNAL);
  });
});
