import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Post from './Post';

jest.mock('react-redux', () => ({
  useSelector: () => ({
    user: {
      _id: 'xxx',
    },
  }),
}));

test('PostComponent renders and handles events', () => {
  const mockFn = jest.fn();

  const post = {
    _id: 'xxx',
    likes: [],
    comments: [],
    content: 'lorem ipsum',
    authorId: {
      email: 'xxx@xxx.com',
      image: '',
    },
    tags: [],
    categories: [],
    images: [],
    createdAt: '2021-09-13T06:54:27.440+00:00',
  };

  const props = {
    item: { ...post },
    navigation: {
      navigate: () => mockFn,
    },
    handlePostLike: () => mockFn,
    handlePostShare: () => mockFn,
    hasRedirectToPostView: true,
  };

  const component = render(<Post {...props} />);

  const author = component.getByText(props.item.authorId.email);
  fireEvent.press(author);

  const likeBtn = component.getByText('Likes 0', { exact: false });
  fireEvent.press(likeBtn);

  const shareBtn = component.getByText('Share', { exact: false });
  fireEvent.press(shareBtn);

  // 2 events triggered | 2 buttons and 1 field change triggered
  // expect(mockFn).toHaveBeenCalledTimes(2);

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
