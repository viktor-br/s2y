const getMessages = require('./query/messages');
const sendMessage = require('./mutation/messages');
const receiveMessage = require('./subscription/message');

const createResolvers = () => ({
  Query: {
    getMessages,
  },
  Mutation: {
    sendMessage,
  },
  Subscription: {
    receiveMessage,
  },
});

module.exports = createResolvers;
