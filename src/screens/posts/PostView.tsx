import React, { FunctionComponent, useState, useEffect } from 'react';
import { AxiosResponse } from 'axios';
import { NavigationProp } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import {
  Share,
} from 'react-native';
import {
  Toast,
  LoaderScreen,
  View,
} from 'react-native-ui-lib';
import Post from '../../components/posts/Post';
import RootScreenParams from '../../screens/RootScreenParams';
import styles from '../../styles/GlobalStyles';
import IPost from '../../screens/templates/post';
import useApi from '../../useApi';

interface IParams {
  postId: string;
}

interface IProps {
  route: {
    params: IParams,
  };
  navigation: NavigationProp<RootScreenParams>;
}

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
      .catch(() => {
        setNotificationMessage('Unknown error');
      });
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

  useEffect(() => {
    if (postId && apiLoaded) {
      fetchPosts.getPost(postId)
        .then((res: AxiosResponse) => {
          setPost(res.data.data);
          setLoaded(true);
        })
        .catch(() => {
          setNotificationMessage('Post not found');
        });
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
    <View style={styles.container}>
      <Toast
        visible={!!notificationMessage}
        position="bottom"
        showDismiss
        onDismiss={() => setNotificationMessage('')}
        backgroundColor="black"
        autoDismiss={3000}
        message={notificationMessage}
      />
      <View key={post._id} style={[styles.card]}>
        <Post
          item={post}
          handlePostLike={handlePostLike}
          handlePostShare={handlePostShare}
          navigation={navigation}
          hasRedirectToPostView={false}
        />
      </View>
    </View>
  );
};

export default PostView;
