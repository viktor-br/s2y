const { gql } = require('apollo-server');

const subscription = gql`
  type Subscription {
    receiveMessage: Message!
  }
`;

module.exports = subscription;
