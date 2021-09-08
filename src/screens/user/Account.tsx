import React, { FunctionComponent, useState } from 'react';
import {
  ScrollView,
  View,
} from 'react-native';
import {
  Button,
  Toast,
  Card,
} from 'react-native-ui-lib';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux';
import IUser from '../templates/user';
import styles from '../../styles/GlobalStyles';
import { IState } from '../../reducer';

interface IPropsNavigation {
  dispatch: any;
  user: IUser;
}

const Login:FunctionComponent<IPropsNavigation> = ({
  dispatch,
  user,
}: IPropsNavigation) => {
  const [notificationMessage, setNotificationMessage] = useState('');

  const handleLogout = async (): Promise<void> => {
    await AsyncStorage.removeItem('@user');

    dispatch({
      type: 'SET_USER',
      payload: {
        email: '',
        token: '',
        loggedInDate: '',
      } as IUser,
    });
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <Toast
          visible={!!notificationMessage}
          position="bottom"
          onDismiss={() => setNotificationMessage('')}
          showDismiss
          backgroundColor="black"
          autoDismiss={5000}
          message={notificationMessage}
        />

        <View style={styles.card}>
          <Card style={{ marginBottom: 10 }}>
            <Card.Section
              bg-white
              content={[
                { text: user?.email || '', text70: true, grey10: true },
                { text: user?.loggedInDate ? `Logged: ${user?.loggedInDate}` : '', text90: true, grey50: true },
              ]}
              style={{ padding: 20 }}
            />
          </Card>

          <Button
            onPress={handleLogout}
            label="Logout"
            enableShadow
            bg-black
            borderRadius={6}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const mapStateToProps = (state: IState) => ({
  user: state.user,
});

export default connect(mapStateToProps)(Login);
