import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import NewPostTextField from './NewPostTextField';

test('NewPostTextField renders and handles events', () => {
  const mockFn = jest.fn();
  const props = {
    isVisible: true,
    value: 'lorem',
    onSubmit: mockFn,
    setIsNewPostTextFieldVisible: mockFn,
    onChange: mockFn,
    setNotificationMessage: mockFn,
    setImages: mockFn,
    images: [],
  };

  const component = render(
    <NewPostTextField {...props} />,
  );

  const textArea = component.getByDisplayValue(props.value);
  fireEvent.changeText(textArea, 'ipsum');

  const submitButton = component.getByText('Submit');
  fireEvent.press(submitButton);

  const cancelButton = component.getByText('Close');
  fireEvent.press(cancelButton);

  // 3 events triggered | 2 buttons and 1 field change triggered
  expect(mockFn).toHaveBeenCalledTimes(3);

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
