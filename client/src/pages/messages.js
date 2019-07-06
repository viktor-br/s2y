import React, { Component } from 'react';
import ApolloProvider from 'react-apollo/ApolloProvider';
import { Mutation } from 'react-apollo';
import { Grid } from '@material-ui/core';
import {
  receiveMessage,
  sendMessage,
  getMessages,
} from '../gql';
import { Message, CreateMessage } from '../components';
import { CreateApiClient } from '../api';

const ApiClient = CreateApiClient();

class Messages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    ApiClient.query({
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
    ApiClient.subscribe({
      query: receiveMessage,
    }).subscribe({
      next: (data) => {
        this.addMessage(data.data.receiveMessage);
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
      <ApolloProvider client={ApiClient}>
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
