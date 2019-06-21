import {Grid, Paper, Typography} from "@material-ui/core";
import {DeleteForever} from "@material-ui/icons";
import React, { Component } from "react";

class Message extends Component {
  constructor(props) {
    super(props);

    const { item, onDelete } = props;

    this.item = item;
    this.onDelete = onDelete;
  }

  render() {
    return <Paper className="message">
        <Grid
          container
          justify="space-between"
        >
          <Grid item>
            <Typography>
              {this.item.content}
            </Typography>
          </Grid>
          <Grid
            item
            className="delete"
            onClick={() => this.onDelete(this.item)}
          >
            <DeleteForever/>
            <Typography variant="body2">
              Remove
            </Typography>
          </Grid>
        </Grid>
      </Paper>
  }
}

export default Message;
