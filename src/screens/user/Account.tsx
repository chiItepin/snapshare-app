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
import { Dispatch } from 'redux';
import IUser from '../templates/user';
import styles from '../../styles/GlobalStyles';
import { IState } from '../../reducer';

interface IProps {
  clearUser: () => void;
  user: IUser;
}

const Login:FunctionComponent<IProps> = ({
  clearUser,
  user,
}: IProps) => {
  const [notificationMessage, setNotificationMessage] = useState('');

  const handleLogout = async (): Promise<void> => {
    await AsyncStorage.removeItem('@user');
    clearUser();
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);
