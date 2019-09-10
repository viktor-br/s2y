import React from 'react';
import { mount } from 'enzyme';
import GoogleSignIn from './google-sign-in';

describe('GoogleSignIn', () => {
  test('GoogleSignIn run', () => {
    window.gapi = {
      signin2: {
        render: jest.fn(),
      },
    };
    const onSignInSuccess = jest.fn();

    mount(<GoogleSignIn onSignInSuccess={onSignInSuccess} />);

    expect(window.gapi.signin2.render).toBeCalled();
  });

  test('onSignIn call', () => {
    const token = '12345';
    const googleUser = {
      getAuthResponse: () => ({ id_token: token }),
    };
    window.gapi = {
      signin2: {
        render: (name, { onsuccess: onSignIn }) => onSignIn(googleUser),
      },
    };

    const onSignInSuccess = jest.fn();
    mount(<GoogleSignIn onSignInSuccess={onSignInSuccess} />);

    expect(onSignInSuccess).toBeCalledWith(token);
  });
});
