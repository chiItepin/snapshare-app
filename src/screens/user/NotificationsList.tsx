import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  View,
  FlatList,
} from 'react-native';
import {
  Button,
  Toast,
  Text,
  Icon,
  ListItem,
} from 'react-native-ui-lib';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import moment from 'moment';
import { NavigationProp } from '@react-navigation/native';
import INotification from '../templates/notification';
import commentsImage from '../../../assets/comments.png';
import userImage from '../../../assets/user.png';
import useApi from '../../useApi';
import HelperStyles from '../../styles/HelperStyles';
import RootScreenParams from '../RootScreenParams';
import handleAxiosErrorMessage from '../../utilities/helpers';

interface IProps {
  navigation: NavigationProp<RootScreenParams>;
  setUnseenNotificationsCount: (count: number) => void;
}

interface INotificationItemProps {
  notification: INotification;
  navigation: NavigationProp<RootScreenParams>;
}

const NotificationItem: FunctionComponent<INotificationItemProps> = ({
  notification,
  navigation,
}: INotificationItemProps) => (
  <View
    style={notification.isSeen
      ? [HelperStyles.borderBottom, HelperStyles.paddingHorizontalSmall]
      : [HelperStyles.borderBottom, HelperStyles.paddingHorizontalSmall, { backgroundColor: 'rgb(255, 249, 235)' }]}
  >
    <ListItem
      onPress={() => {
        if (notification.type === 'post' && notification.resourceId) {
          navigation.navigate('PostView', {
            postId: notification.resourceId,
          });
        }
      }}
    >
      <ListItem.Part middle column>
        <ListItem.Part containerStyle={{ marginBottom: 3 }}>
          <Text grey10 text80 numberOfLines={1}>
            {notification.type}
          </Text>

          <Text grey10 text70 style={{ marginTop: 2 }}>
            <Icon
              size={17}
              source={notification.type === 'post' ? commentsImage : userImage}
            />
          </Text>
        </ListItem.Part>

        <ListItem.Part>
          <Text
            text90
            grey40
            numberOfLines={1}
            style={[HelperStyles.flex1, HelperStyles.paddingRightMed]}
          >
            {notification.message}
          </Text>

          <Text text90 grey40 numberOfLines={1}>
            {moment(notification.createdAt).format('MMM Do YY')}
          </Text>
        </ListItem.Part>
      </ListItem.Part>
    </ListItem>
  </View>
);

const arePropsEqual = (prevProps: INotificationItemProps, nextProps: INotificationItemProps) => (
  prevProps.notification._id === nextProps.notification._id
  && prevProps.notification.resourceId === nextProps.notification.resourceId
);

const MemoizedNotificationItem = React.memo(NotificationItem, arePropsEqual);

const NotificationsList: FunctionComponent<IProps> = ({
  navigation,
  setUnseenNotificationsCount,
}: IProps) => {
  const [alertNotificationMessage, setAlertNotificationMessage] = useState('');
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nextPage, setNextPage] = useState(1);
  const { User, apiLoaded } = useApi();

  const handleGetNotifications = React.useCallback((loadMore = false, page = 1): void => {
    setLoaded(false);
    setLoading(true);
    setAlertNotificationMessage('Loading...');
    setNextPage(page);
    if (loadMore === false) {
      setNotifications([]);
    }
    User.getUserNotifications(page)
      .then((res) => {
        setLoading(false);
        setAlertNotificationMessage('');
        setLoaded(true);
        if (loadMore === false) {
          setNotifications(res.data.data.docs);
        } else {
          setNotifications(notifications.concat(res.data.data.docs));
        }
        setNextPage(res.data.data.nextPage);
      })
      .catch((err) => {
        const errorMsg = handleAxiosErrorMessage(err);
        setAlertNotificationMessage(errorMsg);
      });
  }, [notifications, apiLoaded]);

  const renderFooter = () => (
    <View style={[HelperStyles.marginBottomBig]}>
      {nextPage !== 1 && (
        <Button
          onPress={() => handleGetNotifications(true, nextPage)}
          label="Load more"
          disabled={loading || nextPage === null}
          enableShadow
          borderRadius={6}
        />
      )}
    </View>
  );

  useEffect(() => {
    if (apiLoaded) {
      handleGetNotifications();
      User.updateNotificationsSeenStatus(true)
        .then(() => {
          setUnseenNotificationsCount(0);
        })
        .catch((err) => {
          const errorMsg = handleAxiosErrorMessage(err);
          setAlertNotificationMessage(errorMsg);
        });
    }
  }, [apiLoaded]);

  return (
    <View style={{ flex: 1 }}>
      <Toast
        visible={!!alertNotificationMessage}
        position="bottom"
        onDismiss={() => setAlertNotificationMessage('')}
        showDismiss
        backgroundColor="black"
        autoDismiss={5000}
        message={alertNotificationMessage}
      />

      <FlatList
        data={notifications}
        onRefresh={() => handleGetNotifications(false)}
        refreshing={!loaded}
        renderItem={({ item }) => (
          <MemoizedNotificationItem
            notification={item}
            navigation={navigation}
          />
        )}
        keyExtractor={(item) => item._id}
        ListFooterComponent={(nextPage !== null && nextPage !== 1) ? renderFooter() : undefined}
        ListEmptyComponent={loaded ? <Text grey40 text90 style={{ textAlign: 'center' }}>No records found</Text> : null}
      />
    </View>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setUnseenNotificationsCount: (count: number) => dispatch({
    type: 'SET_UNSEEN_NOTIFICATIONS_COUNT',
    payload: count,
  }),
});

export default connect(null, mapDispatchToProps)(NotificationsList);
