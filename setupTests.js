jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: () => ({
    setItem: async () => null,
  }),
}));

jest.mock('expo-image-picker', () => ({
  __esModule: true,
  launchImageLibraryAsync: () => ({}),
  MediaTypeOptions: {
    Images: {},
  },
}));

jest.mock('./src/useApi', () => ({
  __esModule: true,
  default: () => ({
    User: {
      createUser: () => Promise.resolve({
        data: {
          data: {
            email: 'lorem@ipsum.com',
            _id: 'xxx',
          },
          token: 'XXXxxxXXX',
        },
      }),
    },
  }),
}));
