import gql from 'graphql-tag';

const SUBSCRIPTION_MESSAGE_CREATED = gql`
  subscription {
    messageCreated {
      id
      content
      createdAt
    }
  }
`;

const SUBSCRIPTION_MESSAGE_DELETED = gql`
  subscription {
    messageDeleted {
      id
    }
  }
`;

const MUTATION_CREATE_MESSAGE = gql`
  mutation CreateMessage($content: String!) {
    createMessage(content: $content) {
      id
      content
      createdAt
    }
  }
`;

const MUTATION_DELETE_MESSAGE = gql`
  mutation DeleteMessage($id: String!) {
    deleteMessage(id: $id) {
      id
      content
      createdAt
    }
  }
`;

const QUERY_GET_MESSAGES = gql`
  query {
    getMessages {
      id
      content
      createdAt
    }
  }
`;

export {
  SUBSCRIPTION_MESSAGE_CREATED,
  MUTATION_CREATE_MESSAGE,
  QUERY_GET_MESSAGES,
  MUTATION_DELETE_MESSAGE,
  SUBSCRIPTION_MESSAGE_DELETED,
};
