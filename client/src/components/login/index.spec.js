import React from 'react';
import { mount } from 'enzyme';
import Login from './index';

describe('App', () => {
  test('run App', () => {
    window.gapi = {
      signin2: {
        render: jest.fn(),
      },
    };

    const app = mount(<Login />);

    expect(app.text().match('Home'));
  });
});
