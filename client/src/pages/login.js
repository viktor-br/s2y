import React, {Component} from 'react';
import qs from 'querystringify';
import {Redirect} from 'react-router-dom';

class Login extends Component {
  async componentWillMount() {
    let params = qs.parse(this.props.location.search);

    if (params.token) {
      await fetch('http://localhost:4004/login?token=' + params.token).then(
        (data) => {
          console.log(data);
          this.props.history.push('/messages');
        }
      ).catch(
        (err) => {
          console.log(err);
        }
      );
    } else {
      console.log('where is token');
    }
  };

  render() {
    return <Redirect to='/messages'/>;
  }
}

export default Login;