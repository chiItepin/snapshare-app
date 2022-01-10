import React, { FunctionComponent, useState, useEffect } from 'react';
import {
  Share,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import * as Linking from 'expo-linking';
import {
  Button,
  View,
  Toast,
  Card,
  Avatar,
  Colors,
  LoaderScreen,
} from 'react-native-ui-lib';
import { NavigationProp } from '@react-navigation/native';
import { AxiosResponse } from 'axios';
import { connect } from 'react-redux';
import IUser from '../templates/user';
import IPost from '../templates/post';
import FlatPostsList from '../../components/posts/FlatPostsList';
import styles from '../../styles/GlobalStyles';
import helperStyles from '../../styles/HelperStyles';
import { IState } from '../../reducer';
import useApi from '../../useApi';
import RootScreenParams from '../RootScreenParams';

interface IParams {
  userId: string;
}

interface IProps {
  navigation: NavigationProp<RootScreenParams>;
  user: IUser;
  route: {
    params: IParams,
  };
}

const ProfileView: FunctionComponent<IProps> = ({
  navigation,
  user,
  route,
}: IProps) => {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<IUser>();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [nextPage, setNextPage] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasHeaderShadow, setHasHeaderShadow] = useState(false);
  const { userId } = route.params;
  const { User, apiLoaded, fetchPosts } = useApi();

  const handleGetUserPosts = (loadMore?: boolean, page = 1): void => {
    setLoaded(false);
    setLoading(true);
    setNotificationMessage('Loading...');
    setNextPage(page);
    if (loadMore === false) {
      setPosts([]);
    }
    User.getUserPosts(userId, page).then((res: AxiosResponse<any>) => {
      setLoading(false);
      setLoaded(true);
      if (loadMore === false) {
        setPosts(res.data.data.docs);
      } else {
        setPosts(posts.concat(res.data.data.docs));
      }
      setNextPage(res.data.data.nextPage);
      setNotificationMessage('');
    }).catch(() => {
      setNotificationMessage('Unknown error');
      setLoaded(true);
      setLoading(false);
    });
  };

  const handlePostLike = (postId: string): void => {
    setNotificationMessage('Sending your like...');
    fetchPosts.togglePostLike(postId)
      .then((res: AxiosResponse) => {
        setPosts((prevState) => prevState.map((post) => {
          const suggestedPost = { ...post };
          if (post._id === res.data.data._id) {
            suggestedPost.likes = res.data.data.likes;
          }
          return suggestedPost;
        }));
        setNotificationMessage('');
      })
      .catch(() => {
        setNotificationMessage('Unknown error');
      });
  };

  const handlePostShare = (postId: string): void => {
    const redirectUrl = Linking.createURL('PostView', {
      queryParams: { postId },
    });
    Share.share({
      message: redirectUrl,
    })
      .catch((error: any) => {
        setNotificationMessage(error?.message || 'Unknown error');
      });
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (event.nativeEvent.contentOffset.y === 0) {
      setHasHeaderShadow(false);
    } else {
      setHasHeaderShadow(true);
    }
  };

  useEffect(() => {
    if (userId && apiLoaded) {
      User.getUser(userId)
        .then((res: AxiosResponse) => {
          const requestedUser = res.data.data as IUser;
          setSelectedUser(requestedUser);
          navigation.setOptions({ title: `@${requestedUser.email}` });
        })
        .catch(() => {
          setNotificationMessage('Error retrieving user');
        });
    }
  }, [userId, apiLoaded]);

  useEffect(() => {
    if (apiLoaded) handleGetUserPosts(false);
  }, [apiLoaded]);

  const renderHeader = React.useCallback(() => (
    <Card style={{ marginBottom: 10 }}>
      <View style={styles.accountAvatarContainer}>
        <Avatar
          source={selectedUser?.image ? { uri: `data:image/jpeg;base64,${selectedUser.image}` } : undefined}
          size={60}
          label={selectedUser?.email ? selectedUser.email.substring(0, 1).toUpperCase() : ''}
          backgroundColor={Colors.yellow80}
        />
      </View>

      <Card.Section
        bg-white
        content={[
          { text: selectedUser?.email || '', text70: true, grey10: true },
          { text: selectedUser?.createdAt ? `Since: ${selectedUser?.createdAt}` : '', text90: true, grey50: true },
        ]}
        style={{ padding: 20 }}
      />
    </Card>
  ), [selectedUser]);

  const renderFooter = React.useCallback(() => (
    <View style={[helperStyles.marginBottomBig]}>
      {(nextPage !== 1 && nextPage !== null) && (
        <Button
          onPress={() => handleGetUserPosts(true, nextPage)}
          label="Load more"
          disabled={loading}
          enableShadow
          borderRadius={6}
        />
      )}
    </View>
  ), [nextPage, loading]);

  if (!selectedUser) {
    return (
      <View flex right paddingR-20>
        <LoaderScreen message="Loading..." overlay />
      </View>
    );
  }

  return (
    <View style={styles.containerNoPadding}>
      <View style={[styles.profileHeader]} />

      <View style={hasHeaderShadow
        ? [styles.profileHeaderBack, helperStyles.shadow] : [styles.profileHeaderBack]}
      />

      <Toast
        visible={!!notificationMessage}
        position="bottom"
        onDismiss={() => setNotificationMessage('')}
        showDismiss
        backgroundColor="black"
        autoDismiss={5000}
        message={notificationMessage}
      />

      <View style={[helperStyles.row]}>
        <FlatPostsList
          posts={posts}
          navigation={navigation}
          renderHeader={renderHeader}
          renderFooter={renderFooter}
          loaded={loaded}
          handleGetPosts={handleGetUserPosts}
          handlePostLike={handlePostLike}
          handlePostShare={handlePostShare}
          onScroll={handleScroll}
        />
      </View>
    </View>
  );
};

const mapStateToProps = (state: IState) => ({
  user: state.user,
});

export default connect(mapStateToProps)(ProfileView);
