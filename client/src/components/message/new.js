import React, { useState } from 'react';
import { Grid, makeStyles, TextField, Fab } from '@material-ui/core';
import { Send } from '@material-ui/icons';
import { useMutation } from '@apollo/react-hooks';
import { sendMessage } from '../../gql';

const useStyles = makeStyles(() => ({
  createMessage: {
    width: '85%',
  },
  createMessageText: {
    width: '100%',
    margin: 0,
  },
  createMessageSend: {
    padding: '3px',
  },
}));

const NewMessage = () => {
  const [message, setMessage] = useState('');
  const [saveMessage, { data }] = useMutation(sendMessage, {
    onCompleted: () => setMessage(''),
  });
  const classes = useStyles();

  return (
    <Grid
      container
      direction="row"
      justify="flex-start"
      alignItems="flex-end"
      spacing={0}
    >
      <Grid item className={classes.createMessage}>
        <TextField
          id="message"
          label="Message"
          multiline
          rows="3"
          margin="normal"
          variant="outlined"
          value={message}
          aria-label="Add Message Content"
          className={classes.createMessageText}
          onChange={(e) => setMessage(e.target.value)}
        />
      </Grid>
      <Grid item className={classes.createMessageSend}>
        <Fab
          id="add-message"
          size="small"
          color="primary"
          aria-label="Add Message"
          className={classes.createMessageSend}
          onClick={() => saveMessage({ variables: { content: message } })}
        >
          <Send />
        </Fab>
      </Grid>
    </Grid>
  );
};

export default NewMessage;
