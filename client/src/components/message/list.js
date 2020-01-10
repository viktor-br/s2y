import React, { useEffect, useRef, useState } from 'react';
import { useSubscription, useMutation } from '@apollo/react-hooks';
import { Grid, makeStyles } from '@material-ui/core';
import {
  SUBSCRIPTION_MESSAGE_CREATED,
  SUBSCRIPTION_MESSAGE_DELETED,
  MUTATION_DELETE_MESSAGE,
} from '../../gql';
import MessageCard from './card';

const useStyles = makeStyles(() => ({
  message: {
    margin: '1px',
    paddingTop: '10px',
  },
}));

const scrollToRef = (ref) => {
  if (ref.current && ref.current.scrollIntoView) {
    ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const MessageList = ({ messages: initMessages = [] }) => {
  const messagesEndRef = useRef(null);
  const classes = useStyles();
  const [messages, setMessages] = useState(initMessages);
  useSubscription(SUBSCRIPTION_MESSAGE_DELETED, {
    onSubscriptionData: ({
      subscriptionData: {
        data: { messageDeleted: deletedMessage },
      },
    }) =>
      setMessages(
        messages.filter((message) => message.id !== deletedMessage.id),
      ),
  });
  useSubscription(SUBSCRIPTION_MESSAGE_CREATED, {
    onSubscriptionData: ({
      subscriptionData: {
        data: { messageCreated: createdMessage },
      },
    }) => setMessages([...messages, createdMessage]),
  });

  const [deleteMessageHandler] = useMutation(MUTATION_DELETE_MESSAGE);

  const onDelete = ({ id }) => deleteMessageHandler({ variables: { id } });

  useEffect(() => scrollToRef(messagesEndRef));

  return (
    <Grid container direction="column">
      {messages.map((item) => (
        <Grid item key={item.id} className={classes.message}>
          <MessageCard item={item} onDelete={onDelete} />
        </Grid>
      ))}
      <Grid item ref={messagesEndRef} className={classes.message} />
    </Grid>
  );
};

export default MessageList;
