import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Fab from "@material-ui/core/Fab";
import { Done } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
    fab: {
      bottom: theme.spacing(2),
      right: theme.spacing(6),
    },
  })
);
export default function CreateMessageSend(props) {
  const { onClick } = props;
  const classes = useStyles();
  const theme = useTheme();
  return <Fab
    size="small"
    color="primary"
    aria-label="Add"
    className={classes.fab}
    onClick={onClick}
  >
    <Done />
  </Fab>
}