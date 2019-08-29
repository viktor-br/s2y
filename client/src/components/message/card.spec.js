import React from 'react';
import { mount } from 'enzyme';
import Card from './card';

describe('card component', () => {
  test('check card content', () => {
    const content = '1234';
    const date = 'September 14, 2016';
    const item = { content, date };
    const wrapper = mount(<Card item={item} />);

    expect(wrapper.text()).toMatch(content);
    expect(wrapper.text()).toMatch(date);
  });

  test('card deletion call', () => {
    const content = '1234';
    const date = 'September 14, 2016';
    const item = { content, date };
    const onDelete = jest.fn();
    const wrapper = mount(<Card item={item} onDelete={onDelete} />);

    wrapper.find({ children: 'Delete' }).simulate('click');
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
