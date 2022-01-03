import React, { FunctionComponent, useEffect } from 'react';
import {
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  Chip,
  Colors,
  View,
} from 'react-native-ui-lib';
import * as Linking from 'expo-linking';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerContentComponentProps,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { HeaderBackButton, HeaderBackButtonProps } from '@react-navigation/elements';
import { connect } from 'react-redux';
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
import IUser from '../screens/templates/user';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export interface IDrawerNavigationProps {
  toggleDrawer: () => void;
}

interface IPropsStack {
  navigation: IDrawerNavigationProps;
}

/**
 * stackOptions
 * @param {Object} navigation
 * @returns {Object}
 */
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
}: IDrawerNavigationProps) => (
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
  </View>
);

const PostsStack: FunctionComponent<IPropsStack> = ({ navigation }: IPropsStack) => (
  <Stack.Navigator
    initialRouteName="PostsList"
    screenOptions={stackOptions(navigation)}
  >
    <Stack.Screen name="PostsList" component={PostsList} options={{ title: 'Home' }} />
    <Stack.Screen name="PostView" component={PostView} options={{ title: 'Viewing Post' }} />
  </Stack.Navigator>
);

const LoginStack: FunctionComponent<IPropsStack> = ({ navigation }: IPropsStack) => (
  <Stack.Navigator
    initialRouteName="Login"
    screenOptions={stackOptions(navigation)}
  >
    <Stack.Screen name="Login" component={Login} options={{ title: 'Login' }} />
    <Stack.Screen name="SignUpView" component={SignUpView} options={{ title: 'Sign Up' }} />
  </Stack.Navigator>
);

const AccountStack: FunctionComponent<IPropsStack> = ({ navigation }: IPropsStack) => (
  <Stack.Navigator
    initialRouteName="Account"
    screenOptions={stackOptions(navigation)}
  >
    <Stack.Screen name="Account" component={Account} options={{ title: 'Account' }} />
  </Stack.Navigator>
);

interface IPropsMainNavigation {
  user: IUser;
}

const mapStateToProps = (state: IState) => ({
  user: state.user,
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
              labelStyle={{ color: Colors.blue40 }}
              containerStyle={
                { borderColor: Colors.blue80, backgroundColor: Colors.blue80 }
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
          </>
        )}
    </Drawer.Navigator>
  );
};

export default connect(mapStateToProps)(NavigationDrawer);
