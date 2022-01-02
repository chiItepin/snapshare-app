import IPost from '../screens/templates/post';

interface IPostViewParams {
  post: IPost,
}

interface RootScreenParams {
  PostsList: undefined;
  PostView: IPostViewParams|undefined;
  Login: undefined;
  Account: undefined;
}

export default RootScreenParams;
