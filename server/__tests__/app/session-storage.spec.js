const { createSessionStorage, createRedisOnConnectHandler, createRedisOnErrorHandler } = require('../../src/app/session-storage');

describe('createSessionStorage', () => {
  test('redis client creation', async () => {
    const logger = {
      info: () => {},
      error: () => {},
    };
    const config = {
      get: () => {},
    };
    const returnedRedisClient = createSessionStorage(logger, config);

    expect(returnedRedisClient).not.toBeNull();
  });

  test('createRedisOnConnectHandler', () => {
    const loggerInfoMock = jest.fn();
    const logger = {
      info: loggerInfoMock,
    };
    const createRedisOnConnectHandlerFunc = createRedisOnConnectHandler(logger, { host: 'localhost', port: 1234 });
    createRedisOnConnectHandlerFunc();
    expect(loggerInfoMock).toHaveBeenCalled();
  });

  test('createRedisOnErrorHandler', () => {
    const loggerErrorMock = jest.fn();
    const logger = {
      error: loggerErrorMock,
    };
    const createRedisOnErrorHandlerrFunc = createRedisOnErrorHandler(logger);
    createRedisOnErrorHandlerrFunc({ msg: 'something happens' });
    expect(loggerErrorMock).toHaveBeenCalled();
  });
});
