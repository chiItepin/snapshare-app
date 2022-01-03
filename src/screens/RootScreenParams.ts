interface IPostViewParams {
  postId: string,
}

interface RootScreenParams {
  PostsList: undefined;
  PostView: IPostViewParams|undefined;
  Login: undefined;
  AccountStack: undefined;
  SignUpView: undefined;
}

export default RootScreenParams;
