import React, { FunctionComponent } from 'react';
import moment from 'moment';
import {
  View,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
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
  posts: IPost[];
  navigation: any;
  renderHeader: () => React.ReactElement|null;
  renderFooter: () => React.ReactElement|null;
  loaded: boolean;
  handleGetPosts: (loadMore: boolean, page?: number) => void;
  handlePostLike: (postId: string) => void;
  handlePostShare: (postId: string) => void;
  onScroll?: null|((event: NativeSyntheticEvent<NativeScrollEvent>) => void)
}

interface IRenderPostProps {
  item: IPost;
  navigation: NavigationProp<RootScreenParams>;
  handlePostLike: (postId: string) => void;
  handlePostShare: (postId: string) => void;
}

type likeType = {
  _id: string;
}

const RenderPost: FunctionComponent<IRenderPostProps> = ({
  item,
  navigation,
  handlePostLike,
  handlePostShare,
}: IRenderPostProps) => {
  const user = useSelector((state: IState) => state.user);

  const hasUserLiked = (): boolean => {
    const likes = item.likes as likeType[];
    const [like] = likes
      .filter((l: likeType) => l._id === user._id);
    return !!like;
  };

  return (
    <View key={item._id} style={styles.card}>
      <Card
        style={styles.cardChild}
        onPress={() => navigation.navigate('PostView', {
          postId: item._id,
        })}
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
    </View>
  );
};

const arePropsEqual = (prevProps: IRenderPostProps, nextProps: IRenderPostProps) => (
  prevProps.item._id === nextProps.item._id
  && prevProps.item.content === nextProps.item.content
  && prevProps.item.comments.length === nextProps.item.comments.length
  && prevProps.item.likes.length === nextProps.item.likes.length
);

const MemoizedRenderPost = React.memo(RenderPost, arePropsEqual);

const FlatPostsList: FunctionComponent<IProps> = ({
  posts,
  navigation,
  renderHeader,
  renderFooter,
  loaded,
  handleGetPosts,
  handlePostLike,
  handlePostShare,
  onScroll = null,
}: IProps) => (
  <FlatList
    testID="flat-posts-list"
    data={posts}
    onRefresh={() => handleGetPosts(false)}
    refreshing={!loaded}
    style={HelperStyles.paddingHorizontalMed}
    renderItem={({ item }) => (
      <MemoizedRenderPost
        handlePostLike={handlePostLike}
        handlePostShare={handlePostShare}
        item={item}
        navigation={navigation}
      />
    )}
    ListHeaderComponent={renderHeader()}
    ListFooterComponent={renderFooter()}
    keyExtractor={(item) => item._id}
    onScroll={onScroll
      ? (event: NativeSyntheticEvent<NativeScrollEvent>) => onScroll(event) : undefined}
    ListEmptyComponent={loaded ? <Text style={{ textAlign: 'center' }}>No records found</Text> : null}
  />
);

FlatPostsList.defaultProps = {
  onScroll: null,
};

export default FlatPostsList;
