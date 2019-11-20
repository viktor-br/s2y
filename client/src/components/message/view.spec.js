import MessageView from './view';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import React from 'react';
import waitForExpect from 'wait-for-expect';
import { getMessages, receiveMessage, removeMessage } from '../../gql';
import MessageList from './list';

describe('view component', () => {
  test('error', async () => {
    const mocks = [
      {
        request: {
          query: getMessages,
        },
        error: new Error('something bad happened in query'),
      },
    ];
    await act(async () => {
      const wrapper = mount(
        <MockedProvider mocks={mocks} addTypename={false} resolvers={{}}>
          <MessageView />
        </MockedProvider>,
      );

      await waitForExpect(() => {
        wrapper.update();
        expect(wrapper.text()).toEqual('ERROR');
      });
    });
  });
});
