const { withFilter } = require('apollo-server');

const receiveMessage = {
  subscribe: withFilter(
    (_, __, { pubsub }) => pubsub.asyncIterator('messages'),
    ({ receiveMessage: { userUUID } }, variables, { user: { uuid } }) => uuid && userUUID && uuid === userUUID,
  ),
};

module.exports = receiveMessage;
