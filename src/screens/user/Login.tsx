import React, { FunctionComponent, useState, useEffect } from 'react';
import moment from 'moment';
import {
  Text,
  ScrollView,
} from 'react-native';
import {
  Button,
  TextField,
  Toast,
  View,
  LoaderScreen,
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

type TSetUser = (userModel: IUser) => void

interface DispatchProps {
  setUser: TSetUser;
}
interface IPropsNavigation {
  navigation: NavigationProp<RootScreenParams>;
}

interface IProps extends IPropsNavigation {
  setUser: TSetUser;
}

const Login:FunctionComponent<IProps> = ({
  navigation,
  setUser,
}: IProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingUserToken, setLoadingUserToken] = useState(true);
  const [notificationMessage, setNotificationMessage] = useState('');
  const {
    loginUser,
    apiLoaded,
    User,
  } = useApi();

  const handleLogin = (): void => {
    setLoading(true);
    setNotificationMessage('Loading...');
    loginUser(email, password)
      .then(async (res: AxiosResponse) => {
        setLoading(false);
        setNotificationMessage('Logged in successfully!');

        const userModel = {
          email,
          _id: res.data.userId,
          token: res.data.data,
          loggedInDate: moment().format('LL'),
        } as IUser;

        await AsyncStorage.setItem('@user', JSON.stringify(userModel));
        setUser(userModel);

        navigation.navigate('AccountStack');
      })
      .catch(() => {
        setNotificationMessage('Account not found!');
        setLoading(false);
      });
  };

  useEffect(() => {
    const getUserToken = () => {
      setLoadingUserToken(true);
      AsyncStorage.getItem('@user')
        .then((value: any) => {
          const userModel = JSON.parse(value) as IUser;
          Promise.all([
            User.getUser(userModel._id || ''),
          ])
            .then((responses: AxiosResponse[]) => {
              responses.forEach((res) => {
                setUser({
                  ...userModel,
                  image: res.data.data.image,
                });
                setLoadingUserToken(false);
              });
            })
            .catch(() => {
              setLoadingUserToken(false);
              setNotificationMessage('Failed retrieving user');
            });
        })
        .catch(() => {
          setLoadingUserToken(false);
        });
    };
    if (apiLoaded) {
      getUserToken();
    }
  }, [apiLoaded]);

  if (loadingUserToken) {
    return (
      <View flex right paddingR-20>
        <Toast
          visible={!!notificationMessage}
          position="bottom"
          showDismiss
          onDismiss={() => setNotificationMessage('')}
          backgroundColor="black"
          autoDismiss={3000}
          message={notificationMessage}
        />

        <LoaderScreen message="Loading..." overlay />
      </View>
    );
  }

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
            label="Login"
            disabled={!password || !email || loading}
            enableShadow
            borderRadius={6}
          />

          <Button
            onPress={() => navigation.navigate('SignUpView')}
            hyperlink
            text90
            link
            label="Sign Up"
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
