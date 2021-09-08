import React, { FunctionComponent, useState, useEffect } from 'react';
import moment from 'moment';
import {
  Text,
  ScrollView,
  View,
} from 'react-native';
import {
  Button,
  TextField,
  Toast,
} from 'react-native-ui-lib';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux';
import IUser from '../templates/user';
import useApi from '../../useApi';
import styles from '../../styles/GlobalStyles';
import typographyStyles from '../../styles/TypographyStyles';
import helperStyles from '../../styles/HelperStyles';

interface IPropsNavigation {
  navigation: any;
  dispatch: any;
}

const Login:FunctionComponent<IPropsNavigation> = ({
  navigation,
  dispatch,
}: IPropsNavigation) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const { loginUser } = useApi();

  const handleLogin = (): void => {
    setLoading(true);
    setNotificationMessage('Loading...');
    loginUser(email, password)
      .then(async (res: any) => {
        setLoading(false);
        setNotificationMessage('Logged in successfully!');

        const userModel = {
          email,
          token: res.data.data,
          loggedInDate: moment().format('LL'),
        };

        await AsyncStorage.setItem('@user', JSON.stringify(userModel));
        dispatch({
          type: 'SET_USER',
          payload: {
            ...userModel,
          } as IUser,
        });

        navigation.navigate('AccountStack');
      })
      .catch(() => {
        setNotificationMessage('Account not found!');
        setLoading(false);
      });
  };

  useEffect(() => {
    const getToken = async () => {
      AsyncStorage.getItem('@user').then((value: any) => {
        const userModel = JSON.parse(value) as IUser;

        dispatch({
          type: 'SET_USER',
          payload: {
            ...userModel,
          } as IUser,
        });
      });
    };
    getToken();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <Toast
          visible={!!notificationMessage}
          position="bottom"
          showDismiss
          onDismiss={() => setNotificationMessage('')}
          backgroundColor="black"
          autoDismiss={3000}
          message={notificationMessage}
        />

        <View style={styles.card}>
          <Text
            style={[typographyStyles.h1, helperStyles.marginVerticalMed]}
          >
            Enter your credentials
          </Text>

          <TextField
            placeholder="Enter your email"
            title="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          <TextField
            placeholder="Enter your password"
            title="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button
            onPress={handleLogin}
            label="Submit"
            disabled={!password || !email || loading}
            enableShadow
            borderRadius={6}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default connect(null, null)(Login);
