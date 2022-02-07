import IUser from '../screens/templates/user';

interface IFollower {
  user: string & IUser;
  byUserId: string;
}

export interface IState {
  user: IUser;
  posts: any[];
  followers: IFollower[];
}

export interface IActions {
  type: string;
  payload: any;
}

const initialState: IState = {
  user: {
    _id: '',
    email: '',
    token: '',
    loggedInDate: '',
    image: '',
  },
  posts: [],
  followers: [],
};

const Reducer = (state: IState = initialState, action: IActions): IState => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'SET_FOLLOWERS':
      return {
        ...state,
        followers: action.payload,
      };
    default:
      return state;
  }
};

export default Reducer;
