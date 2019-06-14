const getMessages = require('./query/messages');
const sendMessage = require('./mutation/messages');
const receiveMessage = require('./subscription/message');

module.exports = {
  Query: {
    getMessages,
  },
  Mutation: {
    sendMessage,
  },
  Subscription: {
    receiveMessage,
  },
};
