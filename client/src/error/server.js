import { has } from 'lodash';

const ERR_UNAUTHENTICATED = 'UNAUTHENTICATED';
const ERR_INTERNAL = 'INTERNAL';

const parseServerError = (error) => {
  if (!error) {
    return null;
  }

  if (
    has(error, 'networkError.result.errors') &&
    error.networkError.result.errors.length > 0
  ) {
    const err = error.networkError.result.errors[0];
    if (
      has(err, 'extensions.code') &&
      err.extensions.code === 'UNAUTHENTICATED'
    ) {
      return ERR_UNAUTHENTICATED;
    }
  }

  return ERR_INTERNAL;
};

export { parseServerError, ERR_UNAUTHENTICATED, ERR_INTERNAL };
