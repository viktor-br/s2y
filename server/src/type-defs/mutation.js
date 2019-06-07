import { gql } from 'apollo-server';

const mutation = gql`
  type Mutation {
    sendMessage(content: String!): Message!
  }
`;

export default mutation;
