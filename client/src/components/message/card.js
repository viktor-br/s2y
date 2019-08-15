import { Card, Typography, CardHeader } from '@material-ui/core';
import { DeleteForever } from '@material-ui/icons';
import React from 'react';
import CardContent from '@material-ui/core/CardContent';

function MessageCard(props) {
  const { item, onDelete } = props;

  const { content } = item;

  return (
    <Card>
      <CardHeader
        action={<DeleteForever onClick={() => onDelete(item)} />}
        subheader="September 14, 2016"
      />
      <CardContent>
        <Typography>
          {content}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default MessageCard;
