import React, { FunctionComponent } from 'react';
import {
  View,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import {
  Text,
} from 'react-native-ui-lib';
import { NavigationProp } from '@react-navigation/native';
import Post from './Post';
import styles from '../../styles/GlobalStyles';
import HelperStyles from '../../styles/HelperStyles';
import IPost from '../../screens/templates/post';
import RootScreenParams from '../../screens/RootScreenParams';

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

const RenderPost: FunctionComponent<IRenderPostProps> = ({
  item,
  navigation,
  handlePostLike,
  handlePostShare,
}: IRenderPostProps) => (
  <View key={item._id} style={styles.card}>
    <Post
      item={item}
      handlePostLike={handlePostLike}
      handlePostShare={handlePostShare}
      navigation={navigation}
    />
  </View>
);

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
