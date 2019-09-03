import React from 'react';
import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import waitForExpect from 'wait-for-expect';
import { act } from 'react-dom/test-utils';
import MessageList from './list';
import { getMessages, receiveMessage } from '../../gql';

describe('list component', () => {
  test('load messages', async () => {
    const mocks = [
      {
        request: {
          query: getMessages,
          variables: {},
        },
        result: {
          data: {
            getMessages: [
              { uuid: '111', content: '112', createdAt: '113' },
              { uuid: '221', content: '222', createdAt: '223' },
            ],
          },
        },
      },
      {
        request: {
          query: receiveMessage,
        },
        result: {
          data: {
            receiveMessage: {
              uuid: '331',
              content: '332',
              createdAt: '333',
            },
          },
        },
      },
    ];

    await act(async () => {
      window.HTMLElement.prototype.scrollIntoView = jest.fn();

      const wrapper = await mount(
        <MockedProvider mocks={mocks} addTypename={false}>
          <MessageList />
        </MockedProvider>,
      );

      await waitForExpect(() => {
        wrapper.update();
        expect(
          wrapper
            .find('p')
            .at(0)
            .text(),
        ).not.toEqual('Loading...');
      });

      expect(wrapper.find('p').length).toEqual(3);
      expect(window.HTMLElement.prototype.scrollIntoView).toBeCalled();
    });
  });
});
