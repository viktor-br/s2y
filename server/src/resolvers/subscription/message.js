const { withFilter } = require('apollo-server');

const receiveMessage = {
  subscribe: withFilter(
    (_, __, { pubsub }) => pubsub.asyncIterator('receiveMessage'),
    ({ receiveMessage: { userID } }, variables, { user: { id } }) =>
      id && userID && id === userID,
  ),
};

const removeMessage = {
  subscribe: withFilter(
    (_, __, { pubsub }) => pubsub.asyncIterator('removeMessage'),
    ({ removeMessage: { userID } }, variables, { user: { id } }) =>
      id && userID && id === userID,
  ),
};

module.exports = { receiveMessage, removeMessage };
