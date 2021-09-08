import React, { FunctionComponent } from 'react';
import {
  Image,
  View,
  TouchableOpacity,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  createDrawerNavigator,
} from '@react-navigation/drawer';
import { HeaderBackButton } from '@react-navigation/elements';
import { connect } from 'react-redux';
import { IState } from '../reducer';
import Home from '../screens/Home';
import Home2 from '../screens/Home2';
import Login from '../screens/user/Login';
import Account from '../screens/user/Account';
import IUser from '../screens/templates/user';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

interface IPropsNavigation {
  navigation: any;
}

interface IPropsStack {
  navigation: IPropsNavigation;
}

interface IPropsDrawerStructure {
  toggleDrawer: () => {};
}

/**
 * stackOptions
 * @param {Object} navigation
 * @returns {Object}
 */
const stackOptions = (navigation: any): object => ({
  headerTitleAlign: 'center',
  headerTintColor: '#fff',
  headerStyle: { backgroundColor: '#5446f6' },
  cardStyle: { backgroundColor: '#fff' },
  headerLeft: (props: any) => (!props?.canGoBack
    ? (
      <NavigationDrawerStructure toggleDrawer={() => navigation.toggleDrawer()} />
    ) : (
      <HeaderBackButton
        {...props}
      />
    )),
});

const NavigationDrawerStructure: FunctionComponent<IPropsDrawerStructure> = ({
  toggleDrawer,
}: IPropsDrawerStructure) => (
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

const HomeStack: FunctionComponent<IPropsStack> = ({ navigation }: IPropsStack) => (
  <Stack.Navigator
    initialRouteName="Home"
    screenOptions={stackOptions(navigation)}
  >
    <Stack.Screen name="Home" component={Home} options={{ title: 'Home' }} />
    <Stack.Screen name="Home2" component={Home2} options={{ title: 'Home2' }} />
  </Stack.Navigator>
);

const PostsStack: FunctionComponent<IPropsStack> = ({ navigation }: IPropsStack) => (
  <Stack.Navigator
    initialRouteName="Home"
    screenOptions={stackOptions(navigation)}
  >
    <Stack.Screen name="Home" component={Home} options={{ title: 'Home' }} />
    <Stack.Screen name="Home2" component={Home2} options={{ title: 'Home2' }} />
  </Stack.Navigator>
);

const LoginStack: FunctionComponent<IPropsStack> = ({ navigation }: IPropsStack) => (
  <Stack.Navigator
    initialRouteName="Login"
    screenOptions={stackOptions(navigation)}
  >
    <Stack.Screen name="Login" component={Login} options={{ title: 'Login' }} />
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

const Navigation: FunctionComponent<IPropsMainNavigation> = ({
  user,
}: IPropsMainNavigation) => (
  <Drawer.Navigator
    initialRouteName={!user.token ? 'LoginStack' : 'HomeStack'}
    screenOptions={{
      headerShown: false,
    }}
  >
    <Drawer.Screen name="HomeStack" component={HomeStack} options={{ drawerLabel: 'Home' }} />
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

const mapStateToProps = (state: IState) => ({
  user: state.user,
});

export default connect(mapStateToProps)(Navigation);
