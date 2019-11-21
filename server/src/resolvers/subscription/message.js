const { withFilter } = require('apollo-server');

const messageCreated = {
  subscribe: withFilter(
    (_, __, { pubsub }) => pubsub.asyncIterator('messageCreated'),
    ({ messageCreated: { userID } }, variables, { user: { id } }) =>
      id && userID && id === userID,
  ),
};

const messageDeleted = {
  subscribe: withFilter(
    (_, __, { pubsub }) => pubsub.asyncIterator('messageDeleted'),
    ({ messageDeleted: { userID } }, variables, { user: { id } }) =>
      id && userID && id === userID,
  ),
};

module.exports = { messageCreated, messageDeleted };
