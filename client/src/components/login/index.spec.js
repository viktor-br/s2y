import React from 'react';
import { mount } from 'enzyme';
import waitForExpect from 'wait-for-expect';
import Login from './index';

describe('Login', () => {
  beforeEach(() => jest.clearAllMocks());

  test.each([[204, true], [404, false]])(
    'run onSignInSuccess',
    async (status, authenticated) => {
      const token = '12345';

      jest.spyOn(global, 'fetch').mockImplementation(() => ({ status }));
      const wrapper = mount(<Login />);
      wrapper.instance().onSignInSuccess(token);

      expect(global.fetch).toHaveBeenCalledTimes(1);

      expect(global.fetch).toHaveBeenCalledWith('/auth/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      await waitForExpect(() => {
        wrapper.update();
        expect(wrapper.state('authenticated')).toBe(authenticated);
      });
    },
  );

  test('call onAuthenticated callback', async () => {
    const token = '12345';
    const onAuthenticated = jest.fn();
    onAuthenticated.mockReturnValue(<div>Test</div>);

    jest.spyOn(global, 'fetch').mockImplementation(() => ({ status: 204 }));
    const wrapper = mount(<Login onAuthenticated={onAuthenticated} />);
    wrapper.instance().onSignInSuccess(token);

    await waitForExpect(() => {
      wrapper.update();
      expect(wrapper.state('authenticated')).toBe(true);
    });
    expect(onAuthenticated).toBeCalled();
  });
});
