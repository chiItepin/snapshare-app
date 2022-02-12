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
  NotificationsStack: undefined;
  BarcodeScannerView: undefined;
  BarcodeScannerStack: undefined;
}

export default RootScreenParams;
