interface IPostViewParams {
  postId: string,
}

interface IProfileViewParams {
  userId: string,
}

interface RootScreenParams {
  PostsList: undefined;
  PostView: IPostViewParams|undefined;
  Login: undefined;
  AccountStack: undefined;
  SignUpView: undefined;
  ProfileView: IProfileViewParams;
}

export default RootScreenParams;
