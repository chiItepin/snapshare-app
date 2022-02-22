import React, { FunctionComponent, useEffect } from 'react';
import {
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  Chip,
  View,
  Badge,
  Colors,
} from 'react-native-ui-lib';
import * as Linking from 'expo-linking';
import { createStackNavigator } from '@react-navigation/stack';
import {
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerContentComponentProps,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { HeaderBackButton, HeaderBackButtonProps } from '@react-navigation/elements';
import { connect, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RootScreenParams from '../screens/RootScreenParams';
import drawerStyles from '../styles/RouteStyles';
import { IState } from '../reducer';
import PostsList from '../screens/PostsList';
import Login from '../screens/user/Login';
import Account from '../screens/user/Account';
import SignUpView from '../screens/user/SignUpView';
import PostView from '../screens/posts/PostView';
import ProfileView from '../screens/user/ProfileView';
import NotificationsList from '../screens/user/NotificationsList';
import BarcodeScannerView from '../screens/BarcodeScannerView';
import IUser from '../screens/templates/user';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export interface IDrawerNavigationProps {
  toggleDrawer: () => void;
}

interface IPropsStack {
  navigation: IDrawerNavigationProps;
}

const stackOptions = (navigation: IDrawerNavigationProps): object => ({
  headerTitleAlign: 'center',
  headerTintColor: '#fff',
  headerStyle: { backgroundColor: '#5446f6' },
  cardStyle: { backgroundColor: '#fff' },
  headerLeft: (props: HeaderBackButtonProps) => (!props.canGoBack
    ? (
      <NavigationDrawerStructure toggleDrawer={() => navigation.toggleDrawer()} />
    ) : (
      <HeaderBackButton
        {...props}
      />
    )),
});

const NavigationDrawerStructure: FunctionComponent<IDrawerNavigationProps> = ({
  toggleDrawer,
}: IDrawerNavigationProps) => {
  const unSeenNotificationsCount = useSelector((state: IState) => state.unSeenNotificationsCount);

  return (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity onPress={toggleDrawer}>
        <Image
          source={{
            uri:
              'https://raw.githubusercontent.com/AboutReact/sampleresource/master/drawerWhite.png',
          }}
          style={{ width: 25, height: 25, marginLeft: 15 }}
        />
      </TouchableOpacity>

      {unSeenNotificationsCount
        ? (
          <Badge
            style={{
              marginTop: 2,
            }}
            size={20}
            label={unSeenNotificationsCount.toString()}
            backgroundColor={Colors.orange30}
          />
        ) : null}
    </View>
  );
};

const PostsStack: FunctionComponent<IPropsStack> = ({ navigation }: IPropsStack) => (
  <Stack.Navigator
    screenOptions={stackOptions(navigation)}
  >
    <Stack.Screen name="PostsList" component={PostsList} options={{ title: 'Home' }} />
    <Stack.Screen name="PostView" component={PostView} options={{ title: 'Snap' }} />
    <Stack.Screen name="ProfileView" component={ProfileView} options={{ title: 'Profile' }} />
  </Stack.Navigator>
);

const LoginStack: FunctionComponent<IPropsStack> = ({ navigation }: IPropsStack) => (
  <Stack.Navigator
    initialRouteName="Login"
    screenOptions={stackOptions(navigation)}
  >
    <Stack.Screen name="Login" component={Login} options={{ title: 'Home' }} />
    <Stack.Screen name="SignUpView" component={SignUpView} options={{ title: 'Sign Up' }} />
  </Stack.Navigator>
);

const AccountStack: FunctionComponent<IPropsStack> = ({ navigation }: IPropsStack) => (
  <Stack.Navigator
    initialRouteName="Account"
    screenOptions={stackOptions(navigation)}
  >
    <Stack.Screen name="Account" component={Account} options={{ title: 'Account' }} />
    <Stack.Screen name="ProfileView" component={ProfileView} options={{ title: 'Profile' }} />
  </Stack.Navigator>
);

const NotificationsStack: FunctionComponent<IPropsStack> = ({ navigation }: IPropsStack) => (
  <Stack.Navigator
    initialRouteName="Account"
    screenOptions={stackOptions(navigation)}
  >
    <Stack.Screen name="Notifications" component={NotificationsList} options={{ title: 'Notifications' }} />
  </Stack.Navigator>
);

const BarcodeScannerStack: FunctionComponent<IPropsStack> = ({ navigation }: IPropsStack) => (
  <Stack.Navigator
    initialRouteName="BarcodeScannerView"
    screenOptions={stackOptions(navigation)}
  >
    <Stack.Screen name="BarcodeScannerView" component={BarcodeScannerView} options={{ title: 'QR Scanner' }} />
  </Stack.Navigator>
);

interface IPropsMainNavigation {
  user: IUser;
  unSeenNotificationsCount: number;
}

const mapStateToProps = (state: IState) => ({
  user: state.user,
  unSeenNotificationsCount: state.unSeenNotificationsCount,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  clearUser: () => dispatch({
    type: 'SET_USER',
    payload: {
      email: '',
      token: '',
      loggedInDate: '',
    } as IUser,
  }),
});

interface IDrawerListUserProps {
  user: IUser;
  clearUser: () => void;
}

type DrawerListProps = DrawerContentComponentProps & IDrawerListUserProps;

const DrawerList: FunctionComponent<DrawerListProps> = (props: DrawerListProps) => {
  const {
    descriptors,
    navigation,
    state,
    user,
    clearUser,
  } = props;
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={drawerStyles.drawerListContainer}>
      <View>
        {user?.email ? (
          <View style={drawerStyles.drawerAccountChip}>
            <Chip
              avatarProps={{
                source: user?.image ? { uri: `data:image/jpeg;base64,${user.image}` } : undefined,
                size: 20,
                label: user.email.substring(0, 1).toUpperCase(),
                backgroundColor: Colors.yellow80,
              }}
              iconStyle={drawerStyles.drawerAccountChipImage}
              label={user?.email}
              labelStyle={{ color: Colors.violet30 }}
              containerStyle={
                { borderColor: Colors.violet70, backgroundColor: Colors.violet70 }
              }
              onPress={() => props.navigation.navigate('AccountStack')}
            />
          </View>
        ) : null}

        <DrawerItemList state={state} navigation={navigation} descriptors={descriptors} />
      </View>

      {user?.email ? (
        <View>
          <DrawerItem
            label="Logout"
            labelStyle={{ color: 'black' }}
            onPress={async () => {
              await AsyncStorage.removeItem('@user');
              clearUser();
              props.navigation.closeDrawer();
            }}
          />
        </View>
      ) : null}
    </DrawerContentScrollView>
  );
};

export const DrawerListConnected = connect(mapStateToProps, mapDispatchToProps)(DrawerList);

const NavigationDrawer: FunctionComponent<IPropsMainNavigation> = ({
  user,
  unSeenNotificationsCount,
}: IPropsMainNavigation) => {
  const navigation = useNavigation<NavigationProp<RootScreenParams>>();

  useEffect(() => {
    const urlRedirect = (url: string): void => {
      // parse and redirect to new url
      const { path, queryParams } = Linking.parse(url);
      if (path === 'PostView' && queryParams?.postId) {
        navigation.navigate('PostView', {
          postId: queryParams.postId,
        });
      }
    };

    const linkingHandler = (event: Linking.EventType) => {
      urlRedirect(event.url);
    };

    // listen for new url events coming from Expo
    Linking.addEventListener('url', linkingHandler);
    return () => Linking.removeEventListener('url', linkingHandler);
  }, []);

  return (
    <Drawer.Navigator
      initialRouteName={!user.token ? 'LoginStack' : 'PostsStack'}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: 'rgb(88, 72, 255)',
        drawerInactiveTintColor: 'black',
      }}
      drawerContent={(props: DrawerContentComponentProps) => (
        <DrawerListConnected {...props} />
      )}
    >
      {!user.token
        ? <Drawer.Screen name="LoginStack" component={LoginStack} options={{ drawerLabel: 'Login' }} />
        : (
          <>
            <Drawer.Screen name="PostsStack" component={PostsStack} options={{ drawerLabel: 'Posts' }} />
            <Drawer.Screen name="AccountStack" component={AccountStack} options={{ drawerLabel: 'Account' }} />
            <Drawer.Screen name="NotificationsStack" component={NotificationsStack} options={{ drawerLabel: `Notifications ${unSeenNotificationsCount}` }} />
            <Drawer.Screen name="BarcodeScannerStack" component={BarcodeScannerStack} options={{ drawerLabel: 'QR Scanner' }} />
          </>
        )}
    </Drawer.Navigator>
  );
};

export default connect(mapStateToProps)(NavigationDrawer);
