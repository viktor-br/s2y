const getMessages = require('./query/messages');
const { createMessage, deleteMessage } = require('./mutation/messages');
const { messageCreated, messageDeleted } = require('./subscription/message');

module.exports = {
  Query: {
    getMessages,
  },
  Mutation: {
    createMessage,
    deleteMessage,
  },
  Subscription: {
    messageCreated,
    messageDeleted,
  },
};
