const config = {
  screens: {
    ProfileView: {
      path: 'profile/:id',
    },
  },
};

const linking = {
  prefixes: ['snapshare-app://app'],
  config,
};

export default linking;
