import React from 'react';
import { mount } from 'enzyme';
import { CardHeader, CardContent } from '@material-ui/core';
import { DeleteForever } from '@material-ui/icons';
import Card from './card';

describe('card component', () => {
  test('check card content', () => {
    const content = '1234';
    const createdAt = 1574517910000;
    const item = { content, createdAt };
    const wrapper = mount(<Card item={item} />);

    expect(wrapper.find(CardHeader).text()).toMatch(
      new Date(createdAt).toLocaleString(),
    );
    expect(wrapper.find(CardContent).text()).toMatch(content);
  });

  test('card deletion call', () => {
    const content = '1234';
    const createdAt = '';
    const item = { content, createdAt };
    const onDelete = jest.fn();
    const wrapper = mount(<Card item={item} onDelete={onDelete} />);

    expect(wrapper.find(CardHeader).text()).toMatch('');

    const deleteElements = wrapper.find(DeleteForever);
    expect(deleteElements).toHaveLength(1);
    deleteElements.at(0).simulate('click');
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
