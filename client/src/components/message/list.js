import React, { useState, useEffect, useRef } from 'react';
import ApolloProvider from 'react-apollo/ApolloProvider';
import { Mutation } from 'react-apollo';
import { Grid, makeStyles } from '@material-ui/core';
import {
  receiveMessage,
  sendMessage,
  getMessages,
} from '../../gql';
import NewMessage from './new';
import MessageCard from './card';
import { CreateApiClient } from '../../api';

const ApiClient = CreateApiClient();

const useStyles = makeStyles(
  theme => ({
    messages: {
      height: '90vh',
      // paddingTop: '10px',
      flexWrap: 'nowrap',
      padding: '3px',
    },
    messagesItem: {
      height: '80vh',
      overflow: 'scroll',
      width: '99%',
    },
    message: {
      margin: '1px',
      paddingTop: '10px',
    },
    createMessage: {
      width: '99%',
      height: '20vh',
    },
  }),
);

const scrollToRef = ref => ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });

function MessageList() {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

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

  useEffect(() => scrollToRef(messagesEndRef));

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
          >
            {
              messages.map(item => (
                <Grid item key={item.uuid} className={classes.message}>
                  <MessageCard
                    item={item}
                    onDelete={msg => console.log(msg)}
                  />
                </Grid>
              ))
            }
            <Grid item ref={messagesEndRef} className={classes.message} />
          </Grid>
        </Grid>
        <Grid item className={classes.createMessage}>
          <Mutation mutation={sendMessage}>
            {
              sendMessageHandler => (
                <NewMessage
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

export default MessageList;
