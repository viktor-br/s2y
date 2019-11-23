const { gql } = require('apollo-server');

const query = gql`
  type Query {
    myProfile: MyProfile
    getMessages: [Message!]!
  }
`;

module.exports = query;
