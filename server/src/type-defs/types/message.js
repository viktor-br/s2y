const { gql } = require('apollo-server');

const message = gql`
  type Message {
    uuid: String!
    content: String!
    createdAt: String!
  }
`;

module.exports = message;
