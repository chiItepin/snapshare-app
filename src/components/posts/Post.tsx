import React, { FunctionComponent } from 'react';
import moment from 'moment';
import {
  View,
} from 'react-native';
import {
  TouchableOpacity,
  Card,
  Button,
  Text,
  Avatar,
  Colors,
} from 'react-native-ui-lib';
import { useSelector } from 'react-redux';
import { NavigationProp } from '@react-navigation/native';
import styles from '../../styles/GlobalStyles';
import HelperStyles from '../../styles/HelperStyles';
import IPost from '../../screens/templates/post';
import RootScreenParams from '../../screens/RootScreenParams';
import { IState } from '../../reducer';

interface IProps {
  item: IPost;
  navigation: NavigationProp<RootScreenParams>;
  handlePostLike: (postId: string) => void;
  handlePostShare: (postId: string) => void;
  hasRedirectToPostView?: boolean;
}

interface IlikeType {
  _id: string;
}

const Post: FunctionComponent<IProps> = ({
  item,
  navigation,
  handlePostLike,
  handlePostShare,
  hasRedirectToPostView,
}: IProps) => {
  const user = useSelector((state: IState) => state.user);

  const hasUserLiked = (): boolean => {
    const likes = item.likes as IlikeType[];
    const [like] = likes
      .filter((l: IlikeType) => l._id === user._id);
    return !!like;
  };

  return (
    <Card
      style={styles.cardChild}
      onPress={hasRedirectToPostView ? () => navigation.navigate('PostView', {
        postId: item._id,
      }) : undefined}
    >

      <View style={styles.postHeaderContainer}>
        <View style={HelperStyles['w-10']}>
          <Avatar
            onPress={() => navigation.navigate('ProfileView', {
              userId: item?.authorId._id || '',
            })}
            source={item?.authorId.image ? { uri: `data:image/jpeg;base64,${item.authorId.image}` } : undefined}
            size={30}
            label={item.authorId.email.substring(0, 1).toUpperCase()}
            backgroundColor={Colors.yellow80}
          />
        </View>

        <View style={HelperStyles['w-90']}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ProfileView', {
              userId: item?.authorId._id || '',
            })}
            style={styles.postHeaderAuthor}
          >
            <Text
              numberOfLines={1}
              text90
              grey30
              link
            >
              {item?.authorId?.email}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Card.Section
        bg-white
        content={[
          { text: item.content.length > 50 ? `${item.content.substring(0, 50)}...` : item.content, text70: true, grey10: true },
          { text: moment(item.createdAt).format('MMM Do YY'), text90: true, grey50: true },
        ]}
        style={{ padding: 20 }}
      />

      {item.images.length !== 0 && (
        <Card.Section
          imageSource={{
            uri: `data:image/jpeg;base64,${item.images[0].url}`,
          }}
          imageStyle={{
            height: 200,
            width: '100%',
            resizeMode: 'cover',
            marginBottom: 10,
          }}
        />
      )}

      <View style={[HelperStyles.row,
        HelperStyles.paddingHorizontalBig,
        HelperStyles.bgWhite,
        HelperStyles.paddingBottomMed,
        HelperStyles.justifySpaceBetween,
      ]}
      >
        <View style={[HelperStyles.row,
          HelperStyles['w-100'],
        ]}
        >
          <View>
            <Button
              text90
              color={hasUserLiked() ? Colors.violet30 : Colors.grey30}
              link
              onPress={() => handlePostLike(item._id)}
              label={`Likes ${item.likes.length}`}
              style={HelperStyles.paddingRightMed}
            />
          </View>

          <View>
            <Text
              text90
              grey40
              link
              style={HelperStyles.paddingRightMed}
            >
              {`Comments ${item.comments.length}`}
            </Text>
          </View>

          <View>
            <Button
              text90
              color={Colors.grey40}
              link
              onPress={() => handlePostShare(item._id)}
              label="Share"
              style={HelperStyles.paddingRightMed}
            />
          </View>
        </View>
      </View>
    </Card>
  );
};

const arePropsEqual = (prevProps: IProps, nextProps: IProps) => (
  prevProps.item._id === nextProps.item._id
  && prevProps.item.content === nextProps.item.content
  && prevProps.item.comments.length === nextProps.item.comments.length
  && prevProps.item.likes.length === nextProps.item.likes.length
  && prevProps.item.images.length === nextProps.item.images.length
  && prevProps.hasRedirectToPostView === nextProps.hasRedirectToPostView
);

Post.defaultProps = {
  hasRedirectToPostView: true,
};

export default React.memo(Post, arePropsEqual);
