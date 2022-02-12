import React, { FunctionComponent, useState } from 'react';
import {
  ScrollView,
  View,
} from 'react-native';
import {
  Button,
  Toast,
  Card,
  Avatar,
  Colors,
} from 'react-native-ui-lib';
import { NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as ImagePicker from 'expo-image-picker';
import IUser from '../templates/user';
import styles from '../../styles/GlobalStyles';
import { IState } from '../../reducer';
import useApi from '../../useApi';
import HelperStyles from '../../styles/HelperStyles';
import RootScreenParams from '../RootScreenParams';

type userPropertiesType = 'image'|'loggedInDate'|'token';
interface IProps {
  clearUser: () => void;
  changeUser: (user: IUser, property: userPropertiesType, value: any) => void;
  user: IUser;
  navigation: NavigationProp<RootScreenParams>;
}

const Login:FunctionComponent<IProps> = ({
  clearUser,
  user,
  changeUser,
  navigation,
}: IProps) => {
  const [notificationMessage, setNotificationMessage] = useState('');
  const { User } = useApi();

  const handleLogout = async (): Promise<void> => {
    await AsyncStorage.removeItem('@user');
    clearUser();
  };

  const handlePickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.5,
      base64: true,
    });

    if (!result.cancelled && user._id && result.base64) {
      setNotificationMessage('Uploading...');
      User.updateImage(user._id, result.base64)
        .then(() => {
          setNotificationMessage('Image updated successfully');
          changeUser(user, 'image', result.base64);
        })
        .catch(() => {
          setNotificationMessage('Image uploading failed!');
        });
    }
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
          <Card style={{ marginBottom: 10, alignItems: 'center' }}>
            <View style={styles.accountAvatarContainer}>
              <Avatar
                source={user?.image ? { uri: `data:image/jpeg;base64,${user.image}` } : undefined}
                size={60}
                label={user.email.substring(0, 1).toUpperCase()}
                backgroundColor={Colors.yellow80}
                onPress={handlePickImage}
              />
            </View>

            <Card.Section
              bg-white
              content={[
                { text: user?.email || '', text70: true, grey10: true },
                { text: user?.loggedInDate ? `Logged: ${user?.loggedInDate}` : '', text90: true, grey50: true },
              ]}
              style={{ padding: 20 }}
            />

            <View style={[HelperStyles.paddingHorizontalBig, HelperStyles.paddingBottomMed]}>
              <Button
                onPress={() => navigation.navigate('ProfileView', {
                  userId: user._id || '',
                })}
                label="View profile"
                enableShadow
                outline
                borderRadius={6}
              />
            </View>
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
      image: '',
    } as IUser,
  }),
  changeUser: (user: IUser, property: string, value: any) => {
    dispatch({
      type: 'SET_USER',
      payload: {
        ...user,
        [property]: value,
      } as IUser,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
