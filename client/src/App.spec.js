import React from 'react';
import { mount } from 'enzyme';
import App from './App';

describe('App', () => {
  test('check App run', () => {
    const app = mount(<App />);

    expect(app.text().match('Home')).toHaveLength(1);
  });
});
