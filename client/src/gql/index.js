import gql from 'graphql-tag';

const receiveMessage = gql`
  subscription {
    receiveMessage {
      id
      content
      createdAt
    }
  }
`;

const removeMessage = gql`
  subscription {
    removeMessage {
      id
    }
  }
`;

const sendMessage = gql`
  mutation SendMessage($content: String!) {
    sendMessage(content: $content) {
      id
      content
      createdAt
    }
  }
`;

const deleteMessage = gql`
  mutation DeleteMessage($id: String!) {
    deleteMessage(id: $id) {
      id
      content
      createdAt
    }
  }
`;

const getMessages = gql`
  query {
    getMessages {
      id
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
