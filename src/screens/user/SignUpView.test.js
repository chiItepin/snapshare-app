import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import SignUpView from './SignUpView';
import AppReducer from '../../reducer';

test('SignUpView renders and handles events', async () => {
  const store = createStore(AppReducer);

  const { getByPlaceholderText, getByText, toJSON } = await render(
    <Provider store={store}>
      <SignUpView />
    </Provider>,
  );

  const emailField = getByPlaceholderText('Enter your email');
  const passwordField = getByPlaceholderText('Enter your password');
  const confirmPassword = getByPlaceholderText('Confirm your password');
  const submitButton = getByText('Sign Up');

  await act(async () => {
    fireEvent.changeText(emailField, 'lorem@ipsum.com');
    fireEvent.changeText(passwordField, '123123');
    fireEvent.changeText(confirmPassword, '123123');
    fireEvent.press(submitButton);
  });

  const tree = toJSON();
  expect(tree).toMatchSnapshot();
});
