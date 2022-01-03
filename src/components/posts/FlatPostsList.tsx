import React, { FunctionComponent } from 'react';
import moment from 'moment';
import {
  View,
  FlatList,
} from 'react-native';
import {
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
}

interface IRenderPostProps {
  item: IPost;
  navigation: NavigationProp<RootScreenParams>;
  handlePostLike: (postId: string) => void;
}

type likeType = {
  _id: string;
}

const RenderPost: FunctionComponent<IRenderPostProps> = ({
  item,
  navigation,
  handlePostLike,
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
          post: item,
        })}
      >

        <View style={styles.postHeaderContainer}>
          <View style={HelperStyles['w-10']}>
            <Avatar
              source={item?.authorId.image ? { uri: `data:image/jpeg;base64,${item.authorId.image}` } : undefined}
              size={30}
              label={item.authorId.email.substring(0, 1).toUpperCase()}
              backgroundColor={Colors.yellow80}
            />
          </View>

          <View style={HelperStyles['w-90']}>
            <Text numberOfLines={1} style={styles.postHeaderAuthor}>{item?.authorId?.email}</Text>
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
            HelperStyles['w-50'],
          ]}
          >
            <View style={HelperStyles.paddingRightMed}>
              <Button
                text90
                color={hasUserLiked() ? Colors.violet30 : Colors.grey30}
                link
                onPress={() => handlePostLike(item._id)}
                label={`Likes ${item.likes.length}`}
              />
            </View>

            <View>
              <Text
                text90
                grey40
                link
              >
                {`Comments ${item.comments.length}`}
              </Text>
            </View>
          </View>

          <View style={[HelperStyles['w-50'], HelperStyles.row, HelperStyles.justifyFlexEnd]}>
            {/* <Button text90 link label="Share" /> */}
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
}: IProps) => (
  <FlatList
    data={posts}
    onRefresh={() => handleGetPosts(false)}
    refreshing={!loaded}
    style={HelperStyles.paddingHorizontalMed}
    renderItem={({ item }) => (
      <MemoizedRenderPost
        handlePostLike={handlePostLike}
        item={item}
        navigation={navigation}
      />
    )}
    ListHeaderComponent={renderHeader()}
    ListFooterComponent={renderFooter()}
    keyExtractor={(item) => item._id}
    ListEmptyComponent={loaded ? <Text style={{ textAlign: 'center' }}>No records found</Text> : null}
  />
);

export default FlatPostsList;
