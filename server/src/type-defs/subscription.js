const { gql } = require('apollo-server');

const subscription = gql`
  type Subscription {
    receiveMessage: Message!
    removeMessage: Message!
  }
`;

module.exports = subscription;
