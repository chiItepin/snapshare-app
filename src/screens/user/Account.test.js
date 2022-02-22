import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Account from './Account';
import AppReducer, { initialState } from '../../reducer';

test('Account renders and handles events', async () => {
  const newSharedState = {
    ...initialState,
    user: {
      _id: 'xxx',
      email: 'lorem@ipsum.com',
      token: 'xxx',
      loggedInDate: '123123',
      image: '',
    },
  };

  const store = createStore(() => AppReducer(newSharedState));

  const mockFn = jest.fn();
  const navigation = {
    navigate: mockFn,
  };

  const { getByText, toJSON } = render(
    <Provider store={store}>
      <Account navigation={navigation} />
    </Provider>,
  );

  getByText('lorem@ipsum.com');
  getByText('Logout');
  const viewProfileBtn = getByText('View profile');
  fireEvent.press(viewProfileBtn);

  expect(mockFn).toHaveBeenCalledTimes(1);

  const tree = toJSON();
  expect(tree).toMatchSnapshot();
});
