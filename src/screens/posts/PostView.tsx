import React, { FunctionComponent, useEffect, useState } from 'react';
import moment from 'moment';
import {
  View,
  FlatList,
} from 'react-native';
import {
  Toast,
  Card,
  Text,
  Button,
} from 'react-native-ui-lib';
import useApi from '../../useApi';
import styles from '../../styles/GlobalStyles';
import HelperStyles from '../../styles/HelperStyles';
import IPost from '../../screens/templates/post';

interface IParams {
  post: IPost;
}

interface IProps {
  route: {
    params: IParams,
  };
}

const PostView: FunctionComponent<IProps> = ({
  route,
}: IProps) => {
  const [notificationMessage, setNotificationMessage] = useState('');
  const { apiLoaded } = useApi();
  const { post } = route.params;
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
