import React, { FunctionComponent, useState } from 'react';
import moment from 'moment';
import {
  Text,
  ScrollView,
} from 'react-native';
import {
  Button,
  Incubator,
  Toast,
  View,
} from 'react-native-ui-lib';
import { NavigationProp } from '@react-navigation/native';
import { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux';
import Redux from 'redux';
import IUser from '../templates/user';
import useApi from '../../useApi';
import styles from '../../styles/GlobalStyles';
import typographyStyles from '../../styles/TypographyStyles';
import helperStyles from '../../styles/HelperStyles';
import RootScreenParams from '../RootScreenParams';

const { TextField } = Incubator;

type TSetUser = (userModel: IUser) => void

interface DispatchProps {
  setUser: TSetUser
}
interface IPropsNavigation {
  navigation: NavigationProp<RootScreenParams>;
  setUser: TSetUser
}

const Login:FunctionComponent<IPropsNavigation> = ({
  navigation,
  setUser,
}: IPropsNavigation) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const { User } = useApi();

  const handleSignup = (): void => {
    setLoading(true);
    setNotificationMessage('Loading...');
    User.createUser(email, password, confirmPassword)
      .then(async (res: AxiosResponse) => {
        setLoading(false);
        setNotificationMessage('Signed Up successfully!');

        const newUser: IUser = res.data.data;

        const userModel = {
          email: newUser.email,
          _id: newUser._id,
          token: res.data.token,
          loggedInDate: moment().format('LL'),
        } as IUser;

        await AsyncStorage.setItem('@user', JSON.stringify(userModel));
        setUser(userModel);
      })
      .catch(() => {
        setNotificationMessage('Email already found!');
        setLoading(false);
      });
  };

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
            Signing Up
          </Text>

          <TextField
            placeholder="Enter your email"
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            enableErrors
            validationMessage={['Email is required', 'Email is invalid']}
            validate={['required', 'email']}
            validateOnChange
            fieldStyle={styles.genericField}
            validationMessageStyle={{ marginBottom: 10 }}
          />

          <TextField
            placeholder="Enter your password"
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            maxLength={20}
            showCharCounter
            fieldStyle={styles.genericField}
          />

          <TextField
            placeholder="Confirm your password"
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            maxLength={20}
            showCharCounter
            fieldStyle={styles.genericField}
          />

          <Button
            onPress={handleSignup}
            label="Sign Up"
            disabled={!password || !email || loading || (password !== confirmPassword)}
            enableShadow
            borderRadius={6}
          />

          <Button
            onPress={() => navigation.navigate('Login')}
            hyperlink
            text90
            link
            label="Already have an account"
            style={helperStyles.marginTopMed}
            labelStyle={{ textDecorationLine: 'none' }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const mapDispatchToProps = (dispatch: Redux.Dispatch<any>) => ({
  setUser: (userModel: IUser) => dispatch({
    type: 'SET_USER',
    payload: {
      ...userModel,
    },
  }),
});

export default connect<DispatchProps>(null, mapDispatchToProps)(Login);
