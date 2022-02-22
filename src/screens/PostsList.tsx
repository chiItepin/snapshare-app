import React, { FunctionComponent, useEffect, useState } from 'react';
import { AxiosResponse, AxiosError } from 'axios';
import * as Linking from 'expo-linking';
import {
  View,
  Share,
} from 'react-native';
import {
  Toast,
  Incubator,
  Button,
  ActionSheet,
  FloatingButton,
  Assets,
} from 'react-native-ui-lib';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import handleAxiosErrorMessage from '../utilities/helpers';
import useApi from '../useApi';
import styles from '../styles/GlobalStyles';
import HelperStyles from '../styles/HelperStyles';
import IUser from '../screens/templates/user';
import IPost from '../screens/templates/post';
import NewPostTextField from '../components/posts/NewPostTextField';
import FlatPostsList from '../components/posts/FlatPostsList';

interface IProps {
  clearUser: () => void;
  navigation: any;
}

interface IImage {
  index: number;
  url: string;
}

const { TextField } = Incubator;

const PostsList: FunctionComponent<IProps> = ({
  navigation,
  clearUser,
}: IProps) => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [arePostsQueried, setArePostsQueried] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState('');
  const [newContent, setNewContent] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [images, setImages] = useState<IImage[]>([]);
  const [isNewPostTextFieldVisible, setIsNewPostTextFieldVisible] = useState(false);
  const [nextPage, setNextPage] = useState(1);
  const [notificationMessage, setNotificationMessage] = useState('');
  const { fetchPosts, apiLoaded } = useApi();

  const handleGetPosts = (loadMore?: boolean, page = 1): void => {
    setArePostsQueried(false);
    setLoaded(false);
    setLoading(true);
    setNotificationMessage('Loading...');
    setNextPage(page);
    if (loadMore === false) {
      setPosts([]);
    }
    fetchPosts.getPosts(page).then((res: AxiosResponse<any>) => {
      setLoading(false);
      setLoaded(true);
      if (loadMore === false) {
        setPosts(res.data.data.docs);
      } else {
        setPosts(posts.concat(res.data.data.docs));
      }
      setNextPage(res.data.data.nextPage);
      setNotificationMessage('');
    }).catch(async (err: AxiosError) => {
      if (err.response?.status === 401) {
        await AsyncStorage.removeItem('@user');
        clearUser();
      } else {
        setNotificationMessage('Unknown error');
      }
      setLoaded(true);
      setLoading(false);
    });
  };

  const handleSearchPosts = (loadMore?: boolean, page = 1): void => {
    setArePostsQueried(true);
    setLoaded(false);
    setLoading(true);
    setNotificationMessage('Loading...');
    setNextPage(page);
    if (loadMore === false) {
      setPosts([]);
    }
    fetchPosts.searchPost(searchValue, page).then((res: AxiosResponse<any>) => {
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

  const handleSubmitPost = (): void => {
    setIsNewPostTextFieldVisible(false);
    setNotificationMessage('Uploading...');
    const newImages = images.map((image) => ({ url: image.url }));
    fetchPosts.createPost(newContent, newImages).then((res) => {
      const updatedPosts = [...posts];
      updatedPosts.unshift(res.data.data);
      setPosts(updatedPosts);
      setNewContent('');
      setImages([]);
      setNotificationMessage('');
    }).catch(() => {
      setNotificationMessage('Unknown error');
    });
  };

  const renderCreatePost = () => (
    <View style={[HelperStyles.paddingVerticalMed]}>
      <View>
        <TextField
          placeholder="Search snap..."
          value={searchValue}
          onChangeText={setSearchValue}
          editable={loaded}
          fieldStyle={styles.searchField}
          onSubmitEditing={() => {
            if (searchValue) {
              handleSearchPosts(false);
            } else {
              handleGetPosts(false);
            }
          }}
        />

        <Button
          onPress={() => {
            if (searchValue) {
              handleSearchPosts(false);
            } else {
              handleGetPosts(false);
            }
          }}
          style={styles.searchFieldBtn}
          iconSource={Assets.icons.search}
          iconStyle={styles.searchFieldBtnIcon}
          color="white"
          disabled={!loaded}
          enableShadow
        />
      </View>
    </View>
  );

  const renderFooter = () => (
    <View style={{ marginBottom: 100 }}>
      {nextPage !== 1 && (
        <Button
          onPress={() => {
            if (arePostsQueried) {
              handleSearchPosts(true, nextPage);
            } else {
              handleGetPosts(true, nextPage);
            }
          }}
          label="Load more"
          disabled={loading || nextPage === null}
          enableShadow
          borderRadius={6}
        />
      )}
    </View>
  );

  const handleDeletePost = (postId: string): void => {
    setNotificationMessage('Deleting post...');
    fetchPosts.deletePost(postId)
      .then(() => {
        setPosts((prevState) => prevState.filter((post) => post._id !== postId));
        setNotificationMessage('');
      })
      .catch((err) => {
        setNotificationMessage(handleAxiosErrorMessage(err));
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
      .catch((err) => {
        setNotificationMessage(handleAxiosErrorMessage(err));
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
    if (apiLoaded) handleGetPosts(false);
  }, [apiLoaded]);

  return (
    <View style={styles.containerNoPadding}>
      <Toast
        visible={!!notificationMessage}
        position="bottom"
        showDismiss
        onDismiss={() => setNotificationMessage('')}
        backgroundColor="black"
        autoDismiss={3000}
        message={notificationMessage}
      />

      <NewPostTextField
        isVisible={isNewPostTextFieldVisible}
        setIsNewPostTextFieldVisible={setIsNewPostTextFieldVisible}
        value={newContent}
        onChange={setNewContent}
        onSubmit={handleSubmitPost}
        setNotificationMessage={setNotificationMessage}
        setImages={setImages}
        images={images}
      />

      <ActionSheet
        title="Options"
        message="Message goes here"
        onDismiss={() => setSelectedPostId('')}
        visible={!!selectedPostId}
        options={[
          { label: 'Delete', onPress: () => handleDeletePost(selectedPostId) },
          { label: 'Send like', onPress: () => handlePostLike(selectedPostId) },
          { label: 'Cancel', onPress: () => setSelectedPostId('') },
        ]}
      />

      <FlatPostsList
        posts={posts}
        navigation={navigation}
        renderHeader={renderCreatePost}
        renderFooter={renderFooter}
        loaded={loaded}
        handleGetPosts={handleGetPosts}
        handlePostLike={handlePostLike}
        handlePostShare={handlePostShare}
        handleLongPress={(postId) => setSelectedPostId(postId)}
      />

      <FloatingButton
        visible
        button={{
          label: 'Snap',
          iconSource: Assets.icons.plusSmall,
          onPress: () => setIsNewPostTextFieldVisible(true),
          disabled: !loaded,
        }}
      />
    </View>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  clearUser: () => dispatch({
    type: 'SET_USER',
    payload: {
      email: '',
      token: '',
      loggedInDate: '',
    } as IUser,
  }),
});

export default connect(null, mapDispatchToProps)(PostsList);
