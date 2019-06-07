import { gql } from 'apollo-server';

const subscription = gql`
  type Subscription {
    receiveMessage: Message!
  }
`;

export default subscription;
