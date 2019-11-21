const { gql } = require('apollo-server');

const message = gql`
  type Message {
    id: String!
    content: String!
    createdAt: String!
  }
`;

module.exports = message;
