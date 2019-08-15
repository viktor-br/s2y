import React, { useState } from 'react';
import {
  Grid,
  makeStyles,
  TextField,
  Fab,
} from '@material-ui/core';
import { Send } from '@material-ui/icons';

const useStyles = makeStyles(
  theme => ({
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
  }),
);

function NewMessage(props) {
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
      <Grid
        item
        className={classes.createMessageSend}
      >
        <Fab
          size="small"
          color="primary"
          aria-label="Add"
          className={classes.createMessageSend}
          onClick={() => onCreate(message)}
        >
          <Send />
        </Fab>
      </Grid>
    </Grid>
  );
}

export default NewMessage;
