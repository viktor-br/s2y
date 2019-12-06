const { gql } = require('apollo-server');

const dateTime = gql`
  scalar DateTime
`;

module.exports = dateTime;
