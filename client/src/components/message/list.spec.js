import React from 'react';
import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import waitForExpect from 'wait-for-expect';
import { act } from 'react-dom/test-utils';
import { DeleteForever } from '@material-ui/icons';
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

  test('delete message', async () => {
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

    const onDelete = jest.fn();

    await act(async () => {
      const wrapper = await mount(
        <MockedProvider mocks={mocks} addTypename={false}>
          <MessageList onDelete={onDelete} />
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

      const elements = wrapper.find(DeleteForever);
      expect(elements).toHaveLength(3);
      elements.at(0).simulate('click');
      expect(onDelete).toBeCalled();
    });
  });


  test('handle error', async () => {
    const mocks = [
      {
        request: {
          query: getMessages,
          variables: {},
        },
        error: new Error('something bad happened in query'),
      },
      {
        request: {
          query: receiveMessage,
        },
        error: new Error('something bad happened in subscription'),
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
        expect(
          wrapper
            .find('p')
            .at(0)
            .text(),
        ).toEqual('ERROR');
      });
    });
  });
});
