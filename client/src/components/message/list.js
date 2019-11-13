import React, { useEffect, useRef, useState } from 'react';
import { useSubscription, useMutation } from '@apollo/react-hooks';
import { Grid, makeStyles } from '@material-ui/core';
import { receiveMessage, deleteMessage, removeMessage } from '../../gql';
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

const MessageList = ({ messages: initMessages }) => {
  const messagesEndRef = useRef(null);
  const classes = useStyles();
  const [messages, setMessages] = useState(initMessages);
  useSubscription(removeMessage, {
    onSubscriptionData: ({
      subscriptionData: {
        data: { removeMessage: removedMessage },
      },
    }) =>
      setMessages(
        messages.filter((message) => message.uuid !== removedMessage.uuid),
      ),
  });
  useSubscription(receiveMessage, {
    onSubscriptionData: ({
      subscriptionData: {
        data: { receiveMessage: receivedMessage },
      },
    }) => setMessages([...messages, receivedMessage]),
  });

  const [deleteMessageHandler] = useMutation(deleteMessage);

  const onDelete = ({ uuid }) => deleteMessageHandler({ variables: { uuid } });

  useEffect(() => scrollToRef(messagesEndRef));

  return (
    <Grid container direction="column">
      {messages.map((item) => (
        <Grid item key={item.uuid} className={classes.message}>
          <MessageCard item={item} onDelete={onDelete} />
        </Grid>
      ))}
      <Grid item ref={messagesEndRef} className={classes.message} />
    </Grid>
  );
};

export default MessageList;
