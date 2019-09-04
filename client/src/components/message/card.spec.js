import React from 'react';
import { mount } from 'enzyme';
import { CardHeader, CardContent } from '@material-ui/core';
import { DeleteForever } from '@material-ui/icons';
import Card from './card';

describe('card component', () => {
  test('check card content', () => {
    const content = '1234';
    const date = 'September 14, 2016';
    const item = { content, date };
    const wrapper = mount(<Card item={item} />);

    expect(wrapper.find(CardHeader).text()).toMatch(date);
    expect(wrapper.find(CardContent).text()).toMatch(content);
  });

  test('card deletion call', () => {
    const content = '1234';
    const date = 'September 14, 2016';
    const item = { content, date };
    const onDelete = jest.fn();
    const wrapper = mount(<Card item={item} onDelete={onDelete} />);

    const deleteElements = wrapper.find(DeleteForever);
    expect(deleteElements).toHaveLength(1);
    deleteElements.at(0).simulate('click');
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
