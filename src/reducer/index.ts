import IUser from '../screens/templates/user';

export interface IState {
  user: IUser,
  posts: any[],
}

export interface IActions {
  type: string;
  payload: any;
}

const initialState: IState = {
  user: {
    email: '',
    token: '',
    loggedInDate: '',
  },
  posts: [],
};

const Reducer = (state: IState = initialState, action: IActions): IState => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

export default Reducer;
