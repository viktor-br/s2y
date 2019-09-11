const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis);

const createRedisOnConnectHandler = (logger, { host, port }) => () =>
  logger.info(`Redis client connected to ${host}:${port}`);
const createRedisOnErrorHandler = (logger) => (err) =>
  logger.error(`Redis error: ${err}`);

const createSessionStorage = (logger, config) => {
  const host = config.get('session.storage.host');
  const port = config.get('session.storage.port');
  const redisClient = redis.createClient(port, host);
  redisClient.on(
    'connect',
    createRedisOnConnectHandler(logger, { host, port }),
  );
  redisClient.on('error', createRedisOnErrorHandler(logger));

  return redisClient;
};

module.exports = {
  createSessionStorage,
  createRedisOnConnectHandler,
  createRedisOnErrorHandler,
};
