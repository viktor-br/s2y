import { Card, Typography, CardHeader } from '@material-ui/core';
import { DeleteForever } from '@material-ui/icons';
import React from 'react';
import CardContent from '@material-ui/core/CardContent';

const MessageCard = (props) => {
  const { item, onDelete } = props;
  // TODO handle date properly
  const { content, date } = item;

  return (
    <Card>
      <CardHeader
        action={<DeleteForever onClick={() => onDelete(item)}>Delete</DeleteForever>}
        subheader={date}
      />
      <CardContent data-test-id={item.uuid}>
        <Typography>
          {content}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MessageCard;
