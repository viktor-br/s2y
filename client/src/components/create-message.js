import React, { Component } from "react";
import {Button, Grid, TextField} from "@material-ui/core";

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
      justify="center"
      spacing={0}
      alignItems="center"
    >
      <Grid item>
        <TextField
          id="message"
          label="Message"
          type="search"
          margin="normal"
          value={this.state.message}
          onChange={
            (e) => this.setState({
              message: e.target.value
            })
          }
        />
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={
            () => this.onCreate(this.state.message)
          }
        >Send</Button>
      </Grid>
    </Grid>
  }
}

export default CreateMessage;
