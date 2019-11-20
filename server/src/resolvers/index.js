const getMessages = require('./query/messages');
const { sendMessage, deleteMessage } = require('./mutation/messages');
const { receiveMessage, removeMessage } = require('./subscription/message');

module.exports = {
  Query: {
    getMessages,
  },
  Mutation: {
    sendMessage,
    deleteMessage,
  },
  Subscription: {
    receiveMessage,
    removeMessage,
  },
};
