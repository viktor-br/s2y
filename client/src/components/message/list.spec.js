import React from 'react';
import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import waitForExpect from 'wait-for-expect';
import { act } from 'react-dom/test-utils';
import { DeleteForever } from '@material-ui/icons';
import MessageList from './list';
import { deleteMessage, receiveMessage, removeMessage } from '../../gql';

describe('list component', () => {
  test('empty initial message list', async () => {
    const mocks = [
      {
        request: {
          query: removeMessage,
        },
        result: {},
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
      const wrapper = await mount(
        <MockedProvider mocks={mocks} addTypename={false}>
          <MessageList />
        </MockedProvider>,
      );

      await waitForExpect(() => {
        wrapper.update();
        expect(wrapper.find('p').length).toEqual(1);
      });
    });
  });

  test('load messages', async () => {
    const initMessages = [
      { uuid: '111', content: '112', createdAt: '113' },
      { uuid: '221', content: '222', createdAt: '223' },
    ];
    const mocks = [
      {
        request: {
          query: removeMessage,
        },
        result: {},
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
          <MessageList messages={initMessages} />
        </MockedProvider>,
      );

      await waitForExpect(() => {
        wrapper.update();
        expect(wrapper.find('p').length).toEqual(3);
      });

      expect(window.HTMLElement.prototype.scrollIntoView).toBeCalled();
    });
  });

  test('receive message removed event', async () => {
    const initMessages = [
      { uuid: '111', content: '112', createdAt: '113' },
      { uuid: '221', content: '222', createdAt: '223' },
      { uuid: '331', content: '332', createdAt: '333' },
    ];
    const mocks = [
      {
        request: {
          query: removeMessage,
        },
        result: {
          data: {
            removeMessage: {
              uuid: '221',
              content: '221',
              createdAt: '223',
            },
          },
        },
      },
      {
        request: {
          query: receiveMessage,
        },
        result: {},
      },
    ];

    await act(async () => {
      window.HTMLElement.prototype.scrollIntoView = jest.fn();

      const wrapper = await mount(
        <MockedProvider mocks={mocks} addTypename={false}>
          <MessageList messages={initMessages} />
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

      expect(wrapper.find('p').length).toEqual(2);
      expect(window.HTMLElement.prototype.scrollIntoView).toBeCalled();
    });
  });

  test('delete message', async () => {
    const initMessages = [
      { uuid: '111', content: '112', createdAt: '113' },
      { uuid: '221', content: '222', createdAt: '223' },
    ];
    const mocks = [
      {
        request: {
          query: removeMessage,
        },
        result: {},
      },
      {
        request: {
          query: receiveMessage,
        },
        result: {},
      },
      {
        request: {
          query: deleteMessage,
          variables: {
            uuid: '111',
          },
        },
        result: {
          data: {
            deleteMessage: { uuid: '111', content: '112', createdAt: '113' },
          },
        },
      },
    ];

    await act(async () => {
      const wrapper = await mount(
        <MockedProvider mocks={mocks} addTypename={false}>
          <MessageList messages={initMessages} />
        </MockedProvider>,
      );

      await waitForExpect(() => {
        wrapper.update();
        expect(wrapper.find(DeleteForever)).toHaveLength(2);
      });

      wrapper
        .find(DeleteForever)
        .at(0)
        .simulate('click');
    });
  });
});
