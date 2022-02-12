import React, { FunctionComponent, useState, useEffect } from 'react';
import { AxiosResponse, AxiosError } from 'axios';
import moment from 'moment';
import { NavigationProp } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import {
  Share,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  Toast,
  LoaderScreen,
  View,
  Text,
  Incubator,
} from 'react-native-ui-lib';
import handleAxiosErrorMessage from '../../utilities/helpers';
import Post from '../../components/posts/Post';
import RootScreenParams from '../../screens/RootScreenParams';
import styles from '../../styles/GlobalStyles';
import helperStyles from '../../styles/HelperStyles';
import IPost, { IComment } from '../../screens/templates/post';
import useApi from '../../useApi';

const { TextField } = Incubator;

interface IParams {
  postId: string;
}

interface IProps {
  route: {
    params: IParams,
  };
  navigation: NavigationProp<RootScreenParams>;
}

interface ICommentProps {
  comment: IComment;
  navigation: NavigationProp<RootScreenParams>;
}

interface IRenderPostProps {
  item: IPost;
  navigation: NavigationProp<RootScreenParams>;
  handlePostLike: (postId: string) => void;
  handlePostShare: (postId: string) => void;
  handleCreateComment: (content: string) => void;
}

const renderPost: FunctionComponent<IRenderPostProps> = ({
  item,
  navigation,
  handlePostLike,
  handlePostShare,
  handleCreateComment,
}: IRenderPostProps) => {
  const [commentField, setCommentField] = useState('');

  return (
    <View key={item._id} style={styles.card}>
      <Post
        item={item}
        handlePostLike={handlePostLike}
        handlePostShare={handlePostShare}
        navigation={navigation}
        hasRedirectToPostView={false}
      />

      <View style={helperStyles.marginVerticalMed}>
        <TextField
          placeholder="Enter your comment"
          value={commentField}
          onChangeText={setCommentField}
          maxLength={100}
          showCharCounter
          fieldStyle={styles.genericField}
          onSubmitEditing={() => {
            handleCreateComment(commentField);
            setCommentField('');
          }}
        />
      </View>
    </View>
  );
};

const arePropsEqual = (prevProps: IRenderPostProps, nextProps: IRenderPostProps) => (
  prevProps.item._id === nextProps.item._id
  && prevProps.item.content === nextProps.item.content
  && prevProps.item.comments.length === nextProps.item.comments.length
  && prevProps.item.likes.length === nextProps.item.likes.length
);

const MemoizedRenderPost = React.memo(renderPost, arePropsEqual);

const renderCommentRow: FunctionComponent<ICommentProps> = ({
  comment,
  navigation,
}: ICommentProps) => (
  <>
    <View style={helperStyles['w-25']}>
      <View>
        <TouchableOpacity
          onPress={() => navigation.navigate('ProfileView', {
            userId: comment?.authorId._id || '',
          })}
        >
          <Text
            numberOfLines={1}
            text90
            link
          >
            {comment?.authorId?.email}
          </Text>
        </TouchableOpacity>
        <Text
          numberOfLines={1}
          grey40
          text90
          link
        >
          {moment(comment.createdAt).format('MMM Do YY')}
        </Text>
      </View>
    </View>

    <View style={helperStyles['w-75']}>
      <Text
        text90
        grey30
      >
        {comment?.content}
      </Text>
    </View>
  </>
);

const areCommentPropsEqual = (prevProps: ICommentProps, nextProps: ICommentProps) => (
  prevProps.comment._id === nextProps.comment._id
  && prevProps.comment.content === nextProps.comment.content
);

const MemoizedRenderComment = React.memo(renderCommentRow, areCommentPropsEqual);

const PostView: FunctionComponent<IProps> = ({
  route,
  navigation,
}: IProps) => {
  const [post, setPost] = useState<IPost>();
  const [loaded, setLoaded] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const { fetchPosts, apiLoaded } = useApi();
  const { postId } = route.params;

  const handlePostLike = (id: string): void => {
    setNotificationMessage('Sending your like...');
    fetchPosts.togglePostLike(id)
      .then((res: AxiosResponse) => {
        setPost((prevState) => {
          if (prevState) {
            const suggestedPost = { ...prevState };
            if (suggestedPost._id === res.data.data._id) {
              suggestedPost.likes = res.data.data.likes;
            }
            return suggestedPost;
          }
          return prevState;
        });
        setNotificationMessage('');
      })
      .catch((err: AxiosError) => {
        setNotificationMessage(handleAxiosErrorMessage(err));
      });
  };

  const handleCreateComment = (content: string): void => {
    if (content && content.trim()) {
      setNotificationMessage('Sending your comment...');
      fetchPosts.createPostComment(postId, content.trim())
        .then((res: AxiosResponse) => {
          setPost(res.data.data);
          setNotificationMessage('');
        })
        .catch((err: AxiosError) => {
          setNotificationMessage(handleAxiosErrorMessage(err));
        });
    }
  };

  const handlePostShare = (id: string): void => {
    const redirectUrl = Linking.createURL('PostView', {
      queryParams: { postId: id },
    });
    Share.share({
      message: redirectUrl,
    })
      .catch((error: any) => {
        setNotificationMessage(error?.message || 'Unknown error');
      });
  };

  const handleGetPost = React.useCallback(() => {
    fetchPosts.getPost(postId)
      .then((res: AxiosResponse) => {
        setPost(res.data.data);
        setLoaded(true);
      })
      .catch(() => {
        setNotificationMessage('Post not found');
      });
  }, [postId, apiLoaded]);

  useEffect(() => {
    if (postId && apiLoaded) {
      handleGetPost();
    }
  }, [postId, apiLoaded]);

  if (!loaded || !post?._id) {
    return (
      <View flex right paddingR-20>
        <Toast
          visible={!!notificationMessage}
          position="bottom"
          showDismiss
          onDismiss={() => setNotificationMessage('')}
          backgroundColor="black"
          autoDismiss={3000}
          message={notificationMessage}
        />

        <LoaderScreen message="Loading..." overlay />
      </View>
    );
  }

  return (
    <>
      <Toast
        visible={!!notificationMessage}
        position="bottom"
        showDismiss
        onDismiss={() => setNotificationMessage('')}
        backgroundColor="black"
        autoDismiss={3000}
        message={notificationMessage}
      />

      <FlatList
        data={post.comments}
        onRefresh={() => handleGetPost()}
        refreshing={!loaded}
        style={helperStyles.paddingHorizontalMed}
        renderItem={({ item }) => (
          <View style={[
            helperStyles.row,
            helperStyles.borderBottom,
            helperStyles.marginBottomMed,
            helperStyles.paddingHorizontalMed,
          ]}
          >
            <MemoizedRenderComment
              comment={item}
              navigation={navigation}
            />
          </View>
        )}
        ListHeaderComponent={() => (
          <MemoizedRenderPost
            handlePostLike={handlePostLike}
            handlePostShare={handlePostShare}
            item={post}
            navigation={navigation}
            handleCreateComment={handleCreateComment}
          />
        )}
        ListFooterComponent={null}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={loaded ? <Text grey40 text90 style={{ textAlign: 'center' }}>Comments box is empty</Text> : null}
      />
    </>
  );
};

export default PostView;
