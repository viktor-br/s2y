import React from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import {
  Container,
  Toolbar,
  IconButton,
  InputBase,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import { fade, makeStyles } from '@material-ui/core/styles';
import { ApolloProvider } from '@apollo/react-hooks';
import { MessageList } from './components/message';
import Home from './components/home';
import Login from './components/login';
import { CreateApiClient } from './api';

const ApiClient = CreateApiClient();

const useStyles = makeStyles(theme => ({
  container: {
    flexGrow: 1,
    padding: 0,
    height: '100vh',
    overflow: 'hidden',
  },
  header: {
    height: '10vh',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  },
}));

const App = () => {
  const classes = useStyles();

  return (
    <ApolloProvider client={ApiClient}>
      <Container maxWidth="sm" className={classes.container}>
        <AppBar color="primary" position="static" className={classes.header}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="Open drawer"
            >
              <MenuIcon />
            </IconButton>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'Search' }}
              />
            </div>
          </Toolbar>
        </AppBar>
        <BrowserRouter>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/login" exact component={Login} />
            <Route path="/messages" component={MessageList} />
          </Switch>
        </BrowserRouter>
      </Container>
    </ApolloProvider>
  );
};

export default App;
