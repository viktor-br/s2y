import { Card, Typography, CardHeader } from '@material-ui/core';
import { DeleteForever } from '@material-ui/icons';
import React, { Component } from 'react';
import CardContent from '@material-ui/core/CardContent';

class Message extends Component {
  constructor(props) {
    super(props);

    const { item, onDelete } = props;

    this.item = item;
    this.onDelete = onDelete;
  }

  render() {
    return (
      <Card>
        <CardHeader
          action={<DeleteForever onClick={() => this.onDelete(this.item)} />}
          subheader="September 14, 2016"
        />
        <CardContent>
          <Typography>
            {this.item.content}
          </Typography>
        </CardContent>
      </Card>
    );
  }
}

export default Message;
