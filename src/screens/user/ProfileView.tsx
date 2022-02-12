import React, { FunctionComponent, useState, useEffect } from 'react';
import {
  Share,
  SafeAreaView,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as Linking from 'expo-linking';
import {
  Button,
  View,
  Toast,
  Card,
  Avatar,
  Colors,
  LoaderScreen,
  Assets,
} from 'react-native-ui-lib';
import { NavigationProp } from '@react-navigation/native';
import IUser from '../templates/user';
import IPost from '../templates/post';
import IFollower from '../templates/follower';
import FlatPostsList from '../../components/posts/FlatPostsList';
import styles from '../../styles/GlobalStyles';
import helperStyles from '../../styles/HelperStyles';
import useApi from '../../useApi';
import RootScreenParams from '../RootScreenParams';
import { IState } from '../../reducer';
import handleAxiosErrorMessage from '../../utilities/helpers';

interface IParams {
  userId: string;
}

interface IProps {
  navigation: NavigationProp<RootScreenParams>;
  route: {
    params: IParams,
  };
  user: IUser;
  followers: IFollower[];
  setFollowers: (followers: IFollower[]) => void;
}

const ProfileView: FunctionComponent<IProps> = ({
  navigation,
  route,
  user,
  followers,
  setFollowers,
}: IProps) => {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<IUser>();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [nextPage, setNextPage] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [selectedUserFollowersCount, setSelectedUserFollowersCount] = useState(0);
  const { userId: selectedUserId } = route.params;
  const {
    User,
    apiLoaded,
    fetchPosts,
    fetchFollowers,
  } = useApi();

  const isUserFollowed = React.useCallback(() => {
    const [followedUser] = followers.filter((follower) => follower.user._id === selectedUserId);
    return !!followedUser;
  }, [followers, selectedUserId]);

  const handleFollowing = (): void => {
    setNotificationMessage('Loading...');
    setLoading(true);
    Promise.all([
      fetchFollowers.addFollower(user._id || '', selectedUserId),
      fetchFollowers.getFollowers(user._id || '', 1),
    ])
      .then((responses) => {
        responses.forEach((res, index) => {
          if (index === 1) {
            // update the loggedin user followers
            setFollowers(res.data.data.docs);

            // update the selected user followers
            if (isUserFollowed()) {
              setSelectedUserFollowersCount((count) => count - 1);
            } else {
              setSelectedUserFollowersCount((count) => count + 1);
            }
          }
        });
        setNotificationMessage('');
        setLoading(false);
      }).catch(() => {
        setNotificationMessage('Unknown error');
        setLoaded(true);
        setLoading(false);
      });
  };

  const handleGetUserPosts = (loadMore?: boolean, page = 1): void => {
    setLoaded(false);
    setLoading(true);
    setNotificationMessage('Loading...');
    setNextPage(page);
    if (loadMore === false) {
      setPosts([]);
    }
    User.getUserPosts(selectedUserId, page).then((res) => {
      setLoaded(true);
      setInitialLoaded(true);
      if (loadMore === false) {
        setPosts(res.data.data.docs);
      } else {
        setPosts(posts.concat(res.data.data.docs));
      }
      setNextPage(res.data.data.nextPage);
      setNotificationMessage('');
      setLoading(false);
    }).catch(() => {
      setNotificationMessage('Unknown error occurred');
      setLoaded(true);
      setLoading(false);
    });
  };

  const handlePostLike = (postId: string): void => {
    setNotificationMessage('Sending your like...');
    fetchPosts.togglePostLike(postId)
      .then((res) => {
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

  useEffect(() => {
    if (selectedUserId && apiLoaded) {
      navigation.setOptions({ title: '', headerTintColor: 'rgb(88, 72, 255)' });

      Promise.all([
        User.getUser(selectedUserId),
        fetchFollowers.getFollowers(selectedUserId, 1),
      ])
        .then((responses) => {
          responses.forEach((res, index) => {
            if (index === 0) {
              const requestedUser = res.data.data as IUser;
              setSelectedUser(requestedUser);
            } else {
              setSelectedUserFollowersCount(res.data.data.totalDocs);
            }
          });
          setLoading(false);
        })
        .catch((err) => {
          const errorMsg = handleAxiosErrorMessage(err);
          setNotificationMessage(errorMsg);
        });
    }
  }, [selectedUserId, apiLoaded]);

  useEffect(() => {
    if (apiLoaded) {
      handleGetUserPosts(false);
    }
    navigation.setOptions({ headerTransparent: true });
  }, [apiLoaded]);

  const renderHeader = React.useCallback(() => (
    <Card style={{ marginBottom: 10, alignItems: 'center' }}>
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
          {
            text: selectedUser?.email || '', text70: true, grey10: true, style: { textAlign: 'center' },
          },
          {
            text: selectedUser?.createdAt ? `Since: ${selectedUser?.createdAt}` : '', text90: true, grey50: true, style: { textAlign: 'center' },
          },
          {
            text: `${selectedUserFollowersCount.toString()} followers`, text90: true, grey50: true, style: { textAlign: 'center' },
          },
        ]}
        style={{ padding: 10 }}
      />

      {user._id !== selectedUserId && (
        <View style={[helperStyles.paddingHorizontalMed, helperStyles.marginBottomMed]}>
          <Button
            onPress={() => handleFollowing()}
            style={styles.followBtn}
            label={isUserFollowed() ? 'Following' : 'Follow'}
            borderRadius={30}
            iconSource={Assets.icons.plusSmall}
            outline={!isUserFollowed()}
            // disabled={loading}
          />
        </View>
      )}
    </Card>
  ), [selectedUser, followers, selectedUserFollowersCount]);

  const renderFooter = React.useCallback(() => (
    <View style={(Platform.OS === 'android') ? { marginBottom: 45 } : [helperStyles.marginBottomBig]}>
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

  if (!selectedUser || !initialLoaded) {
    return (
      <View flex right paddingR-20>
        <Toast
          visible={!!notificationMessage}
          position="bottom"
          onDismiss={() => setNotificationMessage('')}
          showDismiss
          backgroundColor="black"
          autoDismiss={5000}
          message={notificationMessage}
        />

        <LoaderScreen message="Loading..." overlay />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.containerNoPadding]}>
      <View style={[styles.profileHeader]} />
      {(Platform.OS === 'android') && <View style={[styles.profileHeaderBack]} />}

      <Toast
        visible={!!notificationMessage}
        position="bottom"
        onDismiss={() => setNotificationMessage('')}
        showDismiss
        backgroundColor="black"
        autoDismiss={5000}
        message={notificationMessage}
      />

      <View style={{ height: '100%' }}>
        <FlatPostsList
          posts={posts}
          navigation={navigation}
          renderHeader={renderHeader}
          renderFooter={renderFooter}
          loaded={loaded}
          handleGetPosts={handleGetUserPosts}
          handlePostLike={handlePostLike}
          handlePostShare={handlePostShare}
        />
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = (state: IState) => ({
  user: state.user,
  followers: state.followers,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setFollowers: (followers: IFollower[]) => dispatch({
    type: 'SET_FOLLOWERS',
    payload: followers,
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileView);
