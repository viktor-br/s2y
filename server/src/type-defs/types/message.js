import { gql } from 'apollo-server';

const message = gql`
  type Message {
    uuid: String!
    content: String!
    created_at: String!
  }
`;

export default message;
