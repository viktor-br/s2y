import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import waitForExpect from 'wait-for-expect';
import { MockedProvider } from '@apollo/react-testing';
import { act } from 'react-dom/test-utils';
import Login from './login';
import PagesSwitch from './pages-switch';
import { getMessages, receiveMessage } from '../gql';

describe('PagesSwitch', () => {
  test('switch', async () => {
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
    window.gapi = {
      signin2: {
        render: jest.fn(),
      },
    };

    await act(async () => {
      const wrapper = mount(
        <MockedProvider mocks={mocks} addTypename={false}>
          <MemoryRouter initialEntries={['/login']}>
            <PagesSwitch />
          </MemoryRouter>
        </MockedProvider>,
      );

      jest.spyOn(global, 'fetch').mockImplementation(() => ({ status: 204 }));

      expect(wrapper.find('Route').prop('location').pathname).toEqual('/login');

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
