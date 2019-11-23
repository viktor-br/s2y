const { gql } = require('apollo-server');

const myProfile = gql`
  type MyProfile {
    id: String!
    name: String
    pictureUrl: String
  }
`;

module.exports = myProfile;
