import React, { FunctionComponent, useState, useEffect } from 'react';
import moment from 'moment';
import { AxiosResponse } from 'axios';
import {
  Toast,
  Card,
  Text,
  Button,
  LoaderScreen,
  View,
} from 'react-native-ui-lib';
import styles from '../../styles/GlobalStyles';
import HelperStyles from '../../styles/HelperStyles';
import IPost from '../../screens/templates/post';
import useApi from '../../useApi';

interface IParams {
  postId: string;
}

interface IProps {
  route: {
    params: IParams,
  };
}

const PostView: FunctionComponent<IProps> = ({
  route,
}: IProps) => {
  const [post, setPost] = useState<IPost>();
  const [loaded, setLoaded] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const { fetchPosts, apiLoaded } = useApi();
  const { postId } = route.params;

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
        <Card style={{ marginBottom: 5 }}>
          <Card.Section
            bg-white
            content={[
              { text: post.content, text70: true, grey10: true },
              { text: post?.authorId?.email, text90: true, grey40: true },
              { text: moment(post.createdAt).format('MMM Do YY'), text90: true, grey50: true },
            ]}
            style={{ padding: 20 }}
          />

          <View style={[
            HelperStyles.row,
            HelperStyles.paddingHorizontalBig,
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
                  label={`Likes ${post.likes.length}`}
                />
              </View>

              <View>
                <Text
                  text90
                  grey40
                  link
                >
                  {`Comments ${post.comments.length}`}
                </Text>
              </View>
            </View>

            <View style={[HelperStyles['w-50'], HelperStyles.row, HelperStyles.justifyFlexEnd]}>
              <Button text90 link label="Share" />
            </View>
          </View>
        </Card>
      </View>
    </View>
  );
};

export default PostView;
