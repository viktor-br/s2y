import React from 'react';
import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import waitForExpect from 'wait-for-expect';
import { act } from 'react-dom/test-utils';
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
    const wrapper = mount(
      <MockedProvider mocks={mocks} addTypename={false} resolvers={{}}>
        <NewMessage onCreate={onCreate} />
      </MockedProvider>,
    );


    wrapper.find('textarea#message').simulate('click');
    wrapper.find('textarea#message').simulate('change', { target: { value: message } });
    await waitForExpect(() => {
      expect(wrapper.find('textarea#message')
        .text())
        .toEqual(message);
    });

    await act(async () => {
      await wrapper.find('button#add-message').simulate('click');
    });

    await waitForExpect(() => {
      expect(onCreate)
        .toHaveBeenCalledTimes(1);
    });
  });
});
