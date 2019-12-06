const { gql } = require('apollo-server');

const message = gql`
  type Message {
    id: String!
    content: String!
    createdAt: DateTime!
  }
`;

module.exports = message;
