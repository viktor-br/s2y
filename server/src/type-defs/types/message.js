import { gql } from 'apollo-server';

const message = gql`
  type Message {
    uuid: String!
    content: String!
    createdAt: String!
  }
`;

export default message;
