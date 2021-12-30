import React, { FunctionComponent, useEffect, useState } from 'react';
import { AxiosResponse, AxiosError } from 'axios';
import {
  View,
} from 'react-native';
import {
  Toast,
  TextField,
  Button,
} from 'react-native-ui-lib';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

const PostsList: FunctionComponent<IProps> = ({
  navigation,
  clearUser,
}: IProps) => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [isNewPostTextFieldVisible, setIsNewPostTextFieldVisible] = useState(false);
  const [nextPage, setNextPage] = useState(1);
  const [notificationMessage, setNotificationMessage] = useState('');
  const { fetchPosts, apiLoaded } = useApi();

  const handleGetPosts = (loadMore?: boolean, page = 1): void => {
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
      setLoading(false);
    });
  };

  const handleSubmitPost = (): void => {
    setIsNewPostTextFieldVisible(false);
    setNotificationMessage('Uploading...');
    fetchPosts.createPost(newContent).then((res) => {
      const updatedPosts = [...posts];
      updatedPosts.unshift(res.data.data);
      setPosts(updatedPosts);
      setNewContent('');
      setNotificationMessage('');
    }).catch((err) => {
      console.log(err);
      setNotificationMessage('Unknown error');
    });
  };

  const renderCreatePost = () => (
    <View style={[HelperStyles.paddingHorizontalMed, HelperStyles.paddingVerticalTopMed]}>
      <TextField
        placeholder="Enter your message"
        value={newContent}
        onChangeText={setNewContent}
        onToggleExpandableModal={(event: boolean) => setIsNewPostTextFieldVisible(event)}
        editable={loaded}
        renderExpandable={() => (
          <NewPostTextField
            isVisible={isNewPostTextFieldVisible}
            setIsNewPostTextFieldVisible={setIsNewPostTextFieldVisible}
            value={newContent}
            onChange={setNewContent}
            onSubmit={handleSubmitPost}
          />
        )}
        expandable
      />
    </View>
  );

  const renderFooter = () => (
    <View style={[HelperStyles.marginBottomBig]}>
      {nextPage !== 1 && (
        <Button
          onPress={() => handleGetPosts(true, nextPage)}
          label="Load more"
          disabled={loading}
          enableShadow
          borderRadius={6}
        />
      )}
    </View>
  );

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

      <FlatPostsList
        posts={posts}
        navigation={navigation}
        renderHeader={renderCreatePost}
        renderFooter={renderFooter}
        loaded={loaded}
        handleGetPosts={handleGetPosts}
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
