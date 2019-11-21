const { gql } = require('apollo-server');

const subscription = gql`
  type Subscription {
    messageCreated: Message!
    messageDeleted: Message!
  }
`;

module.exports = subscription;
