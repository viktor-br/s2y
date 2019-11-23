import { Card, Typography, CardHeader } from '@material-ui/core';
import { DeleteForever } from '@material-ui/icons';
import React from 'react';
import CardContent from '@material-ui/core/CardContent';

const MessageCard = (props) => {
  const { item, onDelete } = props;
  const { content, createdAt } = item;
  // TODO refactor date
  const createdAtTimestamp = parseInt(createdAt, 10);
  const createdAtDate = createdAtTimestamp ? (new Date(createdAtTimestamp)).toLocaleString() : '';

  return (
    <Card>
      <CardHeader
        action={<DeleteForever onClick={() => onDelete(item)}>Delete</DeleteForever>}
        subheader={createdAtDate}
      />
      <CardContent>
        <Typography>
          {content}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MessageCard;
