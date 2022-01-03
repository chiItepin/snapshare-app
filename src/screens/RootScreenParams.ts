import IPost from '../screens/templates/post';

interface IPostViewParams {
  post: IPost,
}

interface RootScreenParams {
  PostsList: undefined;
  PostView: IPostViewParams|undefined;
  Login: undefined;
  AccountStack: undefined;
  SignUpView: undefined;
}

export default RootScreenParams;
