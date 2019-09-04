import React from 'react';
import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import waitForExpect from 'wait-for-expect';
import { act } from 'react-dom/test-utils';
import { TextField, Fab } from '@material-ui/core';
import NewMessage from './new';
import { sendMessage } from '../../gql';

describe('new message component', () => {
  test('content', async () => {
    const message = 'Message content';
    const onCreate = jest.fn();
    const mocks = [
      {
        request: {
          query: sendMessage,
          variables: {
            content: message,
          },
        },
        result: {
          data: {
            sendMessage: {
              content: message,
            },
          },
        },
      },
    ];
    await act(async () => {
      const wrapper = mount(
        <MockedProvider mocks={mocks} addTypename={false} resolvers={{}}>
          <NewMessage onCreate={onCreate} />
        </MockedProvider>,
      );

      expect(wrapper.find(TextField)).toHaveLength(1);

      wrapper.find('textarea')
        .at(0)
        .simulate('click');
      wrapper.find('textarea')
        .at(0)
        .simulate('change', { target: { value: message } });
      // wrapper.find('textarea#message').simulate('change', { target: { value: message } });
      await waitForExpect(() => {
        wrapper.update();
        expect(wrapper.find('textarea').at(0).text()).toEqual(message);
      });

      const sendMessageElements = wrapper.find(Fab);
      expect(sendMessageElements).toHaveLength(1);
      await sendMessageElements.at(0).simulate('click');

      await waitForExpect(() => {
        expect(onCreate).toHaveBeenCalledTimes(1);
      });
    });
  });
});
