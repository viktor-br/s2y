const { gql } = require('apollo-server');

const mutation = gql`
  type Mutation {
    sendMessage(content: String!): Message!
  }
`;

module.exports = mutation;
