const { PubSub } = require('graphql-subscriptions');
const { Subscription: { receiveMessage } } = require('../../../src/resolvers');

describe('receiveMessage', () => {
  test('proper recipient', async () => {
    const userUUID = '12345';
    const context = {
      pubsub: new PubSub(),
      user: { uuid: userUUID },
    };
    const iterator = await receiveMessage.subscribe({ receiveMessage: { userUUID } }, null, context);
    expect(() => {
      context.pubsub.publish('messages', { messages: { content: 'text' } });
      iterator.next();
    });
  });

  test('wrong recipient', async () => {
    const userUUID = '12345';
    const context = {
      pubsub: new PubSub(),
      user: { uuid: userUUID },
    };
    const content = 'text';
    const payload = {
      receiveMessage: {
        uuid: '67890',
        userUUID,
        createdAt: new Date(Date.now()),
        content,
      },
    };
    const iterator = await receiveMessage.subscribe({ receiveMessage: { userUUID: '55555' } }, null, context);

    iterator.next().then(({ value }) => expect(value).toEqual(payload));

    return context.pubsub.publish('messages', payload);
  });
});
