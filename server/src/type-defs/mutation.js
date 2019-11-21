const { gql } = require('apollo-server');

const mutation = gql`
  type Mutation {
    createMessage(content: String!): Message!
    deleteMessage(id: String!): Message
  }
`;

module.exports = mutation;
