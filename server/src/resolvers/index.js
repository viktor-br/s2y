import { getMessages, sendMessage } from './query/messages';
import receiveMessage from './subscription/message';

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

export default createResolvers;
