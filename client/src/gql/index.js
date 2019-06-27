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

const sendMessage = gql`
    mutation SendMessage ($content: String!) {
        sendMessage(content: $content) {
            content
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
};
