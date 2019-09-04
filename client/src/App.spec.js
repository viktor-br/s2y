import React from 'react';
import { mount } from 'enzyme';
import App from './App';

describe('App', () => {
  test('run App', () => {
    const app = mount(<App />);

    expect(app.text().match('Home'));
  });
});
