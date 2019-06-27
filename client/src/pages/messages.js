import React, { Component } from 'react';
import ApolloProvider from 'react-apollo/ApolloProvider';
import { Mutation } from 'react-apollo';
import { WebSocketLink } from 'apollo-link-ws';
import { HttpLink } from 'apollo-link-http';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { Grid } from '@material-ui/core';
import {
  receiveMessage,
  sendMessage,
  getMessages,
} from '../gql';
import { Message, CreateMessage } from '../components';

const wsLink = new WebSocketLink({
  uri: process.env.REACT_APP_SEND2YOURSELF_WS_URI,
  options: {
    reconnect: true,
  },
});

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_SEND2YOURSELF_URI,
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});


class Messages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    client.query({
      query: getMessages,
    }).then(
      (data) => {
        const messages = data.data.getMessages;
        this.setState({ messages });
      },
      (err) => {
        // TODO cannot get messages
        console.log(err);
      },
    ).catch(
      (error) => {
        console.log(error);
      },
    );
    client.subscribe({
      query: receiveMessage,
    }).subscribe({
      next: (data) => {
        this.addMessage(data.data.receiveMessage);
        const { messages } = data.data;
        console.log(messages[0]);
      },
      error(value) {
        console.log(value);
      },
    });
  }

  addMessage(message) {
    const { messages } = this.state;
    messages.push(message);

    this.setState(messages);
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Grid item>
            <Grid
              container
              direction="column"
              spacing={1}
            >
              {
                this.state.messages.map(item => (
                  <Grid item key={item.uuid}>
                    <Message
                      item={item}
                      onDelete={msg => console.log(msg)}
                    />
                  </Grid>
                ))
              }
            </Grid>
          </Grid>
          <Grid item>
            <Mutation mutation={sendMessage}>
              {
                sendMessageHandler => (
                  <CreateMessage
                    onCreate={
                      content => sendMessageHandler({ variables: { content } })
                    }
                  />
                )
              }
            </Mutation>
          </Grid>
        </Grid>
      </ApolloProvider>
    );
  }
}

export default Messages;
