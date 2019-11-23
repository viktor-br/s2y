const { withFilter } = require('apollo-server');

const messageCreated = {
  subscribe: withFilter(
    (_, __, { pubsub }) => pubsub.asyncIterator('messageCreated'),
    ({ messageCreated: { userId } }, variables, { user: { id } }) =>
      id && userId && id === userId,
  ),
};

const messageDeleted = {
  subscribe: withFilter(
    (_, __, { pubsub }) => pubsub.asyncIterator('messageDeleted'),
    ({ messageDeleted: { userId } }, variables, { user: { id } }) =>
      id && userId && id === userId,
  ),
};

module.exports = { messageCreated, messageDeleted };
