const getMessages = require('./query/messages');
const myProfile = require('./query/my-profile');
const DateTime = require('./scalar/date-time');
const { createMessage, deleteMessage } = require('./mutation/messages');
const { messageCreated, messageDeleted } = require('./subscription/message');

module.exports = {
  Query: {
    myProfile,
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
  DateTime,
};
