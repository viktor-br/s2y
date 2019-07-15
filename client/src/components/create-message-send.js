import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import { Send } from '@material-ui/icons';

const useStyles = makeStyles(
  theme => ({
    createMessageSend: {
      // bottom: theme.spacing(7),
      // right: theme.spacing(2),
    },
  }),
);

function CreateMessageSend(props) {
  const { onClick } = props;
  const classes = useStyles();

  return (
    <Fab
      size="small"
      color="primary"
      aria-label="Add"
      className={classes.createMessageSend}
      onClick={onClick}
    >
      <Send />
    </Fab>
  );
}

export default CreateMessageSend;
