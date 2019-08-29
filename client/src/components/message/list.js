import React, { useEffect, useRef } from 'react';
import { useQuery, useSubscription } from '@apollo/react-hooks';
import { Grid, makeStyles } from '@material-ui/core';
import {
  receiveMessage,
  getMessages,
} from '../../gql';
import NewMessage from './new';
import MessageCard from './card';

const useStyles = makeStyles(
  () => ({
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

const scrollToRef = (ref) => {
  if (ref.current) {
    ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const MessageList = () => {
  const messagesEndRef = useRef(null);
  const classes = useStyles();
  const { data, loading, error } = useQuery(getMessages);
  const { data: subscriptionData } = useSubscription(receiveMessage);

  useEffect(() => scrollToRef(messagesEndRef));

  if (loading) return <p>Loading...</p>;
  if (error) return <p>ERROR</p>;

  let { getMessages: messages } = data;
  if (subscriptionData) {
    const { receiveMessage: newMessage } = subscriptionData;
    messages = [...messages, newMessage];
  }

  return (
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
        <NewMessage
          className={classes.createMessage}
        />
      </Grid>
    </Grid>
  );
};

export default MessageList;
