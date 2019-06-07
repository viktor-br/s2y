import redis from 'redis';
import bluebird from 'bluebird';

bluebird.promisifyAll(redis);

const createSessionStorage = (logger, config) => {
  const redisClient = redis.createClient(
    config.get('session.storage.port'),
    config.get('session.storage.host'),
  );
  redisClient.on('connect', () => logger.info('Redis client connected'));
  redisClient.on('error', err => logger.error(`Redis error: ${err}`));

  return redisClient;
};

export default createSessionStorage;
