import gql from 'graphql-tag';

const receiveMessage = gql`
  subscription {
    receiveMessage {
      uuid
      content
      createdAt
    }
  }
`;

const removeMessage = gql`
  subscription {
    removeMessage {
      uuid
    }
  }
`;

const sendMessage = gql`
  mutation SendMessage($content: String!) {
    sendMessage(content: $content) {
      uuid
      content
      createdAt
    }
  }
`;

const deleteMessage = gql`
  mutation DeleteMessage($uuid: String!) {
    deleteMessage(uuid: $uuid) {
      uuid
      content
      createdAt
    }
  }
`;

const getMessages = gql`
  query {
    getMessages {
      uuid
      content
      createdAt
    }
  }
`;

export {
  receiveMessage,
  sendMessage,
  getMessages,
  deleteMessage,
  removeMessage,
};
