import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FlatPostsList from './FlatPostsList';

jest.mock('react-redux', () => ({
  useSelector: () => ({
    _id: 'xxx',
  }),
}));

test('FlatPostsList renders and handles events', () => {
  const mockFn = jest.fn();
  const props = {
    navigation: {
      navigate: () => mockFn,
    },
    posts: [{
      _id: 'xxx',
      likes: [],
      comments: [],
      content: 'lorem ipsum',
      authorId: {
        email: 'xxx@xxx.com',
        image: '',
      },
      createdAt: 123,
    }],
    renderHeader: () => null,
    renderFooter: () => null,
    loaded: true,
    handleGetPosts: mockFn,
    handlePostLike: mockFn,
    handlePostShare: mockFn,
  };

  const component = render(
    <FlatPostsList {...props} />,
  );

  const [firsPostLikesBtn] = component.getAllByText(/Likes/);
  fireEvent.press(firsPostLikesBtn);

  const [firsPostShareBtn] = component.getAllByText(/Share/);
  fireEvent.press(firsPostShareBtn);

  expect(mockFn).toHaveBeenCalledTimes(2);

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
