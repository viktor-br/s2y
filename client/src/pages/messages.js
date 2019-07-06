import React, { useState, useEffect } from 'react';
import ApolloProvider from 'react-apollo/ApolloProvider';
import { Mutation } from 'react-apollo';
import { Grid, makeStyles } from '@material-ui/core';
import {
  receiveMessage,
  sendMessage,
  getMessages,
} from '../gql';
import { Message, CreateMessage } from '../components';
import { CreateApiClient } from '../api';

const ApiClient = CreateApiClient();

const useStyles = makeStyles(
  theme => ({
    messages: {
      paddingTop: '10px',
    },
    messagesItem: {
      height: '80vh',
      overflow: 'auto',
      width: '99%',
    },
    message: {
      margin: '1px',
    },
    createMessage: {
      width: '99%',
    },
  }),
);

function Messages() {
  const [messages, setMessages] = useState([]);

  const classes = useStyles();

  useEffect(
    () => {
      ApiClient.query({
        query: getMessages,
      }).then(
        (data) => {
          setMessages(data.data.getMessages);
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
    },
    [],
  );

  useEffect(
    () => {
      ApiClient.subscribe({
        query: receiveMessage,
      }).subscribe({
        next: (data) => {
          setMessages(currentMessages => [...currentMessages, data.data.receiveMessage]);
        },
        error(value) {
          console.log(value);
        },
      });
    },
    [],
  );

  return (
    <ApolloProvider client={ApiClient}>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.messages}
      >
        <Grid
          item
          className={classes.messagesItem}
        >
          <Grid
            container
            direction="column"
            spacing={1}
          >
            {
              messages.map(item => (
                <Grid item key={item.uuid} className={classes.message}>
                  <Message
                    item={item}
                    onDelete={msg => console.log(msg)}
                  />
                </Grid>
              ))
            }
          </Grid>
        </Grid>
        <Grid item className={classes.createMessage}>
          <Mutation mutation={sendMessage}>
            {
              sendMessageHandler => (
                <CreateMessage
                  className={classes.createMessage}
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

export default Messages;
