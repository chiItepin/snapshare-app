import { FunctionComponent, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import IUser from '../screens/templates/user';
import useApi from '../useApi';
import IFollower from '../screens/templates/follower';
import { IState } from '../reducer';

type TSetFollowers = (followers: IFollower[]) => void;

interface IProps {
  user: IUser;
  setFollowers: TSetFollowers;
  setUnseenNotificationsCount: (count: number) => void;
}

const UserPlaceholder:FunctionComponent<IProps> = ({
  user,
  setFollowers,
  setUnseenNotificationsCount,
}: IProps) => {
  const {
    apiLoaded,
    fetchFollowers,
    User,
  } = useApi();

  useEffect(() => {
    if (apiLoaded) {
      if (user._id) {
        fetchFollowers.getFollowers(user._id || '', 1)
          .then((res) => {
            setFollowers(res.data.data.docs);
          });

        User.getUserUnSeenNotifications(1)
          .then((res) => {
            setUnseenNotificationsCount(res.data.data.totalDocs);
          });
      }
    }
  }, [apiLoaded, user]);

  return null;
};

const mapStateToProps = (state: IState) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setFollowers: (followers: IFollower[]) => dispatch({
    type: 'SET_FOLLOWERS',
    payload: followers,
  }),
  setUnseenNotificationsCount: (count: number) => dispatch({
    type: 'SET_UNSEEN_NOTIFICATIONS_COUNT',
    payload: count,
  }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserPlaceholder);
