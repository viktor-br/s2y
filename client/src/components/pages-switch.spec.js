import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import waitForExpect from 'wait-for-expect';
import { MockedProvider } from '@apollo/react-testing';
import { act } from 'react-dom/test-utils';
import { parseServerError, ERR_UNAUTHENTICATED, ERR_INTERNAL } from '../error';
import Login from './login';
import PagesSwitch from './pages-switch';

import {
  QUERY_GET_MESSAGES,
  SUBSCRIPTION_MESSAGE_CREATED,
  SUBSCRIPTION_MESSAGE_DELETED,
} from '../gql';

jest.mock('../error');

describe('PagesSwitch', () => {
  test('open login page', async () => {
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
          <MemoryRouter initialEntries={['/login']}>
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
          '/messages',
        );
      });
    });
  });

  test.each([[ERR_UNAUTHENTICATED, '/login'], [ERR_INTERNAL, '/messages']])(
    'open message page without authentication',
    async (errorCode, path) => {
      parseServerError.mockReturnValue(errorCode);
      const mocks = [
        {
          request: {
            query: QUERY_GET_MESSAGES,
            variables: {},
          },
          error: new Error('Something went wrong'),
        },
      ];

      await act(async () => {
        const wrapper = mount(
          <MockedProvider mocks={mocks} addTypename={false}>
            <MemoryRouter initialEntries={['/messages']}>
              <PagesSwitch />
            </MemoryRouter>
          </MockedProvider>,
        );

        await waitForExpect(() => {
          wrapper.update();
          expect(wrapper.find('Route').prop('location').pathname).toEqual(path);
        });
      });
    },
  );
});
