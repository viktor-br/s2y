import React, {Component} from 'react';
import ApolloProvider from "react-apollo/ApolloProvider";
import {Mutation} from "react-apollo";
import {WebSocketLink} from "apollo-link-ws";
import {HttpLink} from "apollo-link-http";
import {split} from "apollo-link";
import {getMainDefinition} from "apollo-utilities";
import {ApolloClient} from "apollo-client";
import {InMemoryCache} from "apollo-cache-inmemory";
import gql from "graphql-tag";

const wsLink = new WebSocketLink({
  uri: 'ws://send2yourself.com/ws/',//process.env.REACT_SEND2YOURSELF_WS_URI,
  options: {
    reconnect: true
  }
});

const httpLink = new HttpLink({
  uri: 'http://send2yourself.com/graphql/',//process.env.REACT_SEND2YOURSELF_URI,
});

const link = split(
  ({query}) => {
    const {kind, operation} = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});

const receiveMessage = gql`
  subscription {
    receiveMessage {
      uuid
      content
      created_at
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
      created_at
    }
  }
`;

class Messages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
    };
  };

  addMessage(message) {
    let messages = this.state.messages;
    messages.push(message);

    this.setState(messages)
  }

  componentDidMount() {
    client.query({
      query: getMessages,
    }).then(
      (data) => {
        let messages = data.data.getMessages;
        this.setState({messages});
      },
      (err) => {
        // TODO cannot get messages
        console.log(err);
      }
    ).catch(
      (error) => {
        console.log(error);
      }
    );
    client.subscribe({
      query: receiveMessage,
    }).subscribe({
      next: (data) => {
        this.addMessage(data.data.receiveMessage);
        console.log(this.state.messages[0]);
      },
      error(value) {
        console.log(value);
      }
    });
  }

  render() {
    let input;

    return <ApolloProvider client={client}>

      <div>
        {
          this.state.messages.map((item, key) =>
            <div>{item.content}</div>
          )
        }
      </div>


      <Mutation mutation={sendMessage}>
        {(sendMessage, {data}) => (
          <div>
            <form
              onSubmit={e => {
                e.preventDefault();
                sendMessage({variables: {content: input.value}});
                input.value = "";
              }}
            >
              <input
                ref={node => {
                  input = node;
                }}
              />
              <button type="submit">Send</button>
            </form>
          </div>
        )}
      </Mutation>
    </ApolloProvider>
  }
}

export default Messages;