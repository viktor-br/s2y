const { withFilter } = require('apollo-server');

const receiveMessage = {
  subscribe: withFilter(
    (_, __, { pubsub }) => pubsub.asyncIterator('receiveMessage'),
    ({ receiveMessage: { userUUID } }, variables, { user: { uuid } }) =>
      uuid && userUUID && uuid === userUUID,
  ),
};

const removeMessage = {
  subscribe: withFilter(
    (_, __, { pubsub }) => pubsub.asyncIterator('removeMessage'),
    ({ removeMessage: { userUUID } }, variables, { user: { uuid } }) =>
      uuid && userUUID && uuid === userUUID,
  ),
};

module.exports = { receiveMessage, removeMessage };
