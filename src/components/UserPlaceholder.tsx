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
}

const UserPlaceholder:FunctionComponent<IProps> = ({
  user,
  setFollowers,
}: IProps) => {
  const {
    apiLoaded,
    fetchFollowers,
  } = useApi();

  useEffect(() => {
    if (apiLoaded && user._id) {
      fetchFollowers.getFollowers(user._id || '', 1)
        .then((res) => {
          setFollowers(res.data.data.docs);
        });
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserPlaceholder);
