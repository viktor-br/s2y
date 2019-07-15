import React, { useState } from 'react';
import {Grid, makeStyles, TextField} from '@material-ui/core';
import CreateMessageSend from './create-message-send';

const useStyles = makeStyles(
  theme => ({
    createMessage: {
      width: '85%',
    },
    createMessageText: {
      width: '100%',
    },
  }),
);

function CreateMessage(props) {
  const { message: initMessage, onCreate } = props;

  const [message, setMessage] = useState(initMessage);

  const classes = useStyles();

  return (
    <Grid
      container
      direction="row"
      justify="flex-start"
      alignItems="flex-end"
      spacing={0}
    >
      <Grid
        item
        className={classes.createMessage}
      >
        <TextField
          id="message"
          label="Message"
          multiline
          rows="3"
          margin="normal"
          variant="outlined"
          value={message}
          className={classes.createMessageText}
          onChange={
            e => setMessage(e.target.value)
          }
        />
      </Grid>
      <Grid item>
        <CreateMessageSend
          onClick={
            () => onCreate(message)
          }
        />
      </Grid>
    </Grid>
  );
}

export default CreateMessage;
