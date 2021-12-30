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
} from 'react-native-ui-lib';
import styles from '../../styles/GlobalStyles';
import HelperStyles from '../../styles/HelperStyles';
import IPost from '../../screens/templates/post';

interface IProps {
  posts: IPost[];
  navigation: any;
  renderHeader: () => React.ReactElement|null;
  renderFooter: () => React.ReactElement|null;
  loaded: boolean;
  handleGetPosts: (loadMore: boolean, page?: number) => void;
}

const FlatPostsList: FunctionComponent<IProps> = ({
  posts,
  navigation,
  renderHeader,
  renderFooter,
  loaded,
  handleGetPosts,
}: IProps) => (
  <FlatList
    data={posts}
    onRefresh={() => handleGetPosts(false)}
    refreshing={!loaded}
    style={HelperStyles.paddingHorizontalMed}
    renderItem={(item) => (
      <View key={item.item._id} style={styles.card}>
        <Card
          style={styles.cardChild}
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
    ListHeaderComponent={renderHeader()}
    ListFooterComponent={renderFooter()}
    keyExtractor={(item) => item._id}
    ListEmptyComponent={loaded ? <Text style={{ textAlign: 'center' }}>No records found</Text> : null}
  />
);

export default FlatPostsList;
