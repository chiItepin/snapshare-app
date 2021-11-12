import React, { FunctionComponent, useEffect, useState } from 'react';
import moment from 'moment';
import {
  View,
  FlatList,
} from 'react-native';
import {
  Toast,
  Card,
  TextField,
  Button,
  Text,
} from 'react-native-ui-lib';
import useApi from '../useApi';
import styles from '../styles/GlobalStyles';
import HelperStyles from '../styles/HelperStyles';
import IPost from '../screens/templates/post';
import NewPostTextField from '../components/posts/NewPostTextField';

interface IPropsNavigation {
  navigation: any;
}

const PostsList: FunctionComponent<IPropsNavigation> = ({
  navigation,
}: IPropsNavigation) => {
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
    fetchPosts.getPosts(page).then((res) => {
      setLoading(false);
      setLoaded(true);
      if (loadMore === false) {
        setPosts(res.data.data.docs);
      } else {
        setPosts(posts.concat(res.data.data.docs));
      }
      setNextPage(res.data.data.nextPage);
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

      <FlatList
        data={posts}
        onRefresh={() => handleGetPosts(false)}
        refreshing={!loaded}
        style={HelperStyles.paddingHorizontalMed}
        renderItem={(item) => (
          <View key={item.item._id} style={styles.card}>
            <Card
              style={{ marginBottom: 5 }}
              onPress={() => navigation.navigate('PostView', {
                post: item.item,
              })}
            >
              <Card.Section
                bg-white
                content={[
                  { text: item.item.content.length > 50 ? `${item.item.content.substring(0, 50)}...` : item.item.content, text70: true, grey10: true },
                  { text: item.item?.authorId?.email, text90: true, grey40: true },
                  { text: moment(item.item.createdAt).format('MMM Do YY'), text90: true, grey50: true },
                ]}
                style={{ padding: 20 }}
              />
              <View style={[HelperStyles.row,
                HelperStyles.paddingHorizontalBig,
                HelperStyles.marginBottomMed,
                HelperStyles.justifySpaceBetween,
              ]}
              >
                <View style={[HelperStyles.row,
                  HelperStyles['w-50'],
                ]}
                >
                  <View style={HelperStyles.paddingRightMed}>
                    <Button
                      text90
                      link
                      label={`Likes ${item.item.likes.length}`}
                    />
                  </View>

                  <View>
                    <Text
                      text90
                      grey40
                      link
                    >
                      {`Comments ${item.item.comments.length}`}
                    </Text>
                  </View>
                </View>

                <View style={[HelperStyles['w-50'], HelperStyles.row, HelperStyles.justifyFlexEnd]}>
                  {/* <Button text90 link label="Share" /> */}
                </View>
              </View>
            </Card>
          </View>
        )}
        ListHeaderComponent={renderCreatePost()}
        ListFooterComponent={renderFooter()}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={loaded ? <Text style={{ textAlign: 'center' }}>No records found</Text> : null}
      />
    </View>
  );
};

export default PostsList;
