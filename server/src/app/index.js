const { createSessionStorage } = require('./session-storage');
const { createPersistentStoragePool } = require('./persistent-storage');
const { createContext } = require('./context');
const { createAuthHandler, createLogoutHandler } = require('./handlers');
const { createSubscriptionOnConnectHandler } = require('./subscriptions');
const authenticateUser = require('./authenticate-user');

module.exports = {
  createSessionStorage,
  createPersistentStoragePool,
  createContext,
  createAuthHandler,
  createLogoutHandler,
  createSubscriptionOnConnectHandler,
  authenticateUser,
};
