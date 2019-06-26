import React, { Component } from "react";
import { Button, Grid, TextField } from "@material-ui/core";
import CreateMessageSend from "./create-message-send";

class CreateMessage extends Component {
  constructor(props) {
    super(props);

    const { message = '', onCreate } = props;

    this.onCreate = onCreate;
    this.state = { message };
  }

  render() {
    return <Grid
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
          value={this.state.message}
          onChange={
            (e) => this.setState({
              message: e.target.value
            })
          }
        />
      </Grid>
      <Grid item>
        <CreateMessageSend
          onClick={
            () => this.onCreate(this.state.message)
          }
        />
      </Grid>
    </Grid>
  }
}

export default CreateMessage;
