import React, { FunctionComponent } from 'react';
import {
  Image,
  TouchableOpacity,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  Chip,
  Colors,
  View,
} from 'react-native-ui-lib';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerContentComponentProps,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { HeaderBackButton } from '@react-navigation/elements';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import drawerStyles from '../styles/RouteStyles';
import { IState } from '../reducer';
import PostsList from '../screens/PostsList';
import Login from '../screens/user/Login';
import Account from '../screens/user/Account';
import PostView from '../screens/posts/PostView';
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
              // iconSource={Assets.icons.settings}
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
}: IPropsMainNavigation) => (
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

export default connect(mapStateToProps)(NavigationDrawer);
