import React, { FunctionComponent, useEffect, useState } from 'react';
import moment from 'moment';
import {
  View,
  FlatList,
  Text,
} from 'react-native';
import {
  Toast,
  Card,
  TextField,
} from 'react-native-ui-lib';
import useApi from '../useApi';
import styles from '../styles/GlobalStyles';
import HelperStyles from '../styles/HelperStyles';
import IPost from '../screens/templates/post';
import NewPostTextField from '../components/posts/NewPostTextField';

const PostsList: FunctionComponent = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [isNewPostTextFieldVisible, setIsNewPostTextFieldVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const { fetchPosts, apiLoaded } = useApi();

  const handleGetPosts = (): void => {
    setPosts([]);
    setLoaded(false);
    setNotificationMessage('Loading...');
    fetchPosts.getPosts().then((res) => {
      setLoaded(true);
      setPosts(res.data.data);
      setNotificationMessage('');
    }).catch((err) => {
      console.log(err);
      setNotificationMessage('Unknown error');
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

  useEffect(() => {
    if (apiLoaded) handleGetPosts();
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

      <FlatList
        data={posts}
        onRefresh={handleGetPosts}
        refreshing={!loaded}
        style={HelperStyles.paddingHorizontalMed}
        renderItem={(item) => (
          <View key={item.item._id} style={styles.card}>
            <Card style={{ marginBottom: 5 }}>
              <Card.Section
                bg-white
                content={[
                  { text: item.item.content, text70: true, grey10: true },
                  { text: item.item?.authorId?.email, text90: true, grey40: true },
                  { text: moment(item.item.createdAt).format('MMM Do YY'), text90: true, grey50: true },
                ]}
                style={{ padding: 20 }}
              />
            </Card>
          </View>
        )}
        ListHeaderComponent={renderCreatePost()}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={loaded ? <Text style={{ textAlign: 'center' }}>No records found</Text> : null}
      />
    </View>
  );
};

export default PostsList;
