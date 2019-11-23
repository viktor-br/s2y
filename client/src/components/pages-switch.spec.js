import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import waitForExpect from 'wait-for-expect';
import { MockedProvider } from '@apollo/react-testing';
import { act } from 'react-dom/test-utils';
import Login from './login';
import PagesSwitch from './pages-switch';
import {
  QUERY_GET_MESSAGES,
  SUBSCRIPTION_MESSAGE_CREATED,
  SUBSCRIPTION_MESSAGE_DELETED,
} from '../gql';

describe('PagesSwitch', () => {
  test.each(['/login', '/messages'])('open login page', async (initPath) => {
    const mocks = [
      {
        request: {
          query: QUERY_GET_MESSAGES,
          variables: {},
        },
        result: {
          data: {
            getMessages: [
              { id: '111', content: '112', createdAt: '113' },
              { id: '221', content: '222', createdAt: '223' },
            ],
          },
        },
      },
      {
        request: {
          query: SUBSCRIPTION_MESSAGE_DELETED,
        },
        result: {},
      },
      {
        request: {
          query: SUBSCRIPTION_MESSAGE_CREATED,
        },
        result: {},
      },
      {
        request: {
          query: SUBSCRIPTION_MESSAGE_CREATED,
        },
        result: {
          data: {
            messageCreated: {
              id: '331',
              content: '332',
              createdAt: '333',
            },
          },
        },
      },
    ];

    await act(async () => {
      const wrapper = mount(
        <MockedProvider mocks={mocks} addTypename={false}>
          <MemoryRouter initialEntries={[initPath]}>
            <PagesSwitch />
          </MemoryRouter>
        </MockedProvider>,
      );

      jest.spyOn(global, 'fetch').mockImplementation(() => ({ status: 204 }));

      await waitForExpect(() => {
        wrapper.update();
        expect(wrapper.find('Route').prop('location').pathname).toEqual(
          '/login',
        );
      });

      wrapper
        .find(Login)
        .instance()
        .onSignInSuccess('12345');

      await waitForExpect(() => {
        wrapper.update();
        expect(wrapper.find('Route').prop('location').pathname).toEqual(
          '/messages/',
        );
      });
    });
  });
});
