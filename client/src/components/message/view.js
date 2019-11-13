import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Grid, makeStyles } from '@material-ui/core';
import { getMessages } from '../../gql';
import NewMessage from './new';
import MessageList from './list';

const useStyles = makeStyles(() => ({
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
  createMessage: {
    width: '99%',
    height: '20vh',
  },
}));

const MessageView = () => {
  const classes = useStyles();
  const { data, loading, error } = useQuery(getMessages);

  // TODO what if query failed, but subscription not?!
  if (loading) return <p>Loading...</p>;
  if (error) return <p>ERROR</p>;
  const { getMessages: messages = [] } = data || {};

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      className={classes.messages}
    >
      <Grid item className={classes.messagesItem}>
        <MessageList messages={messages} />
      </Grid>
      <Grid item className={classes.createMessage}>
        <NewMessage className={classes.createMessage} />
      </Grid>
    </Grid>
  );
};

export default MessageView;
