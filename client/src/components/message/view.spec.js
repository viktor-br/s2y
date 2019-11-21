import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import React from 'react';
import waitForExpect from 'wait-for-expect';
import MessageView from './view';
import { QUERY_GET_MESSAGES } from '../../gql';

describe('view component', () => {
  test('error', async () => {
    const mocks = [
      {
        request: {
          query: QUERY_GET_MESSAGES,
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
