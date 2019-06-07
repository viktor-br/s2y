import { gql } from 'apollo-server';

const query = gql`
  type Query {
    getMessages: [Message!]!
    
  }
`;

export default query;
