const { gql } = require('apollo-server');

const mutation = gql`
  type Mutation {
    sendMessage(content: String!): Message!
    deleteMessage(uuid: String!): Message
  }
`;

module.exports = mutation;
