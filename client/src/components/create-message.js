import React, { useState } from 'react';
import { Grid, TextField } from '@material-ui/core';
import CreateMessageSend from './create-message-send';

function CreateMessage(props) {
  const { message: initMessage, onCreate } = props;

  const [message, setMessage] = useState(initMessage);

  return (
    <Grid
      container
      direction="row"
      justify="flex-end"
      spacing={0}
      alignItems="flex-end"
    >
      <Grid item>
        <TextField
          id="message"
          label="Message"
          multiline
          rows="3"
          margin="normal"
          variant="outlined"
          value={message}
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
