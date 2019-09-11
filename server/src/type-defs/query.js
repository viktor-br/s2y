const { gql } = require('apollo-server');

const query = gql`
  type Query {
    getMessages: [Message!]!
  }
`;

module.exports = query;
