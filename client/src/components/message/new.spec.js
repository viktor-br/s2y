import React from 'react';
import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import waitForExpect from 'wait-for-expect';
import { act } from 'react-dom/test-utils';
import { TextField, Fab } from '@material-ui/core';
import NewMessage from './new';
import { MUTATION_CREATE_MESSAGE } from '../../gql';

describe('new message component', () => {
  test('content', async () => {
    const message = 'Message content';
    const mocks = [
      {
        request: {
          query: MUTATION_CREATE_MESSAGE,
          variables: {
            content: message,
          },
        },
        result: {
          data: {
            createMessage: {
              id: '123',
              createdAt: '12345',
              content: message,
            },
          },
        },
      },
    ];
    await act(async () => {
      const wrapper = mount(
        <MockedProvider mocks={mocks} addTypename={false} resolvers={{}}>
          <NewMessage />
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

      const createMessageElements = wrapper.find(Fab);
      expect(createMessageElements).toHaveLength(1);
      await createMessageElements.at(0).simulate('click');

      await waitForExpect(() => {
        expect(wrapper.find('textarea').at(0).text()).toEqual('');
      });
    });
  });
});
